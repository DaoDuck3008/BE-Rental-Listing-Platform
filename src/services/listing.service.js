import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";
import DatabaseError from "../errors/DatabaseError.js";
import UploadError from "../errors/UploadError.js";
import db from "../models/index.js";
import sequelize from "../config/database.js";
import { destroyImages, uploadImage } from "./upload.service.js";
import { randomUUID } from "crypto";
import { Op } from "sequelize";

const { ListingType, Listing, ListingImage, ListingAmenity, Amenity, User } =
  db;

export const getAllListingTypesService = async () => {
  try {
    const listingTypes = await ListingType.findAll({
      attributes: ["code", "name"],
    });

    if (!listingTypes || listingTypes.length === 0) {
      throw new NotFoundError("Không tìm thấy loại phòng nào.");
    }

    return listingTypes;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Lỗi khi lấy danh sách loại phòng");
  }
};

export const getListingByIdService = async (id) => {
  try {
    const listing = await Listing.findByPk(id, {
      include: [
        {
          model: ListingImage,
          as: "images",
          attributes: ["image_url", "sort_order", "public_id"],
        },
        {
          model: ListingType,
          as: "listing_type",
          attributes: ["code", "name"],
        },
        {
          model: Amenity,
          as: "amenities",
          through: { attributes: [] },
        },
        {
          model: User,
          as: "owner",
          attributes: [
            "id",
            "full_name",
            "email",
            "phone_number",
            "gender",
            "avatar",
          ],
        },
      ],
    });

    if (!listing) {
      throw new NotFoundError("Không tìm thấy bài đăng.");
    }

    return listing;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Lỗi khi lấy thông tin bài đăng");
  }
};

export const getListingByOwnerIdService = async (ownerId, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await Listing.findAndCountAll({
    where: {
      owner_id: ownerId,
      status: { [Op.notIn]: ["DELETED"] },
    },
    attributes: [
      "id",
      "title",
      "price",
      "area",
      "address",
      "bedrooms",
      "bathrooms",
      "views",
      "status",
      "created_at",
    ],
    include: [
      {
        model: ListingImage,
        as: "images",
        attributes: ["image_url", "sort_order", "public_id"],
        order: [["sort_order", "ASC"]],
      },
      {
        model: ListingType,
        as: "listing_type",
        attributes: ["code", "name"],
      },
    ],
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    limit,
    offset,
    distinct: true,
  });

  return result;
};

