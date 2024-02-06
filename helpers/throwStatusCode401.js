module.exports = () => {
  const error = new Error('Unauthorized');
  error.statusCode = 401;
  throw error;
};
