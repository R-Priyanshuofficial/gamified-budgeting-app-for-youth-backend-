import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, "User name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required "],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    // ---------- Gamification fields ----------
    level: {
      type: Number,
      default: 1,
      min: [1, "Level must be at least 1"],
    },
    xp: {
      type: Number,
      default: 0,
      min: [0, "XP cannot be negative"],
    },
    xpForNextLevel: {
      type: Number,
      default: 100, // fallback default; will be overridden at signup from admin setting
      min: [1, "xpForNextLevel must be at least 1"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
