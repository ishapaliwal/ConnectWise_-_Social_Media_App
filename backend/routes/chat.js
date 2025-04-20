const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', chatController.getUserChats);
router.get('/messages/:otherUserId', chatController.getChatMessages);
router.post('/messages/:otherUserId', chatController.sendMessage);

module.exports = router;