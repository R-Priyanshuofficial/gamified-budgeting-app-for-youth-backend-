// controllers/user.controller.js
import User from "../models/User.js";
import addXpToUser from "../services/addXp.service.js";

/**
 * POST /api/admin/users/:userId/add-xp
 * Body: { xpAmount: Number }
 * Adds XP to a user and handles auto level-up
 */
export const addXp = async (req, res) => {
  try {
    const { userId } = req.params;
    const { xpAmount } = req.body;

    if (!xpAmount || !Number.isFinite(xpAmount) || xpAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "xpAmount must be a positive number"
      });
    }

    const result = await addXpToUser(userId, xpAmount);

    return res.status(200).json({
      success: true,
      message: result.levelsGained > 0 
        ? `XP added! User leveled up ${result.levelsGained} time(s)!` 
        : "XP added successfully",
      ...result
    });
  } catch (err) {
    console.error("addXp error:", err);
    
    if (err.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add XP",
      error: err.message
    });
  }
};

/**
 * GET /api/admin/users
 * List all users with their XP and level info
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ level: -1, xp: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error("listUsers error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message
    });
  }
};

/**
 * GET /api/admin/users/:userId
 * Get a single user's details
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err.message
    });
  }
};
