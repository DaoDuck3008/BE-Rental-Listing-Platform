import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import process from "process";
import configFile from "../config/config.cjs";

// ===== Fix __dirname trong ES Module =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Environment =====
const env = process.env.NODE_ENV || "development";
const config = configFile[env];

// ===== Init Sequelize =====
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// ===== Load all models =====
const db = {};
const basename = path.basename(__filename);

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename &&
      (file.endsWith(".js") || file.endsWith(".cjs")) &&
      !file.endsWith(".test.js")
  );

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);

  // Sequelize CLI model export là CommonJS
  const module = await import(`file://${modelPath}`);
  const modelFactory = module.default || module;

  const model = modelFactory(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// ===== Call associate() =====
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ===== Export =====
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
