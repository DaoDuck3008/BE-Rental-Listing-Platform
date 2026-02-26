import db from "../models/index.js";
import { getRedis } from "../config/redis.js";
import NotFoundError from "../errors/NotFoundError.js";
import RedisError from "../errors/RedisError.js";
import BusinessError from "../errors/BusinessError.js";

const { ListingType, Listing } = db;

const clearListingTypesCache = async () => {
  try {
    const redis = getRedis();
    const keys = await redis.keys("listing_types:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    await redis.del("all_listing_types");
  } catch (error) {
    console.error(
      new RedisError("Lỗi khi xóa cache loại bài đăng: " + error.message)
    );
  }
};

export const getAllListingTypesService = async () => {
  const cacheKey = "all_listing_types";
  const redis = getRedis();

  try {
    const cachedListingTypes = await redis.get(cacheKey);
    if (cachedListingTypes) {
      return JSON.parse(cachedListingTypes);
    }
  } catch (error) {
    console.error("Lỗi khi truy xuất cache loại bài đăng:", error);
  }

  const listingTypes = await ListingType.findAll({
    attributes: ["id", "code", "name", "description"],
    order: [["name", "ASC"]],
  });

  try {
    await redis.set(cacheKey, JSON.stringify(listingTypes), "EX", 15 * 60);
  } catch (error) {
    console.error("Lỗi khi lưu loại bài đăng vào cache:", error);
  }

  return listingTypes;
};

export const getListingTypeByIdService = async (id) => {
  const listingType = await ListingType.findByPk(id);
  if (!listingType) {
    throw new NotFoundError("Không tìm thấy loại bài đăng.");
  }
  return listingType;
};

export const createListingTypeService = async (data) => {
  const listingType = await ListingType.create(data);
  await clearListingTypesCache();
  return listingType;
};

export const updateListingTypeService = async (id, data) => {
  const listingType = await ListingType.findByPk(id);
  if (!listingType) {
    throw new NotFoundError("Không tìm thấy loại bài đăng để cập nhật.");
  }

  await listingType.update(data);
  await clearListingTypesCache();
  return listingType;
};

export const deleteListingTypeService = async (id) => {
  const listingType = await ListingType.findByPk(id);
  if (!listingType) {
    throw new NotFoundError("Không tìm thấy loại bài đăng để xóa.");
  }

  // Kiểm tra nếu đang được sử dụng
  const usageCount = await Listing.count({
    where: { listing_type_id: id },
  });

  if (usageCount > 0) {
    throw new BusinessError(
      `Không thể xóa loại bài đăng này vì có ${usageCount} bài đăng đang thuộc loại này.`,
      "LISTING_TYPE_IN_USE"
    );
  }

  await listingType.destroy();
  await clearListingTypesCache();
  return true;
};

export const searchListingTypesService = async (query) => {
  const { keyword } = query;
  const where = {};

  if (keyword) {
    where[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.iLike]: `%${keyword}%` } },
      { code: { [db.Sequelize.Op.iLike]: `%${keyword}%` } },
    ];
  }

  const listingTypes = await ListingType.findAll({
    where,
    order: [["name", "ASC"]],
  });

  return listingTypes;
};
