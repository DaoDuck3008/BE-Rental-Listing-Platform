import AppError from "./AppError.js";

class UploadError extends AppError {
  constructor(message = "Lỗi tải lên tệp tin") {
    super(message, 400, "UPLOAD_ERROR");
  }
}

export default UploadError;
