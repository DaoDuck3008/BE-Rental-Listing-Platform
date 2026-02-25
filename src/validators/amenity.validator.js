import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z
    .string({ required_error: "Tên tiện ích là bắt buộc." })
    .min(2, "Tên tiện ích phải có ít nhất 2 ký tự.")
    .max(100, "Tên tiện ích không được vượt quá 100 ký tự."),
  icon: z.string().optional().nullable(),
});

export const updateAmenitySchema = createAmenitySchema.partial();
