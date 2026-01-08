import { hashPassword, comparePassword } from "../utils/password.util.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util.js";
import db from "../models/index.js";

const { User, Role } = db;

export const registgerService = async ({
  email,
  password,
  confirmPassword,
  phoneNumber,
  fullName,
  gender,
  avatar,
}) => {
  const existingUser = await User.findOne({
    where: { email: email },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  if (password !== confirmPassword) {
    throw new Error("Password is not matched!");
  }

  const role = await Role.findOne({ where: { code: "USER" } });

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    role_id: role.id,
    email,
    password_hash: hashedPassword,
    phone_number: phoneNumber,
    full_name: fullName,
    avatar,
    gender,
    status: "Active",
  });

  return user;
};

export const googleRegiterService = async ({
  email,
  fullName,
  provider,
  provider_user_id,
  avatar,
}) => {
  const existingUser = await User.findOne({
    where: { email: email },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const role = await Role.findOne({ where: { code: "USER" } });

  const user = await User.create({
    role_id: role.id,
    email,
    full_name: fullName,
    provider,
    provider_user_id,
    status: "Active",
    gender: "Male",
    avatar,
  });

  const _user = await User.findOne({
    where: { id: user.id },
    include: {
      model: Role,
      as: "role",
    },
  });

  return _user;
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email: email },
    include: {
      model: Role,
      as: "role",
    },
  });

  if (!user) {
    return { EC: 1, EM: "Sai Email hoặc mật khẩu đăng nhập." };
  }

  const isMatch = comparePassword(password, user.password_hash);
  if (!isMatch) {
    return { EC: 1, EM: "Sai Email hoặc mật khẩu đăng nhập." };
  }

  const access_token = signAccessToken({
    id: user.id,
    role: user.role.code,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    tokenVersion: 1,
  });

  return { user, access_token, refreshToken };
};
