// routes/chatbot.routes.js
import express from "express";
import { chatWithBot, getSuggestions, listModels } from "../controllers/chatbot.controller.js";

const router = express.Router();

// Chat with AI bot (no auth required - public endpoint)
router.post("/", chatWithBot);

// Get suggested questions
router.get("/suggestions", getSuggestions);

// Test which models work (for debugging)
router.get("/test-models", listModels);

export default router;
