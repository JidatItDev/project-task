const handleError = (
  res,
  error,
  statusCode = 500,
  message = "Internal Server Error"
) => {
  let errorMessage = message;

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorMessage,
  });
};

module.exports = handleError;
