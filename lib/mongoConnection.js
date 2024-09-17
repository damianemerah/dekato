// import mongoose from "mongoose";

// const connection = {};

// async function dbConnect() {
//   try {
//     if (connection.isConnected) {
//       console.log("Using existing connection🌐📁");
//       return;
//     }
//     const db = await mongoose.connect(process.env.MONGODB_URI);

//     //run index setup here

//     console.log("Connected to DB");

//     connection.isConnected = db.connections[0].readyState;
//   } catch (error) {
//     console.log("🔗🔗🔗", error);
//   }
// }
// export default dbConnect;

// lib/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

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
