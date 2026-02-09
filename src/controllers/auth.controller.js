import { OAuth2Client } from "google-auth-library";
import {
  registgerService,
  loginService,
  getOrCreateUserByGoogle,
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
    const user = await registgerService(req.body);

    return res.status(201).json({
      message: "Register successful",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, access_token, refreshToken } = await loginService(req.body);

    // Nếu như client gửi về thông tin lưu đăng nhập thì set cookie sống trong 7 ngày
    const maxAge =
      req.body.rememberMe === "1" ? 7 * 24 * 60 * 60 * 1000 : undefined;

    return res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: maxAge,
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
    const user = await getOrCreateUserByGoogle(payload);

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
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: maxAge,
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
    sub: payload.sub,
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
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // path: "/api/auth/refresh"
  });
  res.sendStatus(204);
};