export const createListingService = async (
  userId,
  listingData,
  images = [],
  coverImageIndex = 0,
  status = "PENDING"
) => {
  // Validate images (not handled by Zod middleware)
  // For DRAFT, images are optional. For others, at least 1 image is required.
  if (status !== "DRAFT" && (!images || images.length === 0)) {
    throw new ValidationError("Phải có ít nhất 1 ảnh", [
      { field: "images", message: "Phải có ít nhất 1 ảnh" },
    ]);
  }

  if (images && images.length > 20) {
    throw new ValidationError("Tối đa 20 ảnh", [
      { field: "images", message: "Tối đa 20 ảnh" },
    ]);
  }

  // Validate coverImageIndex only if there are images
  if (
    images &&
    images.length > 0 &&
    (coverImageIndex < 0 || coverImageIndex >= images.length)
  ) {
    throw new ValidationError(
      `Cover image index không hợp lệ. Phải từ 0 đến ${images.length - 1}`,
      [
        {
          field: "coverImageIndex",
          message: `Phải từ 0 đến ${images.length - 1}`,
        },
      ]
    );
  }

  const t = await sequelize.transaction();
  try {
    // Validate listing type exists
    let listingTypeId = null;
    if (listingData.listing_type_code) {
      const selectedListingType = await ListingType.findOne({
        where: { code: listingData.listing_type_code },
      });

      if (!selectedListingType) {
        if (status !== "DRAFT") {
          throw new NotFoundError(
            `Loại phòng "${listingData.listing_type_code}" không tồn tại.`
          );
        }
      } else {
        listingTypeId = selectedListingType.id;
      }
    }

    // Create listing
    const listing = await Listing.create(
      {
        owner_id: userId,
        listing_type_id: listingTypeId,
        title: listingData.title?.trim() || null,
        description: listingData.description?.trim() || null,
        price: listingData.price != null ? parseFloat(listingData.price) : null,
        area: listingData.area != null ? parseFloat(listingData.area) : null,
        bedrooms: listingData.beds != null ? parseInt(listingData.beds) : 0,
        bathrooms:
          listingData.bathrooms != null ? parseInt(listingData.bathrooms) : 0,
        capacity:
          listingData.capacity != null ? parseInt(listingData.capacity) : 1,
        views: 0,
        province_code:
          listingData.province_code != null
            ? parseInt(listingData.province_code)
            : null,
        ward_code:
          listingData.ward_code != null
            ? parseInt(listingData.ward_code)
            : null,
        address: listingData.address?.trim() || null,
        longitude: listingData.longitude
          ? parseFloat(listingData.longitude)
          : null,
        latitude: listingData.latitude
          ? parseFloat(listingData.latitude)
          : null,
        show_phone_number:
          listingData.showPhoneNumber !== undefined
            ? Boolean(listingData.showPhoneNumber)
            : true,
        status: status,
      },
      { transaction: t }
    );

    const listingId = listing.id;

    // Create listing amenities
    if (listingData.amenities?.length > 0) {
      await ListingAmenity.bulkCreate(
        listingData.amenities.map((amenity) => ({
          listing_id: listingId,
          amenity_id: amenity,
        })),
        { transaction: t }
      );
    }

    // Upload and create listing images
    if (images && images.length > 0) {
      const uploadPromises = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Validate image file
        if (!image || !image.mimetype) {
          throw new ValidationError(`Ảnh thứ ${i + 1} không hợp lệ`);
        }

        // Validate image type
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(image.mimetype)) {
          throw new ValidationError(
            `Ảnh thứ ${i + 1} phải là định dạng JPG, PNG hoặc WEBP`
          );
        }

        // Validate image size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (image.size > maxSize) {
          throw new ValidationError(
            `Ảnh thứ ${i + 1} vượt quá kích thước cho phép (10MB)`
          );
        }

        const public_id = `${listingId}-${randomUUID()}`;

        // Calculate sort_order
        let sortOrder;
        if (i === coverImageIndex) {
          sortOrder = 0;
        } else if (i < coverImageIndex) {
          sortOrder = i + 1;
        } else {
          sortOrder = i;
        }

        // Upload image and create record
        uploadPromises.push(
          (async () => {
            try {
              const uploadResult = await uploadImage(
                image,
                "listings",
                public_id
              );

              await ListingImage.create(
                {
                  listing_id: listingId,
                  image_url: uploadResult.secure_url,
                  public_id,
                  sort_order: sortOrder,
                },
                { transaction: t }
              );
            } catch (uploadError) {
              throw new UploadError(
                `Lỗi khi tải ảnh thứ ${i + 1}: ${uploadError.message}`
              );
            }
          })()
        );
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
    }

    await t.commit();
    return listing;
  } catch (error) {
    await t.rollback();

    // Re-throw custom errors
    if (
      error instanceof NotFoundError ||
      error instanceof ValidationError ||
      error instanceof UploadError
    ) {
      throw error;
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      throw new ValidationError("Dữ liệu đã tồn tại", [
        { field: error.errors[0]?.path, message: "Giá trị đã tồn tại" },
      ]);
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ValidationError("Dữ liệu tham chiếu không hợp lệ");
    }

    // Handle database errors
    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    // Unknown error
    throw new DatabaseError("Lỗi không xác định khi tạo listing");
  }
};

