import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";
import DatabaseError from "../errors/DatabaseError.js";
import UploadError from "../errors/UploadError.js";
import db from "../models/index.js";
import sequelize from "../config/database.js";
import { destroyImages, uploadImage } from "./upload.service.js";
import { randomUUID } from "crypto";
import { Op, literal } from "sequelize";
import AuthenticationError from "../errors/AuthenticationError.js";
import BusinessError from "../errors/BusinessError.js";
import AuthorizationError from "../errors/AuthorizationError.js";
import { getRedis } from "../config/redis.js";
import RedisError from "../errors/RedisError.js";

const { ListingType, Listing, ListingImage, ListingAmenity, Amenity, User } =
  db;

const clearListingSearchCache = async () => {
  try {
    const redis = getRedis();
    const keys = await redis.keys("listings:search:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error(new RedisError("Lỗi xóa cache tìm kiếm: " + error.message));
  }
};

const clearPublishedListingDetailCache = async (listingId) => {
  try {
    const redis = getRedis();
    const key = `listing:published-detail:${listingId}`;
    await redis.del(key);
  } catch (error) {
    console.error(
      new RedisError("Lỗi xóa cache chi tiết listing: " + error.message)
    );
  }
};

export const searchPublishedListingsService = async (params) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword,
      province_code,
      ward_code,
      listing_type_code,
      min_price,
      max_price,
      min_area,
      max_area,
      beds,
      amenities,
      sort_by,
      centerLat,
      centerLong,
      radius,
    } = params;

    // Tạo cache key dựa trên params
    const cacheKey = `listings:search:${JSON.stringify(params)}`;
    const redis = getRedis();

    // Kiểm tra cache đã tồn tại hay chưa
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error(new RedisError("Lỗi lấy dữ liệu từ cache: " + err.message));
    }

    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 12;
    const offset = (p - 1) * l;

    // Nếu như có bán kính truyền về thì phải đổi từ mét sang km
    const radiusKm = radius ? radius / 1000 : null;

    const querySearch = {
      status: "PUBLISHED",
    };

    if (keyword) {
      querySearch[Op.or] = [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { address: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    if (province_code) querySearch.province_code = province_code;
    if (ward_code) querySearch.ward_code = ward_code;

    if (min_price || max_price) {
      querySearch.price = {};
      if (min_price) querySearch.price[Op.gte] = min_price;
      if (max_price) querySearch.price[Op.lte] = max_price;
    }

    if (min_area || max_area) {
      querySearch.area = {};
      if (min_area) querySearch.area[Op.gte] = min_area;
      if (max_area) querySearch.area[Op.lte] = max_area;
    }

    if (beds) {
      querySearch.bedrooms = { [Op.gte]: beds };
    }

    // tìm kiếm theo Bounding Box
    const { minLat, maxLat, minLng, maxLng, include_markers } = params;
    if (minLat && maxLat && minLng && maxLng) {
      querySearch.latitude = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] };
      querySearch.longitude = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] };
    }

    const include = [
      {
        model: ListingImage,
        as: "images",
        attributes: ["image_url", "sort_order"],
      },
      {
        model: ListingType,
        as: "listing_type",
        attributes: ["code", "name"],
        where: listing_type_code ? { code: listing_type_code } : undefined,
        required: !!listing_type_code,
      },
    ];

    if (amenities && amenities.length > 0) {
      const amenityIds = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");
      include.push({
        model: Amenity,
        as: "amenities",
        where: { id: { [Op.in]: amenityIds } },
        attributes: ["id", "name"],
        through: { attributes: [] }, 
      });
    }

    const attributes = [
      "id",
      "title",
      "price",
      "address",
      "views",
      "province_code",
      "ward_code",
      "longitude",
      "latitude",
      "area",
      "bedrooms",
      "bathrooms",
      "created_at",
      "updated_at",
      "status",
      "show_phone_number",
    ];

    let havingCondition = undefined;
    let orderBy = [];

    if (centerLat !== undefined && centerLong !== undefined && radiusKm) {
      const distanceSql = `
        6371 * acos(
          cos(radians(${centerLat})) 
          * cos(radians("Listing"."latitude")) 
          * cos(radians("Listing"."longitude") - radians(${centerLong})) 
          + sin(radians(${centerLat})) 
          * sin(radians("Listing"."latitude"))
        )
      `;
      const distanceLiteral = literal(distanceSql);
      attributes.push([distanceLiteral, "distance"]);

      if (!querySearch[Op.and]) querySearch[Op.and] = [];
      querySearch[Op.and].push(literal(`(${distanceSql}) <= ${radiusKm}`));

      orderBy.push([literal("distance"), "ASC"]);
    }

    switch (sort_by) {
      case "PRICE_DESC":
        orderBy.push(["price", "DESC"]);
        break;
      case "PRICE_ASC":
        orderBy.push(["price", "ASC"]);
        break;
      case "DATE_ASC":
        orderBy.push(["updated_at", "ASC"]);
        break;
      case "DATE_DESC":
      default:
        orderBy.push(["updated_at", "DESC"]);
        break;
    }

    // 1. Truy vấn kết quả tìm kiếm
    const result = await Listing.findAndCountAll({
      where: querySearch,
      attributes,
      include,
      having: havingCondition,
      order: [
        ...orderBy,
        [{ model: ListingImage, as: "images" }, "sort_order", "ASC"],
      ],
      limit: l,
      offset: offset,
      distinct: true,
    });

    // 2. Nếu như có yêu cầu tìm kiếm theo Bounding Box (Map), truy vấn riêng markers để hiển thị trên map (không có phân trang)
    let markers = [];
    if (include_markers === "true" || include_markers === true) {
      const markerAttributes = ["id", "latitude", "longitude", "price", "title", "address", "area"];
      
      if (centerLat !== undefined && centerLong !== undefined && radiusKm) {
        const distanceSql = `
          6371 * acos(
            cos(radians(${centerLat})) 
            * cos(radians("Listing"."latitude")) 
            * cos(radians("Listing"."longitude") - radians(${centerLong})) 
            + sin(radians(${centerLat})) 
            * sin(radians("Listing"."latitude"))
          )
        `;
        markerAttributes.push([literal(distanceSql), "distance"]);
      }

      markers = await Listing.findAll({
        where: querySearch,
        attributes: markerAttributes,
        include: [
          {
            model: ListingType,
            as: "listing_type",
            attributes: ["code", "name"],
            where: listing_type_code ? { code: listing_type_code } : undefined,
            required: !!listing_type_code,
          },
          {
            model: ListingImage,
            as: "images",
            attributes: ["image_url", "sort_order"],
          },
        ],
        order: orderBy,
      });
    }


    const finalResult = {
      ...result,
      markers: markers
    };

    try {
      await redis.set(cacheKey, JSON.stringify(finalResult), "EX", 300);
    } catch (err) {
      console.error(
        new RedisError("Lỗi lưu dữ liệu vào cache: " + err.message)
      );
    }

    return finalResult;

  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new DatabaseError("Lỗi khi tìm kiếm bài đăng: " + error.message);
  }
};

