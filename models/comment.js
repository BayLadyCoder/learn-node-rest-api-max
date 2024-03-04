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
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true } // auto generate createdAt and updatedAt
);

module.exports = mongoose.model('Comment', commentSchema);
