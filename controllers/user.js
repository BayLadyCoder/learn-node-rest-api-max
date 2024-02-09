const User = require('../models/user');

exports.getUserPosts = (req, res, next) => {
  const { userId } = req.params;

  User.findById({ _id: userId })
    .populate('posts')
    .then((user) => {
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }

      const posts = user.posts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ); // sort newest to oldest

      res.status(200).json({ posts, userId: user._id });
    })
    .catch((err) => next(err));
};
