const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const authenticate = require("../middleware/auth");

router.get("/me", authenticate, getCurrentUser);
router.post('/register', register);
router.post('/login', login);

module.exports = router;