import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, messagesTable } from "@workspace/db";
import {
  CreateMessageBody,
  DeleteMessageParams,
  ListMessagesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeMessage(m: typeof messagesTable.$inferSelect) {
  return {
    ...m,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
  };
}

router.get("/messages", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt));

  res.json(ListMessagesResponse.parse(messages.map(serializeMessage)));
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

  res.status(201).json(serializeMessage(message));
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
