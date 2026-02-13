import db from "../models/index.js";
import { uploadImage, destroyImage } from "./upload.service.js";
import { googleRegisterService } from "./auth.service.js";
import NotFoundError from "../errors/NotFoundError.js";
import UploadError from "../errors/UploadError.js";
import AuthenticationError from "../errors/AuthenticationError.js";
import DatabaseError from "../errors/DatabaseError.js";

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

export const updateUserProfile = async (userId, userData, userFile) => {
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

  await user.update(updateData, { where: { id: userId } });

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
