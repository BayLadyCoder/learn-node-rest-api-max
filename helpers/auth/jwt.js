const jwt = require('jsonwebtoken');

const EXPIRES_IN = '3h';

exports.createJwtToken = (user, email) => {
  return jwt.sign(
    { email, userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: EXPIRES_IN,
    }
  );
};
