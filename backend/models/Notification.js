const db = require('../db');

const Notification = {
  async create(user_id, type, content) {
    const result = await db.query(
      `INSERT INTO notifications (user_id, type, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, type, content]
    );
    return result.rows[0];
  },

  async getAll(userId) {
    const result = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async markRead(notificationId) {
    await db.query(
      `UPDATE notifications SET read = true WHERE id = $1`,
      [notificationId]
    );
  },

  async clear(userId) {
    await db.query(
      `DELETE FROM notifications WHERE user_id = $1`,
      [userId]
    );
  }
};

module.exports = Notification;