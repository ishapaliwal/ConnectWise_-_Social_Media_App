const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const commentController = require('../controllers/commentController');

router.use(authenticate);

router.post('/:postId', commentController.addComment);
router.get('/:postId', commentController.getCommentsByPost);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;