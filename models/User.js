import { Schema, model } from "mongoose";

const User = new Schema({
  username: { type: String, unique: true, requires: true },
  password: { type: String, requires: true },
  roles: [{ type: String, ref: "Role" }],
});

export default model("User", User);
