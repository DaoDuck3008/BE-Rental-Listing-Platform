import db from "../models/index.js";
import NotFoundError from "../errors/NotFoundError.js";
import AuthorizationError from "../errors/AuthorizationError.js";
import { emitNewNotification } from "../sockets/notification.socket.js";

const { Notification, Listing, Chat, User } = db;

/**
 * Tạo thông báo mới và gửi realtime qua socket
 * @param {Object} data - { message, type, referenceId }
 * @param {string} senderId - ID của người thực hiện hành động (để tránh tự gửi cho mình)
 */
export const createNotification = async (
  { message, type, referenceId },
  senderId
) => {
  try {
    let recipientId;

    if (type === "NEW_MESSAGE") {
      const chat = await Chat.findOne({ where: { id: referenceId } });
      if (!chat) {
        throw new NotFoundError("Đoạn chat không tồn tại để tạo thông báo.");
      }
      // Người nhận là người còn lại trong cuộc trò chuyện
      recipientId = chat.tenant_id === senderId ? chat.owner_id : chat.tenant_id;
    }

    const listingRelatedTypes = ["NEW_FAVORITE", "NEW_APPROVED", "NEW_REJECTED"];
    if (listingRelatedTypes.includes(type)) {
      const listing = await Listing.findOne({ where: { id: referenceId } });
      if (!listing) {
        throw new NotFoundError("Bài đăng không tồn tại để tạo thông báo.");
      }
      recipientId = listing.owner_id;
    }

    // Không tạo thông báo nếu không xác định được người nhận hoặc người nhận là chính mình
    if (!recipientId || recipientId === senderId) {
      return null;
    }

    const notification = await Notification.create({
      content: message,
      type,
      reference_id: referenceId,
      recipient_id: recipientId,
      is_read: false,
    });

    // Gửi thông báo realtime qua Socket nếu người dùng đang online
    emitNewNotification(recipientId, notification);

    return notification;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Lấy danh sách thông báo của người dùng
 */
export const getUserNotifications = async (userId, limit = 20, page = 1) => {
  const offset = (page - 1) * limit;
  
  return await Notification.findAndCountAll({
    where: { recipient_id: userId },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
  });
};

/**
 * Lấy số lượng thông báo chưa đọc
 */
export const getUnreadCount = async (userId) => {
  return await Notification.count({
    where: { 
      recipient_id: userId,
      is_read: false 
    }
  });
};

/**
 * Cập nhật trạng thái đã đọc cho thông báo
 */
export const updateNotificationStatus = async (notificationId, userId, isRead) => {
  const notification = await Notification.findOne({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new NotFoundError("Thông báo không tồn tại.");
  }

  // Kiểm tra quyền sở hữu thông báo
  if (notification.recipient_id !== userId) {
    throw new AuthorizationError("Bạn không có quyền thực hiện hành động này.");
  }

  notification.is_read = isRead;
  await notification.save();

  return notification;
};

/**
 * Đánh dấu toàn bộ thông báo là đã đọc
 */
export const markAllAsRead = async (userId) => {
  return await Notification.update(
    { is_read: true },
    { where: { recipient_id: userId, is_read: false } }
  );
};

/**
 * Xóa một thông báo
 */
export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new NotFoundError("Thông báo không tồn tại.");
  }

  if (notification.recipient_id !== userId) {
    throw new AuthorizationError("Bạn không có quyền xóa thông báo này.");
  }

  await notification.destroy();
  return true;
};
