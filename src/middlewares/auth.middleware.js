import { verifyAcessToken } from "../utils/jwt.util.js";

// Authentication
// để xác nhận xem người này đã đăng nhập chưa
export const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];
  const payload = verifyAcessToken(token);

  req.user = payload;
  next();
};

// Authorization
// kiểm tra xem người dùng hiện tại có đủ thẩm quyền để đùng api này không
export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.sendStatus(403);
  next();
};
