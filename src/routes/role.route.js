import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  searchRoles,
} from "../controllers/role.controller.js";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { roleSchema, updateRoleSchema } from "../validators/role.validator.js";

const router = express.Router();

router.use(protect);
router.use(requireRole(["ADMIN"]));

router.get("/", getAllRoles);
router.get("/search", searchRoles);
router.get("/:id", getRoleById);
router.post("/", validate(roleSchema), createRole);
router.put("/:id", validate(updateRoleSchema), updateRole);
router.delete("/:id", deleteRole);

export default router;
