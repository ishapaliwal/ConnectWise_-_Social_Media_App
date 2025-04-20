const db = require("../db");

const Comment = {
  async flagComment(commentId) {
    const result = await db.query(
      `UPDATE comments SET flagged = TRUE WHERE id = $1 RETURNING *`,
      [commentId]
    );
    return result.rows[0];
  },

  async getFlaggedComments() {
    const result = await db.query(`
      SELECT comments.*, users.name AS author, users.avatar_url
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE flagged = TRUE
      ORDER BY comments.created_at DESC
    `);
    return result.rows;
  },

  async deleteComment(id) {
    await db.query(`DELETE FROM comments WHERE id = $1`, [id]);
  },
};

module.exports = Comment;