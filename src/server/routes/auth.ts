import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, schema } from "../../lib/db";
import { eq } from "drizzle-orm";
import { authenticateToken, generateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Login
router.post("/login", async (req: AuthRequest, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const [user] = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        password: schema.users.password,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        accountType: schema.users.accountType,
        isActive: schema.users.isActive,
        image: schema.users.image,
      })
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()));

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated. Please contact support." });
    }

    // For users without password (OAuth users), they need to use OAuth login
    if (!user.password) {
      return res.status(401).json({ error: "Please login with your OAuth provider" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      accountType: user.accountType,
    });

    // Update last active timestamp
    await db
      .update(schema.users)
      .set({ lastActiveAt: new Date() })
      .where(eq(schema.users.id, user.id));

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const [user] = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        phone: schema.users.phone,
        location: schema.users.location,
        image: schema.users.image,
        accountType: schema.users.accountType,
        isActive: schema.users.isActive,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout (client-side token removal, but we can add token blacklisting if needed)
router.post("/logout", authenticateToken, async (req: AuthRequest, res) => {
  // In a production app, you might want to blacklist the token
  // For now, just return success - client will remove the token
  res.json({ message: "Logged out successfully" });
});

// Register new user (for admin to create users)
router.post("/register", async (req: AuthRequest, res) => {
  try {
    const { email, password, firstName, lastName, accountType, phone, location } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Email, password, first name, and last name are required" });
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()));

    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        location: location || null,
        accountType: (accountType as "VENDOR" | "CUSTOMER" | "PLANNER" | "ADMIN") || "CUSTOMER",
        provider: "local",
        isActive: true,
        emailVerified: false,
      })
      .returning();

    // Generate token for auto-login after registration
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      accountType: newUser.accountType,
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        accountType: newUser.accountType,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Change password
router.post("/change-password", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }

    // Get user with password
    const [user] = await db
      .select({ id: schema.users.id, password: schema.users.password })
      .from(schema.users)
      .where(eq(schema.users.id, req.user!.id));

    if (!user || !user.password) {
      return res.status(404).json({ error: "User not found or has no password" });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db
      .update(schema.users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(schema.users.id, req.user!.id));

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
