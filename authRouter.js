import Router from "express";
import authController from "./authController.js";
import { check } from "express-validator";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";

const router = new Router();

router.post(
  "/registration",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "Password can be 4 - 10 symbols").isLength({
      min: 4,
      max: 10,
    }),
  ],
  authController.registration
);
router.post("/login", authController.login);
//якщо вказуєм адмін то роль адмін лише побачить всіх користувачів
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  authController.getUsers
);

export default router;
