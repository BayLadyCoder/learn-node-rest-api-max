const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    author: {
      _id: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true } // auto generate createdAt and updatedAt
);

module.exports = mongoose.model('Comment', commentSchema);
