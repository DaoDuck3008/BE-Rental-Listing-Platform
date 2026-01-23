import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";
import DatabaseError from "../errors/DatabaseError.js";
import UploadError from "../errors/UploadError.js";
import db from "../models/index.js";
import sequelize from "../config/database.js";
import { uploadImage } from "./upload.service.js";
import { randomUUID } from "crypto";

const { ListingType, Listing, ListingImage, ListingAmenity, Amenity } = db;

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

export const getListingByOwnerIdService = async (ownerId, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await Listing.findAndCountAll({
    where: {
      owner_id: ownerId,
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
  images,
  coverImageIndex = 0
) => {
  // Validate images (not handled by Zod middleware)
  if (!images || images.length === 0) {
    throw new ValidationError("Phải có ít nhất 1 ảnh", [
      { field: "images", message: "Phải có ít nhất 1 ảnh" },
    ]);
  }

  if (images.length > 20) {
    throw new ValidationError("Tối đa 20 ảnh", [
      { field: "images", message: "Tối đa 20 ảnh" },
    ]);
  }

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

  const t = await sequelize.transaction();
  try {
    // Validate listing type exists
    const selectedListingType = await ListingType.findOne({
      where: { code: listingData.listing_type_code },
    });

    if (!selectedListingType) {
      throw new NotFoundError(
        `Loại phòng "${listingData.listing_type_code}" không tồn tại.`
      );
    }

    // Create listing
    const listing = await Listing.create(
      {
        owner_id: userId,
        listing_type_id: selectedListingType.id,
        title: listingData.title.trim(),
        description: listingData.description.trim(),
        price: parseFloat(listingData.price),
        area: parseFloat(listingData.area),
        bedrooms: parseInt(listingData.beds) || 0,
        bathrooms: parseInt(listingData.bathrooms) || 0,
        capacity: parseInt(listingData.capacity) || 1,
        views: 0,
        province_code: parseInt(listingData.province_code),
        ward_code: parseInt(listingData.ward_code),
        address: listingData.address.trim(),
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
        status: "PENDING",
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
