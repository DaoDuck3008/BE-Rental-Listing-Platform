import { z } from "zod";

// Validator cho Đăng ký tài khoản
export const registerUserSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được vượt quá 100 ký tự"),

    email: z.email("Email không hợp lệ"),

    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu quá dài")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{6,50}$/,
        "Mật khẩu phải chứa ít nhất một chữ cái, một ký tự và một số"
      ),

    phone_number: z
      .string()
      .min(10, "Số điện thoại phải đủ 10 ký tự")
      .max(10, "Số điện thoại phải đủ 10 ký tự")
      .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),

    confirm_password: z.string(),

    gender: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Giới tính không hợp lệ" }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

// Validator cho Cập nhật thông tin cá nhân
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Họ và tên không được để trống")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),

  phone_number: z
    .string()
    .trim()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ (phải có 10 số)"),

  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Giới tính không hợp lệ" }),
  }),

  email: z.string().email("Email không hợp lệ").optional(),
});

// Validator cho Hoàn thiện hồ sơ (Bổ sung sau khi đăng nhập bằng Google/Facebook, v.v.)
export const fillProfileSchema = z.object({
  phone_number: z
    .string()
    .trim()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ (phải có 10 số)"),

  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Giới tính không hợp lệ" }),
  }).optional(),

  role: z.enum(["TENANT", "LANDLORD", "USER"], {
    errorMap: () => ({ message: "Vai trò không hợp lệ" }),
  }).optional(),
});

// Validator cho Quên mật khẩu - Gửi Email
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

// Validator cho Đặt lại mật khẩu (Reset Password)
export const resetPasswordSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    otp: z
      .string()
      .min(6, "Mã xác nhận phải đủ 6 chữ số")
      .max(6, "Mã xác nhận phải đủ 6 chữ số")
      .regex(/^[0-9]+$/, "Mã xác nhận chỉ bao gồm các chữ số"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu mới quá dài")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{6,50}$/,
        "Mật khẩu phải chứa ít nhất một chữ cái, một ký tự và một số"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Validator cho Đổi mật khẩu
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu mới quá dài")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{6,50}$/,
        "Mật khẩu mới phải chứa ít nhất một chữ cái, một ký tự và một số"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Mật khẩu mới không được giống mật khẩu cũ",
    path: ["newPassword"],
  });
