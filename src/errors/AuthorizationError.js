import AppError from "./AppError.js";

class AuthorizationError extends AppError {
  constructor(message = "Bạn không có quyền truy cập tài nguyên này") {
    super(message, 403, "FORBIDDEN");
  }
}
export default AuthorizationError;
