// routes/user.routes.js
import express from "express";
import { addXp, listUsers, getUserById } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes for user management
router.get("/", listUsers);                    // List all users
router.get("/:userId", getUserById);           // Get single user
router.post("/:userId/add-xp", addXp);        // Add XP to user (triggers auto level-up)

export default router;
