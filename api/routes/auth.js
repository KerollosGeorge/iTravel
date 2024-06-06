import express from "express";
import {
  login,
  register,
  forget_password,
  reset_password,
  adminLogin,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/adminLogin", adminLogin);

router.post("/forget_password", forget_password);
router.post("/reset_password/:id/:token", reset_password);

export default router;
