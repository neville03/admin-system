import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db, schema } from "../../lib/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    accountType: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      accountType: string;
    };

    // Verify user still exists and is active
    const [user] = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        accountType: schema.users.accountType,
        isActive: schema.users.isActive,
      })
      .from(schema.users)
      .where(eq(schema.users.id, decoded.id));

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      accountType: user.accountType,
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.accountType !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const generateToken = (payload: {
  id: number;
  email: string;
  accountType: string;
}): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      accountType: string;
    };
  } catch {
    return null;
  }
};
