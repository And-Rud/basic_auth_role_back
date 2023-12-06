import jwt from "jsonwebtoken";
import config from "../config.js";

export default function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "User not autorizated" });
      }
      const { roles: userRoles } = jwt.verify(token, config.secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: "You have not acsess" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "User not autarizated" });
    }
  };
}
