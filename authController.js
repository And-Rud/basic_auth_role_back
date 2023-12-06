import User from "./models/User.js";
import Role from "./models/Role.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "./config.js";

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, config.secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error on registration", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Користувач з таким імененм вже існує" });
      }
      //якщо треба створити адміна то міняжмо на ADMIN
      const userRole = await Role.findOne({ value: "USER" });
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "User registrated" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `User ${username} not found...` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Password not correctly` });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getUsers(req, res) {
    try {
      //створюємо в БД в колекції Role дві ролі ADMIN USER, потім цей код видалили
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new AuthController();
