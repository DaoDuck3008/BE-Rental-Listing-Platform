import db from "../models/index.js";
import ValidationError from "../errors/ValidationError.js";
import DatabaseError from "../errors/DatabaseError.js";
import { fn, col, literal } from "sequelize";
import sequelize from "../config/database.js";
import NotFoundError from "../errors/NotFoundError.js";

const { Destination } = db;

export const createDestinationService = async ({
  name,
  type,
  longitude,
  latitude,
  province_code,
  ward_code,
}) => {
  try {
    if (
      longitude > 180 ||
      longitude < -180 ||
      latitude > 180 ||
      latitude < -180
    ) {
      throw new ValidationError("Tọa độ không hợp lệ");
    }
    const destination = await Destination.create({
      name,
      type,
      province_code,
      ward_code,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    return destination;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    console.error("Error creating destination:", error);
    throw new DatabaseError("Đã xảy ra lỗi khi tạo địa danh");
  }
};

export const searchDestinationsService = async ({
  limit = 10,
  page = 1,
  keyword = "",
  type = "",
}) => {
  try {
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (keyword) {
      where.name = {
        [db.Sequelize.Op.iLike]: `%${keyword}%`,
      };
    }
    if (type) {
      where.type = type;
    }

    const destinations = await Destination.findAndCountAll({
      where,
      attributes: [
        "id",
        "name",
        "type",
        [literal("ST_X(location::geometry)"), "longitude"],
        [literal("ST_Y(location::geometry)"), "latitude"],
      ],
      limit: limitNum,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return destinations;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    console.error("Error fetching destinations:", error);
    throw new DatabaseError("Đã xảy ra lỗi khi lấy danh sách địa danh");
  }
};

export const updateDestinationService = async (
  destinationId,
  { name, type, longitude, latitude, province_code, ward_code }
) => {
  const t = await sequelize.transaction();
  try {
    const destination = await Destination.findByPk(destinationId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!destination) {
      throw new NotFoundError("Địa danh không tồn tại");
    }

    if (longitude !== undefined || latitude !== undefined) {
      if (
        longitude > 180 ||
        longitude < -180 ||
        latitude > 90 ||
        latitude < -90
      ) {
        throw new ValidationError("Tọa độ không hợp lệ");
      }
    }

    const updateData = {
      name,
      type,
      province_code,
      ward_code,
    };

    if (longitude !== undefined && latitude !== undefined) {
      updateData.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    const updatedDestination = await destination.update(updateData, {
      transaction: t,
    });

    await t.commit();
    return updatedDestination;
  } catch (error) {
    if (t) await t.rollback();
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    console.error("Error updating destination:", error);
    throw new DatabaseError("Đã xảy ra lỗi khi cập nhật địa danh");
  }
};

export const deleteDestinationService = async (destinationId) => {
  const t = await sequelize.transaction();
  try {
    const destination = await Destination.findByPk(destinationId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!destination) {
      throw new NotFoundError("Địa danh không tồn tại");
    }

    await destination.destroy({ transaction: t });
    await t.commit();
  } catch (error) {
    if (t) await t.rollback();
    if (error instanceof NotFoundError) {
      throw error;
    }

    console.error("Error deleting destination:", error);
    throw new DatabaseError("Đã xảy ra lỗi khi xóa địa danh");
  }
};

export const getDestinationByIdService = async (destinationId) => {
  const destination = await Destination.findByPk(destinationId, {
    attributes: [
      "id",
      "name",
      "type",
      "province_code",
      "ward_code",
      [literal("ST_X(location::geometry)"), "longitude"],
      [literal("ST_Y(location::geometry)"), "latitude"],
    ],
  });

  if (!destination) {
    throw new NotFoundError("Địa danh không tồn tại");
  }

  return destination;
};

export const getDestinationStatsService = async () => {
  const [total, university, mall, hospital, park] = await Promise.all([
    Destination.count(),
    Destination.count({ where: { type: "UNIVERSITY" } }),
    Destination.count({ where: { type: "MALL" } }),
    Destination.count({ where: { type: "HOSPITAL" } }),
    Destination.count({ where: { type: "PARK" } }),
  ]);

  return {
    total,
    UNIVERSITY: university,
    MALL: mall,
    HOSPITAL: hospital,
    PARK: park,
  };
};
