import { hashPassword, comparePassword } from "../utils/password.util.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util.js";
import AuthenticationError from "../errors/AuthenticationError.js";
import ConflictError from "../errors/ConflictError.js";
import NotFoundError from "../errors/NotFoundError.js";
import db from "../models/index.js";
import { createAuditLog } from "./auditLog.service.js";
import { getRedis } from "../config/redis.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "./mail.service.js";
import { generateOTP, hashToken, compareToken } from "../utils/hash.util.js";
import BusinessError from "../errors/BusinessError.js";

const { User, Role } = db;

export const registerService = async ({
  email,
  password,
  confirm_password,
  phone_number,
  full_name,
  gender,
  avatar,
}, auditInfo = {}) => {
  const existingUser = await User.findOne({
    where: {
      [db.Sequelize.Op.or]: [
        { email: email },
        { phone_number: phone_number }
      ]
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictError("Email đã tồn tại trên hệ thống.");
    }
    if (existingUser.phone_number === phone_number) {
      throw new ConflictError("Số điện thoại đã tồn tại trên hệ thống.");
    }
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
    is_locked: false, 
    is_email_verified: process.env.VERIFY_EMAIL_TOGGLE !== "true",
  });

  // Nếu tính năng verify email được bật
  if (process.env.VERIFY_EMAIL_TOGGLE === "true") {
    const verifyToken = generateOTP();
    const hashedToken = hashToken(verifyToken);
    
    const redis = getRedis();
    // Lưu hash của token vào Redis (hết hạn sau 10 phút)
    await redis.set(`verify_email:${email}`, hashedToken, "EX", 600);

    // Gửi email xác thực
    await sendVerificationEmail(email, full_name, verifyToken);
  }


  // Log action
  await createAuditLog({
    userId: user.id,
    action: "USER_REGISTER",
    entityType: "User",
    entityId: user.id,
    newData: { email, full_name, phone_number },
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return user;
};

export const verifyEmailService = async ({ email, token }, auditInfo = {}) => {
  if (process.env.VERIFY_EMAIL_TOGGLE !== "true") {
    throw new BusinessError("Tính năng xác thực email hiện đang bị tắt.");
  }

  const redis = getRedis();
  const storedHashedToken = await redis.get(`verify_email:${email}`);

  if (!storedHashedToken || !compareToken(token, storedHashedToken)) {
    throw new BusinessError("Mã xác thực không hợp lệ hoặc đã hết hạn.");
  }

  const user = await User.findOne({ 
    where: { email },
    include: { model: Role, as: "role" }
  });
  if (!user) {
    throw new NotFoundError("Người dùng không tồn tại.");
  }

  if (user.is_email_verified) {
    throw new BusinessError("Tài khoản này đã được xác thực trước đó.");
  }

  // Update trạng thái
  user.is_email_verified = true;
  user.email_verified_at = new Date();
  await user.save();

  // Xóa token trong redis
  await redis.del(`verify_email:${email}`);

  // Tạo access token và refresh token cho auto login
  const access_token = signAccessToken({
    id: user.id,
    role: user.role.code,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    tokenVersion: 1,
  });

  // Log action
  await createAuditLog({
    userId: user.id,
    action: "USER_VERIFY_EMAIL",
    entityType: "User",
    entityId: user.id,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return { user, access_token, refreshToken };
};

export const resendVerifyEmailService = async ({ email }, auditInfo = {}) => {
  if (process.env.VERIFY_EMAIL_TOGGLE !== "true") {
    throw new BusinessError("Tính năng xác thực email hiện đang bị tắt.");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError("Email này chưa được đăng ký.");
  }

  if (user.is_email_verified) {
    throw new BusinessError("Tài khoản đã được xác thực.");
  }

  // Tạo mã mới
  const verifyToken = generateOTP();
  const hashedToken = hashToken(verifyToken);
  
  const redis = getRedis();
  await redis.set(`verify_email:${email}`, hashedToken, "EX", 600);

  // Gửi Mail
  await sendVerificationEmail(email, user.full_name, verifyToken);

  return true;
};

export const googleRegisterService = async ({
  email,
  full_name,
  provider,
  provider_user_id,
  avatar,
}, auditInfo = {}) => {
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

  // Log action
  await createAuditLog({
    userId: user.id,
    action: "USER_GOOGLE_REGISTER",
    entityType: "User",
    entityId: user.id,
    newData: { email, full_name, provider },
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
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

export const getOrCreateUserByGoogle = async (googleUser, auditInfo = {}) => {
  let user = await User.findOne({
    where: { email: googleUser.email },
    include: { model: Role, as: "role" },
  });

  const { email, name, picture, sub } = googleUser;

  if (!user) {
    user = await googleRegisterService(
      {
        email,
        full_name: name,
        provider: "GOOGLE",
        provider_user_id: sub,
        avatar: picture,
      },
      auditInfo
    );
  }

  await createAuditLog({
    userId: user.id,
    action: "USER_GOOGLE_LOGIN",
    entityType: "User",
    entityId: user.id,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return user;
};

export const changePasswordService = async (userId, { oldPassword, newPassword }, auditInfo = {}) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError("Người dùng không tồn tại.");
  }

  // Nếu là user đăng nhập bằng Google/Facebook thì không có mật khẩu nội bộ. Không cho đổi
  if (!user.password_hash) {
    throw new BusinessError("Tài khoản đăng nhập qua bên thứ ba không thể đổi mật khẩu theo cách này.");
  }

  // Kiểm tra mật khẩu cũ
  const isMatch = await comparePassword(oldPassword, user.password_hash);
  if (!isMatch) {
    throw new BusinessError("Mật khẩu hiện tại không chính xác.");
  }

  // Hash mật khẩu mới
  const hashedPassword = await hashPassword(newPassword);
  user.password_hash = hashedPassword;
  await user.save();

  await createAuditLog({
    userId: user.id,
    action: "USER_CHANGE_PASSWORD",
    entityType: "User",
    entityId: user.id,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return true;
};

export const forgotPasswordService = async (email, auditInfo = {}) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError("Email này chưa được đăng ký trên hệ thống.");
  }

  // Tài khoản Google không thể reset pass theo cách này
  if (user.provider === "GOOGLE") {
    throw new BusinessError("Tài khoản này được đăng ký qua Google. Vui lòng sử dụng tính năng đăng nhập Google.");
  }

  // Tạo mã OTP đặt lại mật khẩu
  const resetToken = generateOTP();
  const hashedToken = hashToken(resetToken);

  const redis = getRedis();
  // Lưu vào Redis (10 phút)
  await redis.set(`reset_password:${email}`, hashedToken, "EX", 600);

  // Gửi email
  await sendResetPasswordEmail(email, user.full_name, resetToken);

  await createAuditLog({
    userId: user.id,
    action: "USER_REQUEST_FORGOT_PASSWORD",
    entityType: "User",
    entityId: user.id,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return true;
};

export const resetPasswordService = async ({ email, otp, newPassword }, auditInfo = {}) => {
  const redis = getRedis();
  const storedHashedToken = await redis.get(`reset_password:${email}`);

  if (!storedHashedToken || !compareToken(otp, storedHashedToken)) {
    throw new BusinessError("Mã xác thực không chính xác hoặc đã hết hạn.");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError("Người dùng không tồn tại.");
  }

  // Cập nhật mật khẩu mới
  const hashedPassword = await hashPassword(newPassword);
  user.password_hash = hashedPassword;
  await user.save();

  // Xóa mã OTP sau khi dùng xong
  await redis.del(`reset_password:${email}`);

  await createAuditLog({
    userId: user.id,
    action: "USER_RESET_PASSWORD",
    entityType: "User",
    entityId: user.id,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return true;
};

export const loginService = async ({ email, password }, auditInfo = {}) => {
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

  // Nếu tính năng verify email được bật, kiểm tra trạng thái xác thực
  if (process.env.VERIFY_EMAIL_TOGGLE === "true" && !user.is_email_verified) {
    throw new BusinessError(
      "Tài khoản chưa được xác thực email. Vui lòng xác thực để tiếp tục.",
      "USER_NOT_VERIFIED",
      { email: user.email }
    );
  }

  if (user.is_locked) {
    throw new AuthenticationError("Tài khoản của bạn đã bị khóa bởi quản trị viên.");
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

  // Log action
  await createAuditLog({
    userId: user.id,
    action: "USER_LOGIN",
    entityType: "User",
    entityId: user.id,
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return { user, access_token, refreshToken };
};
