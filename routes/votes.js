const express = require('express');
const { body } = require('express-validator');

const votesController = require('../controllers/votes');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/votes', isAuth, votesController.getUserVotes);

router.put(
  '/votes',
  isAuth,
  [
    body('isUpVote', 'isUpVote is required.').notEmpty(),
    body('userId', 'userId is required.').notEmpty(),
    body('postId', 'postId is required.').notEmpty(),
  ],
  votesController.updateOrCreateVote
);

module.exports = router;
