  import {
  getMyFavorites,
  getUserById,
  updateUserProfile,
  getAllUsersByAdminService,
  getUserStatsService,
  toggleUserActiveService,
  updateUserRoleService,
  getUserDetailForAdminService,
} from "../services/user.service.js";
import { getUserListingStatsService } from "../services/listing.service.js";
import { getUserRecentActivityService } from "../services/auditLog.service.js";
import { verifyAcessToken } from "../utils/jwt.util.js";
import AuthenticationError from "../errors/AuthenticationError.js";

export const getUserDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [stats, activities] = await Promise.all([
      getUserListingStatsService(userId),
      getUserRecentActivityService(userId, 5),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);

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
    const userId = req.user.id;

    const user = await getUserById(userId);

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
    const userId = req.user.id;

    const { EM, EC } = await updateUserProfile(userId, req.body, req.file, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      message: EM,
      code: EC,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getMyFavorites(userId, limit, page);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách yêu thích thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersForAdmin = async (req, res, next) => {
  try {
    const result = await getAllUsersByAdminService(req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStatsForAdmin = async (req, res, next) => {
  try {
    const stats = await getUserStatsService();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserActiveForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const result = await toggleUserActiveService(id, adminId, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: true,
      message: result.is_locked
        ? "Kích hoạt người dùng thành công"
        : "Khóa người dùng thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roleCode } = req.body;
    const adminId = req.user.id;
    const result = await updateUserRoleService(id, roleCode, adminId, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật vai trò người dùng thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetailForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getUserDetailForAdminService(id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
