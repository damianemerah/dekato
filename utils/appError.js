import { NextResponse } from "next/server";

const sendErrorDev = (err, req) => {
  if (req.nextUrl.pathname.startsWith("/api")) {
    console.error(
      "ERROR:: 💥",
      NextResponse.json(
        {
          error: err,
          status: err.status,
          message: err.message,
          stack: err.stack,
        },
        { status: err.statusCode }
      )
    );
    return NextResponse.json(
      {
        error: err,
        status: err.status,
        message: err.message,
        stack: err.stack,
      },
      { status: err.statusCode }
    );
  } else {
    return NextResponse.json(
      {
        error: err,
        status: "error",
        message: "Something went wrong",
      },
      { status: 400 }
    );
  }
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
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

  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Invalid input data. ${errors.join(". ")}`;
  }

  if (err.isOperational) {
    console.log("🔥🔥🔥🌐", err.isOperational);
    return NextResponse.json(
      {
        status: err.status,
        message: message || err.message,
      },
      { status: err.statusCode }
    );
  }
  // Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return NextResponse.json(
    {
      status: "error",
      message: "Something went wrong" + err.message,
    },
    { status: 500 }
  );
};

module.exports = (err, req) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, req);
  } else if (process.env.NODE_ENV === "production") {
    return sendErrorProd(err);
  }
};
