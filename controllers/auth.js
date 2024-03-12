const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateNewUsername } = require('../helpers/generateNewUsername');
const {
  createErrorWithStatusCode,
} = require('../helpers/createErrorWithStatusCode');

const { createDisplayDateInfo } = require('../helpers/dateTime/formatDateTime');
const { createJwtToken } = require('../helpers/auth/jwt');

exports.signUp = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(createErrorWithStatusCode(validationErrors.array(), 422));
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
    const token = createJwtToken(user, email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      userId: user._id,
      username: user.username,
      cakeDay: createDisplayDateInfo(user.createdAt),
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

    const token = createJwtToken(user, email);

    res.status(200).json({
      token,
      _id: user._id.toString(),
      username: user.username,
      cakeDay: createDisplayDateInfo(user.createdAt),
    });
  } catch (err) {
    next(err);
  }
};
