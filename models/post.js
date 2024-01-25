const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true } // auto generate createdAt and updatedAt
);

module.exports = mongoose.model('Post', postSchema);
