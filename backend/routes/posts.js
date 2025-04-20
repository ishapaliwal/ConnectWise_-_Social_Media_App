const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', postController.getPosts);
router.post('/', postController.createPost);
router.post('/:postId/like', postController.toggleLike);
router.post('/:postId/comment', postController.addComment);
router.get("/user/:id", postController.getPostsByUser);
router.get("/:id/likes", authenticate, postController.getLikesByPost);
router.get("/:id", postController.getPostById);

module.exports = router;