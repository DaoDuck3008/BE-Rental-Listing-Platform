import { OAuth2Client } from "google-auth-library";
import {
  registerService,
  loginService,
  getOrCreateUserByGoogle,
  verifyEmailService,
  resendVerifyEmailService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service.js";
import { getUserById } from "../services/user.service.js";
import {
  signAccessToken,
  verifyRefreshToken,
  signRefreshToken,
} from "../utils/jwt.util.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res, next) => {
  try {
    const user = await registerService(req.body, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const message = process.env.VERIFY_EMAIL_TOGGLE === "true" 
      ? "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực."
      : "Đăng ký thành công!";

    return res.status(201).json({
      message,
      success: true,
      isVerifyRequired: process.env.VERIFY_EMAIL_TOGGLE === "true",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { user, access_token, refreshToken } = await verifyEmailService(req.body, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Sau khi verify email thành công thì đăng nhập luôn
    // Mặc định sống trong 7 ngày
    const maxAge = 7 * 24 * 60 * 60 * 1000;

    return res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + maxAge),
      })
      .json({
        success: true,
        message: "Email đã được xác thực thành công!",
        access_token: access_token,
        user: {
          id: user.id,
          full_name: user.full_name,
          role: user.role.code,
          avatar: user.avatar,
        },
      });
  } catch (error) { 
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    await resendVerifyEmailService(req.body, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: true,
      message: "Mã xác thực mới đã được gửi vào email của bạn.",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, access_token, refreshToken } = await loginService(req.body, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Khách chọn lưu đăng nhập thì sống 7 ngày, ngược lại mặc định sống 1 ngày
    const maxAge =
      req.body.rememberMe === "1"
        ? 7 * 24 * 60 * 60 * 1000
        : 1 * 24 * 60 * 60 * 1000;

    return res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + maxAge),
        // path: "/api/auth/refresh",
      })
      .json({
        access_token: access_token,
        user: {
          id: user.id,
          full_name: user.full_name,
          role: user.role.code,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    // 1. Verify token ID from client
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // 2. Tìm hoặc tạo mới tài khoản người dùng với payload google
    const user = await getOrCreateUserByGoogle(payload, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // 3. Tạo access token và refresh token
    const access_token = signAccessToken({
      id: user.id,
      role: user.role.code,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
      tokenVersion: 1,
    });

    // Mặc định cho 7 ngày
    const maxAge = 7 * 24 * 60 * 60 * 1000;

    // 4. Trả về cho client
    return res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + maxAge),
        // path: "/api/auth/refresh",
      })
      .json({
        access_token: access_token,
        user: {
          id: user.id,
          full_name: user.full_name,
          role: user.role.code,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.sendStatus(401);

  const payload = verifyRefreshToken(token);

  const user = await getUserById(payload.sub);

  const access_token = signAccessToken({
    id: user.id,
    role: user.role.code,
  });

  return res.json({
    access_token: access_token,
    user: {
      id: user.id,
      role: user.role.code,
      full_name: user.full_name,
      avatar: user.avatar,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    // path: "/api/auth/refresh"
  });
  res.sendStatus(204);
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await changePasswordService(userId, req.body, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi về email của bạn.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await resetPasswordService(req.body, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: true,
      message: "Mật khẩu đã được đặt lại thành công!",
    });
  } catch (error) {
    next(error);
  }
};
