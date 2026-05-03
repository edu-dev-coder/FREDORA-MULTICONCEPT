import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, messagesTable } from "@workspace/db";
import {
  CreateMessageBody,
  DeleteMessageParams,
} from "@workspace/api-zod";
import nodemailer from "nodemailer";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function serializeMessage(m: typeof messagesTable.$inferSelect) {
  return {
    ...m,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
  };
}

async function sendEmailNotification(name: string, email: string, message: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFICATION_EMAIL) return;

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Fredora Website" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New message from Fredora website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #1a6641;padding-left:12px;color:#555;">${message.replace(/\n/g, "<br>")}</blockquote>
        <hr>
        <p style="color:#888;font-size:12px;">Sent from Fredora Multiconcept contact form</p>
      `,
    });
    logger.info({ to: NOTIFICATION_EMAIL }, "Email notification sent");
  } catch (err) {
    logger.error({ err }, "Failed to send email notification");
  }
}

router.get("/messages", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt));

  res.json(messages.map(serializeMessage));
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db
    .insert(messagesTable)
    .values(parsed.data)
    .returning();

  void sendEmailNotification(parsed.data.name, parsed.data.email, parsed.data.message);

  res.status(201).json(serializeMessage(message));
});

router.patch("/messages/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { status } = req.body as { status?: string };
  const validStatuses = ["pending", "in_progress", "resolved"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    return;
  }
  const [message] = await db
    .update(messagesTable)
    .set({ status })
    .where(eq(messagesTable.id, id))
    .returning();
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(serializeMessage(message));
});

router.delete("/messages/:id", async (req, res): Promise<void> => {
  const params = DeleteMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [message] = await db
    .delete(messagesTable)
    .where(eq(messagesTable.id, params.data.id))
    .returning();

  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
