require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();
const PORT = 8080;

// app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded <form></form>
app.use(express.json()); // application/json

app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Origin', 'https://cdpn.io');
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow requesting code from any origin to access the resource
  res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', postsRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('database connected');

    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Mongoose connection error: ', err);
    // having issue connecting with the database
    throw new Error(err);
  });
