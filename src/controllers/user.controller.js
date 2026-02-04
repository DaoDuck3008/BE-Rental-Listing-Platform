import { getUserById, updateUserProfile } from "../services/user.service.js";
import { verifyAcessToken } from "../utils/jwt.util.js";
import AuthenticationError from "../errors/AuthenticationError.js";

export const getMe = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) next(new AuthenticationError("No authorization header"));

    const token = auth.split(" ")[1];
    const payload = verifyAcessToken(token);

    const user = await getUserById(payload.sub);

    let canPostListing = true;
    let profileCompleted = true;

    // Chỉ người cho thuê mới có thể đăng tin
    if (user.role.code !== "LANDLORD") {
      canPostListing = false;
    }

    // Kiểm tra xem giới tính và số điện thoại đã được điền chưa
    if (!user.gender || !user.phone_number) {
      profileCompleted = false;
      canPostListing = false;
    }

    return res.status(200).json({
      id: user.id,
      role: user.role.code,
      profile: {
        full_name: user.full_name,
        phone_number: user.phone_number,
        avatar: user.avatar,
        gender: user.gender,
        role: user.role.code,
      },
      profileCompleted,
      canPostListing,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) next(new AuthenticationError("No authorization header"));

    const token = auth.split(" ")[1];
    const payload = verifyAcessToken(token);

    const user = await getUserById(payload.sub);

    return res.status(200).json({
      success: true,
      user: {
        role: user.role.name,
        email: user.email,
        phone_number: user.phone_number,
        full_name: user.full_name,
        created_at: user.createdAt,
        status: user.status,
        gender: user.gender,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);

    const token = auth.split(" ")[1];
    const payload = verifyAcessToken(token);
    const userId = payload.sub;

    const { EM, EC } = await updateUserProfile(userId, req.body, req.file);

    return res.status(200).json({
      message: EM,
      code: EC,
    });
  } catch (error) {
    next(error);
  }
};
