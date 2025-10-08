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

/**
 * GET /api/users/dashboard/:userId
 * Get complete user data for dashboard display
 */
export const getUserDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch user with populated completed challenges
    const user = await User.findById(userId)
      .select('-password')
      .populate({
        path: 'completedChallenges.challenge',
        select: 'challengeName challengeDescription xpReward'
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Calculate dashboard statistics
    const totalCompletedChallenges = user.completedChallenges.length;
    const totalXpEarned = user.xp;
    const currentLevel = user.level;
    const xpForNextLevel = user.xpForNextLevel;
    const xpProgress = ((user.xp % xpForNextLevel) / xpForNextLevel * 100).toFixed(2);

    // Prepare dashboard response
    const dashboardData = {
      userInfo: {
        id: user._id,
        email: user.email,
        username: user.username,
        country: user.country,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      gamificationStats: {
        level: currentLevel,
        xp: totalXpEarned,
        xpForNextLevel: xpForNextLevel,
        xpProgress: parseFloat(xpProgress),
        totalCompletedChallenges: totalCompletedChallenges
      },
      completedChallenges: user.completedChallenges.map(cc => ({
        challengeId: cc.challenge?._id,
        challengeName: cc.challenge?.challengeName,
        challengeDescription: cc.challenge?.challengeDescription,
        xpReward: cc.xpReward,
        completedAt: cc.completedAt
      }))
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData
    });
  } catch (err) {
    console.error("getUserDashboardData error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: err.message
    });
  }
};
