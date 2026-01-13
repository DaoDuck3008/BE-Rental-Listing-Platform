import AppError from "./AppError.js";

class AuthenticationError extends AppError {
  constructor(message = "Vui lòng đăng nhập để tiếp tục") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export default AuthenticationError;
