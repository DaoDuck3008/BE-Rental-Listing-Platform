import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connection from "./config/database.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

// MIDDLEWARE
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());

// CONNECT DB
connection();

// ROUTE
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});
app.get("/favicon.ico", (req, res) => res.status(204));

// HANDLING ERROR (TEMPORARY)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error!" });
});

export default app;
