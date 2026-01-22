import {
  createListingService,
  getAllListingTypesService,
} from "../services/listing.service.js";
import { verifyAcessToken } from "../utils/jwt.util.js";

export const getAllListingTypes = async (req, res, next) => {
  try {
    const listingTypes = await getAllListingTypesService();

    return res.status(200).json(listingTypes);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    const data = req.body;
    const images = req.files;
    const coverImageIndex = parseInt(data.coverImageIndex) || 0;

    const auth = req.headers.authorization;
    if (!auth) next(new AuthenticationError("No authorization header"));
    const token = auth.split(" ")[1];
    const payload = verifyAcessToken(token);

    const result = await createListingService(
      payload.sub,
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
