import db from "../models/index.js";
import { uploadImage, destroyImage } from "./upload.service.js";

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
    return { EC: 1, EM: "Không tìm thấy người dùng", user: null };
  }

  return { EC: 0, EM: "OK", user };
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
    return { EC: 1, EM: "Không tìm thấy người dùng", user: null };
  }

  return { EC: 0, EM: "OK", user };
};

export const updateUserProfile = async (userId, userData, userFile) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return { EC: 1, EM: "Không tìm thấy người dùng", user: null };
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
      const publicId = `avatar_${userId}`;
      await destroyImage("avatars", publicId);
    }

    // upload ảnh mới lên cloudinary
    const image = await uploadImage(userFile, "avatars", `avatar_${userId}`);
    updateData.avatar = image.secure_url;
  }

  if (userData.role) {
    const role = await Role.findOne({ where: { code: userData.role } });
    if (role) {
      updateData.role_id = role.id;
    } else {
      return { EC: 2, EM: "Vai trò không hợp lệ" };
    }
  }

  await user.update(updateData, { where: { id: userId } });

  return { EC: 0, EM: "Cập nhật hồ sơ thành công" };
};
