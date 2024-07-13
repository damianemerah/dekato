import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  try {
    if (connection.isConnected) {
      return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB 🚀🚀🚀");

    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("🔗🔗🔗", error);
  }
}
export default dbConnect;
