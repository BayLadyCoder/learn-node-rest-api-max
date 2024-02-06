const jwt = require('jsonwebtoken');

const throwStatusCode401 = require('../helpers/throwStatusCode401');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throwStatusCode401();
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw err;
  }

  if (!decodedToken) {
    throwStatusCode401();
  }

  req.userId = decodedToken.userId;
  req.username = decodedToken.username;
  next();
};
