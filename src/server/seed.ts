import bcrypt from "bcryptjs";
import { db, schema } from "../lib/db";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const email = "admin@eventbridge.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()));

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    await db.insert(schema.users).values({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      accountType: "ADMIN",
      isActive: true,
      emailVerified: true,
      provider: "local",
    });

    console.log("Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

async function seedRoles() {
  try {
    // Check if roles already exist
    const [existingRoles] = await db.select().from(schema.roles).limit(1);

    if (existingRoles) {
      console.log("Roles already exist");
      return;
    }

    // Create default roles
    await db.insert(schema.roles).values([
      {
        name: "super_admin",
        displayName: "Super Admin",
        description: "Full access to all features and settings",
        level: 100,
        permissions: ["*"],
        isSystem: true,
      },
      {
        name: "admin",
        displayName: "Admin",
        description: "Access to most admin features",
        level: 80,
        permissions: [
          "users.read",
          "users.write",
          "users.delete",
          "verifications.read",
          "verifications.write",
          "settings.read",
          "settings.write",
          "support.read",
          "support.write",
        ],
        isSystem: true,
      },
      {
        name: "moderator",
        displayName: "Moderator",
        description: "Can manage users and content",
        level: 50,
        permissions: [
          "users.read",
          "verifications.read",
          "verifications.write",
          "support.read",
          "support.write",
        ],
        isSystem: true,
      },
      {
        name: "support",
        displayName: "Support",
        description: "Can handle support tickets",
        level: 30,
        permissions: [
          "support.read",
          "support.write",
        ],
        isSystem: true,
      },
    ]);

    console.log("Default roles created successfully!");
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
}

async function seedAdminSettings() {
  try {
    // Check if settings already exist
    const [existingSettings] = await db.select().from(schema.adminSettings).limit(1);

    if (existingSettings) {
      console.log("Admin settings already exist");
      return;
    }

    // Create default admin settings
    await db.insert(schema.adminSettings).values({
      siteName: "Event Bridge",
      siteDescription: "Your trusted event planning platform",
      contactEmail: "support@eventbridge.com",
      timezone: "Africa/Kampala",
      maintenanceMode: false,
    });

    console.log("Admin settings created successfully!");
  } catch (error) {
    console.error("Error seeding admin settings:", error);
  }
}

async function seedPaymentSettings() {
  try {
    // Check if payment settings already exist
    const [existingSettings] = await db.select().from(schema.paymentSettings).limit(1);

    if (existingSettings) {
      console.log("Payment settings already exist");
      return;
    }

    // Create default payment settings
    await db.insert(schema.paymentSettings).values({
      stripeEnabled: false,
      currency: "UGX",
      platformFeePercentage: "10.00",
      minPayoutAmount: 100000,
      payoutSchedule: "weekly",
      paymentMethods: ["card", "mobile_money"],
      mobileMoneyEnabled: true,
    });

    console.log("Payment settings created successfully!");
  } catch (error) {
    console.error("Error seeding payment settings:", error);
  }
}

async function seed() {
  await seedAdmin();
  await seedRoles();
  await seedAdminSettings();
  await seedPaymentSettings();
  console.log("\n✅ Seeding completed!");
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
