const db = require("../db");

exports.getFlaggedPosts = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
  p.*,
  u.name AS reported_by,
  r.reason
FROM posts p
JOIN reports r ON r.target_id = p.id AND r.report_type = 'post'
JOIN users u ON u.id = r.reported_by
ORDER BY p.created_at DESC;
`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch flagged posts:", err);
    res.status(500).json({ error: "Failed to fetch flagged posts" });
  }
};

exports.getReportedUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.*, r.reason, r.created_at, r.reported_by
       FROM reports r
       JOIN users u ON r.target_id = u.id
       WHERE r.report_type = 'user'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reported users:", err);
    res.status(500).json({ error: "Failed to fetch reported users" });
  }
};

exports.getReportedComments = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         c.id AS comment_id,
         c.text AS comment_text,
         c.post_id,
         p.content AS post_content,
         r.reason,
         r.created_at
       FROM reports r
       JOIN comments c ON r.target_id = c.id
       JOIN posts p ON c.post_id = p.id
       WHERE r.report_type = 'comment'
       ORDER BY r.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reported comments:", err);
    res.status(500).json({ error: "Failed to fetch reported comments" });
  }
};

exports.approvePost = async (req, res) => {
  const postId = req.params.id;
  try {
    await db.query(
      `DELETE FROM reports WHERE report_type = 'post' AND target_id = $1`,
      [postId]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error approving post:", err);
    res.status(500).json({ error: "Failed to approve post" });
  }
};

exports.deletePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    await db.query(`DELETE FROM likes WHERE post_id = $1`, [postId]);

    await db.query(`DELETE FROM comments WHERE post_id = $1`, [postId]);

    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);

    res.json({ message: "Post and related data deleted successfully" });
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

exports.banUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query(
      `
      DELETE FROM likes
      WHERE post_id IN (SELECT id FROM posts WHERE user_id = $1)
    `,
      [userId]
    );

    await db.query(`DELETE FROM likes WHERE user_id = $1`, [userId]);

    await db.query(
      `
      DELETE FROM comments
      WHERE post_id IN (SELECT id FROM posts WHERE user_id = $1)
    `,
      [userId]
    );

    await db.query(`DELETE FROM comments WHERE user_id = $1`, [userId]);

    await db.query(
      `
      DELETE FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
    `,
      [userId]
    );

    await db.query(`DELETE FROM notifications WHERE user_id = $1`, [userId]);

    await db.query(
      `DELETE FROM reports WHERE report_type = 'user' AND target_id = $1`,
      [userId]
    );

    await db.query(`DELETE FROM posts WHERE user_id = $1`, [userId]);

    await db.query(`DELETE FROM users WHERE id = $1`, [userId]);

    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting user and related data:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.ignoreUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query(
      `DELETE FROM reports WHERE report_type = 'user' AND target_id = $1`,
      [userId]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error ignoring user:", err);
    res.status(500).json({ error: "Failed to ignore user report" });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  try {
    await db.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
    await db.query(
      `DELETE FROM reports WHERE report_type = 'comment' AND target_id = $1`,
      [commentId]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

exports.ignoreComment = async (req, res) => {
  const commentId = req.params.id;
  try {
    await db.query(
      `DELETE FROM reports WHERE report_type = 'comment' AND target_id = $1`,
      [commentId]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error ignoring comment report:", err);
    res.status(500).json({ error: "Failed to ignore comment report" });
  }
};

exports.createReport = async (req, res) => {
  const { report_type, target_id, reason, reported_by } = req.body;

  try {
    await db.query(
      "INSERT INTO reports (report_type, target_id, reason, reported_by) VALUES ($1, $2, $3, $4)",
      [report_type, target_id, reason, reported_by]
    );
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("Failed to submit report:", err);
    res.status(500).json({ error: "Failed to submit report" });
  }
};