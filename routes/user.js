const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/user/:userId/posts', userController.getUserPosts);

module.exports = router;
