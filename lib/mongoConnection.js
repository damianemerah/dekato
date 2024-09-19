import mongoose from "mongoose";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // Return the cached connection if it exists
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Optional: Disable mongoose buffering during connection
    };

    // Save the connection promise to the cache
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise; // Resolve the cached promise
  return cached.conn;
}

export default dbConnect;
