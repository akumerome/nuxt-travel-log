import mongoose from "mongoose";
import env from "~/lib/env";

export default defineNitroPlugin(async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(env.MONGO_URI, {
        dbName: env.MONGO_DATABASE,
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }
});
