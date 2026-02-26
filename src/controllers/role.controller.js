import {
  getAllRolesService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
  getRoleByIdService,
  searchRolesService,
} from "../services/role.service.js";

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await getAllRolesService();
    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await getRoleByIdService(id);
    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const role = await createRoleService(req.body);
    return res.status(201).json({
      success: true,
      message: "Tạo quyền hạn thành công",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await updateRoleService(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Cập nhật quyền hạn thành công",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteRoleService(id);
    return res.status(200).json({
      success: true,
      message: "Xóa quyền hạn thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const searchRoles = async (req, res, next) => {
  try {
    const roles = await searchRolesService(req.query);
    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};
