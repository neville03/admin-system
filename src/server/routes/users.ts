import { Router } from "express";
import { db, schema } from "../../lib/db";
import { desc, eq, sql, count, like, or } from "drizzle-orm";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all users with pagination and filters - requires authentication
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const search = req.query.search as string;

    // Build where conditions
    const conditions = [];
    if (role && role !== "all") {
      conditions.push(eq(schema.users.accountType, role.toUpperCase() as "VENDOR" | "CUSTOMER" | "PLANNER" | "ADMIN"));
    }
    if (search) {
      conditions.push(
        or(
          like(schema.users.email, `%${search}%`),
          like(schema.users.firstName, `%${search}%`),
          like(schema.users.lastName, `%${search}%`)
        )
      );
    }

    // Get total count
    const [totalResult] = await db.select({ count: count() }).from(schema.users);

    // Build query
    let query = db.select({
      id: schema.users.id,
      email: schema.users.email,
      firstName: schema.users.firstName,
      lastName: schema.users.lastName,
      location: schema.users.location,
      accountType: schema.users.accountType,
      isActive: schema.users.isActive,
      createdAt: schema.users.createdAt,
    }).from(schema.users);

    if (conditions.length > 0) {
      query = query.where(or(...conditions)) as typeof query;
    }

    const users = await query.orderBy(desc(schema.users.createdAt)).limit(limit).offset(page * limit);

    res.json({ users, total: totalResult.count || 0 });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID - requires authentication
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const [user] = await db.select({
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
    .where(eq(schema.users.id, id));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If vendor, get vendor profile
    if (user.accountType === "VENDOR") {
      const [vendorProfile] = await db.select({
        id: schema.vendorProfiles.id,
        businessName: schema.vendorProfiles.businessName,
        description: schema.vendorProfiles.description,
        city: schema.vendorProfiles.city,
        rating: schema.vendorProfiles.rating,
        reviewCount: schema.vendorProfiles.reviewCount,
        verificationStatus: schema.vendorProfiles.verificationStatus,
        isVerified: schema.vendorProfiles.isVerified,
        subscriptionStatus: schema.vendorProfiles.subscriptionStatus,
        createdAt: schema.vendorProfiles.createdAt,
      })
      .from(schema.vendorProfiles)
      .where(eq(schema.vendorProfiles.userId, id));

      return res.json({ ...user, vendorProfile });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
