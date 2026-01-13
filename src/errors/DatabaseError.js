import AppError from "./AppError.js";

class DatabaseError extends AppError {
  constructor(message = "Lỗi cơ sở dữ liệu") {
    super(message, 500, "DATABASE_ERROR");
  }
}

export default DatabaseError;
