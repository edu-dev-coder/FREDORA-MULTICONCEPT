import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import path from "path";
import fs from "fs/promises";
import { db, tmReportsTable, tmTestSessionsTable, tmProfilesTable } from "@workspace/db";
import {
  ListReportsQueryParams,
  ListReportsResponse,
  GetReportParams,
  GetReportResponse,
  GenerateReportParams,
  GenerateReportResponse,
} from "@workspace/api-zod";
import { generateReport } from "../lib/pdfGenerator";
import { serializeDates, serializeDatesArray } from "../lib/serializeDates";

const router: IRouter = Router();

const REPORTS_DIR = path.join(process.cwd(), "reports");

async function ensureReportsDir() {
  try { await fs.mkdir(REPORTS_DIR, { recursive: true }); } catch { /* already exists */ }
}

router.get("/reports", async (req, res): Promise<void> => {
  const params = ListReportsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message }); return;
  }
  const reports = await db
    .select()
    .from(tmReportsTable)
    .where(params.data.userId ? eq(tmReportsTable.userId, params.data.userId) : undefined)
    .orderBy(desc(tmReportsTable.createdAt));
  res.json(ListReportsResponse.parse(serializeDatesArray(reports)));
});

router.get("/reports/:id", async (req, res): Promise<void> => {
  const params = GetReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message }); return;
  }
  const [report] = await db
    .select()
    .from(tmReportsTable)
    .where(eq(tmReportsTable.id, params.data.id));
  if (!report) {
    res.status(404).json({ error: "Report not found" }); return;
  }
  res.json(GetReportResponse.parse(serializeDates(report)));
});

router.post("/reports/generate/:sessionId", async (req, res): Promise<void> => {
  const params = GenerateReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message }); return;
  }
  const [session] = await db
    .select()
    .from(tmTestSessionsTable)
    .where(eq(tmTestSessionsTable.id, params.data.sessionId));
  if (!session) {
    res.status(404).json({ error: "Test session not found" }); return;
  }
  let userData: { fullName?: string | null; email?: string | null } = {};
  if (session.userId) {
    const [profile] = await db.select().from(tmProfilesTable).where(eq(tmProfilesTable.id, session.userId));
    if (profile) userData = profile;
  }
  try {
    await ensureReportsDir();
    const pdfBuffer = await generateReport(
      {
        testType: session.testType,
        results: {
          primary: session.primaryTemp ?? "",
          secondary: session.secondaryTemp ?? "",
          blend: session.blend ?? "",
          percentages: (session.results ?? {}) as Record<string, number>,
        },
      },
      userData
    );
    const filename = `report-${params.data.sessionId}-${Date.now()}.pdf`;
    const filePath = path.join(REPORTS_DIR, filename);
    await fs.writeFile(filePath, pdfBuffer);
    const reportUrl = `/api/reports/pdf/${filename}`;
    const [report] = await db.insert(tmReportsTable).values({
      sessionId: session.id,
      userId: session.userId,
      reportUrl,
      reportType: "individual",
    }).returning();
    res.json(GenerateReportResponse.parse(serializeDates(report)));
  } catch (err) {
    req.log.error({ err }, "PDF generation failed");
    res.status(500).json({ error: "PDF generation failed" });
  }
});

router.get("/reports/pdf/:filename", async (req, res): Promise<void> => {
  const { filename } = req.params as { filename: string };
  if (!filename || filename.includes("..")) {
    res.status(400).json({ error: "Invalid filename" }); return;
  }
  const filePath = path.join(REPORTS_DIR, filename);
  try {
    const data = await fs.readFile(filePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(data);
  } catch {
    res.status(404).json({ error: "Report file not found" });
  }
});

export default router;
