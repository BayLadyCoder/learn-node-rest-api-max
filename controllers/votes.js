const User = require('../models/user');
const Vote = require('../models/vote');
const Post = require('../models/post');

exports.getUserVotes = async (req, res, next) => {
  const user = await User.findById(req.userId).populate('votes');

  res.status(200).send({ votes: user.votes });
};

exports.updateOrCreateVote = async (req, res, next) => {
  try {
    const { isUpVote, userId, postId, _id } = req.body;
    let vote;

    const user = await User.findById(userId).populate('votes');
    const post = await Post.findById(postId);

    if (!user || !post) {
      const value = !user ? 'user' : 'post';
      const error = new Error(`Invalid ${value} id`);
      error.statusCode = 404;
      return next(error);
    }

    if (_id) {
      vote = await Vote.findById(_id);

      if (!vote) {
        const error = new Error('Invalid vote id');
        error.statusCode = 404;
        return next(error);
      }

      const previousVoteIsUpVote = vote.isUpVote;
      if (previousVoteIsUpVote === isUpVote) {
        return res.status(200).send({ message: 'Voted successfully', vote });
      }

      vote.isUpVote = isUpVote;

      user.votes = user.votes.map((v) => {
        if (v._id.toString() === vote._id.toString()) {
          return vote;
        }
        return v;
      });

      if (previousVoteIsUpVote && !isUpVote) {
        post.votingScores = post.votingScores - 2;
      } else if (!previousVoteIsUpVote && isUpVote) {
        post.votingScores = post.votingScores + 2;
      }
    } else {
      vote = new Vote({ isUpVote, userId, postId });

      user.votes.push(vote);

      post.votingScores = isUpVote
        ? post.votingScores + 1
        : post.votingScores - 1;
    }

    await vote.save();
    await user.save();
    await post.save();

    res.status(200).send({ message: 'Voted successfully', vote });
  } catch (err) {
    next(err);
  }
};

exports.deleteVote = async (req, res, next) => {
  try {
    const { voteId } = req.params;
    const vote = await Vote.findById(voteId);
    const post = await Post.findById(vote.postId);

    await vote.deleteOne();

    if (vote.isUpVote) {
      post.votingScores = post.votingScores - 1;
    } else {
      post.votingScores = post.votingScores + 1;
    }

    await post.save();

    res.status(200).send({ vote, message: 'Unvoted successfully' });
  } catch (err) {
    next(err);
  }
};
