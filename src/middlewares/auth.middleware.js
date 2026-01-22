import { verifyAcessToken } from "../utils/jwt.util.js";
import AuthenticationError from "../errors/AuthenticationError.js";
import AuthorizationError from "../errors/AuthorizationError.js";

// Authentication
// để xác nhận xem người này đã đăng nhập chưa
export const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return next(
      new AuthenticationError("Bạn cần đăng nhập để thực hiện hành động này")
    );

  const token = auth.split(" ")[1];
  try {
    const payload = verifyAcessToken(token);
    req.user = payload;
    next();
  } catch (errror) {
    return next(new AuthenticationError("Token không hợp lệ hoặc đã hết hạn"));
  }
};

// Authorization
// kiểm tra xem người dùng hiện tại có đủ thẩm quyền để đùng api này không
export const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return next(new AuthenticationError("Chưa xác thực người dùng."));
  }

  if (!role.includes(req.user.role)) {
    return next(new AuthorizationError("Bạn không có quyền truy cập"));
  }

  next();
};
