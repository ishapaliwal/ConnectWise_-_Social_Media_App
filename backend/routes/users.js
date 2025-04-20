const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const userController = require("../controllers/userController");
const upload = require("../middleware/upload");

router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/profile/image", authenticate, upload.single("avatar"), userController.uploadProfileImage);

module.exports = router;