import { z } from "zod";

export const createListingTypeSchema = z.object({
  code: z
    .string({ required_error: "Mã loại bài đăng là bắt buộc." })
    .min(2, "Mã loại bài đăng phải có ít nhất 2 ký tự.")
    .max(50, "Mã loại bài đăng không được vượt quá 50 ký tự."),
  name: z
    .string({ required_error: "Tên loại bài đăng là bắt buộc." })
    .min(2, "Tên loại bài đăng phải có ít nhất 2 ký tự.")
    .max(100, "Tên loại bài đăng không được vượt quá 100 ký tự."),
  description: z.string().optional().nullable(),
});

export const updateListingTypeSchema = createListingTypeSchema.partial();
