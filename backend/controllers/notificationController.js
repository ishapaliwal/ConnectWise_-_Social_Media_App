const db = require('../db');
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING *`,
      [notificationId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

exports.clearNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    await Notification.clear(userId);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};