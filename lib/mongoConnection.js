import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection🌐📁");
      return;
    }

    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables",
      );
    }

    console.log(mongodbUri, "👇👇👇mongodbUri");

    const db = await mongoose.connect(mongodbUri, {
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    //run index setup here

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to DB");
  } catch (error) {
    console.log("🔗🔗🔗", error);
  }
}

export default dbConnect;
