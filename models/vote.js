const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  isUpVote: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Vote', voteSchema);
