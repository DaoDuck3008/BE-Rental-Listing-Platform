import transporter from "../config/mail.js";

export const sendVerificationEmail = async (to, userName, verifyToken) => {
  try {
    const from = `${process.env.SMTP_FROM_NAME || "Rental Listing Platform"} <${process.env.SMTP_FROM_EMAIL}>`;

    const mailOptions = {
      from,
      to,
      subject: "Xác thực tài khoản của bạn",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1a73e8;">Chào ${userName},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Rental Listing Platform.</p>
          <p>Vui lòng sử dụng mã OTP dưới đây để hoàn tất việc xác thực địa chỉ email của bạn:</p>
          <div style="background-color: #f1f3f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; color: #1a73e8; margin: 0;">${verifyToken}</h1>
          </div>
          <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #70757a;">
            Đây là email tự động, vui lòng không trả lời.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(">>> Send email error using Nodemailer: ", error);
    throw new Error(`Gửi email xác nhận thất bại: ${error.message}`);
  }
};
