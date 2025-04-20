const db = require("../db");

async function addNotification(userId, type, text) {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, type, text, created_at) VALUES ($1, $2, $3, NOW())`,
      [userId, type, text]
    );
  } catch (err) {
    console.error("Notification insert failed:", err.message);
  }
}

module.exports = addNotification;