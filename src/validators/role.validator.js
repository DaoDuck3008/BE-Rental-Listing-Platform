import { z } from "zod";

export const roleSchema = z.object({
  code: z
    .string({
      required_error: "Mã quyền hạn là bắt buộc",
      invalid_type_error: "Mã quyền hạn phải là chuỗi",
    })
    .trim()
    .min(1, "Mã quyền hạn không được để trống")
    .max(50, "Mã quyền hạn không được vượt quá 50 ký tự"),
  name: z
    .string({
      required_error: "Tên quyền hạn là bắt buộc",
      invalid_type_error: "Tên quyền hạn phải là chuỗi",
    })
    .trim()
    .min(1, "Tên quyền hạn không được để trống")
    .max(100, "Tên quyền hạn không được vượt quá 100 ký tự"),
});

export const updateRoleSchema = z
  .object({
    code: z
      .string({
        invalid_type_error: "Mã quyền hạn phải là chuỗi",
      })
      .trim()
      .min(1, "Mã quyền hạn không được để trống")
      .max(50, "Mã quyền hạn không được vượt quá 50 ký tự")
      .optional(),
    name: z
      .string({
        invalid_type_error: "Tên quyền hạn phải là chuỗi",
      })
      .trim()
      .min(1, "Tên quyền hạn không được để trống")
      .max(100, "Tên quyền hạn không được vượt quá 100 ký tự")
      .optional(),
  })
  .refine(
    (data) => data.code !== undefined || data.name !== undefined,
    "Phải cập nhật ít nhất một trường"
  );
