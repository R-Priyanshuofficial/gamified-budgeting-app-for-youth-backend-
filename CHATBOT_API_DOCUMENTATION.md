# AI Chatbot API Documentation

Complete guide for using the FinBuddy AI Chatbot powered by Google Gemini.

---

## 🤖 Overview

FinBuddy is an AI-powered financial advisor and budgeting assistant that helps users with:
- Budgeting strategies and tips
- Expense tracking advice
- Savings goals planning
- Financial literacy education
- Money management guidance

**Powered by:** Google Gemini AI (Free Tier)

---

## 🔐 Authentication

The chatbot endpoints are **public** - no authentication required. Anyone can chat with the bot.

---

## 📚 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Chat with Bot](#1-chat-with-bot)
3. [Get Suggestions](#2-get-suggestions)
4. [Testing Examples](#testing-examples)
5. [Error Scenarios](#error-scenarios)

---

## Setup Instructions

### Step 1: Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"**
4. Click **"Create API Key"** (it's FREE!)
5. Copy the API key

### Step 2: Add to .env File

Add this line to your `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

### Step 3: Restart Server

Stop and restart your Node.js server:

```bash
npm run dev
```

---

## 1. Chat with Bot

### Endpoint: `POST /api/chatbot`

**Description:** Send a message to the AI chatbot and get financial advice.

**Authentication:** Not required (public endpoint)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How can I create a monthly budget?",
  "conversationHistory": []
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | String | ✅ Yes | User's question or message |
| `conversationHistory` | Array | ❌ No | Previous conversation (for context) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Creating a monthly budget is a great step toward financial stability! Here's a simple approach:\n\n1. **Track Your Income**: List all sources of income for the month.\n\n2. **List Your Expenses**: Categorize them into fixed (rent, utilities) and variable (groceries, entertainment).\n\n3. **Use the 50/30/20 Rule**: Allocate 50% to needs, 30% to wants, and 20% to savings.\n\n4. **Monitor and Adjust**: Review your spending weekly and adjust as needed.\n\nWould you like help with any specific category?",
  "conversationId": 1728625234567
}
```

---

### Example Requests

#### Example 1: Simple Question

**Request:**
```json
{
  "message": "What is the 50/30/20 rule?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "The 50/30/20 rule is a simple budgeting framework:\n\n- **50% for Needs**: Essential expenses like rent, utilities, groceries, transportation\n- **30% for Wants**: Non-essential items like dining out, entertainment, hobbies\n- **20% for Savings**: Emergency fund, retirement, debt repayment\n\nFor example, if you earn $3,000/month:\n- Needs: $1,500\n- Wants: $900\n- Savings: $600\n\nThis helps ensure you're covering basics while building financial security!",
  "conversationId": 1728625234567
}
```

---

#### Example 2: With Conversation History

**Request:**
```json
{
  "message": "Can you give me tips for the wants category?",
  "conversationHistory": [
    {
      "user": "What is the 50/30/20 rule?",
      "bot": "The 50/30/20 rule is a simple budgeting framework..."
    }
  ]
}
```

**Response:** AI provides context-aware answer based on previous conversation.

---

## 2. Get Suggestions

### Endpoint: `GET /api/chatbot/suggestions`

**Description:** Get pre-defined suggested questions users can ask.

**Authentication:** Not required

**Example Request:**
```
GET /api/chatbot/suggestions
```

**Success Response (200):**
```json
{
  "success": true,
  "suggestions": [
    "How can I create a monthly budget?",
    "What's the 50/30/20 budgeting rule?",
    "How do I save money on groceries?",
    "What are some tips for reducing expenses?",
    "How much should I save for emergencies?",
    "How can I track my expenses effectively?",
    "What's the best way to pay off debt?",
    "How do I set realistic savings goals?",
    "What are some good saving habits?",
    "How can I stick to my budget?"
  ]
}
```

---

## Testing Examples

### Complete Test Flow

#### Step 1: Get Suggestions

**Request:**
```
GET http://localhost:5000/api/chatbot/suggestions
```

**Result:** See list of suggested questions

---

#### Step 2: Ask First Question

**Request:**
```
POST http://localhost:5000/api/chatbot
Content-Type: application/json

{
  "message": "How can I save money on groceries?"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Great question! Here are effective ways to save on groceries:\n\n1. **Plan Your Meals**: Create a weekly menu and shopping list to avoid impulse buys\n2. **Buy Generic Brands**: Store brands are often 20-30% cheaper with similar quality\n3. **Use Coupons & Deals**: Check apps and weekly flyers for discounts\n4. **Buy in Bulk**: Purchase non-perishables when on sale\n5. **Avoid Shopping Hungry**: You'll buy less unnecessary items\n\nThese strategies can save you 20-40% monthly!",
  "conversationId": 1728625234567
}
```

---

#### Step 3: Follow-up Question (With History)

**Request:**
```json
{
  "message": "What about meal planning? Any specific tips?",
  "conversationHistory": [
    {
      "user": "How can I save money on groceries?",
      "bot": "Great question! Here are effective ways to save on groceries..."
    }
  ]
}
```

**Result:** Bot provides detailed meal planning advice with context from previous question

---

## Sample Conversations

### Conversation 1: Budgeting Basics

**Q:** "I'm new to budgeting. Where do I start?"

**A:** "Welcome to your budgeting journey! Here's a simple starter guide:

1. **Track Your Spending**: For one month, write down every expense to understand your habits
2. **Calculate Your Income**: Note your total monthly take-home pay
3. **Categorize Expenses**: Group into needs (rent, food) and wants (entertainment)
4. **Set Limits**: Decide how much to spend in each category
5. **Use Tools**: Try budgeting apps or spreadsheets

Start simple and adjust as you learn. Would you like help with tracking tools?"

---

### Conversation 2: Emergency Fund

**Q:** "How much should I save for emergencies?"

**A:** "Financial experts recommend saving 3-6 months of essential living expenses. Here's how to calculate:

1. **Add up monthly essentials**: Rent, utilities, food, insurance, minimum debt payments
2. **Multiply by 3-6**: This is your target emergency fund

Example:
- Monthly essentials: $2,000
- 3-6 month fund: $6,000 - $12,000

Start with a mini-goal of $1,000, then build up. Even small monthly contributions add up!"

---

### Conversation 3: Debt Management

**Q:** "What's the best way to pay off debt?"

**A:** "Two popular strategies:

**Debt Snowball Method:**
- Pay minimums on all debts
- Put extra money toward smallest debt first
- Once paid, roll that payment to next smallest
- Builds motivation with quick wins

**Debt Avalanche Method:**
- Pay minimums on all debts
- Put extra toward highest interest rate first
- Saves more money on interest
- Better mathematically

Choose based on your personality - quick wins (snowball) or maximum savings (avalanche)."

---

## Error Scenarios

### Error 1: Missing Message

**Request:**
```json
{
  "conversationHistory": []
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Message is required and must be a non-empty string"
}
```

---

### Error 2: Empty Message

**Request:**
```json
{
  "message": "   "
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Message is required and must be a non-empty string"
}
```

---

### Error 3: Missing API Key

**Response (500):**
```json
{
  "success": false,
  "message": "Chatbot is not configured. Please add GEMINI_API_KEY to .env file"
}
```

**Fix:** Add `GEMINI_API_KEY=your_key` to `.env` file

---

### Error 4: Invalid API Key

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid Gemini API key. Please check your configuration."
}
```

**Fix:** Get a new API key from Google AI Studio

---

### Error 5: Rate Limit Exceeded

**Response (429):**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again in a moment."
}
```

**Fix:** Wait a few seconds before trying again

---

## Features

### ✅ What the Bot Can Do

- Answer budgeting questions
- Explain financial concepts
- Provide saving strategies
- Offer debt management advice
- Share expense reduction tips
- Explain investment basics
- Help set financial goals
- Give personalized financial advice

---

### ❌ What the Bot Won't Do

- Provide specific stock recommendations
- Guarantee investment returns
- Replace certified financial advisors
- Answer non-finance questions
- Store personal financial data
- Make financial decisions for you

---

## Conversation History

To maintain context across multiple questions, send previous conversation:

**Request:**
```json
{
  "message": "Current question here",
  "conversationHistory": [
    {
      "user": "First question",
      "bot": "First answer"
    },
    {
      "user": "Second question",
      "bot": "Second answer"
    }
  ]
}
```

**Note:** System keeps last 5 messages to stay within token limits.

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "AI response here",
  "conversationId": 1728625234567
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Postman Collection

### Request 1: Get Suggestions

**Method:** GET  
**URL:** `http://localhost:5000/api/chatbot/suggestions`

---

### Request 2: Chat with Bot

**Method:** POST  
**URL:** `http://localhost:5000/api/chatbot`  
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "message": "How can I create a budget?"
}
```

---

## Integration Tips

### Frontend Example (JavaScript)

```javascript
async function askBot(message, history = []) {
  const response = await fetch('http://localhost:5000/api/chatbot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      conversationHistory: history
    })
  });

  const data = await response.json();
  
  if (data.success) {
    return data.message;
  } else {
    throw new Error(data.message);
  }
}

// Usage
const answer = await askBot("How do I save money?");
console.log(answer);
```

---

## Base URL

All endpoints use the base URL:
```
http://localhost:5000
```

Or your deployed URL:
```
https://your-domain.com
```

---

## Pricing

**Google Gemini API (Free Tier):**
- 60 requests per minute
- 100,000 requests per day
- Completely FREE!

---

## Related Endpoints

- **User Signup:** `POST /api/user/auth/signup`
- **Create Budget:** `POST /api/user/budget`
- **Add Expense:** `POST /api/user/expense`
- **Get Leaderboard:** `GET /api/user/leaderboard`

---

**Last Updated:** October 11, 2025
