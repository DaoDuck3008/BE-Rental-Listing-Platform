import ValidationError from "../errors/ValidationError.js";

export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));

      return next(new ValidationError("Dữ liệu không hợp lệ", errors));
    }

    req[source] = result.data;
    next();
  };

//   MẪU KẾT QUẢ CỦA VALIDATION ERROR
//   {
//     "code": "VALIDATION_ERROR",
//     "errors": [
//       { "field": "phone_number", "message": "Invalid phone number" },
//       { "field": "gender", "message": "Required" }
//     ]
//   }
