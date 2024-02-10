const { ObjectId } = require('mongodb');

const User = require('../models/user');
const Post = require('../models/post');
const deleteAllPosts = require('../helpers/posts/deleteAllPosts');

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

exports.deleteUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }

      if (user._id.toString() !== req.userId) {
        const error = new Error('Unauthorized.');
        error.statusCode = 403;
        throw error;
      }

      return User.findByIdAndDelete(req.userId);
    })
    .then((user) => {
      return Post.find({ 'author._id': new ObjectId(user._id) });
    })
    .then((posts) => {
      return deleteAllPosts(posts);
    })
    .then(() => {
      res.status(200).json({ message: 'Account deleted successfully!' });
    })
    .catch((err) => next(err));
};
