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
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    votingScores: { type: Number, required: true, default: 0 },
  },
  { timestamps: true } // auto generate createdAt and updatedAt
);

module.exports = mongoose.model('Post', postSchema);
