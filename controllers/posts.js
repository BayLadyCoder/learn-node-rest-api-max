const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');
const io = require('../socket/io');

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

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is invalid.');
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const { title, content } = req.body;

  try {
    const post = new Post({
      title,
      content,
      imageUrl: req.file?.path,
      author: { _id: req.userId, username: req.username },
    });
    await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    io.getIO().emit('posts', { action: 'create', post });

    res.status(201).json({
      message: 'Post created successfully!',
      post,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postId);
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

    const updatedPost = await post.save();
    io.getIO().emit('posts', { action: 'update', post: updatedPost });
    res.status(200).json({ post: updatedPost });
  } catch (err) {
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
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

    const deletedPost = await Post.findByIdAndDelete(postId);
    io.getIO().emit('posts', { action: 'delete', postId: deletedPost._id });

    res.status(200).json({
      message: 'Post is removed successfully.',
      postId: deletedPost._id,
    });
  } catch (err) {
    next(err);
  }
};
