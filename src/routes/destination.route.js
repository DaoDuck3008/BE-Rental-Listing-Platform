import express from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  create,
  destroy,
  getOne,
  search,
  stats,
  update,
} from "../controllers/destination.controller.js";
import {
  createDestinationSchema,
  updateDestinationSchema,
} from "../validators/destination.validator.js";

const router = express.Router();

router.use(protect);
router.use(requireRole(["ADMIN"]));

router.get("/", search);
router.get("/stats", stats);
router.get("/:id", getOne);
router.post("/", upload.none(), validate(createDestinationSchema), create);
router.patch(
  "/:id",
  upload.none(),
  validate(updateDestinationSchema),
  update
);
router.delete("/:id", destroy);

export default router;
