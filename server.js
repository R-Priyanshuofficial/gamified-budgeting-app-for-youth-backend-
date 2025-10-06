import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import levelConfigRoutes from "./routes/levelConfig.routes.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";





dotenv.config();

const app = express();
app.use(cors());  // allow all origins (for dev)


// Middleware
app.use(express.json());

//Routes
app.use("/api/user/auth", authRoutes);
    //admin
    app.use("/api/admin/settings", settingsRoutes);
    app.use("/api/admin/levels", levelConfigRoutes);
    app.use("/api/admin/users", userRoutes);
    app.use("/api/admin", adminRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Base route
app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
