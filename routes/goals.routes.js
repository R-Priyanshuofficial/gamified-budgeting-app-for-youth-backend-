// routes/goals.routes.js
import express from "express";
import { createGoal, getGoals, getGoalById } from "../controllers/goals.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // adapt path if needed

const router = express.Router();

// Create goal
router.post("/", authMiddleware, createGoal);

// List goals with filters/pagination
router.get("/", authMiddleware, getGoals);

// Get single goal by id
router.get("/:id", authMiddleware, getGoalById);

export default router;