export const getListingByIdService = async (id, options = {}) => {
  try {
    const { transaction, lock } = options;

    const listing = await Listing.findOne({
      where: {
        id: id,
      },
      transaction,
      lock,
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
          attributes: ["id", "name", "icon"],
          through: { attributes: [] },
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "full_name", "phone_number", "gender", "avatar"],
        },
        {
          model: Listing,
          as: "parentListing",
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
              attributes: ["id", "name", "icon"],
              through: { attributes: [] },
            },
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

export const getPublishedListingByIdService = async (id) => {
  const cacheKey = `listing:published-detail:${id}`;
  const redis = getRedis();

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error(new RedisError("Lỗi lấy dữ liệu từ cache: " + error.message));
  }

  try {
    const listing = await Listing.findOne({
      where: {
        id: id,
        status: "PUBLISHED",
      },
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

    try {
      await redis.set(cacheKey, JSON.stringify(listing), "EX", 600);
    } catch (error) {
      console.error(
        new RedisError("Lỗi lưu dữ liệu vào cache: " + error.message)
      );
    }

    return listing;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Lỗi khi lấy thông tin bài đăng");
  }
};

export const getMyListingByIdService = async (id, userId) => {
  try {
    const listing = await Listing.findOne({
      where: {
        id: id,
        owner_id: userId,
      },
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
          attributes: ["id", "name", "icon"],
          through: { attributes: [] },
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "full_name", "phone_number", "gender", "avatar"],
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

export const getListingsByOwnerIdService = async (
  ownerId,
  page = 1,
  limit = 10,
  listing_type_code,
  keyword,
  status,
  sort_by
) => {
  try {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const offset = (p - 1) * l;

    const querySearch = {
      owner_id: ownerId,
    };

    if (status) {
      querySearch.status = status;
    } else {
      querySearch.status = { [Op.notIn]: ["DELETED", "HIDDEN_FROM_USER"] };
    }

    if (keyword) {
      querySearch[Op.or] = [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { address: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    let orderBy = [];
    switch (sort_by) {
      case "DATE_ASC":
        orderBy = [
          ["updated_at", "ASC"],
          ["title", "ASC"],
        ];
        break;
      case "PRICE_DESC":
        orderBy = [
          ["price", "DESC"],
          ["title", "ASC"],
        ];
        break;
      case "PRICE_ASC":
        orderBy = [
          ["price", "ASC"],
          ["title", "ASC"],
        ];
        break;
      case "DATE_DESC":
      default:
        orderBy = [
          ["updated_at", "DESC"],
          ["title", "ASC"],
        ];
        break;
    }

    const result = await Listing.findAndCountAll({
      where: querySearch,
      attributes: [
        "id",
        "title",
        "price",
        "area",
        "address",
        "views",
        "status",
        "created_at",
        "updated_at",
      ],
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
          where: listing_type_code ? { code: listing_type_code } : undefined,
          required: !!listing_type_code,
        },
      ],
      order: [
        ...orderBy,
        [{ model: ListingImage, as: "images" }, "sort_order", "ASC"],
      ],
      limit: l,
      offset: offset,
      distinct: true,
    });

    return result;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new DatabaseError("Lỗi khi lấy danh sách phòng của bạn");
  }
};

export const createListingService = async (
  userId,
  listingData,
  images = [],
  coverImageIndex = 0,
  status = "PENDING",
  parentListingId = null
) => {
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

    // Nếu như la tạo EDIT-DRAFT thì đổi status của parent listing sang HIDDEN_FROM_USER
    if (parentListingId) {
      const parentListing = await Listing.findByPk(parentListingId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (parentListing) {
        await parentListing.update(
          { status: "HIDDEN_FROM_USER" },
          { transaction: t }
        );
      }
    }

    // Create listing
    const listing = await Listing.create(
      {
        owner_id: userId,
        listing_type_id: listingTypeId,
        parent_listing_id: parentListingId,
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
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!listing) {
      throw new NotFoundError(
        "Không tìm thấy bài đăng hoặc bạn không có quyền chỉnh sửa."
      );
    }

    if (listing.status === "PENDING") {
      throw new BusinessError("Bạn không thể sửa khi bài viết đang được duyệt");
    }

    // 2. Định nghĩa các nhóm trường
    const lightFields = [
      "title",
      "description",
      "showPhoneNumber",
      "longitude",
      "latitude",
    ];
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
    ];

    let allowedFields = [];
    let canUpdateImages = false;
    let canUpdateAmenities = false;

    // 3. Áp dụng quy tắc theo status
    const status = listing.status;
    if (["DRAFT", "EDIT_DRAFT"].includes(status)) {
      allowedFields = [...lightFields, ...heavyFields];
      canUpdateImages = true;
      canUpdateAmenities = true;
    } else if (status === "PUBLISHED") {
      allowedFields = lightFields;
      canUpdateAmenities = true;
      canUpdateImages = true;
    } else {
      allowedFields = lightFields;
      canUpdateAmenities = true;
      canUpdateImages = false;
    }

    // 4. Lọc dữ liệu cập nhật
    const dataToUpdate = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        let dbField = field;
        if (field === "beds") dbField = "bedrooms";
        if (field === "showPhoneNumber") dbField = "show_phone_number";

        if (field === "listing_type_code") return;

        dataToUpdate[dbField] = updateData[field];
      }
    });

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
    if (canUpdateImages) {
      const existingImages = await ListingImage.findAll({
        where: { listing_id: listingId },
        transaction: t,
      });
      const publicIdsToDelete = existingImages
        .map((img) => img.public_id)
        .filter(Boolean);

      if (publicIdsToDelete.length > 0) {
        try {
          await destroyImages("listings", publicIdsToDelete);
        } catch (destroyError) {
          throw new UploadError(
            `Lỗi khi xóa ảnh cũ trên Cloudinary: ${destroyError.message}`
          );
        }
      }

      // Xóa ảnh cũ records
      await ListingImage.destroy({
        where: { listing_id: listingId },
        transaction: t,
      });
    }

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
    await clearListingSearchCache();
    await clearPublishedListingDetailCache(listingId);
    return listing;
  } catch (error) {
    await t.rollback();

    if (
      error instanceof NotFoundError ||
      error instanceof ValidationError ||
      error instanceof UploadError ||
      error instanceof AuthenticationError ||
      error instanceof BusinessError
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

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

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

export const hideListingService = async (listingId, userId) => {
  const listing = await Listing.findOne({
    where: { id: listingId, owner_id: userId },
  });
  if (!listing) throw new NotFoundError("Không tìm thấy bài đăng.");
  if (listing.status !== "PUBLISHED")
    throw new BusinessError("Chỉ có thể ẩn bài đăng đang hiển thị.");

  await listing.update({ status: "HIDDEN" });
  await clearListingSearchCache();
  await clearPublishedListingDetailCache(listingId);
  return listing;
};

export const showListingService = async (listingId, userId) => {
  const listing = await Listing.findOne({
    where: { id: listingId, owner_id: userId },
  });
  if (!listing) throw new NotFoundError("Không tìm thấy bài đăng.");
  if (listing.status !== "HIDDEN")
    throw new BusinessError("Bài đăng này không bị ẩn.");

  await listing.update({ status: "PUBLISHED" });
  await clearListingSearchCache();
  await clearPublishedListingDetailCache(listingId);
  return listing;
};

export const renewListingService = async (listingId, userId) => {
  const listing = await Listing.findOne({
    where: { id: listingId, owner_id: userId },
  });
  if (!listing) throw new NotFoundError("Không tìm thấy bài đăng.");
  if (listing.status !== "EXPIRED")
    throw new BusinessError("Chỉ có thể làm mới bài đăng đã hết hạn.");

  await listing.update({
    status: "PUBLISHED",
    published_at: sequelize.fn("NOW"),
    expired_at: sequelize.literal("NOW() + interval '30 days'"),
  });
  await clearListingSearchCache();
  await clearPublishedListingDetailCache(listingId);
  return listing;
};

export const getAllListingByAdminService = async () => {};

export const getAllModatedListingsService = async (
  page = 1,
  limit = 10,
  status,
  keyword
) => {
  const p = parseInt(page);
  const l = parseInt(limit);
  const offset = (p - 1) * l;

  const whereClause = {
    status: status ? status : { [Op.in]: ["PENDING", "EDIT_DRAFT"] },
  };

  const include = [
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
      model: User,
      as: "owner",
      attributes: ["full_name", "avatar", "email"],
    },
  ];

  if (keyword) {
    whereClause[Op.or] = [
      { title: { [Op.substring]: keyword } },
      { address: { [Op.substring]: keyword } },
      { "$owner.full_name$": { [Op.substring]: keyword } },
      { "$owner.email$": { [Op.substring]: keyword } },
    ];
  }

  const result = await Listing.findAndCountAll({
    where: whereClause,
    attributes: [
      "id",
      "title",
      "address",
      "price",
      "status",
      "created_at",
      "updated_at",
    ],
    include: include,
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
    limit: l,
    offset: offset,
    distinct: true,
    subQuery: false,
  });

  return {
    data: result.rows,
    pagination: {
      page: p,
      limit: l,
      totalItems: result.count,
      totalPages: Math.ceil(result.count / l),
    },
  };
};

// Admin duyệt bài mới của landlord (PENDING -> PUBLISHED)
export const approveListingService = async (listingId) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) throw new NotFoundError("Bài đăng không tồn tại.");
  if (listing.status !== "PENDING")
    throw new BusinessError("Chỉ có thể duyệt bài đăng đang chờ duyệt.");

  await listing.update({
    status: "PUBLISHED",
    published_at: sequelize.fn("NOW"),
    expired_at: sequelize.literal("NOW() + interval '30 days'"),
  });

  await clearListingSearchCache();
  await clearPublishedListingDetailCache(listingId);
  return listing;
};

// Admin xác nhận duyệt thay đổi bài viết từ Edit Draft
export const approveEditDraftListingService = async (listingId) => {
  const t = await sequelize.transaction();
  try {
    // 1. Lấy thông tin bản nháp chỉnh sửa (EditDraft)
    const editDraftListing = await Listing.findByPk(listingId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!editDraftListing) {
      throw new NotFoundError("Bài đăng không tồn tại.");
    }

    if (
      !editDraftListing.parent_listing_id ||
      editDraftListing.status !== "EDIT_DRAFT"
    ) {
      throw new BusinessError(
        "Đây không phải là bản thảo chỉnh sửa hợp lệ hoặc trạng thái không đúng."
      );
    }

    // 2. Lấy thông tin bài đăng gốc
    const parentListing = await Listing.findByPk(
      editDraftListing.parent_listing_id,
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      }
    );

    if (!parentListing) {
      throw new NotFoundError("Không tìm thấy bài đăng gốc.");
    }

    // 3. Ghi đè các trường chính từ EditDraft sang ParentListing
    // Ghi đè các trường ở bảng chính Listing đổi status từ HIDDEN_FROM_USER -> PUBLISHED
    const fieldsToOverride = [
      "listing_type_id",
      "title",
      "description",
      "price",
      "area",
      "bedrooms",
      "bathrooms",
      "capacity",
      "province_code",
      "ward_code",
      "address",
      "longitude",
      "latitude",
      "show_phone_number",
    ];

    const updateData = {};
    fieldsToOverride.forEach((field) => {
      updateData[field] = editDraftListing[field];
    });

    updateData.status = "PUBLISHED";
    updateData.updated_at = sequelize.fn("NOW");
    updateData.expired_at = sequelize.literal("NOW() + interval '30 days'");
    await parentListing.update(updateData, { transaction: t });

    //4. Nếu editDraftListing có dữ liệu phần images thì xóa images cũ trên cloud ở parentListing và ghi đè bản mới vào CSDL
    const draftImages = await ListingImage.findAll({
      where: { listing_id: editDraftListing.id },
      transaction: t,
    });

    if (draftImages && draftImages.length > 0) {
      const oldParentImages = await ListingImage.findAll({
        where: { listing_id: parentListing.id },
        transaction: t,
      });

      const publicIdsToDelete = oldParentImages
        .map((img) => img.public_id)
        .filter(Boolean);

      if (publicIdsToDelete.length > 0) {
        try {
          // Xóa ảnh trên Cloudinary
          await destroyImages("listings", publicIdsToDelete);
        } catch (err) {
          throw new UploadError(
            `Lỗi khi xóa ảnh bài gốc trên Cloudinary: ${err.message}`
          );
        }
      }

      // Xóa bản ghi ảnh cũ của parent
      await ListingImage.destroy({
        where: { listing_id: parentListing.id },
        transaction: t,
      });

      // Tạo bản ghi ảnh mới cho parent từ dữ liệu của draft
      await ListingImage.bulkCreate(
        draftImages.map((img) => ({
          listing_id: parentListing.id,
          image_url: img.image_url,
          public_id: img.public_id,
          sort_order: img.sort_order,
        })),
        { transaction: t }
      );
    }

    //5. Nếu editDraftListing có dữ liệu phần amenities thì ghi đè dữ liệu mới ở parentListing
    const draftAmenities = await ListingAmenity.findAll({
      where: { listing_id: editDraftListing.id },
      transaction: t,
    });

    if (draftAmenities && draftAmenities.length > 0) {
      // Xóa tiện ích cũ của bài gốc
      await ListingAmenity.destroy({
        where: { listing_id: parentListing.id },
        transaction: t,
      });

      // Tạo tiện ích mới cho parent từ dữ liệu của draft
      await ListingAmenity.bulkCreate(
        draftAmenities.map((am) => ({
          listing_id: parentListing.id,
          amenity_id: am.amenity_id,
        })),
        { transaction: t }
      );
    }

    // 6. Xóa EditDraft listing (không xóa ảnh trên cloud vì đã chuyển sang parent)
    await editDraftListing.destroy({ transaction: t });

    await t.commit();
    await clearListingSearchCache();
    await clearPublishedListingDetailCache(parentListing.id);
    return parentListing;
  } catch (error) {
    if (t) await t.rollback();

    if (
      error instanceof BusinessError ||
      error instanceof AuthenticationError ||
      error instanceof AuthorizationError ||
      error instanceof ValidationError ||
      error instanceof UploadError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ValidationError("Dữ liệu tham chiếu không hợp lệ");
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    throw new DatabaseError("Lỗi không xác định khi duyệt bài đăng");
  }
};

// Admin từ chối bài mới của landlord (PENDING -> REJECTED)
export const rejectListingService = async (listingId, reason) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) throw new NotFoundError("Bài đăng không tồn tại.");
  if (listing.status !== "PENDING")
    throw new BusinessError("Chỉ có thể từ chối bài đăng đang chờ duyệt.");

  await listing.update({ status: "REJECTED" });
  return listing;
};

// Admin từ chối bản chỉnh sửa (Xóa EDIT_DRAFT, khôi phục Parent sang PUBLISHED)
export const rejectEditDraftListingService = async (listingId, reason) => {
  const t = await sequelize.transaction();
  try {
    const listing = await Listing.findByPk(listingId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!listing) {
      throw new NotFoundError("Bài đăng không tồn tại.");
    }

    if (!listing.parent_listing_id || listing.status !== "EDIT_DRAFT") {
      throw new BusinessError(
        "Đây không phải là bản thảo chỉnh sửa hợp lệ hoặc trạng thái không đúng."
      );
    }

    // 1. Khôi phục bài đăng gốc thành PUBLISHED
    const parentListing = await Listing.findByPk(listing.parent_listing_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (parentListing) {
      await parentListing.update({ status: "PUBLISHED" }, { transaction: t });
    }

    // 2. Xóa ảnh của bản nháp trên Cloudinary
    const draftImages = await ListingImage.findAll({
      where: { listing_id: listing.id },
      transaction: t,
    });

    const publicIdsToDelete = draftImages
      .map((img) => img.public_id)
      .filter(Boolean);

    if (publicIdsToDelete.length > 0) {
      try {
        await destroyImages("listings", publicIdsToDelete);
      } catch (err) {
        throw new UploadError(
          `Lỗi khi xóa ảnh bản nháp trên Cloudinary: ${err.message}`
        );
      }
    }

    // 3. Xóa bản ghi bản nháp hoàn toàn
    await listing.destroy({ transaction: t });

    await t.commit();
    await clearListingSearchCache();
    await clearPublishedListingDetailCache(parentListing.id);
    return true;
  } catch (error) {
    if (t) await t.rollback();

    if (
      error instanceof BusinessError ||
      error instanceof AuthenticationError ||
      error instanceof AuthorizationError ||
      error instanceof ValidationError ||
      error instanceof UploadError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    throw new DatabaseError("Lỗi không xác định khi từ chối bài đăng");
  }
};

// Landlord xóa bài viết (DELETED) nhưng vẫn lưu trong CSDL
export const softDeleteListingService = async (listingId, userId) => {
  const t = await sequelize.transaction();
  try {
    const listing = await Listing.findByPk(listingId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (listing.owner_id !== userId)
      throw new AuthorizationError("Bạn không có quyền xóa bài của người khác");

    if (listing.status === "DELETED")
      throw new BusinessError("Bài viết đã bị xóa trước đó");

    const notAllowedStatus = ["PENDING", "EDIT_DRAFT"];

    if (notAllowedStatus.includes(listing.status))
      throw new BusinessError("Bạn không thể xóa bài viết đang được duyệt");

    if (listing.status === "DRAFT") {
      await listing.destroy({ transaction: t });
    } else {
      await listing.update(
        { status: "DELETED", deleted_at: sequelize.fn("NOW") },
        { transaction: t }
      );
    }

    await t.commit();
    await clearListingSearchCache();
    await clearPublishedListingDetailCache(listingId);
    return true;
  } catch (error) {
    await t.rollback();

    if (
      error instanceof NotFoundError ||
      error instanceof AuthenticationError ||
      error instanceof AuthorizationError ||
      error instanceof BusinessError ||
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

// Admin xóa bài viết vĩnh viễn khỏi CSDL
export const hardDeleteListingService = async (listingId) => {
  try {
    await clearPublishedListingDetailCache(listingId);
    await clearListingSearchCache();
  } catch (error) {
    console.error(
      new RedisError("Lỗi xóa cache khi hard delete: " + error.message)
    );
  }
};
