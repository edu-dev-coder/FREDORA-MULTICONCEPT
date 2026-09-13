import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, tmPaymentsTable, tmTestSessionsTable, tmCouponsTable } from "@workspace/db";
import {
  InitializePaymentBody,
  InitializePaymentResponse,
  VerifyPaymentParams,
  VerifyPaymentResponse,
  ListPaymentsQueryParams,
  ListPaymentsResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { serializeDatesArray } from "../lib/serializeDates";
import nodemailer from "nodemailer";

const router: IRouter = Router();

const PAYSTACK_SECRET = process.env["PAYSTACK_SECRET_KEY"] ?? "";

const PRICES: Record<string, number> = {
  single_test: 500000,
  couples_test: 1000000,
  child_3_5: 500000,
  child_6_9: 500000,
  preteen_10_12: 500000,
  teen_13_17: 500000,
  school_license: 5000000,
  corporate_team: 15000000,
  individual_student: 500000,
};

const PRICE_LABELS: Record<string, string> = {
  single_test: "Individual Test",
  couples_test: "Couples Test",
  child_3_5: "Ages 3–5 Assessment",
  child_6_9: "Ages 6–9 Assessment",
  preteen_10_12: "Ages 10–12 Assessment",
  teen_13_17: "Ages 13–17 Assessment",
  school_license: "School License",
  corporate_team: "Corporate Team",
  individual_student: "Individual Student",
};

async function sendPaymentConfirmationEmail(to: string, product: string, amount: number) {
  const host = process.env["SMTP_HOST"];
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  const from = process.env["SMTP_FROM"] ?? user;
  if (!host || !user || !pass) {
    logger.info("SMTP not configured — skipping payment confirmation email");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env["SMTP_PORT"] ?? "587"),
      secure: process.env["SMTP_PORT"] === "465",
      auth: { user, pass },
    });
    const label = PRICE_LABELS[product] ?? product;
    const amountStr = `₦${(amount / 100).toLocaleString()}`;
    await transporter.sendMail({
      from: `"Fredora TemperaMap" <${from}>`,
      to,
      subject: "Payment Confirmed — Your TemperaMap Test is Unlocked",
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
        <div style="background:#1B3A6B;padding:32px 40px;text-align:center">
          <h1 style="color:#C8961E;font-size:22px;margin:0">FREDORA</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:4px 0 0">TemperaMap Assessment</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#1B3A6B">Payment Confirmed ✅</h2>
          <p style="color:#5a6a8a">Your assessment is now unlocked and ready to take.</p>
          <div style="background:#f8f9fb;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e2e6ef">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#5a6a8a">Product</span>
              <strong style="color:#1a2d52">${label}</strong>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:#5a6a8a">Amount</span>
              <strong style="color:#C8961E">${amountStr}</strong>
            </div>
          </div>
          <p style="color:#9aabb8;font-size:12px;text-align:center">Questions? Contact support@fredora.com</p>
        </div>
      </div>`,
    });
  } catch (err) {
    logger.error({ err }, "Failed to send payment confirmation email");
  }
}

router.post("/payments/validate-coupon", async (req, res): Promise<void> => {
  const { code } = req.body as { code?: string };
  if (!code) {
    res.status(400).json({ valid: false, message: "Coupon code required" }); return;
  }
  const [coupon] = await db.select().from(tmCouponsTable).where(eq(tmCouponsTable.code, code.toUpperCase().trim()));
  if (!coupon) {
    res.status(404).json({ valid: false, message: "Invalid coupon code" }); return;
  }
  if (!coupon.isActive || (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses)) {
    res.status(400).json({ valid: false, message: "Coupon is no longer valid" }); return;
  }
  res.json({ valid: true, discountPercent: coupon.discountPercent, couponId: coupon.id });
});

router.post("/payments/initialize", async (req, res): Promise<void> => {
  const body = InitializePaymentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message }); return;
  }
  const { email, product, sessionId, userId, couponCode } = body.data;
  const baseAmount = PRICES[product];
  if (!baseAmount) {
    res.status(400).json({ error: `Unknown product: ${product}` }); return;
  }
  let amount = baseAmount;
  let appliedCouponId: string | undefined;
  if (couponCode) {
    const [coupon] = await db.select().from(tmCouponsTable).where(eq(tmCouponsTable.code, couponCode.toUpperCase().trim()));
    if (coupon && coupon.isActive && coupon.usedCount < (coupon.maxUses ?? Infinity)) {
      const discount = Math.floor(baseAmount * (coupon.discountPercent / 100));
      amount = baseAmount - discount;
      appliedCouponId = coupon.id;
    }
  }
  if (!PAYSTACK_SECRET) {
    const reference = `demo_${Date.now()}`;
    await db.insert(tmPaymentsTable).values({
      userId: userId ?? null,
      sessionId: sessionId as `${string}-${string}-${string}-${string}-${string}`,
      amount,
      paystackRef: reference,
      product,
      status: "pending",
      couponId: appliedCouponId as `${string}-${string}-${string}-${string}-${string}` | undefined,
    });
    res.json(InitializePaymentResponse.parse({ authorizationUrl: null, reference }));
    return;
  }
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        reference: `tm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        metadata: { sessionId, userId, product, couponId: appliedCouponId },
        callback_url: `${req.headers.origin ?? ""}/payment/${sessionId}?verify=true`,
      }),
    });
    const data = await response.json() as { status: boolean; data?: { authorization_url: string; reference: string } };
    if (!data.status || !data.data) {
      res.status(500).json({ error: "Paystack initialization failed" }); return;
    }
    await db.insert(tmPaymentsTable).values({
      userId: userId ?? null,
      sessionId: sessionId as `${string}-${string}-${string}-${string}-${string}`,
      amount,
      paystackRef: data.data.reference,
      product,
      status: "pending",
      couponId: appliedCouponId as `${string}-${string}-${string}-${string}-${string}` | undefined,
    });
    res.json(InitializePaymentResponse.parse({ authorizationUrl: data.data.authorization_url, reference: data.data.reference }));
  } catch (err) {
    req.log.error({ err }, "Payment initialization failed");
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

router.get("/payments/verify/:reference", async (req, res): Promise<void> => {
  const params = VerifyPaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message }); return;
  }
  if (!PAYSTACK_SECRET) {
    res.status(503).json({ error: "Paystack not configured" }); return;
  }
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${params.data.reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const data = await response.json() as { status: boolean; data?: { status: string; amount: number; customer: { email: string }; metadata?: { sessionId?: string; userId?: string; product?: string; couponId?: string } } };
    if (!data.status || !data.data) {
      res.status(500).json({ error: "Paystack verification failed" }); return;
    }
    if (data.data.status === "success") {
      await db.update(tmPaymentsTable).set({ status: "success" }).where(eq(tmPaymentsTable.paystackRef, params.data.reference));
      const sessionId = data.data.metadata?.sessionId;
      if (sessionId) {
        await db.update(tmTestSessionsTable).set({ paid: true, paymentRef: params.data.reference, status: "paid" })
          .where(eq(tmTestSessionsTable.id, sessionId as `${string}-${string}-${string}-${string}-${string}`));
      }
      const couponId = data.data.metadata?.couponId;
      if (couponId) {
        await db.update(tmCouponsTable)
          .set({ usedCount: sql`${tmCouponsTable.usedCount} + 1` })
          .where(eq(tmCouponsTable.id, couponId as `${string}-${string}-${string}-${string}-${string}`));
      }
      const email = data.data.customer?.email;
      const product = data.data.metadata?.product ?? "";
      if (email) {
        await sendPaymentConfirmationEmail(email, product, data.data.amount);
      }
    }
    res.json(VerifyPaymentResponse.parse({ status: data.data.status, sessionId: data.data.metadata?.sessionId ?? null }));
  } catch (err) {
    req.log.error({ err }, "Payment verification failed");
    res.status(500).json({ error: "Payment verification failed" });
  }
});

router.post("/payments/demo-unlock/:sessionId", async (req, res): Promise<void> => {
  if (PAYSTACK_SECRET) {
    res.status(403).json({ error: "Demo mode is not available when PAYSTACK_SECRET_KEY is configured." }); return;
  }
  const { sessionId } = req.params as { sessionId: string };
  if (!sessionId) {
    res.status(400).json({ error: "sessionId required" }); return;
  }
  const [session] = await db.update(tmTestSessionsTable)
    .set({ paid: true, status: "paid" })
    .where(eq(tmTestSessionsTable.id, sessionId as `${string}-${string}-${string}-${string}-${string}`))
    .returning();
  if (!session) {
    res.status(404).json({ error: "Session not found" }); return;
  }
  res.json({ success: true, sessionId });
});

router.get("/payments", async (req, res): Promise<void> => {
  const params = ListPaymentsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message }); return;
  }
  const payments = await db.select().from(tmPaymentsTable)
    .where(params.data.userId ? eq(tmPaymentsTable.userId, params.data.userId) : undefined)
    .orderBy(desc(tmPaymentsTable.createdAt));
  res.json(ListPaymentsResponse.parse(serializeDatesArray(payments)));
});

export default router;
