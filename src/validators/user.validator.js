import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .optional(),

  phone_number: z
    .string()
    .min(10, "Số điện thoại phải 10 ký tự")
    .max(10, "Số điện thoại phải có 10 ký tự")
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
    .optional(),

  gender: z
    .enum(["Male", "Female", "Other"], "Giới tính không hợp lệ")
    .optional(),

  //   avatar: z.file("Ảnh đại diện phải là 1 file").optional(),

  role: z
    .enum(["TENANT", "LANDLORD", "ADMIN", "USER"], "Vai trò không hợp lệ")
    .optional(),

  email: z.email("Email không hợp lệ").optional(),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự")
    .optional(),
});
