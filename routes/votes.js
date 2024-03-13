const express = require('express');
const { body } = require('express-validator');

const votesController = require('../controllers/votes');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/votes', isAuth, votesController.getUserVotes);

module.exports = router;
