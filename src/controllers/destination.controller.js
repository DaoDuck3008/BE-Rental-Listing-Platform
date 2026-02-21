import {
  createDestinationService,
  deleteDestinationService,
  getDestinationByIdService,
  getDestinationStatsService,
  searchDestinationsService,
  updateDestinationService,
} from "../services/destination.service.js";

export const create = async (req, res, next) => {
  try {
    const result = await createDestinationService(req.body);

    res.status(201).json({
      success: true,
      message: "Địa danh đã được tạo thành công.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    const result = await searchDestinationsService(req.query);

    res.status(200).json({
      success: true,
      message: "Tìm kiếm địa danh thành công.",
      data: result.rows,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        totalItems: result.count,
        totalPages: Math.ceil(result.count / (parseInt(req.query.limit) || 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id: destinationId } = req.params;
    const result = await getDestinationByIdService(destinationId);

    res.status(200).json({
      success: true,
      message: "Lấy thông tin địa danh thành công.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const stats = async (req, res, next) => {
  try {
    const result = await getDestinationStatsService();

    res.status(200).json({
      success: true,
      message: "Lấy thống kê địa danh thành công.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id: destinationId } = req.params;

    const result = await updateDestinationService(destinationId, req.body);

    res.status(200).json({
      success: true,
      message: "Cập nhật địa danh thành công.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const { id: destinationId } = req.params;

    await deleteDestinationService(destinationId);

    res.status(200).json({
      success: true,
      message: "Xóa địa danh thành công.",
    });
  } catch (error) {
    next(error);
  }
};
