const db = require('../db');

exports.addComment = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { text } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO comments (user_id, post_id, text, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [userId, postId, text]
    );

    const postOwner = await db.query(
      `SELECT user_id FROM posts WHERE id = $1`,
      [postId]
    );

    if (postOwner.rows.length && postOwner.rows[0].user_id !== userId) {
      const addNotification = require('../utils/addNotification');
      await addNotification(
        postOwner.rows[0].user_id,
        'comment',
        `${req.user.name} commented on your post`
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add comment failed:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.getCommentsByPost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await db.query(
      `SELECT comments.*, users.name AS author, users.avatar_url
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at ASC`,
      [postId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch comments failed:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    await db.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Delete comment failed:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
