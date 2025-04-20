const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authenticate = require("../middleware/auth");

router.use(authenticate);
router.get("/", notificationController.getNotifications);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.delete("/clear", notificationController.clearNotifications);

module.exports = router;