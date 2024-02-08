const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post(
  '/auth/sign-up',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email.')
      .custom((email, { req }) => {
        return User.findOne({ email }).then((user) => {
          if (user) {
            throw 'Email address already exists.';
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Password must be between 2-30 characters.'),
  ],
  authController.signUp
);

router.post(
  '/auth/login',
  [
    body('email').isEmail().withMessage('Invalid email.').normalizeEmail(),
    body('password').trim().isLength({ min: 2, max: 30 }),
  ],
  authController.login
);

module.exports = router;
