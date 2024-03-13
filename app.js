require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const commentsRoutes = require('./routes/comments');
const votesRoutes = require('./routes/votes');

const io = require('./socket/io');

const app = express();
const PORT = 8080;
const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jgp' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded <form></form>
app.use(express.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: fileStorage, fileFilter }).single('image')); //

app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Origin', 'https://cdpn.io');
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow requesting code from any origin to access the resource
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', postsRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', commentsRoutes);
app.use('/api', votesRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message, errors } = error;

  res.status(statusCode || 500).json({ message, errors });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('database connected');

    const httpServer = app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });

    io.init(httpServer);
  })
  .catch((err) => {
    console.log('Mongoose connection error: ', err);
    // having issue connecting with the database
    throw new Error(err);
  });
