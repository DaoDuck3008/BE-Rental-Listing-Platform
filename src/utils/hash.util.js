import crypto from "crypto";

/**
 * Tạo mã OTP ngẫu nhiên gồm 6 chữ số
 * @returns {string} Mã OTP
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Mã hóa token bằng SHA256
 * @param {string} token Chuỗi cần mã hóa
 * @returns {string} Chuỗi đã mã hóa
 */
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * So sánh token thô với token đã mã hóa
 * @param {string} rawToken Token người dùng nhập
 * @param {string} hashedToken Token đã lưu trong database/redis
 * @returns {boolean} Kết quả so sánh
 */
export const compareToken = (rawToken, hashedToken) => {
  const hashedInput = hashToken(rawToken);
  return hashedInput === hashedToken;
};

/**
 * Mã hóa IP bằng MD5
 * @param {string} rawIP IP cần mã hóa
 * @returns {string} IP đã mã hóa
 */
export const hashIP = (rawIP) => {
  return crypto.createHash("md5").update(rawIP).digest("hex");
};
