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

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email: email },
    include: {
      model: Role,
      as: "role",
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
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
