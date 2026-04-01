import express from "express";
import * as authController from "../controllers/authController.js";
// import bycrypt from "bcrypt";

const router = express.Router();

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//
//   const user = await findUserByName(username);
//
//   if (!user) return res.status(401).json({ error: "Invalid credentials" });
//
//     const validPassword = await bycrypt.compare(password, user.password)
// });

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/get-me", authController.getMe);
router.get("/refresh-token", authController.refreshToken);
router.delete("/logout", authController.logout);
router.delete("/logout-all", authController.logoutAll);
// router.get("/", authController.registerUser);

export default router;
