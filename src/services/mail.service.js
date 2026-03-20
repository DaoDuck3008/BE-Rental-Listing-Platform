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
    throw new Error(error.message || "Gửi email xác nhận thất bại!");
  }
};

export const sendResetPasswordEmail = async (to, userName, resetToken) => {
  try {
    const from = `${process.env.SMTP_FROM_NAME || "Rental Listing Platform"} <${process.env.SMTP_FROM_EMAIL}>`;

    const mailOptions = {
      from,
      to,
      subject: `[${process.env.SMTP_FROM_NAME || "Rental Listing Platform"}] Đặt lại mật khẩu tài khoản`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #137fec; text-align: center;">Đặt lại mật khẩu</h2>
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản trên hệ thống của chúng tôi. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quy trình:</p>
          <div style="background-color: #f6f7f8; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0d141b;">${resetToken}</span>
          </div>
          <p style="color: #4c739a; font-size: 14px;">Mã này có hiệu lực trong vòng <strong>10 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="text-align: center; font-size: 12px; color: #999;">Đây là email tự động, vui lòng không phản hồi.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(">>> Send reset password email error: ", error);
    throw new Error(error.message || "Gửi email đặt lại mật khẩu thất bại!");
  }
};
