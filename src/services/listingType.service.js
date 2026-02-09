import db from "../models/index.js";
import { getRedis } from "../config/redis.js";

const { ListingType } = db;

const clearListingTypesCache = async () => {
  try {
    const redis = getRedis();
    await redis.del("all_listing_types");
  } catch (error) {
    throw new RedisError("Lỗi khi xóa cache tiện ích.", error);
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
    console.error("Lỗi khi truy xuất cache loại phòng:", error);
  }

  try {
    const listingTypes = await ListingType.findAll({
      attributes: ["code", "name"],
    });

    if (!listingTypes || listingTypes.length === 0) {
      throw new NotFoundError("Không tìm thấy loại phòng nào.");
    }

    try {
      await redis.set(cacheKey, JSON.stringify(listingTypes), "EX", 15 * 60);
    } catch (error) {
      console.error("Lỗi khi lưu loại phòng vào cache:", error);
    }

    return listingTypes;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Lỗi khi lấy danh sách loại phòng");
  }
};
