// import mongoose from "mongoose";

// const connection = { isConnected: false };

// async function dbConnect() {
//   if (connection.isConnected) {
//     return;
//   }

//   try {
//     if (mongoose.connections.length > 0) {
//       const currentConnection = mongoose.connections[0];
//       if (currentConnection.readyState === 1) {
//         connection.isConnected = true;
//         return;
//       }
//       await mongoose.disconnect();
//     }

//     const db = await mongoose.connect(process.env.MONGODB_URI);

//     connection.isConnected = db.connections[0].readyState === 1;

//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw error;
//   }
// }

// export default dbConnect;

import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection🌐📁");
      return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URI);

    //run index setup here

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to DB");
  } catch (error) {
    console.log("🔗🔗🔗", error);
  }
}
export default dbConnect;
