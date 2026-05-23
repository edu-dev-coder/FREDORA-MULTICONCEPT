import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, paymentsTable, testSessionsTable, couponsTable } from "@workspace/db";
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
  school_license: 5000000,
  corporate_team: 15000000,
};

const PRICE_LABELS: Record<string, string> = {
  single_test: "Individual Test",
  couples_test: "Couples Test",
  school_license: "School License",
  corporate_team: "Corporate Team",
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
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
          <div style="background: #1B3A6B; padding: 32px 40px; text-align: center;">
            <h1 style="color: #C8961E; font-size: 22px; margin: 0; letter-spacing: 1px;">FREDORA</h1>
            <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 4px 0 0;">TemperaMap Assessment</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #1B3A6B; font-size: 22px; margin: 0 0 8px;">Payment Confirmed ✅</h2>
            <p style="color: #5a6a8a; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Thank you for your purchase. Your assessment is now unlocked and ready to take.
            </p>
            <div style="background: #f8f9fb; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e6ef;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #5a6a8a; font-size: 14px;">Product</span>
                <span style="color: #1a2d52; font-size: 14px; font-weight: 600;">${label}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #5a6a8a; font-size: 14px;">Amount Paid</span>
                <span style="color: #C8961E; font-size: 16px; font-weight: 700;">${amountStr}</span>
              </div>
            </div>
            <a href="https://fredora.com/web/dashboard" style="display: block; background: #1B3A6B; color: #ffffff; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 15px; margin-bottom: 20px;">
              Go to My Dashboard →
            </a>
            <p style="color: #9aabb8; font-size: 12px; text-align: center; line-height: 1.6;">
              If you have any issues, reply to this email or contact us at support@fredora.com.<br/>
              Results are indicative, not diagnostic.
            </p>
          </div>
          <div style="background: #f8f9fb; padding: 16px; text-align: center; border-top: 1px solid #e2e6ef;">
            <p style="color: #9aabb8; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Fredora TemperaMap. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    logger.info({ to, product }, "Payment confirmation email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send payment confirmation email");
  }
}

// Validate coupon code
router.post("/coupons/validate", async (req, res): Promise<void> => {
  const { code } = req.body as { code?: string };
  if (!code || typeof code !== "string") {
    res.status(400).json({ valid: false, message: "Coupon code is required" });
    return;
  }

  const [coupon] = await db
    .select()
    .from(couponsTable)
    .where(eq(couponsTable.code, code.toUpperCase().trim()));

  if (!coupon) {
    res.status(404).json({ valid: false, message: "Invalid coupon code" });
    return;
  }

  if (!coupon.isActive) {
    res.status(400).json({ valid: false, message: "This coupon is no longer active" });
    return;
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    res.status(400).json({ valid: false, message: "This coupon has expired" });
    return;
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    res.status(400).json({ valid: false, message: "This coupon has reached its usage limit" });
    return;
  }

  res.json({
    valid: true,
    couponId: coupon.id,
    discountPercent: coupon.discountPercent,
    code: coupon.code,
  });
});

