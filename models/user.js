const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    isOnline: { type: Boolean, default: false },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  },
  { timestamps: true } // auto generate createdAt and updatedAt
);

module.exports = mongoose.model('User', userSchema);
