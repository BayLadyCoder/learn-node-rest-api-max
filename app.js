const express = require('express');

const postsRoutes = require('./routes/posts');

const app = express();
const PORT = 8080;

// app.use(express.urlencoded()); // x-www-form-urlencoded <form></form>
app.use(express.json()); // application/json

app.use('/api', postsRoutes);

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
