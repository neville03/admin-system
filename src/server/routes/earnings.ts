import { Router } from "express";
import { db, schema } from "../../lib/db";
import { desc, eq, sql, count, gte, and, like, or } from "drizzle-orm";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// Get earnings stats
router.get("/stats", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Overall earnings (all time paid invoices)
    const [overallEarningsResult] = await db.select({
      total: sql<number>`COALESCE(SUM(${schema.invoices.amount}), 0)`
    }).from(schema.invoices).where(eq(schema.invoices.status, "paid"));
    
    // This month's earnings
    const [monthlyEarningsResult] = await db.select({
      total: sql<number>`COALESCE(SUM(${schema.invoices.amount}), 0)`
    }).from(schema.invoices)
      .where(and(eq(schema.invoices.status, "paid"), gte(schema.invoices.paidAt, startOfMonth)));
    
    // Get total vendors count
    const [totalVendorsResult] = await db.select({ count: count() })
      .from(schema.vendorProfiles);

    res.json({
      overallEarnings: Number(overallEarningsResult.total || 0),
      monthlyEarnings: Number(monthlyEarningsResult.total || 0),
      totalVendors: totalVendorsResult.count || 0,
    });
  } catch (error) {
    console.error("Error fetching earnings stats:", error);
    res.status(500).json({ error: "Failed to fetch earnings stats" });
  }
});

// Get earnings chart data
router.get("/chart", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    
    const chartData = await db.select({
      month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${schema.invoices.paidAt}), 'MON YYYY')`,
      revenue: sql<number>`SUM(${schema.invoices.amount})`,
    })
    .from(schema.invoices)
    .where(eq(schema.invoices.status, "paid"))
    .groupBy(sql`DATE_TRUNC('month', ${schema.invoices.paidAt})`)
    .orderBy(sql`DATE_TRUNC('month', ${schema.invoices.paidAt}) DESC`)
    .limit(months);
    
    // Reverse to get chronological order
    res.json(chartData.reverse());
  } catch (error) {
    console.error("Error fetching earnings chart:", error);
    res.status(500).json({ error: "Failed to fetch earnings chart data" });
  }
});

// Get vendor earnings
router.get("/vendors", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    
    // Get total vendors count
    const [totalResult] = await db.select({ count: count() }).from(schema.vendorProfiles);
    
    // Build vendor query with optional search
    let vendorsQuery = db.select({
      id: schema.vendorProfiles.id,
      businessName: schema.vendorProfiles.businessName,
      userFirstName: schema.users.firstName,
      userLastName: schema.users.lastName,
      totalEarnings: sql<number>`COALESCE(SUM(${schema.invoices.amount}), 0)`,
      subscriptionTier: schema.vendorProfiles.subscriptionStatus,
    })
    .from(schema.vendorProfiles)
    .innerJoin(schema.users, eq(schema.vendorProfiles.userId, schema.users.id))
    .leftJoin(schema.bookings, eq(schema.vendorProfiles.id, schema.bookings.vendorId))
    .leftJoin(schema.invoices, and(eq(schema.bookings.id, schema.invoices.bookingId), eq(schema.invoices.status, "paid")))
    .groupBy(schema.vendorProfiles.id, schema.users.firstName, schema.users.lastName, schema.vendorProfiles.businessName, schema.vendorProfiles.subscriptionStatus);
    
    // Apply search filter if provided
    if (search) {
      vendorsQuery = vendorsQuery.where(
        or(
          like(schema.vendorProfiles.businessName, `%${search}%`),
          like(schema.users.firstName, `%${search}%`),
          like(schema.users.lastName, `%${search}%`)
        )
      ) as typeof vendorsQuery;
    }
    
    const vendors = await vendorsQuery
      .orderBy(desc(sql`COALESCE(SUM(${schema.invoices.amount}), 0)`))
      .limit(limit)
      .offset(page * limit);
    
    res.json({ 
      vendors: vendors.map(v => ({
        id: v.id,
        name: v.businessName || `${v.userFirstName} ${v.userLastName}`,
        initials: (v.businessName ? v.businessName.substring(0, 2) : `${v.userFirstName?.charAt(0)}${v.userLastName?.charAt(0)}`).toUpperCase(),
        earnings: Number(v.totalEarnings || 0),
        tier: v.subscriptionTier || "BASIC",
        tierColor: v.subscriptionTier === "PREMIUM" ? "text-purple-500" : v.subscriptionTier === "ENTERPRISE" ? "text-yellow-500" : "text-muted-foreground",
      })), 
      total: totalResult.count || 0 
    });
  } catch (error) {
    console.error("Error fetching vendor earnings:", error);
    res.status(500).json({ error: "Failed to fetch vendor earnings" });
  }
});

export default router;