// sử dụng cho cả DRAFT / PUBLISHED / EDIT_DRAFT / PENDING / HIDDEN
export const updateListingService = async (
  listingId,
  userId,
  updateData,
  images = [],
  coverImageIndex = 0
) => {
  // Validate images count if present
  if (images && images.length > 20) {
    throw new ValidationError("Tối đa 20 ảnh", [
      { field: "images", message: "Tối đa 20 ảnh" },
    ]);
  }

  const t = await sequelize.transaction();
  try {
    // 1. Tìm listing và kiểm tra quyền sở hữu
    const listing = await Listing.findOne({
      where: { id: listingId, owner_id: userId },
    });

    if (!listing) {
      throw new NotFoundError(
        "Không tìm thấy bài đăng hoặc bạn không có quyền chỉnh sửa."
      );
    }

    // 2. Định nghĩa các nhóm trường
    const lightFields = ["title", "description", "showPhoneNumber"];
    const heavyFields = [
      "price",
      "area",
      "beds",
      "bathrooms",
      "capacity",
      "province_code",
      "ward_code",
      "address",
      "listing_type_code",
      "longitude",
      "latitude",
    ];

    let allowedFields = [];
    let canUpdateImages = false;
    let canUpdateAmenities = false;

    // 3. Áp dụng quy tắc theo status
    const status = listing.status;
    if (["DRAFT", "PENDING", "EDIT_DRAFT"].includes(status)) {
      allowedFields = [...lightFields, ...heavyFields];
      canUpdateImages = true;
      canUpdateAmenities = true;
    } else if (status === "PUBLISHED") {
      allowedFields = lightFields;
      canUpdateAmenities = true;
      canUpdateImages = false; // PUBLISHED không được sửa ảnh trực tiếp
    } else if (status === "HIDDEN") {
      if (listing.views == 0) {
        allowedFields = [...lightFields, ...heavyFields];
        canUpdateImages = true;
        canUpdateAmenities = true;
      } else {
        allowedFields = lightFields;
        canUpdateAmenities = true;
        canUpdateImages = false;
      }
    }

    // 4. Lọc dữ liệu cập nhật
    const dataToUpdate = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        // Mapping beds/bathrooms từ form sang database column name
        let dbField = field;
        if (field === "beds") dbField = "bedrooms";
        if (field === "showPhoneNumber") dbField = "show_phone_number";

        if (field === "listing_type_code") return; // Sẽ xử lý riêng listing_type_id

        dataToUpdate[dbField] = updateData[field];
      }
    });

    // Xử lý listing_type_id nếu listing_type_code thay đổi và được phép
    if (
      allowedFields.includes("listing_type_code") &&
      updateData.listing_type_code
    ) {
      const selectedType = await ListingType.findOne({
        where: { code: updateData.listing_type_code },
      });
      if (selectedType) {
        dataToUpdate.listing_type_id = selectedType.id;
      } else if (status !== "DRAFT") {
        throw new NotFoundError(
          `Loại phòng "${updateData.listing_type_code}" không tồn tại.`
        );
      }
    }

    // 5. Cập nhật các trường cơ bản
    await listing.update(dataToUpdate, { transaction: t });

    // 6. Cập nhật Tiện ích (Amenities)
    if (canUpdateAmenities && updateData.amenities) {
      let amenityIds = [];
      if (Array.isArray(updateData.amenities)) {
        amenityIds = updateData.amenities;
      } else if (typeof updateData.amenities === "string") {
        amenityIds = updateData.amenities.split(",").filter(Boolean);
      }

      await ListingAmenity.destroy({
        where: { listing_id: listingId },
        transaction: t,
      });

      if (amenityIds.length > 0) {
        await ListingAmenity.bulkCreate(
          amenityIds.map((id) => ({ listing_id: listingId, amenity_id: id })),
          { transaction: t }
        );
      }
    }

    // Xóa ảnh cũ rồi tải anh mới lên
    const existingImages = await ListingImage.findAll({
      where: { listing_id: listingId },
    });
    const publicIdsToDelete = existingImages
      .map((img) => img.public_id)
      .filter(Boolean);

    if (publicIdsToDelete.length > 0) {
      try {
        await destroyImages("listings", publicIdsToDelete);
      } catch (destroyError) {
        console.error(
          "Failed to destroy old images on Cloudinary:",
          destroyError
        );
      }
    }

    // Xóa ảnh cũ records
    await ListingImage.destroy({
      where: { listing_id: listingId },
      transaction: t,
    });

    // 7. Cập nhật Hình ảnh (Images)
    if (canUpdateImages && images && images.length > 0) {
      // Validate coverImageIndex
      if (coverImageIndex < 0 || coverImageIndex >= images.length) {
        throw new ValidationError(
          `Cover image index không hợp lệ. Phải từ 0 đến ${images.length - 1}`,
          [
            {
              field: "coverImageIndex",
              message: `Phải từ 0 đến ${images.length - 1}`,
            },
          ]
        );
      }

      const uploadPromises = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Validate image file
        if (!image || !image.mimetype) {
          throw new ValidationError(`Ảnh thứ ${i + 1} không hợp lệ`);
        }

        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(image.mimetype)) {
          throw new ValidationError(
            `Ảnh thứ ${i + 1} phải là định dạng JPG, PNG hoặc WEBP`
          );
        }

        const maxSize = 10 * 1024 * 1024;
        if (image.size > maxSize) {
          throw new ValidationError(
            `Ảnh thứ ${i + 1} vượt quá kích thước cho phép (10MB)`
          );
        }

        const public_id = `${listingId}-${randomUUID()}`;
        let sortOrder;
        if (i === coverImageIndex) {
          sortOrder = 0;
        } else if (i < coverImageIndex) {
          sortOrder = i + 1;
        } else {
          sortOrder = i;
        }

        uploadPromises.push(
          (async () => {
            try {
              const uploadResult = await uploadImage(
                image,
                "listings",
                public_id
              );
              await ListingImage.create(
                {
                  listing_id: listingId,
                  image_url: uploadResult.secure_url,
                  public_id,
                  sort_order: sortOrder,
                },
                { transaction: t }
              );
            } catch (uploadError) {
              throw new UploadError(
                `Lỗi khi tải ảnh thứ ${i + 1}: ${uploadError.message}`
              );
            }
          })()
        );
      }
      await Promise.all(uploadPromises);
    }

    await t.commit();
    return listing;
  } catch (error) {
    await t.rollback();

    // Re-throw custom errors
    if (
      error instanceof NotFoundError ||
      error instanceof ValidationError ||
      error instanceof UploadError ||
      error instanceof AuthenticationError
    ) {
      throw error;
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      throw new ValidationError("Dữ liệu đã tồn tại", [
        { field: error.errors[0]?.path, message: "Giá trị đã tồn tại" },
      ]);
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ValidationError("Dữ liệu tham chiếu không hợp lệ");
    }

    // Handle database errors
    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    // Unknown error
    throw new DatabaseError("Lỗi không xác định khi cập nhật listing");
  }
};

export const submitDraftListingService = async (listingId, images) => {
  try {
    const draftListing = await getListingByIdService(listingId);
    if (!images || images.length === 0) {
      throw new ValidationError("Phải có ít nhất 1 ảnh", [
        { field: "images", message: "Phải có ít nhất 1 ảnh" },
      ]);
    }

    if (draftListing.status !== "DRAFT") {
      throw new NotFoundError("Trạng thái bài đăng không hợp lệ");
    }
    await Listing.update(
      {
        status: "PENDING",
      },
      {
        where: { id: draftListing.id },
      }
    );

    return draftListing;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ValidationError ||
      error instanceof UploadError
    ) {
      throw error;
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    throw new DatabaseError("Lỗi không xác định khi cập nhật listing");
  }
};

export const createEditDraftService = async (listingId, proposedChanges) => {};

export const approveListingService = async (listingId) => {};

export const rejectListingService = async (listingId, reason) => {};

export const hideListingService = async (listingId) => {};

export const showListingService = async (listingId) => {};

export const softDeleteListingService = async (listingId) => {};

export const hardDeleteListingService = async (listingId) => {};
