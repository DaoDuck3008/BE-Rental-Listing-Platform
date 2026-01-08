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
