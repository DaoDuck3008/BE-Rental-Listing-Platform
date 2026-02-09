import { getRedis } from "../config/redis.js";
import NotFoundError from "../errors/NotFoundError.js";
import RedisError from "../errors/RedisError.js";
import db from "../models/index.js";

const { Amenity } = db;

const clearAmenitiesCache = async () => {
  try {
    const redis = getRedis();
    await redis.del("all_amenities");
  } catch (error) {
    throw new RedisError("Lỗi khi xóa cache tiện ích.", error);
  }
};

export const getAllAmenitiesService = async () => {
  const cacheKey = "all_amenities";
  const redis = getRedis();

  try {
    const cachedAmenities = await redis.get(cacheKey);
    if (cachedAmenities) {
      return JSON.parse(cachedAmenities);
    }
  } catch (error) {
    console.error("Lỗi khi cache tiện ích:", error);
  }

  const amenities = await Amenity.findAll({
    attributes: ["id", "name", "icon"],
  });

  if (!amenities)
    throw new NotFoundError("Không có tiện ích nhà nào trong cơ sở dữ liệu.");

  try {
    await redis.set(cacheKey, JSON.stringify(amenities), "EX", 15 * 60);
  } catch (error) {
    console.error("Lỗi khi lưu tiện ích vào cache:", error);
  }

  return amenities;
};
