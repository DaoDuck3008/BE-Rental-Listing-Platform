import { z } from "zod";

export const createDestinationSchema = z.object({
  name: z
    .string()
    .min(3, "Tên địa danh phải dài ít nhất 3 ký tự.")
    .max(255, "Tên địa danh không được vượt quá 255 ký tự."),

  type: z
    .string()
    .min(3, "Loại địa danh phải dài ít nhất 3 ký tự.")
    .max(255, "Loại địa danh không được vượt quá 255 ký tự."),

  longitude: z.coerce
    .number()
    .min(-180, "Kinh độ phải lớn hơn hoặc bằng -180.")
    .max(180, "Kinh độ phải nhỏ hơn hoặc bằng 180."),

  latitude: z.coerce
    .number()
    .min(-180, "Vĩ độ phải lớn hơn hoặc bằng -180.")
    .max(180, "Vĩ độ phải nhỏ hơn hoặc bằng 180."),

  province_code: z.coerce.number().optional().nullable(),
  ward_code: z.coerce.number().optional().nullable(),
});

export const updateDestinationSchema = z.object({
  name: z
    .string()
    .min(3, "Tên địa danh phải dài ít nhất 3 ký tự.")
    .max(255, "Tên địa danh không được vượt quá 255 ký tự.")
    .optional(),

  type: z
    .string()
    .min(3, "Loại địa danh phải dài ít nhất 3 ký tự.")
    .max(255, "Loại địa danh không được vượt quá 255 ký tự.")
    .optional(),

  longitude: z.coerce
    .number()
    .min(-180, "Kinh độ phải lớn hơn hoặc bằng -180.")
    .max(180, "Kinh độ phải nhỏ hơn hoặc bằng 180.")
    .optional(),

  latitude: z.coerce
    .number()
    .min(-180, "Vĩ độ phải lớn hơn hoặc bằng -180.")
    .max(180, "Vĩ độ phải nhỏ hơn hoặc bằng 180.")
    .optional(),

  province_code: z.coerce.number().optional().nullable(),
  ward_code: z.coerce.number().optional().nullable(),
});
