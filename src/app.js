import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import cookieParser from "cookie-parser";

import defaultRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import amenitiesRoutes from "./routes/amenities.route.js";
import listingRoutes from "./routes/listing.route.js";
import adminRoutes from "./routes/admin.route.js";
import commentRoutes from "./routes/comment.route.js";

import { initRedis } from "./config/redis.js";
import { startSyncListingViewsJob } from "./jobs/syncListingViews.job.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT DB
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(">>> Database connected");
  } catch (error) {
    console.error(">>> Database connection failed: ", error);
  }
};
connectDB();
// CONNECT REDIS
initRedis();

// ROUTE
app.use("/", defaultRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/amenities", amenitiesRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);

// CRON JOB (TEMPORARY FOR DEV)
startSyncListingViewsJob();

// HANDLING ERROR
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    error: err.errorCode || "INTERNAL_SERVER_ERROR",
    message: err.message,
    errors: err.errors || undefined,
  });
});

export default app;
