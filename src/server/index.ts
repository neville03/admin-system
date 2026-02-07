import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import routes
import dashboardRoutes from "./routes/dashboard";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import verificationRoutes from "./routes/verifications";
import settingsRoutes from "./routes/settings";
import supportRoutes from "./routes/support";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/support", supportRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
