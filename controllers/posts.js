const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        id: 1,
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        author: {
          name: 'Bay',
        },
        createdAt: new Date(),
      },
      {
        id: 2,
        title: 'Second Post',
        content: 'This is the second post!',
        imageUrl: 'images/duck.jpg',
        author: {
          name: 'Oreo',
        },
        createdAt: new Date(),
      },
      {
        id: 3,
        title: 'Third Post',
        content: 'This is the third post!',
        imageUrl: 'images/duck.jpg',
        author: {
          name: 'Taylor',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
      message: 'Validation failed, entered data is invalid.',
    });
  }

  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl: 'images/duck.jpg',
    author: { name: 'Bay' },
  });

  post
    .save()
    .then((result) => {
      const {
        _id: id,
        title,
        content,
        imageUrl,
        author,
        createdAt,
        updatedAt,
      } = result;

      res.status(201).json({
        message: 'Post created successfully!',
        post: {
          id,
          title,
          content,
          imageUrl,
          author,
          createdAt,
          updatedAt,
        },
      });
    })
    .catch((err) => console.log(err));
};
