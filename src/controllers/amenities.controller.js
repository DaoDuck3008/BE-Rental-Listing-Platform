import {
  getAllAmenitiesService,
  createAmenityService,
  updateAmenityService,
  deleteAmenityService,
  getAmenityByIdService,
  searchAmenitiesService,
} from "../services/amenities.service.js";

export const getAllAmenities = async (req, res, next) => {
  try {
    const amenities = await getAllAmenitiesService();
    return res.status(200).json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    next(error);
  }
};

export const getAmenityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await getAmenityByIdService(id);
    return res.status(200).json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    next(error);
  }
};

export const createAmenity = async (req, res, next) => {
  try {
    const amenity = await createAmenityService(req.body);
    return res.status(201).json({
      success: true,
      message: "Tạo tiện ích thành công",
      data: amenity,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await updateAmenityService(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Cập nhật tiện ích thành công",
      data: amenity,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteAmenityService(id);
    return res.status(200).json({
      success: true,
      message: "Xóa tiện ích thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const searchAmenities = async (req, res, next) => {
  try {
    const amenities = await searchAmenitiesService(req.query);
    return res.status(200).json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    next(error);
  }
};

