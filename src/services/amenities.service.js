import BusinessError from "../errors/BusinessError.js";
import db from "../models/index.js";
import { getRedis } from "../config/redis.js";

const { Amenity, ListingAmenity } = db;

const clearAmenitiesCache = async () => {
  try {
    const redis = getRedis();
    const keys = await redis.keys("amenities:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    await redis.del("all_amenities");
  } catch (error) {
    console.error(
      new RedisError("Lỗi khi xóa cache tiện ích: " + error.message)
    );
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
    console.error("Lỗi khi lấy cache tiện ích:", error);
  }

  const amenities = await Amenity.findAll({
    attributes: ["id", "name", "icon"],
    order: [["name", "ASC"]],
  });

  try {
    await redis.set(cacheKey, JSON.stringify(amenities), "EX", 15 * 60);
  } catch (error) {
    console.error("Lỗi khi lưu tiện ích vào cache:", error);
  }

  return amenities;
};

export const getAmenityByIdService = async (id) => {
  const amenity = await Amenity.findByPk(id);
  if (!amenity) {
    throw new NotFoundError("Không tìm thấy tiện ích.");
  }
  return amenity;
};

export const createAmenityService = async (data) => {
  const amenity = await Amenity.create(data);
  await clearAmenitiesCache();
  return amenity;
};

export const updateAmenityService = async (id, data) => {
  const amenity = await Amenity.findByPk(id);
  if (!amenity) {
    throw new NotFoundError("Không tìm thấy tiện ích để cập nhật.");
  }

  await amenity.update(data);
  await clearAmenitiesCache();
  return amenity;
};

export const deleteAmenityService = async (id) => {
  const amenity = await Amenity.findByPk(id);
  if (!amenity) {
    throw new NotFoundError("Không tìm thấy tiện ích để xóa.");
  }

  const usageCount = await ListingAmenity.count({
    where: { amenity_id: id },
  });

  if (usageCount > 0) {
    throw new BusinessError(
      `Không thể xóa tiện ích này vì có ${usageCount} bài đăng đang sử dụng nó.`,
      "AMENITY_IN_USE"
    );
  }

  await amenity.destroy();
  await clearAmenitiesCache();
  return true;
};

export const searchAmenitiesService = async (query) => {
  const { name } = query;
  const where = {};

  if (name) {
    where[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.iLike]: `%${name}%` } },
      { icon: { [db.Sequelize.Op.iLike]: `%${name}%` } },
    ];
  }

  const amenities = await Amenity.findAll({
    where,
    order: [["name", "ASC"]],
  });

  return amenities;
};
