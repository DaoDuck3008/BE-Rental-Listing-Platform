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
