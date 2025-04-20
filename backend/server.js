const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('ConnectWise Backend Running');
});

// Route imports
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat');
const commentRoutes = require('./routes/comments');
const moderationRoutes = require('./routes/moderation');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});