const uniqueWords = require('../uniqueWords');
const User = require('../models/user');

const generateRandomIndex = (length = 1) => {
  return Math.floor(Math.random() * length);
};

const generateRandomUsername = () => {
  const randomNumber = Math.floor(Math.random().toFixed(5) * 100000);
  const name1 = uniqueWords[generateRandomIndex(uniqueWords.length)];
  const name2 = uniqueWords[generateRandomIndex(uniqueWords.length)];
  const username = `${name1}-${name2}${randomNumber}`;
  return username;
};

exports.generateNewUsername = () => {
  const username = generateRandomUsername();
  return User.find({ username }).then((user) => {
    // if this username exists in the database, generate a new random username
    if (user.length > 0) {
      return generateNewUsername();
    }
    return username;
  });
};
