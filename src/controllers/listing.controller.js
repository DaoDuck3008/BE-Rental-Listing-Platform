import {
  createListingService,
  getAllListingTypesService,
  getListingByOwnerIdService,
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

    const result = await getListingByOwnerIdService(userId, page, limit);

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
      message: "Tạo listing thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
