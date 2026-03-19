import db from "../models/index.js";
import { uploadImage, destroyImage } from "./upload.service.js";
import { googleRegisterService } from "./auth.service.js";
import NotFoundError from "../errors/NotFoundError.js";
import UploadError from "../errors/UploadError.js";
import AuthenticationError from "../errors/AuthenticationError.js";
import DatabaseError from "../errors/DatabaseError.js";
import { createAuditLog } from "./auditLog.service.js";

const { User, Role, Favorite, ListingImage, Listing, ListingType } = db;

export const getUserById = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    include: {
      model: Role,
      as: "role",
    },
  });

  if (!user) {
    throw new NotFoundError("không tìm thấy người dùng.");
  }

  return user;
};

export const getUserByEmail = async (userEmail) => {
  const user = await User.findOne({
    where: { email: userEmail },
    include: {
      model: Role,
      as: "role",
    },
  });

  if (!user) {
    throw new NotFoundError("không tìm thấy người dùng.");
  }

  return user;
};

export const updateUserProfile = async (userId, userData, userFile, auditInfo = {}) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("không tìm thấy người dùng.");
  }

  const allowedFields = ["full_name", "phone_number", "gender"];

  const updateData = {};

  for (const field of allowedFields) {
    if (userData[field] !== undefined) {
      updateData[field] = userData[field];
    }
  }

  if (userFile) {
    // xóa ảnh cũ trên cloudinary nếu có
    if (user.avatar) {
      try {
        const publicId = `avatar_${userId}`;
        await destroyImage("avatars", publicId);
      } catch (err) {
        throw new UploadError(`Lỗi khi xóa ảnh đại diện cũ: ${err.message}`);
      }
    }

    // upload ảnh mới lên cloudinary
    try {
      const image = await uploadImage(userFile, "avatars", `avatar_${userId}`);
      updateData.avatar = image.secure_url;
    } catch (err) {
      throw new UploadError(`Lỗi khi tải ảnh đại diện mới: ${err.message}`);
    }
  }

  if (userData.role) {
    const role = await Role.findOne({ where: { code: userData.role } });
    if (role) {
      updateData.role_id = role.id;
    } else {
      throw new NotFoundError("Vai trò người dùng không tồn tại.");
    }
  }

  const oldData = user.toJSON();
  await user.update(updateData, { where: { id: userId } });
  const newData = user.toJSON();

  // Log action
  await createAuditLog({
    userId,
    action: "UPDATE_USER_PROFILE",
    entityType: "User",
    entityId: userId,
    oldData,
    newData,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return { EC: 0, EM: "Cập nhật hồ sơ thành công" };
};

export const getMyFavorites = async (userId, limit, page) => {
  try {
    const offest = (page - 1) * limit;

    let querySearch = { user_id: userId };
    let orderBy = [["createdAt", "DESC"]];

    const result = await Favorite.findAndCountAll({
      where: querySearch,

      include: [
        {
          model: Listing,
          as: "listing",
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
              model: User,
              as: "owner",
              attributes: [
                "id",
                "full_name",
                "email",
                "phone_number",
                "avatar",
              ],
            },
            {
              model: ListingImage,
              as: "images",
              attributes: ["image_url", "sort_order", "public_id"],
            },
            {
              model: ListingType,
              as: "listing_type",
              attributes: ["id", "code", "name"],
            },
          ],
        },
      ],
      order: [
        ...orderBy,
        [
          { model: Listing, as: "listing" },
          { model: ListingImage, as: "images" },
          "sort_order",
          "ASC",
        ],
      ],
      limit: limit,
      offset: offest,
      distinct: true,
    });

    return result;
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }

    if (error.name?.startsWith("Sequelize")) {
      throw new DatabaseError(`Lỗi cơ sở dữ liệu: ${error.message}`);
    }

    console.error(error);
    throw new DatabaseError("Lỗi không xác định khi yêu thích bài đăng");
  }
};

export const getAllUsersByAdminService = async (query) => {
  const { limit = 10, page = 1, keyword = "", role = "", statusFilter = "" } = query;
  const offset = (page - 1) * limit;

  const where = {};
  if (keyword) {
    where[db.Sequelize.Op.or] = [
      { full_name: { [db.Sequelize.Op.like]: `%${keyword}%` } },
      { email: { [db.Sequelize.Op.like]: `%${keyword}%` } },
      { phone_number: { [db.Sequelize.Op.like]: `%${keyword}%` } },
    ];
  }

  if (statusFilter !== "") {
    where.is_locked = statusFilter === "blocked";
  }

  const include = [
    {
      model: Role,
      as: "role",
      attributes: ["id", "code", "name"],
    },
  ];

  if (role) {
    include[0].where = { code: role };
  }

  const result = await User.findAndCountAll({
    where,
    include,
    attributes: {
      exclude: ["password_hash"],
    },
    distinct: true,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]], 
  });

  return {
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
    },
  };
};

export const getUserStatsService = async () => {
  const totalUsers = await User.count();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newUsersToday = await User.count({
    where: {
      created_at: { [db.Sequelize.Op.gte]: today },
    },
  });
  const blockedUsers = await User.count({
    where: { is_locked: true },
  });

  // Count by roles
  const landlordRole = await Role.findOne({ where: { code: "LANDLORD" } });
  const tenantRole = await Role.findOne({ where: { code: "TENANT" } });

  const totalLandlords = landlordRole
    ? await User.count({ where: { role_id: landlordRole.id } })
    : 0;
  const totalTenants = tenantRole
    ? await User.count({ where: { role_id: tenantRole.id } })
    : 0;

  return {
    total: totalUsers,
    newToday: newUsersToday,
    blocked: blockedUsers,
    landlords: totalLandlords,
    tenants: totalTenants,
  };
};

export const toggleUserActiveService = async (
  userId,
  adminId,
  auditInfo = {}
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError("Người dùng không tồn tại");

  const oldData = user.toJSON();
  user.is_locked = !user.is_locked;
  await user.save();
  const newData = user.toJSON();

  await createAuditLog({
    userId: adminId,
    action: user.is_locked ? "DEACTIVATE_USER" : "ACTIVATE_USER",
    entityType: "User",
    entityId: userId,
    oldData,
    newData,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return user;
};

export const updateUserRoleService = async (
  userId,
  roleCode,
  adminId,
  auditInfo = {}
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError("Người dùng không tồn tại");

  const role = await Role.findOne({ where: { code: roleCode } });
  if (!role) throw new NotFoundError("Vai trò không tồn tại");

  const oldData = user.toJSON();
  user.role_id = role.id;
  await user.save();
  const newData = user.toJSON();

  await createAuditLog({
    userId: adminId,
    action: "UPDATE_USER_ROLE",
    entityType: "User",
    entityId: userId,
    oldData,
    newData,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return user;
};

export const getUserDetailForAdminService = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    include: [
      { model: Role, as: "role" },
      {
        model: Listing,
        as: "listings",
        include: [{ model: ListingImage, as: "images", limit: 1 }],
      },
    ],
    attributes: { exclude: ["password_hash"] },
  });

  if (!user) throw new NotFoundError("Người dùng không tồn tại");
  return user;
};
