import jwt from "jsonwebtoken";
import config from "../config.js";

export default function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "User not autorizated" });
    }
    const decodedData = jwt.verify(token, config.secret);
    res.user = decodedData;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "User not autarizated" });
  }
}
