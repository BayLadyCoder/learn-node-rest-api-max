const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const io = require('../socket/io');
const { validationResult } = require('express-validator');

exports.createComment = async (req, res, next) => {
  const { comment, authorId, postId } = req.body;

  try {
    const author = await User.findById(authorId);
    const post = await Post.findById(postId);

    const newComment = new Comment({
      comment,
      postId,
      author: { _id: authorId, username: author.username },
    });
    await newComment.save();

    author.comments.push(newComment);
    await author.save();

    post.comments.push(newComment);
    await post.save();

    io.getIO().emit('comments', { action: 'create', comment: newComment });

    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    const userId = req.userId;

    if (comment.author._id !== userId) {
      return res.status(403).send({
        message: "Only comment's author is allowed to delete this comment",
      });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    io.getIO().emit('comments', { action: 'delete', comment: deletedComment });
    res.status(200).send({
      message: 'Comment deleted successfully',
      comment: deletedComment,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is invalid.');
    error.statusCode = 422;
    error.errors = errors.array();
    return next(error);
  }

  const { commentId } = req.params;
  const newComment = req.body.comment;

  try {
    const comment = await Comment.findById(commentId);
    const userId = req.userId;

    if (comment.author._id !== userId) {
      return res.status(403).send({
        message: "Only comment's author is allowed to update this comment",
      });
    }

    comment.comment = newComment;
    const updatedComment = await comment.save();

    res.status(200).send({
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (err) {
    next(err);
  }
};
