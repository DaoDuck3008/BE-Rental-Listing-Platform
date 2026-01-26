import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string()
    .min(10, "Tiêu đề phải dài ít nhất 10 ký tự.")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự."),

  price: z.coerce.number().min(0, "Giá thuê không được âm."),
  area: z.coerce.number().min(0, "Diện tích phòng không được âm."),
  capacity: z.coerce.number().min(1, "Sức chứa không được âm."),
  beds: z.coerce.number().min(0, "Số phòng ngủ không được âm."),
  bathrooms: z.coerce.number().min(0, "Số phòng tắm không được âm."),

  province_code: z.coerce.number({ message: "Tỉnh/ Thành phố không hợp lệ." }),
  ward_code: z.coerce.number({ message: "Phường / Xã không hợp lệ." }),
  address: z.string(),

  longitude: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),

  description: z.string().min(10, "Mô tả phải dài ít nhất 10 ký tự."),

  listing_type_code: z.string(),

  // FormData sends array as comma-separated string, need to parse
  amenities: z
    .string()
    .transform((val) => {
      if (!val || val === "") return [];
      // If already an array (shouldn't happen with FormData but safe)
      if (Array.isArray(val)) return val;
      // Parse comma-separated string
      return val.split(",").map((id) => id.trim());
    })
    .pipe(z.array(z.string())),

  showPhoneNumber: z.coerce.boolean(),
  coverImageIndex: z.coerce.number().min(0, "Ảnh bìa không được âm."),
});

const coerceNullableNumber = z.preprocess(
  (val) => (val === "" || val === "null" || val === undefined ? null : val),
  z.coerce.number().optional().nullable()
);

export const createDraftListingSchema = z.object({
  title: z
    .string({ required_error: "Vui lòng nhập ít nhất tiêu đề để lưu bản nháp" })
    .trim()
    .min(1, "Vui lòng nhập ít nhất tiêu đề để lưu bản nháp")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự."),

  price: coerceNullableNumber,
  area: coerceNullableNumber,
  capacity: coerceNullableNumber,
  beds: coerceNullableNumber,
  bathrooms: coerceNullableNumber,
  coverImageIndex: coerceNullableNumber,

  province_code: coerceNullableNumber,
  ward_code: coerceNullableNumber,
  address: z.string().optional().nullable(),

  longitude: coerceNullableNumber,
  latitude: coerceNullableNumber,

  description: z.string().optional().nullable(),

  listing_type_code: z.string().optional().nullable(),

  amenities: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val || val === "" || val === "null") return [];
      if (Array.isArray(val)) return val;
      return val.split(",").map((id) => id.trim());
    }),

  showPhoneNumber: z.coerce.boolean().optional(),
});
