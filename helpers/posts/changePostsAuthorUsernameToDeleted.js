const Post = require('../../models/post');

module.exports = (posts) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const post of posts) {
        post.author = { _id: undefined, username: '[deleted]' };
        await post.save();
      }
      resolve("Posts' authors became [deleted] successfully!");
    } catch (err) {
      reject(err);
    }
  });
};
