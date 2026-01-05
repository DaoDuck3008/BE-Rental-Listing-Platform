import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

import defaultRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.route.js";

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

// ROUTE
app.use("/", defaultRoutes);
app.use("/api/auth", authRoutes);

// HANDLING ERROR (TEMPORARY)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error!" });
});

export default app;
