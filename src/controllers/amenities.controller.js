import { getAllAmenitiesService } from "../services/amenities.service.js";

export const getAllAmenities = async (req, res, next) => {
  try {
    const amenities = await getAllAmenitiesService();

    return res.status(200).json(amenities);
  } catch (error) {
    next(error);
  }
};
