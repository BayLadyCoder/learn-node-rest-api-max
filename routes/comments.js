const express = require('express');
const { body } = require('express-validator');

const commentsController = require('../controllers/comments');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post(
  '/comments',
  isAuth,
  [
    body('comment', 'Maximum 500 characters for a comment.')
      .trim()
      .isLength({ min: 1, max: 500 }),
    body('authorId', 'authorId is  required.').notEmpty(),
    body('postId', 'postId is required.').notEmpty(),
  ],
  commentsController.createComment
);

router.put(
  '/comments/:commentId',
  isAuth,
  [
    body('comment', 'Maximum 500 characters for a comment.')
      .trim()
      .isLength({ min: 1, max: 500 }),
    body('authorId', 'authorId is  required.').notEmpty(),
    body('postId', 'postId is required.').notEmpty(),
  ],
  commentsController.updateComment
);
router.delete('/comments/:commentId', isAuth, commentsController.deleteComment);

module.exports = router;
