import {
  approveListingService,
  approveEditDraftListingService,
  rejectListingService,
  rejectEditDraftListingService,
  getListingByIdService,
  getAllModatedListingsService,
  getAllListingByAdminService,
  getListingStatsService,
  hardDeleteListingService,
} from "../services/listing.service.js";

export const getListingStatsForAdmin = async (req, res, next) => {
  try {
    const stats = await getListingStatsService();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllListingsForAdmin = async (req, res, next) => {
  try {
    const result = await getAllListingByAdminService(req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách tất cả bài đăng thành công",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllModeratedListingsForAdmin = async (req, res, next) => {
  try {
    const { page, limit, status, keyword } = req.query;

    const result = await getAllModatedListingsService(
      page,
      limit,
      status,
      keyword
    );

    return res.status(200).json({
      success: true,
      message: "Lấy các bài đăng cần duyệt thành công",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getListingByIdService(id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin duyệt bài mới (PENDING -> PUBLISHED)
export const approveListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await approveListingService(id);

    return res.status(200).json({
      success: true,
      message: "Duyệt bài đăng thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin từ chối bài mới (PENDING -> REJECTED)
export const rejectListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await rejectListingService(id, reason);

    return res.status(200).json({
      success: true,
      message: "Từ chối bài đăng thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin duyệt bản nháp chỉnh sửa (Merge vào bài gốc)
export const approveEditDraft = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await approveEditDraftListingService(id);

    return res.status(200).json({
      success: true,
      message: "Duyệt bản chỉnh sửa thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin từ chối bản nháp chỉnh sửa (Xóa bản nháp, bài gốc hiện lại)
export const rejectEditDraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await rejectEditDraftListingService(id, reason);

    return res.status(200).json({
      success: true,
      message: "Từ chối bản chỉnh sửa thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const hardDeleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await hardDeleteListingService(id);

    return res.status(200).json({
      success: true,
      message: "Xóa bài đăng vĩnh viễn thành công",
    });
  } catch (error) {
    next(error);
  }
};
