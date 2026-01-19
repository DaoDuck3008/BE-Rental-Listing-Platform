import express from "express";
import { getAllAmenities } from "../controllers/amenities.controller.js";

const router = express.Router();

router.get("/", getAllAmenities);

export default router;
