import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./authRouter.js";

dotenv.config();

const PORT = process.env.PORT || 5040;

const app = express();

app.use(express.json());
app.use("/auth", router);

const start = async () => {
  try {
    await mongoose.connect(`${process.env.URL}`);
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
