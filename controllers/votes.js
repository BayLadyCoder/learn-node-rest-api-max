const User = require('../models/user');

exports.getUserVotes = async (req, res, next) => {
  const user = await User.findById(req.userId).populate('votes');

  res.status(200).send({ votes: user.votes });
};
