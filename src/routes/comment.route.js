import express from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import {
  create,
  destroy,
  index,
  like,
  update,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.use(protect);

router.get("/listings/:id", index);
router.post("/listings/:id", create);
router.put("/:id", update);
router.delete("/:id", destroy);
router.post("/:id/likes", like);

export default router;
