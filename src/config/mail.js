import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const verifyMailConnection = async () => {
  try {
    if (process.env.VERIFY_EMAIL_TOGGLE !== "true") {
      console.log(">>> [SMTP] Tính năng xác thực email đang bị tắt.");
      return false;
    }
    await transporter.verify();
    console.log(">>> [SMTP] Kết nối thành công!");
    return true;
  } catch (error) {
    console.error(">>> [SMTP] Kết nối thất bại:", error);
    return false;
  }
};

export default transporter;
