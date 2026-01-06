import db from "../models/index.js";

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
    return { EM: "Không tìm thấy người dùng", EC: 1 };
  }

  return user;
};
