const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { generateNewUsername } = require('../helpers/generateNewUsername');

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.errors = errors.array();
    return next(error);
  }

  const { email, password } = req.body;

  try {
    const username = await generateNewUsername();
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { email, userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '5m',
      }
    );
    res
      .status(200)
      .json({ token, userId: user._id.toString(), username: user.username });
  } catch (err) {
    next(err);
  }
};
