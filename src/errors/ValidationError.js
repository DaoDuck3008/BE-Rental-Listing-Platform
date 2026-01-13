import AppError from "./AppError.js";

class ValidationError extends AppError {
  constructor(message = "Dữ liệu không hợp lệ", errors = []) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export default ValidationError;
