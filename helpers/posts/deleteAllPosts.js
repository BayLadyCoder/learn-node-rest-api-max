module.exports = (posts) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const post of posts) {
        await Post.findByIdAndDelete(new ObjectId(post._id));
      }
      resolve('Posts deleted successfully!');
    } catch (err) {
      reject(err);
    }
  });
};
