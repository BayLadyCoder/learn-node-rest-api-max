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
  const { title, content } = req.body;

  // TODO: create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      id: new Date().toISOString(),
      title,
      content,
      author: 'Bay C',
      createdAt: new Date().toISOString(),
    },
  });
};
