import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import SystemSetting from "../models/SystemSetting.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// -------------------- SIGNUP --------------------

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate inputs
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required.",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. ",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already taken.",
      });
    }

    // Hash password
    const hasedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // fetch XP setting
    const xpSetting = await SystemSetting.findOne({
      key: "defaultXpForNextLevel",
    });
    const xpForNextLevel = xpSetting ? Number(xpSetting.value) : 100;

    // Create new user
    const newUser = await User.create({
      email,
      username,
      password: hasedPassword,
      level: 1,
      xp: 0,
      xpForNextLevel,
    });

    // Create token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered sucessfully.",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
      token,
    });
  } catch (err) {
    console.log("Signup Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: err.message,
    });
  }
};

// -------------------- LOGIN --------------------

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Validate inputs
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and password are required.",
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email or username.",
      });
    }

    // Compare password

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }
    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: err.message,
    });
  }
};
