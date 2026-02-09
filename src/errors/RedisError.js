import AppError from "./AppError.js";

class RedisError extends AppError {
  constructor(message = "Lỗi kết nối Redis") {
    super(message, 500, "REDIS_ERROR");
  }
}

export default RedisError;
