import { db, schema } from "@/lib/db";
import { desc, eq, sql, count, and, gte } from "drizzle-orm";

// Dashboard Stats
export async function getDashboardStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Total counts
  const [totalUsers, totalVendors, totalBookings, totalRevenue] = await Promise.all([
    db.select({ count: count() }).from(schema.users),
    db.select({ count: count() }).from(schema.users).where(eq(schema.users.accountType, "VENDOR")),
    db.select({ count: count() }).from(schema.bookings),
    db.select({ total: sql<number>`COALESCE(SUM(${schema.invoices.amount}), 0)` }).from(schema.invoices).where(eq(schema.invoices.status, "paid")),
  ]);

  // New users in last 30 days
  const newUsers = await db.select({ count: count() })
    .from(schema.users)
    .where(gte(schema.users.createdAt, thirtyDaysAgo));

  // New vendors in last 30 days
  const newVendors = await db.select({ count: count() })
    .from(schema.users)
    .where(and(eq(schema.users.accountType, "VENDOR"), gte(schema.users.createdAt, thirtyDaysAgo)));

  // Pending verifications
  const pendingVerifications = await db.select({ count: count() })
    .from(schema.verificationDocuments)
    .where(eq(schema.verificationDocuments.status, "pending"));

  // Open tickets (message threads with pending status)
  const openTickets = await db.select({ count: count() })
    .from(schema.messageThreads)
    .where(eq(schema.messageThreads.status, "pending"));

  return {
    totalUsers: totalUsers[0]?.count || 0,
    totalVendors: totalVendors[0]?.count || 0,
    newUsers: newUsers[0]?.count || 0,
    newVendors: newVendors[0]?.count || 0,
    pendingVerifications: pendingVerifications[0]?.count || 0,
    openTickets: openTickets[0]?.count || 0,
    totalBookings: totalBookings[0]?.count || 0,
    totalRevenue: Number(totalRevenue[0]?.total || 0),
  };
}

// User Growth Data (monthly)
export async function getUserGrowthData() {
  const growthData = await db.select({
    month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${schema.users.createdAt}), 'MON')`,
    vendors: sql<number>`COUNT(CASE WHEN ${schema.users.accountType} = 'VENDOR' THEN 1 END)`,
    users: sql<number>`COUNT(CASE WHEN ${schema.users.accountType} = 'CUSTOMER' THEN 1 END)`,
  })
  .from(schema.users)
  .groupBy(sql`DATE_TRUNC('month', ${schema.users.createdAt})`)
  .orderBy(sql`DATE_TRUNC('month', ${schema.users.createdAt})`)
  .limit(12);

  return growthData;
}

// Verification Status Data
export async function getVerificationStats() {
  const stats = await db.select({
    verified: sql<number>`COUNT(CASE WHEN ${schema.verificationDocuments.status} = 'approved' THEN 1 END)`,
    pending: sql<number>`COUNT(CASE WHEN ${schema.verificationDocuments.status} = 'pending' THEN 1 END)`,
    rejected: sql<number>`COUNT(CASE WHEN ${schema.verificationDocuments.status} = 'rejected' THEN 1 END)`,
  }).from(schema.verificationDocuments);

  return stats[0];
}

// Get All Users
export async function getUsers(options?: { role?: string; search?: string; limit?: number; offset?: number }) {
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

  if (options?.role && options.role !== "all") {
    query = query.where(eq(schema.users.accountType, sql`${options.role.toUpperCase()}` as any)) as typeof query;
  }

  if (options?.search) {
    query = query.where(
      sql`(${schema.users.email} ILIKE ${`%${options.search}%`} OR 
      ${schema.users.firstName} ILIKE ${`%${options.search}%`} OR 
      ${schema.users.lastName} ILIKE ${`%${options.search}%`})`
    ) as typeof query;
  }

  const total = await db.select({ count: count() }).from(schema.users);

  if (options?.limit) {
    query = query.limit(options.limit).offset(options.offset || 0) as typeof query;
  }

  const users = await query.orderBy(desc(schema.users.createdAt));

  return { users, total: total[0]?.count || 0 };
}

// Get User by ID with Vendor Profile
export async function getUserById(id: number) {
  const user = await db.select({
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
  .where(eq(schema.users.id, id))
  .then(rows => rows[0]);

  if (!user) return null;

  // If vendor, get vendor profile
  if (user.accountType === "VENDOR") {
    const vendorProfile = await db.select({
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
    .where(eq(schema.vendorProfiles.userId, id))
    .then(rows => rows[0]);

    return { ...user, vendorProfile };
  }

  return user;
}

// Get Recent Bookings
export async function getRecentBookings(limit = 10) {
  return db.select({
    id: schema.bookings.id,
    status: schema.bookings.status,
    totalAmount: schema.bookings.totalAmount,
    bookingDate: schema.bookings.bookingDate,
    clientName: sql<string>`CONCAT(${schema.users.firstName}, ' ', ${schema.users.lastName})`,
    vendorBusinessName: schema.vendorProfiles.businessName,
  })
  .from(schema.bookings)
  .innerJoin(schema.users, eq(schema.bookings.clientId, schema.users.id))
  .leftJoin(schema.vendorProfiles, eq(schema.bookings.vendorId, schema.vendorProfiles.id))
  .orderBy(desc(schema.bookings.createdAt))
  .limit(limit);
}

// Get Revenue by Month
export async function getRevenueByMonth(months = 12) {
  const revenue = await db.select({
    month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${schema.invoices.paidAt}), 'MON')`,
    amount: sql<number>`SUM(${schema.invoices.amount})`,
  })
  .from(schema.invoices)
  .where(eq(schema.invoices.status, "paid"))
  .groupBy(sql`DATE_TRUNC('month', ${schema.invoices.paidAt})`)
  .orderBy(sql`DATE_TRUNC('month', ${schema.invoices.paidAt})`)
  .limit(months);

  return revenue;
}
