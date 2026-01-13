import AppError from "./AppError.js";

class ConfictError extends AppError {
  constructor(message = "Dữ liệu đã tồn tại") {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export default ConfictError;
