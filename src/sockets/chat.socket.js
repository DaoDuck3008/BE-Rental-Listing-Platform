import { emitToUser } from "./index.js";

/**
 * Emit event when a new message is sent
 */
export const emitNewMessage = (userId, chatId, message) => {
  emitToUser(userId, "new_message", {
    chatId,
    message: typeof message.toJSON === "function" ? message.toJSON() : message,
  });
};

/**
 * Emit event when a message is updated
 */
export const emitMessageUpdate = (userId, chatId, message) => {
  emitToUser(userId, "message_updated", {
    chatId,
    message: typeof message.toJSON === "function" ? message.toJSON() : message,
  });
};

/**
 * Emit event when a message is deleted
 */
export const emitMessageDelete = (userId, chatId, messageId) => {
  emitToUser(userId, "message_deleted", { chatId, messageId });
};

/**
 * Emit event when a chat conversation is deleted
 */
export const emitChatDelete = (userId, chatId) => {
  emitToUser(userId, "chat_deleted", { chatId });
};

/**
 * Emit event when a message is marked as read
 */
export const emitMessageRead = (senderId, messageId, chatId, readerId) => {
  emitToUser(senderId, "message_read", {
    messageId,
    chatId,
    readerId,
  });
};
