import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;



const globalWithMongoose = globalThis 

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  globalWithMongoose.mongoose = cached;
}

async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((conn) => {
      console.log("Connected to MongoDB");
      return conn;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;