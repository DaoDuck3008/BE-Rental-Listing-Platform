import { emitToUser } from "./index.js";

/**
 * Emit event when a new notification is created
 */
export const emitNewNotification = (userId, notification) => {
  emitToUser(userId, "new_notification", 
    typeof notification.toJSON === "function" ? notification.toJSON() : notification
  );
};

/**
 * Emit event when notifications are marked as read
 */
export const emitNotificationsRead = (userId, notificationIds) => {
  emitToUser(userId, "notifications_read", { notificationIds });
};

/**
 * Emit event when all notifications are marked as read
 */
export const emitAllNotificationsRead = (userId) => {
  emitToUser(userId, "all_notifications_read", {});
};

/**
 * Emit event when a notification is deleted
 */
export const emitNotificationDelete = (userId, notificationId) => {
  emitToUser(userId, "notification_deleted", { notificationId });
};
