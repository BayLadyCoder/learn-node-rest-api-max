const express = require('express');

const postsRoutes = require('./routes/posts');

const app = express();
const PORT = 8080;

// app.use(express.urlencoded()); // x-www-form-urlencoded <form></form>
app.use(express.json()); // application/json

app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Origin', 'https://cdpn.io');
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow requesting code from any origin to access the resource
  res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', postsRoutes);

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
