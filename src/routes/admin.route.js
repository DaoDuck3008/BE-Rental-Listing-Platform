import express from "express";
import {
  approveListing,
  hardDeleteListing,
  rejectListing,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/listings/:id/approve", approveListing);
router.post("/listings/:id/reject", rejectListing);
router.delete("/listings/:id/hard", hardDeleteListing);
