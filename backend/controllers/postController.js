const db = require("../db");

exports.getPosts = async (req, res) => {
  const currentUserId = req.user?.id || null;

  try {
    const posts = await db.query(
      `
        SELECT 
          posts.*,
          users.name AS author,
          users.avatar_url,
          COUNT(likes.id) AS like_count,
          BOOL_OR(likes.user_id = $1) AS liked_by_user
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON likes.post_id = posts.id
        GROUP BY posts.id, users.name, users.avatar_url
        ORDER BY posts.created_at DESC
      `,
      [currentUserId]
    );

    res.json(
      posts.rows.map((post) => ({
        ...post,
        like_count: parseInt(post.like_count),
        liked_by_user: post.liked_by_user === true,
      }))
    );
  } catch (err) {
    console.error("getPosts failed:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.createPost = async (req, res) => {
  const { user_id, content, image_url } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, content, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Post creation failed" });
  }
};

const Post = require("../models/Post");

exports.toggleLike = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const result = await db.query(
      `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]
    );

    if (result.rows.length > 0) {
      await Post.unlike(postId, userId);
    } else {
      await Post.like(postId, userId);

      const post = await db.query(`SELECT user_id FROM posts WHERE id = $1`, [
        postId,
      ]);
      if (post.rows.length && post.rows[0].user_id !== userId) {
        const addNotification = require("../utils/addNotification");
        await addNotification(
          post.rows[0].user_id,
          "like",
          `${req.user.name} liked your post`
        );
      }
    }

    const likeCount = await Post.getLikesCount(postId);

    res.json({ likes: likeCount });
  } catch (err) {
    console.error("Toggle like failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addComment = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { text } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO comments (user_id, post_id, text) VALUES ($1, $2, $3) RETURNING *`,
      [userId, postId, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add comment failed:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.getPostsByUser = async (req, res) => {
  const viewerId = req.user?.id || null;
  const userId = req.params.id;

  try {
    const result = await db.query(
      `SELECT p.*, u.name AS author, u.avatar_url, 
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
        EXISTS (SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) AS liked_by_user,
        json_agg(
          json_build_object(
            'id', c.id,
            'user_id', c.user_id,
            'text', c.text,
            'created_at', c.created_at,
            'author', cu.name,
            'avatar_url', cu.avatar_url
          )
        ) FILTER (WHERE c.id IS NOT NULL) AS comments
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN users cu ON c.user_id = cu.id
      WHERE p.user_id = $2
      GROUP BY p.id, u.name, u.avatar_url
      ORDER BY p.created_at DESC`,
      [viewerId, userId]
    );

    const posts = result.rows.map((post) => ({
      ...post,
      like_count: parseInt(post.like_count),
      liked_by_user: post.liked_by_user === true,
      comments: post.comments || [],
    }));

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts by user:", err);
    res.status(500).json({ error: "Failed to fetch posts by user" });
  }
};

exports.getLikesByPost = async (req, res) => {
  const postId = req.params.id;
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.avatar_url
       FROM likes l
       JOIN users u ON u.id = l.user_id
       WHERE l.post_id = $1`,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching likes:", err);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
};

exports.getPostById = async (req, res) => {
  const postId = req.params.id;
  const viewerId = req.user?.id || null;

  try {
    const result = await db.query(
      `SELECT p.*, u.name AS author, u.avatar_url, 
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
        EXISTS (SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) AS liked_by_user,
        json_agg(
          json_build_object(
            'id', c.id,
            'user_id', c.user_id,
            'text', c.text,
            'created_at', c.created_at,
            'author', cu.name,
            'avatar_url', cu.avatar_url
          )
        ) FILTER (WHERE c.id IS NOT NULL) AS comments
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN users cu ON c.user_id = cu.id
      WHERE p.id = $2
      GROUP BY p.id, u.name, u.avatar_url`,
      [viewerId, postId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = result.rows[0];
    post.like_count = parseInt(post.like_count);
    post.liked_by_user = post.liked_by_user === true;
    post.comments = post.comments || [];

    res.json(post);
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};