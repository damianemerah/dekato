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
    console.log("🔗🔗🔗", error, process.env.MONGODB_URI);
    throw new Error("🎈🎈Failed to connect to MongoDB: " + error.message);
  }
}
export default dbConnect;
