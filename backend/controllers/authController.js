const db = require("../db");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");

exports.register = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  try {
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const idResult = await db.query("SELECT MAX(id) AS max_id FROM users");
    const nextId = (idResult.rows[0].max_id || 0) + 1;
    const avatar_url = `https://i.pravatar.cc/150?img=${nextId}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `INSERT INTO users (name, email, password, role, avatar_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, hashedPassword, role, avatar_url]
    );

    const user = rows[0];
    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};