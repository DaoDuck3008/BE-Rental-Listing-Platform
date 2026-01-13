import { hashPassword, comparePassword } from "../utils/password.util.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util.js";
import AuthenticationError from "../errors/AuthenticationError.js";
import ConflictError from "../errors/ConflictError.js";
import db from "../models/index.js";

const { User, Role } = db;

export const registgerService = async ({
  email,
  password,
  confirm_password,
  phone_number,
  full_name,
  gender,
  avatar,
}) => {
  const existingUser = await User.findOne({
    where: { email: email },
  });
  if (existingUser) {
    throw new ConflictError("Email đã tồn tại");
  }

  if (password !== confirm_password) {
    throw new ConflictError("Mật khẩu không khớp.");
  }

  const role = await Role.findOne({ where: { code: "USER" } });

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    role_id: role.id,
    email,
    password_hash: hashedPassword,
    phone_number: phone_number,
    full_name: full_name,
    avatar,
    gender,
    status: "Active",
  });

  return user;
};

export const googleRegisterService = async ({
  email,
  full_name,
  provider,
  provider_user_id,
  avatar,
}) => {
  const existingUser = await User.findOne({
    where: { email: email },
  });
  if (existingUser) {
    throw new ConflictError("Email này đã được sử dụng.");
  }

  const role = await Role.findOne({ where: { code: "USER" } });

  const user = await User.create({
    role_id: role.id,
    email,
    full_name: full_name,
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

export const getOrCreateUserByGoogle = async (googleUser) => {
  let user = await User.findOne({
    where: { email: googleUser.email },
    include: { model: Role, as: "role" },
  });

  const { email, name, picture, sub } = googleUser;

  if (!user) {
    user = await googleRegisterService({
      email,
      full_name: name,
      provider: "GOOGLE",
      provider_user_id: sub,
      avatar: picture,
    });
  }

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
    throw new AuthenticationError("Sai Email hoặc mật khẩu đăng nhập.");
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new AuthenticationError("Sai Email hoặc mật khẩu đăng nhập.");
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
