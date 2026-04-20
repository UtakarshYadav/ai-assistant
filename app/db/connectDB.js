// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Mongo URI is Missing");
// }

// let cached = global.mongoose || { conn: null, promise: null };

// global.mongoose = cached;

// async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(MONGODB_URI, {
//         dbName: "your_db_name",
//         bufferCommands: false,
//       })
//       .then((mongoose) => mongoose)
//       .catch((err) => {
//         console.error("MongoDB Connection Error:", err);
//         throw err;
//       });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectDB;


// EITHER DB OR BROWSER
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

global.mongoose = cached;

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "your_db_name",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;