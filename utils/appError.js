const sendErrorDev = (err) => {
  console.log(err.code, err.name, err.message.includes("E11000"), err);
  return {
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  };
};

const sendErrorProd = (err) => {
  let message;

  if (
    err.code === 11000 ||
    err.name === "MongoServerError" ||
    err.name === "CastError" ||
    err.name === "ValidationError"
  ) {
    err.isOperational = true;
    err.statusCode = 400;
  }

  if (err.code === 11000 && err.name === "MongoServerError") {
    const value = err.message.match(/(?<=")[^"]*(?=")/);
    message = `Duplicate field value ${value}, please use another value`;
  }

  // not internet connection

  if (
    err.message.includes("Network Error") ||
    err.message.includes("timeout") ||
    err.name === "MongoNetworkError"
  ) {
    message = "Please check your internet connection";
  }

  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Invalid input data. ${errors.join(". ")}`;
  }

  if (err.isOperational) {
    return {
      status: err.status,
      message: message || err.message,
    };
  }

  console.error("ERROR 💥", err.message.includes("E11000"), err);

  return {
    status: "error",
    message: err.message,
  };
};

export default function handleAppError(err) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err);
  } else if (process.env.NODE_ENV === "production") {
    return sendErrorProd(err);
  }
}
