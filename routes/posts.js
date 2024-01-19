const express = require('express');

const postsController = require('../controllers/posts');

const router = express.Router();

router.get('/posts', postsController.getPosts);

module.exports = router;
