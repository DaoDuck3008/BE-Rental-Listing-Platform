import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedis } from "../config/redis.js";
import TooManyRequestsError from "../errors/TooManyRequestsError.js";

// Hàm tạo Limiter động cho phép truyền tham số
export const createLimiter = ({
  windowMs = 15 * 60 * 1000,
  limit = 100,
  message = "Hệ thống đang bận, vui lòng thử lại sau ít phút.",
  keyGenerator,
  prefix = "common", // Thêm prefix mặc định cho Redis
} = {}) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { default: false }, // Tắt cảnh báo IPv6 để tránh lỗi crash
    store: new RedisStore({
      sendCommand: (...args) => getRedis().call(...args),
      // Cấu hình prefix cho Redis để tách biệt các bộ đếm
      prefix: `rl:${prefix}:`,
    }),
    keyGenerator: keyGenerator || ((req) => req.ip),
    handler: (req, res, next, options) => {
      next(new TooManyRequestsError(message));
    },
  });
};

// 1. Limiter cho việc Đăng bài viết
export const listingCreationLimiter = createLimiter({
  prefix: "listing-creation",
  windowMs: 12 * 60 * 60 * 1000, // 12 giờ
  limit: 10, // 10 bài viết/12 giờ
  message: "Bạn đã đăng quá nhiều bài viết trong thời gian ngắn. Vui lòng thử lại sau 12 giờ.",
  keyGenerator: (req) => req.user?.id?.toString() || req.ip,
});

// 2. Limiter cho Tìm kiếm bài viết (Bảo vệ API Google Maps)
export const searchLimiter = createLimiter({
  prefix: "search",
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 30, // 30 lượt tìm kiếm/15 phút
  message: "Máy của bạn đã gửi quá nhiều yêu cầu tìm kiếm. Vui lòng thử lại sau 15 phút.",
});

// 3. Limiter cho Đăng ký tài khoản
export const registerLimiter = createLimiter({
  prefix: "register",
  windowMs: 24 * 60 * 60 * 1000, // 24 giờ
  limit: 10, // 10 request/24 giờ
  message: "Máy của bạn đã gửi quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 24 giờ.",
});

// 4. Limiter cho Đăng nhập (Chống Brute-force)
export const loginLimiter = createLimiter({
  prefix: "login",
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 10, // 10 request/15 phút
  message: "Máy của bạn đã gửi quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau 15 phút.",
});

// 5. Limiter cho các API thông thường khác
export const otherLimiter = createLimiter({
  prefix: "other",
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 200, // 200 request/15 phút
  message: "Máy của bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.",
});
