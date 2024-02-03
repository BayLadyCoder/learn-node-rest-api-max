const express = require('express');
const { body } = require('express-validator');

const postsController = require('../controllers/posts');

const router = express.Router();

router.get('/posts', postsController.getPosts);
router.get('/posts/:postId', postsController.getPost);

router.post(
  '/posts',
  [
    body('title', 'Title must be between 1-100 characters.')
      .trim()
      .isLength({ min: 1, max: 100 }),
    body('content', 'Content must be between 1-400 characters.')
      .trim()
      .isLength({ min: 1, max: 400 }),
  ],
  postsController.createPost
);

router.put(
  '/posts/:postId',
  [
    body('title', 'Title must be between 1-100 characters.')
      .trim()
      .isLength({ min: 1, max: 100 }),
    body('content', 'Content must be between 1-400 characters.')
      .trim()
      .isLength({ min: 1, max: 400 }),
  ],
  postsController.updatePost
);

router.delete('/posts/:postId/', postsController.deletePost);

module.exports = router;
