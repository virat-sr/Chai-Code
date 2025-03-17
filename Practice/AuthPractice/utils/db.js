import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

//export a funciton that coinnects to DB.

const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to mongo");
    })
    .catch(() => {
      console.log("Error in connecting");
    });
};

export default db
/**
 * default ,export ,inline export
 */