import React, { useState, useEffect } from "react";
import { notificationService } from "../services/api";
import { FaBell, FaTimes, FaCheck, FaTrash } from "react-icons/fa";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAllNotifications();
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  return (
    <div className="notifications-container">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <FaTimes />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="empty-state">
              <p>No notifications</p>
            </div>
          ) : (
            <>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button
                    className="mark-all-read-btn"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button className="clear-all-btn" onClick={handleClearAll}>
                    Clear All
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${
                      notification.status === "sent" ? "unread" : "read"
                    }`}
                  >
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <small>
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>

                    <div className="notification-actions-item">
                      {notification.status === "sent" && (
                        <button
                          className="icon-btn read-btn"
                          onClick={() => handleMarkAsRead(notification._id)}
                          title="Mark as read"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        className="icon-btn delete-btn"
                        onClick={() =>
                          handleDeleteNotification(notification._id)
                        }
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
