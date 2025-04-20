const db = require("../db");

const Post = {
  async getAll() {
    const result = await db.query(`
      SELECT posts.*, users.name AS author, users.avatar_url
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ user_id, content, image_url }) {
    const result = await db.query(
      "INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *",
      [user_id, content, image_url]
    );
    return result.rows[0];
  },

  async like(postId, userId) {
    await db.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [postId, userId]
    );
  },

  async unlike(postId, userId) {
    await db.query("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [
      postId,
      userId,
    ]);
  },

  async getLikesCount(postId) {
    const result = await db.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );
    return parseInt(result.rows[0].count, 10);
  },
};

module.exports = Post;