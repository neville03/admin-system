import { Router } from "express";
import { db, schema } from "../../lib/db";
import { desc, eq, and, like } from "drizzle-orm";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { supportTickets, supportTicketMessages, flags, users, vendorProfiles } from "../../db/schemas";

const router = Router();

// Get all support tickets
router.get("/tickets", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };
    
    let conditions: any[] = [];
    if (status) {
      conditions.push(eq(supportTickets.status, status as "OPEN" | "CLOSED" | "PENDING"));
    }
    if (search) {
      conditions.push(like(supportTickets.subject, `%${search}%`));
    }

    const tickets = await db
      .select({
        id: supportTickets.id,
        subject: supportTickets.subject,
        status: supportTickets.status,
        priority: supportTickets.priority,
        createdAt: supportTickets.createdAt,
        reporter: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          accountType: users.accountType,
        },
      })
      .from(supportTickets)
      .leftJoin(users, eq(supportTickets.reporterId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(supportTickets.createdAt));

    res.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// Get single ticket with messages
router.get("/tickets/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const ticketResult = await db
      .select({
        id: supportTickets.id,
        subject: supportTickets.subject,
        status: supportTickets.status,
        priority: supportTickets.priority,
        initialMessage: supportTickets.initialMessage,
        createdAt: supportTickets.createdAt,
        reporterId: supportTickets.reporterId,
        reporterFirstName: users.firstName,
        reporterLastName: users.lastName,
        reporterAccountType: users.accountType,
        reporterCreatedAt: users.createdAt,
      })
      .from(supportTickets)
      .leftJoin(users, eq(supportTickets.reporterId, users.id))
      .where(eq(supportTickets.id, id));

    const ticket = ticketResult[0];

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const messagesResult = await db
      .select({
        id: supportTicketMessages.id,
        message: supportTicketMessages.message,
        isFromAdmin: supportTicketMessages.isFromAdmin,
        createdAt: supportTicketMessages.createdAt,
        senderFirstName: users.firstName,
        senderLastName: users.lastName,
      })
      .from(supportTicketMessages)
      .leftJoin(users, eq(supportTicketMessages.senderId, users.id))
      .where(eq(supportTicketMessages.ticketId, id));

    const ticketWithReporter = {
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      initialMessage: ticket.initialMessage,
      createdAt: ticket.createdAt,
      reporter: {
        id: ticket.reporterId,
        firstName: ticket.reporterFirstName,
        lastName: ticket.reporterLastName,
        accountType: ticket.reporterAccountType,
        createdAt: ticket.reporterCreatedAt,
      },
    };

    const messages = messagesResult.map((m: any) => ({
      id: m.id,
      message: m.message,
      isFromAdmin: m.isFromAdmin,
      createdAt: m.createdAt,
      sender: {
        firstName: m.senderFirstName,
        lastName: m.senderLastName,
      },
    }));

    res.json({ ticket: ticketWithReporter, messages });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// Create support ticket
router.post("/tickets", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { subject, reporterId, initialMessage } = req.body;

    const [ticket] = await db
      .insert(supportTickets)
      .values({
        subject,
        reporterId,
        initialMessage,
        status: "OPEN",
        priority: "MEDIUM",
      })
      .returning();

    // Add initial message as first message
    await db
      .insert(supportTicketMessages)
      .values({
        ticketId: ticket.id,
        senderId: reporterId,
        message: initialMessage,
        isFromAdmin: false,
      });

    res.status(201).json({ ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Add message to ticket
router.post("/tickets/:id/messages", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { senderId, message, isFromAdmin } = req.body;

    const [msg] = await db
      .insert(supportTicketMessages)
      .values({
        ticketId: id,
        senderId,
        message,
        isFromAdmin: isFromAdmin || false,
      })
      .returning();

    res.status(201).json({ message: msg });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error: "Failed to add message" });
  }
});

// Update ticket status
router.patch("/tickets/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body;

    const [ticket] = await db
      .update(supportTickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();

    res.json({ ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

// Get all flags
router.get("/flags", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, reason, search } = req.query as { status?: string; reason?: string; search?: string };
    
    let conditions: any[] = [];
    if (status) {
      conditions.push(eq(flags.status, status as "PENDING" | "RESOLVED" | "DISMISSED"));
    }
    if (reason) {
      conditions.push(eq(flags.reason, reason));
    }
    if (search) {
      conditions.push(like(flags.content, `%${search}%`));
    }

    const flagsList = await db
      .select({
        id: flags.id,
        content: flags.content,
        reason: flags.reason,
        status: flags.status,
        targetType: flags.targetType,
        flaggedDate: flags.flaggedDate,
        createdAt: flags.createdAt,
        flagger: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          accountType: users.accountType,
        },
      })
      .from(flags)
      .leftJoin(users, eq(flags.flaggerId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(flags.flaggedDate));

    res.json({ flags: flagsList });
  } catch (error) {
    console.error("Error fetching flags:", error);
    res.status(500).json({ error: "Failed to fetch flags" });
  }
});

// Get single flag
router.get("/flags/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const flag = await db
      .select({
        id: flags.id,
        content: flags.content,
        reason: flags.reason,
        status: flags.status,
        targetType: flags.targetType,
        targetId: flags.targetId,
        flaggedDate: flags.flaggedDate,
        createdAt: flags.createdAt,
        flagger: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          accountType: users.accountType,
        },
      })
      .from(flags)
      .leftJoin(users, eq(flags.flaggerId, users.id))
      .where(eq(flags.id, id));

    const flagResult = flag[0];

    if (!flagResult) {
      return res.status(404).json({ error: "Flag not found" });
    }

    // Get target info based on targetType
    let target: { id: number; name: string | null; userId: number | null } | null = null;
    if (flagResult.targetType === "vendor" || flagResult.targetType === "user") {
      const vendorProfileResult = await db
        .select({
          id: vendorProfiles.id,
          businessName: vendorProfiles.businessName,
          userId: vendorProfiles.userId,
        })
        .from(vendorProfiles)
        .innerJoin(users, eq(vendorProfiles.userId, users.id))
        .where(eq(vendorProfiles.id, flagResult.targetId as number));

      const vendorProfile = vendorProfileResult[0];

      if (vendorProfile) {
        target = {
          id: vendorProfile.id,
          name: vendorProfile.businessName,
          userId: vendorProfile.userId,
        };
      }
    }

    res.json({ flag, target });
  } catch (error) {
    console.error("Error fetching flag:", error);
    res.status(500).json({ error: "Failed to fetch flag" });
  }
});

// Create flag
router.post("/flags", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { content, reason, flaggerId, targetType, targetId } = req.body;

    const [flag] = await db
      .insert(flags)
      .values({
        content,
        reason,
        flaggerId,
        targetType,
        targetId,
        status: "PENDING",
      })
      .returning();

    res.status(201).json({ flag });
  } catch (error) {
    console.error("Error creating flag:", error);
    res.status(500).json({ error: "Failed to create flag" });
  }
});

// Update flag status
router.patch("/flags/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body;

    const [flag] = await db
      .update(flags)
      .set({ status, updatedAt: new Date() })
      .where(eq(flags.id, id))
      .returning();

    res.json({ flag });
  } catch (error) {
    console.error("Error updating flag:", error);
    res.status(500).json({ error: "Failed to update flag" });
  }
});

// Delete flag
router.delete("/flags/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    
    await db
      .delete(flags)
      .where(eq(flags.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting flag:", error);
    res.status(500).json({ error: "Failed to delete flag" });
  }
});

export default router;
