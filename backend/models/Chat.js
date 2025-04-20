const db = require("../db");

const Chat = {
  async getUserChats(userId) {
    const result = await db.query(
      `
      SELECT DISTINCT ON (chat_partner.id)
        chat_partner.id AS user_id,
        chat_partner.name AS user_name,
        chat_partner.avatar_url,
        m.text,
        m.created_at,
        m.sender_id,
        m.receiver_id
      FROM (
        SELECT *
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
        ORDER BY created_at DESC
      ) m
      JOIN users chat_partner
        ON chat_partner.id = CASE
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
        END
      ORDER BY chat_partner.id, m.created_at DESC
      `,
      [userId]
    );

    return result.rows;
  },

  async getChatMessages(userId, otherUserId) {
    const result = await db.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, otherUserId]
    );
    return result.rows;
  },

  async sendMessage(senderId, receiverId, text) {
    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, text, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [senderId, receiverId, text]
    );
    return result.rows[0];
  },
};

module.exports = Chat;