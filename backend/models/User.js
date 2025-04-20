const db = require('../db');

const User = {
  async findById(id) {
    const result = await db.query('SELECT id, name, email, role, avatar_url FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async create({ name, email, password, role = 'user', avatar_url }) {
    const result = await db.query(
      'INSERT INTO users (name, email, password, role, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, password, role, avatar_url]
    );
    return result.rows[0];
  },
};

module.exports = User;