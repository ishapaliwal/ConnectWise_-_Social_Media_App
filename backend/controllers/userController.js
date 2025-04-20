const db = require("../db");
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadProfileImage = async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileName = `images/${userId}_${Date.now()}.jpg`;
  const s3Params = {
    Bucket: "connectwise-app",
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(s3Params).promise();
    const imageUrl = data.Location;

    await db.query(
      `UPDATE users SET avatar_url = $1 WHERE id = $2`,
      [imageUrl, userId]
    );

    res.json({ avatar_url: imageUrl });
  } catch (err) {
    console.error("Failed to upload profile image:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT id, name, email, avatar_url, bio, interests FROM users WHERE id = $1`,
      [userId]
    );
    const user = result.rows[0];
    res.json({
      ...user,
      avatarUrl: user.avatar_url,
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT id, name, avatar_url FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, bio, interests, avatarUrl } = req.body;

  try {
    const result = await db.query(
      `SELECT name, bio, interests, avatar_url FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const current = result.rows[0];

    const updatedName = name ?? current.name;
    const updatedBio = bio ?? current.bio;
    const updatedInterests = interests ?? current.interests;
    const updatedAvatarUrl = avatarUrl ?? current.avatar_url;

    const updateResult = await db.query(
      `UPDATE users
       SET name = $1, bio = $2, interests = $3, avatar_url = $4
       WHERE id = $5
       RETURNING id, name, email, avatar_url, bio, interests`,
      [updatedName, updatedBio, updatedInterests, updatedAvatarUrl, userId]
    );

    const updated = updateResult.rows[0];
    res.json({
      ...updated,
      avatarUrl: updated.avatar_url,
    });
  } catch (err) {
    console.error("Failed to update profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await db.query(
      "SELECT id, name, email, avatar_url, bio, interests FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};