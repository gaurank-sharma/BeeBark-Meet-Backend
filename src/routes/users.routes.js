import { Router } from "express";
import {
  addToHistory,
  getUserHistory,
  login,
  register,
  getAllUsers, 
  scheduleMeeting
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);
router.route("/get_all_users").get(getAllUsers); // New Route
router.route("/schedule_meeting").post(scheduleMeeting); // New

export default router;

import dotenv from "dotenv";
dotenv.config();
