import { Router } from "express";
import { db, schema } from "../../lib/db";
import { eq, desc, count, or, and } from "drizzle-orm";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// ===================== GENERAL SETTINGS =====================

// Get general settings
router.get("/general", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [settings] = await db.select().from(schema.adminSettings).limit(1);
    res.json(settings || {});
  } catch (error) {
    console.error("Error fetching general settings:", error);
    res.status(500).json({ error: "Failed to fetch general settings" });
  }
});

// Update general settings
router.put("/general", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { siteName, siteDescription, logoUrl, faviconUrl, contactEmail, timezone, maintenanceMode } = req.body;

    // Check if settings exist
    const [existing] = await db.select().from(schema.adminSettings).limit(1);

    if (existing) {
      const [updated] = await db.update(schema.adminSettings)
        .set({
          siteName,
          siteDescription,
          logoUrl,
          faviconUrl,
          contactEmail,
          timezone,
          maintenanceMode,
          updatedAt: new Date(),
        })
        .where(eq(schema.adminSettings.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(schema.adminSettings)
        .values({
          siteName,
          siteDescription,
          logoUrl,
          faviconUrl,
          contactEmail,
          timezone,
          maintenanceMode,
        })
        .returning();
      res.json(created);
    }
  } catch (error) {
    console.error("Error updating general settings:", error);
    res.status(500).json({ error: "Failed to update general settings" });
  }
});

// ===================== TEAM & ACCESS =====================

// Get all admin users
router.get("/team", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const admins = await db.select({
      id: schema.users.id,
      email: schema.users.email,
      firstName: schema.users.firstName,
      lastName: schema.users.lastName,
      image: schema.users.image,
      accountType: schema.users.accountType,
      isActive: schema.users.isActive,
      createdAt: schema.users.createdAt,
      lastActiveAt: schema.users.lastActiveAt,
    })
    .from(schema.users)
    .where(eq(schema.users.accountType, "ADMIN"))
    .orderBy(desc(schema.users.createdAt));

    res.json(admins);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// Update admin user role/permissions
router.put("/team/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { isActive, role } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const [updated] = await db.update(schema.users)
      .set({
        isActive,
        accountType: role || "ADMIN",
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ error: "Failed to update team member" });
  }
});

// ===================== ROLES & PERMISSIONS =====================

// Get roles configuration
router.get("/roles", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const roles = await db.select().from(schema.roles).orderBy(desc(schema.roles.level));
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

// Create new role
router.post("/roles", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, displayName, description, level, permissions } = req.body;

    const [created] = await db.insert(schema.roles)
      .values({
        name,
        displayName,
        description,
        level,
        permissions,
      })
      .returning();

    res.json(created);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: "Failed to create role" });
  }
});

// Update role
router.put("/roles/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, displayName, description, level, permissions } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid role ID" });
    }

    const [updated] = await db.update(schema.roles)
      .set({
        name,
        displayName,
        description,
        level,
        permissions,
        updatedAt: new Date(),
      })
      .where(eq(schema.roles.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

// Delete role
router.delete("/roles/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid role ID" });
    }

    await db.delete(schema.roles).where(eq(schema.roles.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ error: "Failed to delete role" });
  }
});

// ===================== PAYMENT SETTINGS =====================

// Get payment settings
router.get("/payments", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [settings] = await db.select().from(schema.paymentSettings).limit(1);
    res.json(settings || {});
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    res.status(500).json({ error: "Failed to fetch payment settings" });
  }
});

// Update payment settings
router.put("/payments", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { 
      stripeEnabled, 
      stripePublicKey, 
      stripeSecretKey, 
      currency, 
      platformFeePercentage,
      minPayoutAmount,
      payoutSchedule,
      paymentMethods
    } = req.body;

    const [existing] = await db.select().from(schema.paymentSettings).limit(1);

    if (existing) {
      const [updated] = await db.update(schema.paymentSettings)
        .set({
          stripeEnabled,
          stripePublicKey,
          stripeSecretKey,
          currency,
          platformFeePercentage,
          minPayoutAmount,
          payoutSchedule,
          paymentMethods,
          updatedAt: new Date(),
        })
        .where(eq(schema.paymentSettings.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(schema.paymentSettings)
        .values({
          stripeEnabled,
          stripePublicKey,
          stripeSecretKey,
          currency,
          platformFeePercentage,
          minPayoutAmount,
          payoutSchedule,
          paymentMethods,
        })
        .returning();
      res.json(created);
    }
  } catch (error) {
    console.error("Error updating payment settings:", error);
    res.status(500).json({ error: "Failed to update payment settings" });
  }
});

// ===================== AUDIT LOGS =====================

// Get audit logs
router.get("/audit-logs", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 50;
    const userId = req.query.userId as string;

    let query = db.select({
      id: schema.auditLogs.id,
      userId: schema.auditLogs.userId,
      action: schema.auditLogs.action,
      entityType: schema.auditLogs.entityType,
      entityId: schema.auditLogs.entityId,
      metadata: schema.auditLogs.metadata,
      ipAddress: schema.auditLogs.ipAddress,
      createdAt: schema.auditLogs.createdAt,
      userEmail: schema.users.email,
      userFirstName: schema.users.firstName,
      userLastName: schema.users.lastName,
    })
    .from(schema.auditLogs)
    .leftJoin(schema.users, eq(schema.auditLogs.userId, schema.users.id));

    if (userId) {
      query = query.where(eq(schema.auditLogs.userId, parseInt(userId))) as typeof query;
    }

    const [totalResult] = await db.select({ count: count() }).from(schema.auditLogs);
    const logs = await query.orderBy(desc(schema.auditLogs.createdAt)).limit(limit).offset(page * limit);

    res.json({ logs, total: totalResult.count || 0 });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;
