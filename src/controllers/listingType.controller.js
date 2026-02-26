import {
  getAllListingTypesService,
  createListingTypeService,
  updateListingTypeService,
  deleteListingTypeService,
  getListingTypeByIdService,
  searchListingTypesService,
} from "../services/listingType.service.js";

export const getAllListingTypes = async (req, res, next) => {
  try {
    const listingTypes = await getAllListingTypesService();
    return res.status(200).json({
      success: true,
      data: listingTypes,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listingType = await getListingTypeByIdService(id);
    return res.status(200).json({
      success: true,
      data: listingType,
    });
  } catch (error) {
    next(error);
  }
};

export const createListingType = async (req, res, next) => {
  try {
    const listingType = await createListingTypeService(req.body);
    return res.status(201).json({
      success: true,
      message: "Tạo loại bài đăng thành công",
      data: listingType,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListingType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listingType = await updateListingTypeService(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Cập nhật loại bài đăng thành công",
      data: listingType,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListingType = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteListingTypeService(id);
    return res.status(200).json({
      success: true,
      message: "Xóa loại bài đăng thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const searchListingTypes = async (req, res, next) => {
  try {
    const listingTypes = await searchListingTypesService(req.query);
    return res.status(200).json({
      success: true,
      data: listingTypes,
    });
  } catch (error) {
    next(error);
  }
};
