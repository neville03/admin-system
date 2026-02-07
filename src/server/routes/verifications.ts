import { Router } from "express";
import { db, schema } from "../../lib/db";
import { desc, eq, count } from "drizzle-orm";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all pending verifications - requires admin authentication
router.get("/", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const status = req.query.status as string || "pending";
    
    const verifications = await db.select({
      id: schema.verificationDocuments.id,
      vendorId: schema.verificationDocuments.vendorId,
      documentType: schema.verificationDocuments.documentType,
      documentUrl: schema.verificationDocuments.documentUrl,
      documentName: schema.verificationDocuments.documentName,
      fileSize: schema.verificationDocuments.fileSize,
      status: schema.verificationDocuments.status,
      uploadedAt: schema.verificationDocuments.uploadedAt,
      vendorProfile: {
        id: schema.vendorProfiles.id,
        businessName: schema.vendorProfiles.businessName,
        userId: schema.vendorProfiles.userId,
        verificationStatus: schema.vendorProfiles.verificationStatus,
      },
      user: {
        id: schema.users.id,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        email: schema.users.email,
        image: schema.users.image,
      },
    })
    .from(schema.verificationDocuments)
    .innerJoin(schema.vendorProfiles, eq(schema.verificationDocuments.vendorId, schema.vendorProfiles.id))
    .innerJoin(schema.users, eq(schema.vendorProfiles.userId, schema.users.id))
    .where(eq(schema.verificationDocuments.status, status))
    .orderBy(desc(schema.verificationDocuments.uploadedAt));

    // Get total count for pending verifications
    const [totalCount] = await db.select({ count: count() })
      .from(schema.verificationDocuments)
      .where(eq(schema.verificationDocuments.status, "pending"));

    res.json({ verifications, total: totalCount.count || 0 });
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({ error: "Failed to fetch verifications" });
  }
});

// Get verification by ID - requires admin authentication
router.get("/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ error: "Invalid verification ID" });
    }
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid verification ID" });
    }

    const [verification] = await db.select({
      id: schema.verificationDocuments.id,
      vendorId: schema.verificationDocuments.vendorId,
      documentType: schema.verificationDocuments.documentType,
      documentUrl: schema.verificationDocuments.documentUrl,
      documentName: schema.verificationDocuments.documentName,
      fileSize: schema.verificationDocuments.fileSize,
      status: schema.verificationDocuments.status,
      uploadedAt: schema.verificationDocuments.uploadedAt,
      vendorProfile: {
        id: schema.vendorProfiles.id,
        businessName: schema.vendorProfiles.businessName,
        userId: schema.vendorProfiles.userId,
        verificationStatus: schema.vendorProfiles.verificationStatus,
        isVerified: schema.vendorProfiles.isVerified,
      },
      user: {
        id: schema.users.id,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        email: schema.users.email,
        image: schema.users.image,
        phone: schema.users.phone,
        location: schema.users.location,
      },
    })
    .from(schema.verificationDocuments)
    .innerJoin(schema.vendorProfiles, eq(schema.verificationDocuments.vendorId, schema.vendorProfiles.id))
    .innerJoin(schema.users, eq(schema.vendorProfiles.userId, schema.users.id))
    .where(eq(schema.verificationDocuments.id, id));

    if (!verification) {
      return res.status(404).json({ error: "Verification not found" });
    }

    res.json(verification);
  } catch (error) {
    console.error("Error fetching verification:", error);
    res.status(500).json({ error: "Failed to fetch verification" });
  }
});

// Update verification status - requires admin authentication
router.patch("/:id/status", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ error: "Invalid verification ID" });
    }
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid verification ID" });
    }

    const { status } = req.body;
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'approved', 'rejected', or 'pending'" });
    }

    const [updated] = await db.update(schema.verificationDocuments)
      .set({ status })
      .where(eq(schema.verificationDocuments.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Verification not found" });
    }

    // If approved, update vendor verification status
    if (status === "approved") {
      const [verification] = await db.select({ vendorId: schema.verificationDocuments.vendorId })
        .from(schema.verificationDocuments)
        .where(eq(schema.verificationDocuments.id, id));
      
      if (verification) {
        await db.update(schema.vendorProfiles)
          .set({ 
            isVerified: true,
            verificationStatus: "approved",
            verificationReviewedAt: new Date(),
          })
          .where(eq(schema.vendorProfiles.id, verification.vendorId));
      }
    }

    res.json({ message: "Verification status updated", verification: updated });
  } catch (error) {
    console.error("Error updating verification status:", error);
    res.status(500).json({ error: "Failed to update verification status" });
  }
});

export default router;
