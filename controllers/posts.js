const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort newest to oldest
      res.status(200).json({
        posts,
      });
    })
    .catch((err) => next(err));
};

exports.getPost = (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        post,
      });
    })
    .catch((err) => next(err));
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is invalid.');
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl: req.file?.path,
    author: { _id: req.userId, username: req.username },
  });

  post
    .save()
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.push(post);
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: 'Post created successfully!',
        post,
      });
    })
    .catch((err) => next(err));
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is invalid.');
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const { postId } = req.params;
  const { title, content, image } = req.body;
  let imageUrl = image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      if (post.author._id !== req.userId) {
        const error = new Error(
          "Only post's author is allowed to update this post."
        );
        error.statusCode = 403;
        throw error;
      }

      if (!!post.imageUrl && imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((err) => next(err));
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      if (post.author._id !== req.userId) {
        const error = new Error(
          "Only post's author is allowed to delete this post."
        );
        error.statusCode = 403;
        throw error;
      }

      if (post.imageUrl) {
        clearImage(post.imageUrl);
      }

      return Post.findByIdAndDelete(postId);
    })
    .then((post) => {
      res
        .status(200)
        .json({ message: 'Post is removed successfully.', postId: post._id });
    })
    .catch((err) => next(err));
};
