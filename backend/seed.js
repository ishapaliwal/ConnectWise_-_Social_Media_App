const db = require('./db');

async function seed() {
  try {
    await db.query(`TRUNCATE likes, comments, posts, users RESTART IDENTITY CASCADE;`);

    const bcrypt = require('bcrypt');
    const hashedPw = await bcrypt.hash('User@1234.Right', 10);

    await db.query(`
      INSERT INTO users (name, email, password, role, avatar_url)
      VALUES 
        ('Alice', 'alice@connectwise.com', '${hashedPw}', 'user', 'https://i.pravatar.cc/150?img=1'),
        ('Bob', 'bob@connectwise.com', '${hashedPw}', 'admin', 'https://i.pravatar.cc/150?img=2'),
        ('Hailey', 'hailey@connectwise.com', '${hashedPw}', 'admin', 'https://i.pravatar.cc/150?img=3'),
        ('Katie', 'katie@connectwise.com', '${hashedPw}', 'admin', 'https://i.pravatar.cc/150?img=4');
    `);

    await db.query(`
      INSERT INTO posts (user_id, content, image_url)
      VALUES 
        (1, 'First post from Alice!', 'https://picsum.photos/300/200?random=1'),
        (2, 'Bob is here too.', 'https://picsum.photos/300/200?random=2');
    `);

    console.log('Test data seeded!');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();