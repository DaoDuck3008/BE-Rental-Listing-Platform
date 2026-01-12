import { z } from "zod";

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

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .optional(),

  phone_number: z
    .string()
    .min(10, "Số điện thoại phải đủ 10 ký tự")
    .max(10, "Số điện thoại phải đủ 10 ký tự")
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
