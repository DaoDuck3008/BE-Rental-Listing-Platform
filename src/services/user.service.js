import db from "../models/index.js";
import { uploadImage, destroyImage } from "./upload.service.js";
import { googleRegisterService } from "./auth.service.js";
import NotFoundError from "../errors/NotFoundError.js";
import UploadError from "../errors/UploadError.js";

const { User, Role } = db;

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
