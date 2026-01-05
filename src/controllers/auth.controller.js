import { registgerService, loginService } from "../services/auth.service.js";
import { signAccessToken, verifyRefreshToken } from "../utils/jwt.util.js";

export const register = async (req, res, next) => {
  try {
    console.log(">>> req.body: ", req.body);
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
    console.log(">>> req.body: ", req.body);
    const { user, access_token, refreshToken } = await loginService(req.body);

    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/auth/refresh",
      })
      .json({
        access_token: access_token,
        user: {
          id: user.id,
          role: user.role.code,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const refresh = (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.sendStatus(401);

  const payload = verifyRefreshToken(token);

  const access_token = signAccessToken({
    sub: payload.sub,
  });

  return res.json({ access_token: access_token });
};

export const logout = (req, res) => {
  res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
  res.sendStatus(204);
};
