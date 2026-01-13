import AppError from "./AppError.js";

class BusinessError extends AppError {
  constructor(
    message = "Vi phạm nguyên tắc nghiệp vụ",
    errorCode = "BUSINESS_RULE_VALIDATION"
  ) {
    super(message, 422, errorCode);
  }
}

export default BusinessError;

// Dùng cho luật nghiệp vụ:

// User đăng quá số bài cho phép

// Listing bị khoá

// User bị ban

// throw new BusinessError(
//     "Bạn đã vượt quá số bài đăng miễn phí",
//     "POST_LIMIT_EXCEEDED"
//   );
