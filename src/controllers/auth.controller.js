import { registgerService, loginService } from "../services/auth.service.js";
import { getUserById } from "../services/user.service.js";
import { signAccessToken, verifyRefreshToken } from "../utils/jwt.util.js";

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
    const { user, access_token, refreshToken, ER, EM } = await loginService(
      req.body
    );

    if (ER === 1) {
      return res.status(401).json({
        Message: EM,
      });
    }

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
          fullName: user.full_name,
          role: user.role.code,
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
  });

  return res.json({
    access_token: access_token,
    user: {
      id: user.id,
      role: user.role.code,
      fullName: user.full_name,
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
