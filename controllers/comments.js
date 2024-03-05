const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

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

    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
};