router.post("/payments/initialize", async (req, res): Promise<void> => {
  const body = InitializePaymentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const baseAmount = PRICES[body.data.product];
  if (!baseAmount) {
    res.status(400).json({ error: "Invalid product. Use: single_test, couples_test, school_license, or corporate_team" });
    return;
  }

  // Apply coupon discount if provided
  const couponCode = (req.body as { couponCode?: string }).couponCode;
  let amount = baseAmount;
  let appliedCouponId: string | null = null;

  if (couponCode) {
    const [coupon] = await db
      .select()
      .from(couponsTable)
      .where(eq(couponsTable.code, couponCode.toUpperCase().trim()));

    if (coupon && coupon.isActive && coupon.usedCount < (coupon.maxUses ?? Infinity)) {
      const discount = Math.floor(baseAmount * (coupon.discountPercent / 100));
      amount = baseAmount - discount;
      appliedCouponId = coupon.id;
    }
  }

  const reference = `FTM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  if (!PAYSTACK_SECRET) {
    req.log.warn("PAYSTACK_SECRET_KEY not set — returning mock authorization URL");
    await db.insert(paymentsTable).values({
      userId: body.data.userId ?? null,
      sessionId: body.data.sessionId as `${string}-${string}-${string}-${string}-${string}`,
      amount,
      paystackRef: reference,
      product: body.data.product,
      status: "pending",
    });
    res.json({
      authorizationUrl: `https://paystack.com/pay/mock-${reference}`,
      reference,
      isDemoMode: true,
    });
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
        email: body.data.email,
        amount,
        reference,
        metadata: {
          userId: body.data.userId,
          sessionId: body.data.sessionId,
          product: body.data.product,
          couponId: appliedCouponId,
        },
      }),
    });

    const data = await response.json() as { data: { authorization_url: string } };

    await db.insert(paymentsTable).values({
      userId: body.data.userId ?? null,
      sessionId: body.data.sessionId as `${string}-${string}-${string}-${string}-${string}`,
      amount,
      paystackRef: reference,
      product: body.data.product,
      status: "pending",
    });

    res.json(
      InitializePaymentResponse.parse({
        authorizationUrl: data.data.authorization_url,
        reference,
      })
    );
  } catch (err) {
    req.log.error({ err }, "Payment initialization failed");
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

router.get("/payments/verify/:reference", async (req, res): Promise<void> => {
  const params = VerifyPaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (!PAYSTACK_SECRET) {
    req.log.warn("PAYSTACK_SECRET_KEY not set — cannot verify payment");
    res.json(VerifyPaymentResponse.parse({ success: false, sessionId: null }));
    return;
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${params.data.reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    );

    const data = await response.json() as {
      data: {
        status: string;
        amount: number;
        customer: { email: string };
        metadata: { sessionId?: string; userId?: string; product?: string; couponId?: string };
      };
    };

    if (data.data.status === "success") {
      await db
        .update(paymentsTable)
        .set({ status: "success" })
        .where(eq(paymentsTable.paystackRef, params.data.reference));

      const sessionId = data.data.metadata?.sessionId;
      if (sessionId) {
        await db
          .update(testSessionsTable)
          .set({ paid: true, paymentRef: params.data.reference, status: "paid" })
          .where(eq(testSessionsTable.id, sessionId as `${string}-${string}-${string}-${string}-${string}`));
      }

      // Increment coupon usedCount if one was applied
      const couponId = data.data.metadata?.couponId;
      if (couponId) {
        await db
          .update(couponsTable)
          .set({ usedCount: db.$count ? undefined : undefined })
          .where(eq(couponsTable.id, couponId));
        // Raw increment
        await db.execute(
          `UPDATE coupons SET used_count = used_count + 1 WHERE id = '${couponId}'` as any
        );
      }

      // Send confirmation email (non-blocking)
      const email = data.data.customer?.email;
      const product = data.data.metadata?.product ?? "single_test";
      const amount = data.data.amount;
      if (email) {
        sendPaymentConfirmationEmail(email, product, amount).catch(() => {});
      }

      res.json(VerifyPaymentResponse.parse({ success: true, sessionId: sessionId ?? null }));
    } else {
      res.json(VerifyPaymentResponse.parse({ success: false, sessionId: null }));
    }
  } catch (err) {
    req.log.error({ err }, "Payment verification failed");
    res.status(500).json({ error: "Payment verification failed" });
  }
});

router.post("/payments/demo-unlock/:sessionId", async (req, res): Promise<void> => {
  if (PAYSTACK_SECRET) {
    res.status(403).json({ error: "Demo mode is not available when PAYSTACK_SECRET_KEY is configured." });
    return;
  }

  const { sessionId } = req.params as { sessionId: string };
  if (!sessionId) {
    res.status(400).json({ error: "sessionId required" });
    return;
  }

  const [session] = await db
    .update(testSessionsTable)
    .set({ paid: true, status: "paid" })
    .where(eq(testSessionsTable.id, sessionId as `${string}-${string}-${string}-${string}-${string}`))
    .returning();

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json({ success: true, sessionId });
});

router.get("/payments", async (req, res): Promise<void> => {
  const params = ListPaymentsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const payments = await db
    .select()
    .from(paymentsTable)
    .where(params.data.userId ? eq(paymentsTable.userId, params.data.userId) : undefined)
    .orderBy(desc(paymentsTable.createdAt));

  res.json(ListPaymentsResponse.parse(serializeDatesArray(payments)));
});

export default router;
