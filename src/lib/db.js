import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connection Successfully : ${conn.connection.host} `);
  } catch (error) {
    console.log(`Database Connection Problem : ${error}`);
    process.exit(1);
  }
};
