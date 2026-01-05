import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

router.get("/favicon.ico", (req, res) => res.status(204));

export default router;
