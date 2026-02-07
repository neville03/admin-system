import { Router } from "express";
import { db, schema } from "../../lib/db";
import { desc, eq, sql, count, and, gte, or } from "drizzle-orm";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// Dashboard stats - requires authentication
router.get("/stats", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsersResult] = await db.select({ count: count() }).from(schema.users);
    const [totalVendorsResult] = await db.select({ count: count() }).from(schema.users).where(eq(schema.users.accountType, "VENDOR"));
    const [totalBookingsResult] = await db.select({ count: count() }).from(schema.bookings);
    const [totalRevenueResult] = await db.select({ total: sql<number>`COALESCE(SUM(${schema.invoices.amount}), 0)` }).from(schema.invoices).where(eq(schema.invoices.status, "paid"));

    const [newUsersResult] = await db.select({ count: count() }).from(schema.users).where(gte(schema.users.createdAt, thirtyDaysAgo));
    const [newVendorsResult] = await db.select({ count: count() }).from(schema.users).where(and(eq(schema.users.accountType, "VENDOR"), gte(schema.users.createdAt, thirtyDaysAgo)));
    const [pendingVerificationsResult] = await db.select({ count: count() }).from(schema.verificationDocuments).where(eq(schema.verificationDocuments.status, "pending"));
    const [openTicketsResult] = await db.select({ count: count() }).from(schema.messageThreads).where(eq(schema.messageThreads.status, "pending"));

    res.json({
      totalUsers: totalUsersResult.count || 0,
      totalVendors: totalVendorsResult.count || 0,
      newUsers: newUsersResult.count || 0,
      newVendors: newVendorsResult.count || 0,
      pendingVerifications: pendingVerificationsResult.count || 0,
      openTickets: openTicketsResult.count || 0,
      totalBookings: totalBookingsResult.count || 0,
      totalRevenue: Number(totalRevenueResult.total || 0),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// User growth data - requires authentication
router.get("/growth", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const growthData = await db.select({
      month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${schema.users.createdAt}), 'MON')`,
      vendors: count(),
      users: count(),
    })
    .from(schema.users)
    .groupBy(sql`DATE_TRUNC('month', ${schema.users.createdAt})`)
    .orderBy(sql`DATE_TRUNC('month', ${schema.users.createdAt})`)
    .limit(12);

    res.json(growthData);
  } catch (error) {
    console.error("Error fetching growth data:", error);
    res.status(500).json({ error: "Failed to fetch growth data" });
  }
});

// Verification stats - requires admin authentication
router.get("/verifications", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [verifiedResult] = await db.select({ count: count() }).from(schema.verificationDocuments).where(eq(schema.verificationDocuments.status, "approved"));
    const [pendingResult] = await db.select({ count: count() }).from(schema.verificationDocuments).where(eq(schema.verificationDocuments.status, "pending"));
    const [rejectedResult] = await db.select({ count: count() }).from(schema.verificationDocuments).where(eq(schema.verificationDocuments.status, "rejected"));

    res.json({
      verified: verifiedResult.count || 0,
      pending: pendingResult.count || 0,
      rejected: rejectedResult.count || 0,
    });
  } catch (error) {
    console.error("Error fetching verification stats:", error);
    res.status(500).json({ error: "Failed to fetch verification stats" });
  }
});

export default router;
