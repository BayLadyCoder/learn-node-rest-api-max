exports.createErrorWithStatusCode = (errors, statusCode) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.errors = errors;

  errors.forEach((err) => {
    error.message = !error.message
      ? err.msg
      : (error.message += `\n${err.msg}`);
  });

  return error;
};
