import db from "../models/index.js";
import { getRedis } from "../config/redis.js";
import NotFoundError from "../errors/NotFoundError.js";
import RedisError from "../errors/RedisError.js";
import BusinessError from "../errors/BusinessError.js";

const { Role, User } = db;

const clearRolesCache = async () => {
  try {
    const redis = getRedis();
    const keys = await redis.keys("roles:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    await redis.del("all_roles");
  } catch (error) {
    console.error(
      new RedisError("Lỗi khi xóa cache quyền hạn: " + error.message)
    );
  }
};

export const getAllRolesService = async () => {
  const cacheKey = "all_roles";
  const redis = getRedis();

  try {
    const cachedRoles = await redis.get(cacheKey);
    if (cachedRoles) {
      return JSON.parse(cachedRoles);
    }
  } catch (error) {
    console.error("Lỗi khi truy xuất cache quyền hạn:", error);
  }

  const roles = await Role.findAll({
    attributes: ["id", "code", "name"],
    order: [["name", "ASC"]],
  });

  try {
    await redis.set(cacheKey, JSON.stringify(roles), "EX", 24 * 60 * 60); // Cache for 24 hours
  } catch (error) {
    console.error("Lỗi khi lưu quyền hạn vào cache:", error);
  }

  return roles;
};

export const getRoleByIdService = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) {
    throw new NotFoundError("Không tìm thấy quyền hạn.");
  }
  return role;
};

export const createRoleService = async (data) => {
  // Check if code already exists
  const existingRole = await Role.findOne({ where: { code: data.code } });
  if (existingRole) {
    throw new BusinessError("Mã quyền hạn đã tồn tại.", "ROLE_CODE_EXISTS");
  }

  const role = await Role.create(data);
  await clearRolesCache();
  return role;
};

export const updateRoleService = async (id, data) => {
  const role = await Role.findByPk(id);
  if (!role) {
    throw new NotFoundError("Không tìm thấy quyền hạn để cập nhật.");
  }

  if (data.code && data.code !== role.code) {
    const existingRole = await Role.findOne({ where: { code: data.code } });
    if (existingRole) {
      throw new BusinessError("Mã quyền hạn đã tồn tại.", "ROLE_CODE_EXISTS");
    }
  }

  await role.update(data);
  await clearRolesCache();
  return role;
};

export const deleteRoleService = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) {
    throw new NotFoundError("Không tìm thấy quyền hạn để xóa.");
  }

  const usageCount = await User.count({
    where: { role_id: id },
  });

  if (usageCount > 0) {
    throw new BusinessError(
      `Không thể xóa quyền hạn này vì có ${usageCount} người dùng đang thuộc quyền này.`,
      "ROLE_IN_USE"
    );
  }

  await role.destroy();
  await clearRolesCache();
  return true;
};

export const searchRolesService = async (query) => {
  const { keyword } = query;
  const where = {};

  if (keyword) {
    where[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.iLike]: `%${keyword}%` } },
      { code: { [db.Sequelize.Op.iLike]: `%${keyword}%` } },
    ];
  }

  const roles = await Role.findAll({
    where,
    order: [["name", "ASC"]],
  });

  return roles;
};
