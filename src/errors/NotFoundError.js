import AppError from "./AppError.js";

class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy tài nguyên") {
    super(message, 404, "NOT_FOUND");
  }
}

export default NotFoundError;
