import db from "../models/index.js";

const { AuditLog } = db;

export const createAuditLog = async ({
  userId,
  action,
  entityType,
  entityId,
  oldData,
  newData,
  ipAddress,
  userAgent,
}) => {
  return await AuditLog.create({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_data: oldData,
    new_data: newData,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

export const getAuditLogs = async ({
  page = 1,
  limit = 50,
  userId,
  action,
  entityType,
}) => {
  const offset = (page - 1) * limit;

  return await AuditLog.findAndCountAll({
    where: {
      ...(userId && { user_id: userId }),
      ...(action && { action }),
      ...(entityType && { entity_type: entityType }),
    },
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["id", "full_name", "email", "avatar"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });
};

export const getEntityAuditLogs = async ({ entityType, entityId }) => {
  return await AuditLog.findAll({
    where: {
      entity_type: entityType,
      entity_id: entityId,
    },
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["id", "full_name", "email", "avatar"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

export const getAuditLogById = async (id) => {
  const log = await AuditLog.findByPk(id, {
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["id", "full_name", "email", "avatar"],
      },
    ],
  });

  if (!log) {
    const NotFoundError = (await import("../errors/NotFoundError.js")).default;
    throw new NotFoundError("Không tìm thấy tùy chọn audit log này");
  }

  return log;
};
export const getUserRecentActivityService = async (userId, limit = 5) => {
  return await AuditLog.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    limit,
  });
};
