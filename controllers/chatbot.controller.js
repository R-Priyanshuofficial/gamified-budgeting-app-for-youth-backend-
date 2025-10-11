// controllers/chatbot.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for finance/budgeting assistant
const SYSTEM_PROMPT = `You are FinBuddy, an expert financial advisor and budgeting assistant. You help users with:

1. Budgeting strategies and tips
2. Expense tracking and categorization
3. Savings goals and planning
4. Financial literacy and education
5. Money management advice
6. Investment basics
7. Debt management strategies

Guidelines:
- Provide clear, practical, and actionable advice
- Be encouraging and supportive
- Use simple language, avoid complex jargon
- Give specific examples when possible
- Focus on budgeting, saving, and smart financial decisions
- If asked about something unrelated to finance, politely redirect to financial topics
- Never provide specific investment recommendations or guarantee returns
- Always remind users to consult certified financial advisors for major decisions

Keep responses concise (2-4 paragraphs) unless user asks for detailed explanation.`;

/**
 * POST /api/chatbot
 * Chat with AI financial assistant
 */
export const chatWithBot = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be a non-empty string",
      });
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return res.status(500).json({
        success: false,
        message: "Chatbot is not configured. Please add GEMINI_API_KEY to .env file",
      });
    }

    // Initialize model - using Gemini 2.5 Flash (stable, fast, FREE)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });

    // Build conversation context
    let prompt = SYSTEM_PROMPT + "\n\n";

    // Add conversation history (last 5 messages to stay within token limit)
    const recentHistory = conversationHistory.slice(-5);
    if (recentHistory.length > 0) {
      prompt += "Conversation History:\n";
      recentHistory.forEach((msg) => {
        prompt += `User: ${msg.user}\n`;
        prompt += `Assistant: ${msg.bot}\n`;
      });
      prompt += "\n";
    }

    // Add current message
    prompt += `User: ${message.trim()}\nAssistant:`;

    console.log("Sending request to Gemini AI...");
    console.log("Using Model: gemini-2.5-flash");
    console.log("Using API Key:", process.env.GEMINI_API_KEY.substring(0, 20) + "...");

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();

    console.log("Received response from Gemini AI");
    console.log("Response preview:", botReply.substring(0, 100));

    return res.json({
      success: true,
      message: botReply,
      conversationId: Date.now(), // Simple conversation tracking
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    console.error("Error details:", err.message);
    console.error("Error stack:", err.stack);

    // Handle specific Gemini API errors
    if (err.message && err.message.includes("API_KEY_INVALID")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Gemini API key. Please check your configuration.",
        error: err.message,
      });
    }

    if (err.message && err.message.includes("RATE_LIMIT")) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please try again in a moment.",
      });
    }

    // Return detailed error for debugging
    return res.status(500).json({
      success: false,
      message: "Failed to get response from chatbot. Please try again later.",
      error: err.message,
    });
  }
};

/**
 * GET /api/chatbot/models
 * List available models using Google's API
 */
export const listModels = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "API key not configured"
      });
    }

    // Call Google's ListModels API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({
        success: false,
        message: "Failed to list models",
        error
      });
    }

    const data = await response.json();
    
    // Filter models that support generateContent
    const availableModels = data.models
      ?.filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      ?.map(m => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description
      })) || [];

    return res.json({
      success: true,
      count: availableModels.length,
      models: availableModels
    });
  } catch (err) {
    console.error("List models error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * GET /api/chatbot/suggestions
 * Get suggested questions for users
 */
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "How can I create a monthly budget?",
      "What's the 50/30/20 budgeting rule?",
      "How do I save money on groceries?",
      "What are some tips for reducing expenses?",
      "How much should I save for emergencies?",
      "How can I track my expenses effectively?",
      "What's the best way to pay off debt?",
      "How do I set realistic savings goals?",
      "What are some good saving habits?",
      "How can I stick to my budget?",
    ];

    return res.json({
      success: true,
      suggestions,
    });
  } catch (err) {
    console.error("Get suggestions error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggestions",
    });
  }
};
