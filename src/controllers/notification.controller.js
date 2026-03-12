import {
  getUserNotifications,
  getUnreadCount,
  updateNotificationStatus,
  markAllAsRead,
  deleteNotification,
} from "../services/notification.service.js";

/**
 * Lấy danh sách thông báo của người dùng hiện tại
 */
export const index = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 20, page = 1 } = req.query;

    const result = await getUserNotifications(userId, limit, page);

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

/**
 * Lấy số lượng thông báo chưa đọc
 */
export const unreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật trạng thái đã đọc của 1 thông báo
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { id: notificationId } = req.params;
    const userId = req.user.id;
    const { isRead } = req.body;

    const notification = await updateNotificationStatus(notificationId, userId, isRead);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đánh dấu toàn bộ thông báo đã đọc
 */
export const markAllRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: "Tất cả thông báo đã được đánh dấu là đã đọc.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa một thông báo
 */
export const destroy = async (req, res, next) => {
  try {
    const { id: notificationId } = req.params;
    const userId = req.user.id;

    await deleteNotification(notificationId, userId);

    res.status(200).json({
      success: true,
      message: "Thông báo đã được xóa.",
    });
  } catch (error) {
    next(error);
  }
};
