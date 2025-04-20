const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const admin = require("../middleware/admin");
const moderationController = require("../controllers/moderationController");

router.get("/flagged-posts", authenticate, admin, moderationController.getFlaggedPosts);
router.get("/reported-users", authenticate, admin, moderationController.getReportedUsers);
router.get("/reported-comments", authenticate, admin, moderationController.getReportedComments);

router.post("/posts/:id/approve", authenticate, admin, moderationController.approvePost);
router.delete("/posts/:id", authenticate, admin, moderationController.deletePost);

router.post("/users/:id/ban", authenticate, admin, moderationController.banUser);
router.post("/users/:id/ignore", authenticate, admin, moderationController.ignoreUser);

router.delete("/comments/:id", authenticate, admin, moderationController.deleteComment);
router.post("/comments/:id/ignore", authenticate, admin, moderationController.ignoreComment);

router.post("/reports", moderationController.createReport);

module.exports = router;