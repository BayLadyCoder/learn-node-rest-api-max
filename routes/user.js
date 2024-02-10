const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/users/:userId/posts', userController.getUserPosts);
router.delete('/users/:userId', isAuth, userController.deleteUser);

module.exports = router;
