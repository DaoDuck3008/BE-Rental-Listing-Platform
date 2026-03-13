import {
  findOrCreateChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessageAsRead,
  deleteChat,
  getChatParticipantIds,
  updateMessage,
  deleteMessage,
} from "../services/chat.service.js";
import { 
  emitNewMessage, 
  emitMessageUpdate, 
  emitMessageDelete, 
  emitMessageRead, 
  emitChatDelete 
} from "../sockets/chat.socket.js";
import { createNotification } from "../services/notification.service.js";

export const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { targetId } = req.body;

    if (!targetId) {
      return res.status(400).json({
        success: false,
        message: "targetId không được để trống",
      });
    }

    if (userId === targetId) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể trò chuyện với chính mình",
      });
    }

    const chat = await findOrCreateChat(userId, targetId);

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

export const index = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const chats = await getUserChats(userId);

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

export const messages = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const result = await getChatMessages(chatId, limit, page);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.count,
        limit: parseInt(limit),
        page: parseInt(page),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const send = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user.id;
    const { content, messageType } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Nội dung tin nhắn không được để trống",
      });
    }

    const message = await sendMessage(chatId, userId, content, messageType);

    // --- SOCKET LOGIC ---
    // Lấy ID của 2 người trong cuộc trò chuyện
    const participantIds = await getChatParticipantIds(chatId);
    
    // Gửi sự kiện 'new_message' cho cả 2 người để giao diện cập nhật ngay lập tức
    participantIds.forEach(id => {
      emitNewMessage(id, chatId, message);
    });

    // Notification
    await createNotification(
      {
        message: `Bạn có tin nhắn mới: "${content.substring(0, 50)}${content.length > 50 ? "..." : ""}"`,
        type: "NEW_MESSAGE",
        referenceId: chatId,
      },
      userId
    );

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user.id;

    const message = await markMessageAsRead(messageId, userId);

    // --- SOCKET LOGIC ---
    // Thông báo cho người gửi tin nhắn rằng tin nhắn của họ đã được đọc
    emitMessageRead(message.sender_id, messageId, message.chat_id, userId);
    // ----------------------

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user.id;

    // Lấy thông tin người còn lại trước khi xóa để thông báo
    const participantIds = await getChatParticipantIds(chatId);
    const otherParticipantId = participantIds.find(id => id !== userId);

    await deleteChat(chatId, userId, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // --- SOCKET LOGIC ---
    // Thông báo cho người còn lại rằng cuộc trò chuyện đã bị xóa
    if (otherParticipantId) {
      emitChatDelete(otherParticipantId, chatId);
    }
    // ----------------------

    res.status(200).json({
      success: true,
      message: "Cuộc trò chuyện đã được xóa",
    });
  } catch (error) {
    next(error);
  }
};

export const updateMsg = async (req, res, next) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    const message = await updateMessage(messageId, userId, content, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Socket: Gửi thông báo cập nhật cho tất cả participant trong chat
    const participantIds = await getChatParticipantIds(message.chat_id);
    participantIds.forEach((id) => {
      emitMessageUpdate(id, message.chat_id, message);
    });

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMsg = async (req, res, next) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user.id;

    const chatId = await deleteMessage(messageId, userId, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Socket: Gửi thông báo xóa cho tất cả participant trong chat
    const participantIds = await getChatParticipantIds(chatId);
    participantIds.forEach((id) => {
      emitMessageDelete(id, chatId, messageId);
    });

    res.status(200).json({
      success: true,
      message: "Tin nhắn đã được xóa",
    });
  } catch (error) {
    next(error);
  }
};


