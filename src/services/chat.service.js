import NotFoundError from "../errors/NotFoundError.js";
import AuthorizationError from "../errors/AuthorizationError.js";
import BusinessError from "../errors/BusinessError.js";
import db from "../models/index.js";
const { Chat, Message, User, Role } = db;
import { Op } from "sequelize";
import { createAuditLog } from "./auditLog.service.js";

export const findOrCreateChat = async (userId, targetId) => {
  // Check if chat exists between the two users
  let chat = await Chat.findOne({
    where: {
      [Op.or]: [
        { owner_id: userId, tenant_id: targetId },
        { owner_id: targetId, tenant_id: userId },
      ],
    },
  });

  if (!chat) {
    chat = await Chat.create({
      tenant_id: userId,
      owner_id: targetId,
    });
  }

  // Load associations before returning
  return await Chat.findByPk(chat.id, {
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "avatar"],
        include: [{ model: Role, as: "role", attributes: ["id", "name", "code"] }],
      },
      {
        model: User,
        as: "tenant",
        attributes: ["id", "full_name", "avatar"],
        include: [{ model: Role, as: "role", attributes: ["id", "name", "code"] }],
      },
    ],
  });
};

export const getUserChats = async (userId) => {
  const chats = await Chat.findAll({
    where: {
      [Op.or]: [{ owner_id: userId }, { tenant_id: userId }],
    },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "avatar"],
        include: [
          { model: Role, as: "role", attributes: ["id", "name", "code"] },
        ],
      },
      {
        model: User,
        as: "tenant",
        attributes: ["id", "full_name", "avatar"],
        include: [
          { model: Role, as: "role", attributes: ["id", "name", "code"] },
        ],
      },
      {
        model: Message,
        as: "messages",
        limit: 1,
        order: [["created_at", "DESC"]],
      },
    ],
    order: [["updated_at", "DESC"]],
  });

  return chats;
};

export const getChatMessages = async (chatId, limit = 20, page = 1) => {
  const offset = (page - 1) * limit;

  return await Message.findAndCountAll({
    where: { chat_id: chatId },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "full_name", "avatar"],
      },
    ],
  });
};

export const sendMessage = async (
  chatId,
  senderId,
  content,
  messageType = "text"
) => {
  const message = await Message.create({
    chat_id: chatId,
    sender_id: senderId,
    content,
    message_type: messageType,
  });

  // Update chat's updated_at timestamp
  await Chat.update({ updated_at: new Date() }, { where: { id: chatId } });

  return message;
};

export const markMessageAsRead = async (messageId, userId) => {
  const message = await Message.findByPk(messageId);

  if (!message) throw new NotFoundError("Tin nhắn không tồn tại");

  // Không cho phép người gửi đánh dấu đã đọc cho chính mình
  if (message.sender_id === userId) return message;

  message.is_read = true;
  await message.save();
  return message;
};

export const deleteChat = async (chatId, userId, auditInfo = {}) => {
  const chat = await Chat.findOne({
    where: {
      id: chatId,
      [Op.or]: [{ owner_id: userId }, { tenant_id: userId }],
    },
  });

  if (!chat) {
    throw new NotFoundError(
      "Cuộc trò chuyện không tồn tại hoặc bạn không có quyền"
    );
  }

  await chat.destroy();

  // Log action
  await createAuditLog({
    userId,
    action: "DELETE_CHAT",
    entityType: "Chat",
    entityId: chatId,
    oldData: chat.toJSON(),
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return true;
};

export const getChatParticipantIds = async (chatId) => {
  const chat = await Chat.findByPk(chatId, {
    attributes: ["owner_id", "tenant_id"],
  });
  if (!chat) return [];
  return [chat.owner_id, chat.tenant_id];
};

export const updateMessage = async (messageId, userId, content, auditInfo = {}) => {
  const message = await Message.findByPk(messageId);

  if (!message) throw new NotFoundError("Tin nhắn không tồn tại");

  // Kiểm tra quyền: chỉ người gửi mới được sửa
  if (message.sender_id !== userId) {
    throw new AuthorizationError("Bạn không có quyền sửa tin nhắn này");
  }

  // Kiểm tra thời gian: giới hạn 15 phút
  const now = new Date();
  const createdAt = new Date(message.created_at);
  const diffInMinutes = (now - createdAt) / (1000 * 60);

  if (diffInMinutes > 15) {
    throw new BusinessError(
      "Đã quá thời gian được phép sửa tin nhắn (15 phút)",
      "EDIT_TIME_EXCEEDED"
    );
  }

    const oldData = message.previous();
    message.content = content;
    await message.save();

    // Log action
    await createAuditLog({
      userId,
      action: "UPDATE_MESSAGE",
      entityType: "Message",
      entityId: messageId,
      oldData,
      newData: message.toJSON(),
      ipAddress: auditInfo.ipAddress,
      userAgent: auditInfo.userAgent,
    });

    return message;
};

export const deleteMessage = async (messageId, userId, auditInfo = {}) => {
  const message = await Message.findByPk(messageId);

  if (!message) throw new NotFoundError("Tin nhắn không tồn tại");

  // Kiểm tra quyền: chỉ người gửi mới được xóa
  if (message.sender_id !== userId) {
    throw new AuthorizationError("Bạn không có quyền xóa tin nhắn này");
  }

  const chatId = message.chat_id;
  await message.destroy();

  // Log action
  await createAuditLog({
    userId,
    action: "DELETE_MESSAGE",
    entityType: "Message",
    entityId: messageId,
    oldData: message.toJSON(),
    ipAddress: auditInfo.ipAddress,
    userAgent: auditInfo.userAgent,
  });

  return chatId;
};
