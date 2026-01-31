import {
  createListingService,
  getAllListingTypesService,
  getPublishedListingByIdService,
  getListingsByOwnerIdService,
  submitDraftListingService,
  updateListingService,
  getMyListingByIdService,
  softDeleteListingService,
  hideListingService,
  showListingService,
} from "../services/listing.service.js";
import AuthenticationError from "../errors/AuthenticationError.js";

export const getAllListingTypes = async (req, res, next) => {
  try {
    const listingTypes = await getAllListingTypesService();

    return res.status(200).json(listingTypes);
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) next(new AuthenticationError("No authorization header"));

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 20);

    const result = await getListingsByOwnerIdService(userId, page, limit);

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        totalItems: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPublishedListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getPublishedListingByIdService(id);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyListingById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) next(new AuthenticationError("No authorization header"));

    const { id } = req.params;
    const result = await getMyListingByIdService(id, userId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord tạo bài viết mới PENDING
export const createListing = async (req, res, next) => {
  try {
    const data = req.body;
    const images = req.files;
    const coverImageIndex = parseInt(data.coverImageIndex) || 0;

    const userId = req.user.id;
    if (!userId) next(new AuthenticationError("No authorization header"));

    const result = await createListingService(
      userId,
      data,
      images,
      coverImageIndex
    );

    return res.status(201).json({
      message: "Tạo bài viết thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord tạo và lưu bản DRAFT
export const createDraftListing = async (req, res, next) => {
  try {
    const data = req.body;
    const images = req.files;
    const coverImageIndex = parseInt(data.coverImageIndex) || 0;

    const userId = req.user.id;
    if (!userId) {
      throw new AuthenticationError("Không tìm thấy thông tin người dùng");
    }

    const result = await createListingService(
      userId,
      data,
      images,
      coverImageIndex,
      "DRAFT"
    );

    return res.status(201).json({
      message: "Lưu bản nháp thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord muốn sửa lại thông tin khi đã PUBLISHED. CHỈ có thể đổi title, description, contact, amenities
export const updateSoftPublisedListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const data = req.body;
    const images = req.files;
    const coverImageIndex = parseInt(data.coverImageIndex) || 0;
    const result = await updateListingService(
      id,
      userId,
      data,
      images,
      coverImageIndex
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật bài viết thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// LandLord muốn sửa bài đăng PUBLISHED -> tạo mới EDIT_DRAFT. Chỉnh sửa nặng (price, area, bedrooms, bathrooms, images)
export const updateHardPublishedListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const data = req.body;
    const images = req.files;
    const coverImageIndex = parseInt(data.coverImageIndex) || 0;

    const result = await createListingService(
      userId,
      data,
      images,
      coverImageIndex,
      "EDIT_DRAFT",
      id
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật bài viết thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord bổ sung thông tin vào bản DRAFT
export const updateDraftListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const images = req.files;
    const coverImageIndex = parseInt(data.coverImageIndex) || 0;
    const userId = req.user.id;

    const result = await updateListingService(
      id,
      userId,
      data,
      images,
      coverImageIndex
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật bài đăng thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord muốn đăng bài từ bản DRAFT -> PENDING
export const submitDraftListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const images = req.files;

    const result = await submitDraftListingService(id, images);

    return res.status(201).json({
      success: true,
      message: "Tạo bài viết thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord không muốn hiển thị bài lên new feeds nữa PUBLISHED -> HIDDEN
export const hideListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await hideListingService(id, userId);

    return res.status(200).json({
      success: true,
      message: `Tạm Ẩn bài viết #${id} thành công.`,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord hiển thị lại bài đăng HIDDEN -> PUBLISHED (Không được chỉnh sửa)
export const showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await showListingService(id, userId);

    return res.status(200).json({
      success: true,
      message: `Hiển thị bài viết #${id} thành công.`,
    });
  } catch (error) {
    next(error);
  }
};

// Bài đăng của landlord đã hết hạn muốn làm mới lại EXPIRED -> PENDING
export const renewListing = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// Landlord xóa bài đăng PENDING/ PUBLISHED/ HIDDEN/ DRAFT/ REJECTED -> DELETED
export const softDeleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await softDeleteListingService(id, userId);

    return res.status(200).json({
      success: true,
      message: "Xóa bài viết thành công.",
    });
  } catch (error) {
    next(error);
  }
};
