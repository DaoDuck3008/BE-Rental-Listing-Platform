import NotFoundError from "../errors/NotFoundError.js";
import db from "../models/index.js";

const { Amenity } = db;

export const getAllAmenitiesService = async () => {
  const amenities = await Amenity.findAll({
    attributes: ["id", "name", "icon"],
  });

  if (!amenities)
    throw new NotFoundError("Không có tiện ích nhà nào trong cơ sở dữ liệu.");

  return amenities;
};
