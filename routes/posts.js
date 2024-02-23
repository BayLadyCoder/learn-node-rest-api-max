const express = require('express');
const { body } = require('express-validator');

const postsController = require('../controllers/posts');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/posts', postsController.getPosts);
router.get('/posts/:postId', postsController.getPost);

router.post(
  '/posts',
  isAuth,
  [
    body('title', 'Title must be between 1-100 characters.')
      .trim()
      .isLength({ min: 1, max: 100 }),
    body('content', "Maximum 5,000 characters for post's content.")
      .trim()
      .isLength({ max: 5000 }),
  ],
  postsController.createPost
);

router.put(
  '/posts/:postId',
  isAuth,
  [
    body('title', 'Title must be between 1-100 characters.')
      .trim()
      .isLength({ min: 1, max: 100 }),
    body('content', "Maximum 5,000 characters for post's content.").isLength({
      max: 5000,
    }),
  ],
  postsController.updatePost
);

router.delete('/posts/:postId/', isAuth, postsController.deletePost);

module.exports = router;
