import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// ── Types for TemperaMap In-Memory Database ────────────────────────────────────

interface PasscodeRecord {
  id: number;
  code: string;
  testType: string;
  status: "active" | "used" | "exhausted" | "expired";
  maxUses: number;
  currentUses: number;
  expiresAt: string | null;
  createdAt: string;
  usedAt: string | null;
  usedBy: string | null;
}

interface TestimonialRecord {
  id: string;
  authorName: string;
  company: string;
  text: string;
  rating: number;
  createdAt: string;
}

interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
}

interface FeatureRecord {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt: string;
}

interface CorporateTeamRecord {
  id: string;
  adminId: string;
  name: string;
  memberSessionIds: string[];
  report: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

interface TestSessionRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  testType: string;
  status: "pending" | "paid" | "in_progress" | "completed";
  paid: boolean;
  primaryTemp: string | null;
  secondaryTemp: string | null;
  blend: string | null;
  answers?: Record<number, number>;
  results?: Record<string, number> | null;
  workplace?: Record<string, unknown> | null;
  partnerSessionId?: string | null;
  passcodeUsed: string;
  createdAt: string;
  completedAt: string | null;
}

interface UserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

// ── Mock Plugin ───────────────────────────────────────────────────────────────

function mockApiPlugin(): Plugin {
  const now = new Date().toISOString();

  // ── Fredora Conglomerate Data ──
  const divisions = [
    {
      id: 1,
      slug: "foods",
      name: "Foods",
      tagline: "Taste the difference",
      description: "Quality food products, catering services, bakery confectioneries, and agro-allied supply chains.",
      bannerColor: "from-blue-600 to-blue-800",
      comingSoon: false,
      imageUrl: null,
      sortOrder: 0,
      services: [
        { id: 101, divisionSlug: "foods", name: "Premium Confectioneries & Bakery", description: "Freshly baked artisan pastries, bread, and custom celebration cakes.", price: "From ₦5,000", imageUrl: null, sortOrder: 0 },
        { id: 102, divisionSlug: "foods", name: "Corporate & Event Catering", description: "Full-service gourmet catering for weddings, executive conferences, and private banquets.", price: "Custom Quote", imageUrl: null, sortOrder: 1 },
        { id: 103, divisionSlug: "foods", name: "Agro-Commodity Bulk Supply", description: "Hygienically packaged staple food items and wholesale bulk delivery for institutions.", price: "Market Rate", imageUrl: null, sortOrder: 2 },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      slug: "eduservices",
      name: "EduServices",
      tagline: "Learn without limits",
      description: "Educational consulting, teacher development, school curriculum design, and youth mentorship.",
      bannerColor: "from-sky-500 to-blue-700",
      comingSoon: false,
      imageUrl: null,
      sortOrder: 1,
      services: [
        { id: 201, divisionSlug: "eduservices", name: "Institutional Curriculum Advisory", description: "Modern curriculum design aligned with global best practices.", price: "Custom Quote", imageUrl: null, sortOrder: 0 },
        { id: 202, divisionSlug: "eduservices", name: "Teacher Mastery Workshops", description: "Professional development and modern pedagogy training for educators.", price: "From ₦25,000 / seat", imageUrl: null, sortOrder: 1 },
        { id: 203, divisionSlug: "eduservices", name: "Academic & Career Counseling", description: "Individualized student guidance, personality-guided career mapping, and admissions consulting.", price: "From ₦15,000", imageUrl: null, sortOrder: 2 },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 3,
      slug: "chems",
      name: "CHEMS",
      tagline: "Chemistry solutions",
      description: "Industrial, agricultural, and laboratory chemical supplies engineered to rigorous purity standards.",
      bannerColor: "from-violet-500 to-purple-700",
      comingSoon: false,
      imageUrl: null,
      sortOrder: 2,
      services: [
        { id: 301, divisionSlug: "chems", name: "Industrial Solvents & Detergents", description: "High-grade industrial degreasers, production chemicals, and sanitizers.", price: "Wholesale", imageUrl: null, sortOrder: 0 },
        { id: 302, divisionSlug: "chems", name: "Analytical & Lab Reagents", description: "High-purity chemical compounds for educational, research, and medical laboratories.", price: "Catalog pricing", imageUrl: null, sortOrder: 1 },
        { id: 303, divisionSlug: "chems", name: "Water Treatment Formulations", description: "Coagulants, pH balancers, and disinfectants for industrial and residential water systems.", price: "From ₦20,000", imageUrl: null, sortOrder: 2 },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 4,
      slug: "scents",
      name: "Scents",
      tagline: "Fragrances that inspire",
      description: "Artisan perfumery, ambient scent marketing, diffusers, and luxury personal care oils.",
      bannerColor: "from-rose-500 to-pink-700",
      comingSoon: false,
      imageUrl: null,
      sortOrder: 3,
      services: [
        { id: 401, divisionSlug: "scents", name: "Bespoke Perfume Blending", description: "Signature fragrances tailored to your personal scent profile and personality.", price: "From ₦18,000", imageUrl: null, sortOrder: 0 },
        { id: 402, divisionSlug: "scents", name: "Corporate Ambient Scenting", description: "Commercial HVAC diffuser systems for hotels, luxury retail spaces, and executive lounges.", price: "Monthly Subscription", imageUrl: null, sortOrder: 1 },
        { id: 403, divisionSlug: "scents", name: "Aromatherapy & Reed Diffusers", description: "Long-lasting essential oil reed diffusers and luxury car fresheners.", price: "From ₦8,500", imageUrl: null, sortOrder: 2 },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 5,
      slug: "transport",
      name: "Transport",
      tagline: "Moving forward together",
      description: "Interstate haulage, fleet leasing, executive transit, and prompt cold-chain supply transport.",
      bannerColor: "from-amber-500 to-orange-600",
      comingSoon: false,
      imageUrl: null,
      sortOrder: 4,
      services: [
        { id: 501, divisionSlug: "transport", name: "Interstate Freight & Haulage", description: "Reliable dry cargo transportation with real-time GPS fleet tracking.", price: "Per tonnage rate", imageUrl: null, sortOrder: 0 },
        { id: 502, divisionSlug: "transport", name: "Cold-Chain Logistics", description: "Temperature-controlled transit for perishable foodstuffs, pharmaceuticals, and sensitive chemicals.", price: "Custom Quote", imageUrl: null, sortOrder: 1 },
        { id: 503, divisionSlug: "transport", name: "Corporate Fleet Hire", description: "Dedicated vehicle leasing and executive protocol transit for corporate events.", price: "Daily / Weekly", imageUrl: null, sortOrder: 2 },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 6,
      slug: "temperamap",
      name: "TemperaMap",
      tagline: "Discover your temperament blueprint",
      description: "Personality assessment based on the classical four-temperament model.",
      bannerColor: "from-[#1B3A6B] to-[#0a2a5e]",
      comingSoon: false,
      imageUrl: null,
      sortOrder: 5,
      services: [],
      createdAt: now,
      updatedAt: now,
    },
  ];
  const divisionMap = Object.fromEntries(divisions.map((d) => [d.slug, d]));

  let galleryItems = [
    { id: 1, divisionSlug: "foods", imageUrl: "/images/foods-banner.png", caption: "Catering preparation in progress", sortOrder: 0, createdAt: now },
    { id: 2, divisionSlug: "scents", imageUrl: "/images/scents-banner.png", caption: "Essential oil extraction and bottling", sortOrder: 0, createdAt: now },
    { id: 3, divisionSlug: "chems", imageUrl: "/images/chems-banner.png", caption: "Quality assurance laboratory testing", sortOrder: 0, createdAt: now },
  ];
  let galleryIdCounter = 10;

  let products = [
    { id: 1, divisionSlug: "foods", name: "Fredora Artisan Pastry Box", description: "Assorted gourmet pastries baked fresh daily.", price: "₦12,500", imageUrl: null, sortOrder: 0, createdAt: now },
    { id: 2, divisionSlug: "scents", name: "Elegance Extrait De Parfum (50ml)", description: "Long-lasting amber and woody floral extrait.", price: "₦28,000", imageUrl: null, sortOrder: 0, createdAt: now },
    { id: 3, divisionSlug: "chems", name: "Industrial Degreaser X-10 (20L)", description: "Heavy duty non-corrosive industrial cleaning formula.", price: "₦35,000", imageUrl: null, sortOrder: 0, createdAt: now },
  ];
  let productIdCounter = 10;

  let homepageData = {
    heroSlides: [
      { id: 1, imageUrl: "/images/hero-bg.png", sortOrder: 0, createdAt: now },
    ],
    aboutTitle: "Welcome to Fredora Multiconcept",
    aboutText: "We are a diversified conglomerate with a passion for excellence across food manufacturing, educational consulting, specialty chemistry, artisan fragrance, and logistics.",
    aboutImageUrl: null,
    missionTitle: "Our Mission",
    missionText: "To deliver exceptional value through innovative products and services.",
    visionTitle: "Our Vision",
    visionText: "To be a globally recognized leader in every sector we operate.",
    values: ["Integrity", "Excellence", "Innovation", "Customer Focus"],
    catalogueNotes: "Orders can be placed directly or through our WhatsApp hotline.",
    googleAnalyticsId: null,
  };
  let slideIdCounter = 10;

  let posts = [
    {
      id: 1,
      title: "Fredora Group Expands Logistics & Multi-Unit Distribution",
      slug: "fredora-group-expands-logistics",
      summary: "Fredora Multiconcept announces expanded freight routes across major commercial hubs.",
      content: "As part of our commitment to seamless delivery and supply chain excellence, Fredora Group has integrated new haulage assets across our Transport and Foods divisions.",
      imageUrl: "/images/transport-banner.png",
      published: true,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];
  let postIdCounter = 10;

  const uploadedFiles = new Map<string, { buffer: Buffer; contentType: string; name: string }>();
  const uploadMeta = new Map<string, { name: string; size: number; contentType: string }>();

  // ── TemperaMap Seed Data ──
  let passcodeCounter = 100;
  let passcodes: PasscodeRecord[] = [
    { id: 1, code: "TM-AB12CD", testType: "single_test", status: "active", maxUses: 1, currentUses: 0, expiresAt: null, createdAt: "2026-07-01T10:00:00.000Z", usedAt: null, usedBy: null },
    { id: 2, code: "TM-EF34GH", testType: "couples_test", status: "used", maxUses: 1, currentUses: 1, expiresAt: null, createdAt: "2026-07-02T14:30:00.000Z", usedAt: "2026-07-03T09:15:00.000Z", usedBy: "user-001" },
    { id: 3, code: "TM-JK56LM", testType: "single_test", status: "active", maxUses: 1, currentUses: 0, expiresAt: null, createdAt: "2026-07-05T08:00:00.000Z", usedAt: null, usedBy: null },
    { id: 4, code: "TM-NP78QR", testType: "group_test", status: "active", maxUses: 10, currentUses: 0, expiresAt: null, createdAt: "2026-07-08T16:45:00.000Z", usedAt: null, usedBy: null },
    { id: 5, code: "TM-FREE01", testType: "single_test", status: "active", maxUses: 100, currentUses: 0, expiresAt: null, createdAt: now, usedAt: null, usedBy: null },
    { id: 6, code: "TM-COUPLE", testType: "couples_test", status: "active", maxUses: 100, currentUses: 0, expiresAt: null, createdAt: now, usedAt: null, usedBy: null },
    { id: 7, code: "TM-CORP01", testType: "corporate_team", status: "active", maxUses: 100, currentUses: 0, expiresAt: null, createdAt: now, usedAt: null, usedBy: null },
  ];

  let testimonials: TestimonialRecord[] = [
    { id: "t-001", authorName: "Sarah Mitchell", company: "Wellness Co.", text: "TemperaMap gave our team incredible insight into how different temperaments interact. Communication improved dramatically.", rating: 5, createdAt: "2026-06-10T12:00:00.000Z" },
    { id: "t-002", authorName: "David Chen", company: "GrowthPath Consulting", text: "The couple assessment was eye-opening. My partner and I finally understood why we clash on certain decisions.", rating: 5, createdAt: "2026-06-18T09:30:00.000Z" },
    { id: "t-003", authorName: "Amara Johnson", company: "Harmony HR", text: "We use TemperaMap for all new hires. It helps managers understand how to motivate each individual from day one.", rating: 4, createdAt: "2026-06-25T15:00:00.000Z" },
    { id: "t-004", authorName: "Luca Fernández", company: "SelfDev Studio", text: "The blend results were surprisingly accurate. It felt like reading a personalized manual for myself.", rating: 5, createdAt: "2026-07-02T11:20:00.000Z" },
  ];

  let faqs: FaqRecord[] = [
    { id: "f-001", question: "What is TemperaMap?", answer: "TemperaMap is a psychometrically grounded assessment tool that evaluates the four classical temperaments (Sanguine, Choleric, Melancholic, Phlegmatic), blends, and interpersonal dynamics.", order: 1, createdAt: "2026-06-01T08:00:00.000Z" },
    { id: "f-002", question: "How long does the assessment take?", answer: "The comprehensive 60-question assessment takes approximately 10–15 minutes.", order: 2, createdAt: "2026-06-01T08:05:00.000Z" },
    { id: "f-003", question: "Can I retake the test or test our team?", answer: "Yes! Passcodes can be configured for single individuals, couples, or multi-member corporate teams.", order: 3, createdAt: "2026-06-01T08:10:00.000Z" },
    { id: "f-004", question: "What is a temperament blend?", answer: "A blend describes your primary and secondary temperaments (e.g. Melancholic-Phlegmatic or Choleric-Sanguine), showing the unique nuance of your personality.", order: 4, createdAt: "2026-06-01T08:15:00.000Z" },
    { id: "f-005", question: "Is my assessment data private?", answer: "Yes. All assessment data is stored securely and accessed only by you and your authorized organization administrators.", order: 5, createdAt: "2026-06-01T08:20:00.000Z" },
  ];

  let features: FeatureRecord[] = [
    { id: "feat-001", title: "Single Assessment", description: "Discover your unique temperament profile with our scientifically grounded assessment.", icon: "user", order: 1, createdAt: "2026-06-01T07:00:00.000Z" },
    { id: "feat-002", title: "Couple Compatibility", description: "Understand the dynamics between you and your partner. See where strengths complement and where friction arises.", icon: "heart", order: 2, createdAt: "2026-06-01T07:05:00.000Z" },
    { id: "feat-003", title: "Child & Youth Profiling", description: "Tailored age-appropriate assessments for children ages 3-5, 6-9, preteens 10-12, and teens 13-17.", icon: "baby", order: 3, createdAt: "2026-06-01T07:10:00.000Z" },
    { id: "feat-004", title: "Corporate Team Diagnostics", description: "Evaluate organizational blends, leadership styles, and communication patterns with automated team analytics.", icon: "briefcase", order: 4, createdAt: "2026-06-01T07:15:00.000Z" },
    { id: "feat-005", title: "Comprehensive PDF Reports", description: "Generate instant, beautifully designed downloadable PDF reports for personal development and counseling.", icon: "file-text", order: 5, createdAt: "2026-06-01T07:20:00.000Z" },
  ];

  let testSessions: TestSessionRecord[] = [
    {
      id: "s-001",
      userId: "u-001",
      userEmail: "admin@fredora.com",
      userName: "Fredora Administrator",
      testType: "single_test",
      status: "completed",
      paid: true,
      primaryTemp: "Melancholic",
      secondaryTemp: "Phlegmatic",
      blend: "Melancholic-Phlegmatic",
      results: { Melancholic: 42, Phlegmatic: 38, Sanguine: 22, Choleric: 18 },
      passcodeUsed: "TM-AB12CD",
      createdAt: "2026-06-15T10:00:00.000Z",
      completedAt: "2026-06-15T10:14:32.000Z",
    },
    {
      id: "s-002",
      userId: "u-002",
      userEmail: "bob@example.com",
      userName: "Bob Reyes",
      testType: "couples_test",
      status: "completed",
      paid: true,
      primaryTemp: "Choleric",
      secondaryTemp: "Sanguine",
      blend: "Choleric-Sanguine",
      results: { Choleric: 45, Sanguine: 35, Phlegmatic: 20, Melancholic: 15 },
      passcodeUsed: "TM-EF34GH",
      createdAt: "2026-06-18T14:00:00.000Z",
      completedAt: "2026-06-18T14:22:10.000Z",
    },
    {
      id: "s-003",
      userId: "u-003",
      userEmail: "carla@example.com",
      userName: "Carla Nguyen",
      testType: "single_test",
      status: "pending",
      paid: false,
      primaryTemp: null,
      secondaryTemp: null,
      blend: null,
      passcodeUsed: "TM-JK56LM",
      createdAt: "2026-07-06T09:30:00.000Z",
      completedAt: null,
    },
    {
      id: "s-007",
      userId: "u-004",
      userEmail: "derek@example.com",
      userName: "Derek Wilson",
      testType: "corporate_team",
      status: "completed",
      paid: true,
      primaryTemp: "Choleric",
      secondaryTemp: "Sanguine",
      blend: "Choleric-Sanguine",
      results: { Choleric: 48, Sanguine: 36, Phlegmatic: 18, Melancholic: 12 },
      passcodeUsed: "TM-CP01AA",
      createdAt: "2026-07-11T09:00:00.000Z",
      completedAt: "2026-07-11T09:16:40.000Z",
    },
    {
      id: "s-008",
      userId: "u-002",
      userEmail: "bob@example.com",
      userName: "Bob Reyes",
      testType: "corporate_team",
      status: "completed",
      paid: true,
      primaryTemp: "Sanguine",
      secondaryTemp: "Melancholic",
      blend: "Sanguine-Melancholic",
      results: { Sanguine: 44, Melancholic: 32, Choleric: 22, Phlegmatic: 16 },
      passcodeUsed: "TM-CP02BB",
      createdAt: "2026-07-11T09:05:00.000Z",
      completedAt: "2026-07-11T09:21:15.000Z",
    },
    {
      id: "s-009",
      userId: "u-005",
      userEmail: "emma@example.com",
      userName: "Emma Santos",
      testType: "corporate_team",
      status: "completed",
      paid: true,
      primaryTemp: "Melancholic",
      secondaryTemp: "Phlegmatic",
      blend: "Melancholic-Phlegmatic",
      results: { Melancholic: 46, Phlegmatic: 34, Sanguine: 20, Choleric: 14 },
      passcodeUsed: "TM-CP03CC",
      createdAt: "2026-07-11T09:10:00.000Z",
      completedAt: "2026-07-11T09:25:55.000Z",
    },
  ];

  let corporateTeams: CorporateTeamRecord[] = [
    {
      id: "ct-mock-001",
      adminId: "u-001",
      name: "Executive Leadership Squad",
      memberSessionIds: ["s-007", "s-008", "s-009"],
      report: null,
      createdAt: "2026-07-12T08:00:00.000Z",
      updatedAt: "2026-07-12T08:00:00.000Z",
    },
  ];

  let users: UserRecord[] = [
    {
      id: "u-001",
      email: "admin@fredora.com",
      password: "password123",
      firstName: "Fredora",
      lastName: "Admin",
      role: "admin",
      createdAt: "2026-05-15T08:00:00.000Z",
      lastLogin: now,
    },
    {
      id: "u-002",
      email: "bob@example.com",
      password: "password123",
      firstName: "Bob",
      lastName: "Reyes",
      role: "user",
      createdAt: "2026-06-01T12:00:00.000Z",
      lastLogin: now,
    },
    {
      id: "u-003",
      email: "carla@example.com",
      password: "password123",
      firstName: "Carla",
      lastName: "Nguyen",
      role: "user",
      createdAt: "2026-06-20T09:00:00.000Z",
      lastLogin: now,
    },
  ];

  const sessions = new Map<string, string>();

  function parseCookies(header: string | undefined): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!header) return cookies;
    for (const pair of header.split(";")) {
      const [k, ...v] = pair.split("=");
      if (k) cookies[k.trim()] = decodeURIComponent(v.join("="));
    }
    return cookies;
  }

  function generatePasscode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "TM-";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }

  function parseQuery(raw: string): Record<string, string> {
    const qs = raw.includes("?") ? raw.split("?")[1] : "";
    const params: Record<string, string> = {};
    if (!qs) return params;
    for (const pair of qs.split("&")) {
      const [k, v] = pair.split("=");
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
    }
    return params;
  }

  async function readBody(req: any): Promise<any> {
    let body = "";
    for await (const chunk of req) body += chunk;
    if (!body) return {};
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  async function readRawBody(req: any): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    return Buffer.concat(chunks);
  }

  const apiMiddleware = async (req: any, res: any, next: any) => {
    const url = (req.url ?? "").split("?")[0];
    if (!url.startsWith("/api")) return next();
        res.setHeader("Content-Type", "application/json");
        const cookies = parseCookies(req.headers.cookie);

        // ── Health Check ──
        if (url === "/api/healthz" || url === "/api/health") {
          return res.end(JSON.stringify({ status: "ok" }));
        }

        // ── Storage: Uploads & Object Serving ──
        if (req.method === "POST" && url === "/api/storage/uploads/request-url") {
          const body = await readBody(req);
          const fileId = "upload-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
          const objectPath = `/objects/${fileId}`;
          uploadMeta.set(fileId, {
            name: body.name || "image",
            size: Number(body.size) || 0,
            contentType: body.contentType || "image/jpeg",
          });
          return res.end(JSON.stringify({
            uploadURL: `/api/storage/uploads/direct/${fileId}`,
            objectPath,
            metadata: { name: body.name, size: body.size, contentType: body.contentType },
          }));
        }

        const uploadDirectMatch = url.match(/^\/api\/storage\/uploads\/direct\/(.+)$/);
        if (req.method === "PUT" && uploadDirectMatch) {
          const fileId = uploadDirectMatch[1];
          const buffer = await readRawBody(req);
          const meta = uploadMeta.get(fileId) || {
            name: fileId,
            size: buffer.length,
            contentType: (req.headers["content-type"] as string) || "image/jpeg",
          };
          const contentType = (req.headers["content-type"] as string) || meta.contentType || "image/jpeg";
          uploadedFiles.set(fileId, { buffer, contentType, name: meta.name });

          try {
            const uploadsDir = path.resolve(import.meta.dirname, "public", "uploads");
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            fs.writeFileSync(path.join(uploadsDir, fileId), buffer);
          } catch (e) {
            // ignore disk errors
          }

          return res.end(JSON.stringify({ ok: true, objectPath: `/objects/${fileId}` }));
        }

        const objectMatch = url.match(/^\/api\/storage\/objects\/(.+)$/);
        if (req.method === "GET" && objectMatch) {
          const fileId = objectMatch[1];
          const file = uploadedFiles.get(fileId);
          if (file) {
            res.setHeader("Content-Type", file.contentType);
            res.setHeader("Cache-Control", "public, max-age=86400");
            return res.end(file.buffer);
          }
          try {
            const filePath = path.resolve(import.meta.dirname, "public", "uploads", fileId);
            if (fs.existsSync(filePath)) {
              const buf = fs.readFileSync(filePath);
              res.setHeader("Content-Type", "image/jpeg");
              res.setHeader("Cache-Control", "public, max-age=86400");
              return res.end(buf);
            }
          } catch (e) {}
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: "File not found" }));
        }

        const publicObjectMatch = url.match(/^\/api\/storage\/public-objects\/(.+)$/);
        if (req.method === "GET" && publicObjectMatch) {
          const subPath = publicObjectMatch[1];
          try {
            const filePath = path.resolve(import.meta.dirname, "public", subPath);
            if (fs.existsSync(filePath)) {
              const buf = fs.readFileSync(filePath);
              res.setHeader("Cache-Control", "public, max-age=86400");
              return res.end(buf);
            }
          } catch (e) {}
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: "Public file not found" }));
        }

        // ── Fredora Conglomerate Endpoints ──
        if (req.method === "GET" && url === "/api/divisions") {
          return res.end(JSON.stringify(divisions));
        }

        const divMatch = url.match(/^\/api\/divisions\/(.+)$/);
        if (req.method === "GET" && divMatch) {
          const div = divisionMap[divMatch[1]];
          return res.end(JSON.stringify(div ?? null));
        }

        if (req.method === "PUT" && divMatch) {
          const slug = divMatch[1];
          const body = await readBody(req);
          const div = divisionMap[slug];
          if (!div) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Division not found" }));
          }
          Object.assign(div, body, { updatedAt: new Date().toISOString() });
          return res.end(JSON.stringify(div));
        }

        // ── Services ──
        if (req.method === "GET" && url.startsWith("/api/services")) {
          const params = parseQuery(req.url ?? "");
          let allServices = divisions.flatMap((d) => d.services || []);
          if (params.divisionSlug) {
            allServices = allServices.filter((s: any) => s.divisionSlug === params.divisionSlug);
          }
          return res.end(JSON.stringify(allServices));
        }

        const serviceIdMatch = url.match(/^\/api\/services\/(\d+)$/);
        if (req.method === "PATCH" && serviceIdMatch) {
          const sId = Number(serviceIdMatch[1]);
          const body = await readBody(req);
          for (const div of divisions) {
            const s = div.services?.find((srv: any) => srv.id === sId);
            if (s) {
              Object.assign(s, body);
              return res.end(JSON.stringify(s));
            }
          }
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: "Service not found" }));
        }

        if (req.method === "POST" && url === "/api/services") {
          const body = await readBody(req);
          const div = divisionMap[body.divisionSlug];
          const newService = {
            id: Date.now(),
            divisionSlug: body.divisionSlug,
            name: body.name,
            description: body.description || null,
            price: body.price || null,
            imageUrl: body.imageUrl || null,
            sortOrder: (div?.services?.length ?? 0),
          };
          if (div) {
            div.services = div.services || [];
            div.services.push(newService);
          }
          res.statusCode = 201;
          return res.end(JSON.stringify(newService));
        }

        // ── Gallery ──
        if (req.method === "GET" && url.startsWith("/api/gallery")) {
          const params = parseQuery(req.url ?? "");
          let result = [...galleryItems];
          if (params.divisionSlug) {
            result = result.filter((g) => g.divisionSlug === params.divisionSlug);
          }
          result.sort((a, b) => a.sortOrder - b.sortOrder);
          return res.end(JSON.stringify(result));
        }

        if (req.method === "POST" && url === "/api/gallery") {
          const body = await readBody(req);
          const item = {
            id: galleryIdCounter++,
            divisionSlug: body.divisionSlug,
            imageUrl: body.imageUrl,
            caption: body.caption || null,
            sortOrder: body.sortOrder ?? galleryItems.length,
            createdAt: new Date().toISOString(),
          };
          galleryItems.push(item);
          res.statusCode = 201;
          return res.end(JSON.stringify(item));
        }

        const delGalleryMatch = url.match(/^\/api\/gallery\/(\d+)$/);
        if (req.method === "DELETE" && delGalleryMatch) {
          const id = Number(delGalleryMatch[1]);
          galleryItems = galleryItems.filter((g) => g.id !== id);
          return res.end(JSON.stringify({ success: true }));
        }

        // ── Products ──
        if (req.method === "GET" && url.startsWith("/api/products")) {
          const params = parseQuery(req.url ?? "");
          let result = [...products];
          if (params.divisionSlug) {
            result = result.filter((p) => p.divisionSlug === params.divisionSlug);
          }
          result.sort((a, b) => a.sortOrder - b.sortOrder);
          return res.end(JSON.stringify(result));
        }

        if (req.method === "POST" && url === "/api/products") {
          const body = await readBody(req);
          const prod = {
            id: productIdCounter++,
            divisionSlug: body.divisionSlug,
            name: body.name,
            description: body.description || null,
            price: body.price || null,
            imageUrl: body.imageUrl || null,
            sortOrder: body.sortOrder ?? products.length,
            createdAt: new Date().toISOString(),
          };
          products.push(prod);
          res.statusCode = 201;
          return res.end(JSON.stringify(prod));
        }

        const delProductMatch = url.match(/^\/api\/products\/(\d+)$/);
        if (req.method === "DELETE" && delProductMatch) {
          const id = Number(delProductMatch[1]);
          products = products.filter((p) => p.id !== id);
          return res.end(JSON.stringify({ success: true }));
        }

        // ── Homepage & Hero Slides ──
        if (req.method === "GET" && url === "/api/homepage") {
          return res.end(JSON.stringify(homepageData));
        }

        if (req.method === "PUT" && url === "/api/homepage") {
          const body = await readBody(req);
          Object.assign(homepageData, body);
          return res.end(JSON.stringify(homepageData));
        }

        if (req.method === "GET" && url === "/api/hero-slides") {
          return res.end(JSON.stringify(homepageData.heroSlides));
        }

        if (req.method === "POST" && url === "/api/hero-slides") {
          const body = await readBody(req);
          const slide = {
            id: slideIdCounter++,
            imageUrl: body.imageUrl,
            sortOrder: body.sortOrder ?? homepageData.heroSlides.length,
            createdAt: new Date().toISOString(),
          };
          homepageData.heroSlides.push(slide);
          res.statusCode = 201;
          return res.end(JSON.stringify(slide));
        }

        const delSlideMatch = url.match(/^\/api\/hero-slides\/(\d+)$/);
        if (req.method === "DELETE" && delSlideMatch) {
          const id = Number(delSlideMatch[1]);
          homepageData.heroSlides = homepageData.heroSlides.filter((s: any) => s.id !== id);
          return res.end(JSON.stringify({ success: true }));
        }

        // ── News / Posts ──
        if (req.method === "GET" && url.startsWith("/api/posts")) {
          const slugMatch = url.match(/^\/api\/posts\/([^/]+)$/);
          if (slugMatch) {
            const idOrSlug = slugMatch[1];
            const p = posts.find((x) => x.slug === idOrSlug || String(x.id) === idOrSlug);
            return res.end(JSON.stringify(p ?? null));
          }
          return res.end(JSON.stringify(posts));
        }

        if (req.method === "POST" && url === "/api/posts") {
          const body = await readBody(req);
          const newPost = {
            id: postIdCounter++,
            title: body.title,
            slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            summary: body.summary || body.excerpt || "",
            content: body.content || "",
            imageUrl: body.imageUrl || null,
            published: body.published ?? true,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          posts.unshift(newPost);
          res.statusCode = 201;
          return res.end(JSON.stringify(newPost));
        }

        const delPostMatch = url.match(/^\/api\/posts\/(\d+)$/);
        if (req.method === "DELETE" && delPostMatch) {
          const id = Number(delPostMatch[1]);
          posts = posts.filter((p) => p.id !== id);
          return res.end(JSON.stringify({ success: true }));
        }

        if (req.method === "GET" && url === "/api/newsletter-subscribers") return res.end(JSON.stringify([]));
        // ── Admin Auth ──
        if (req.method === "POST" && url === "/api/admin/login") {
          const body = await readBody(req);
          if (body.username === "admin" || body.password === "admin" || body.password === "password" || body.password === "isaac" || body.password === "changeme") {
            const adminSessionObj = { id: 1, username: body.username || "admin", loggedIn: true };
            sessions.set("admin_session", "u-001");
            res.setHeader("Set-Cookie", "admin_session=active; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400");
            return res.end(JSON.stringify(adminSessionObj));
          }
          res.statusCode = 401;
          return res.end(JSON.stringify({ error: "Invalid username or password" }));
        }

        if (req.method === "POST" && url === "/api/admin/logout") {
          sessions.delete("admin_session");
          res.setHeader("Set-Cookie", "admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
          return res.end(JSON.stringify({ success: true }));
        }

        if (req.method === "GET" && url === "/api/admin/me") {
          const adminCookie = cookies.admin_session;
          if (adminCookie === "active" || sessions.has("admin_session")) {
            return res.end(JSON.stringify({ id: 1, username: "admin", loggedIn: true }));
          }
          return res.end(JSON.stringify(null));
        }

        if (req.method === "GET" && url === "/api/admin/stats") {
          return res.end(JSON.stringify({ visitors: 0, totalDivisions: 6, totalProducts: 0, totalMessages: 0 }));
        }

        // ── TemperaMap Auth ───────────────────────────────────────────────
        const sessionToken = cookies.tm_session;
        const sessionUserId = sessionToken ? sessions.get(sessionToken) : undefined;

        if (req.method === "GET" && url === "/api/tm/auth/me") {
          if (!sessionUserId) return res.end(JSON.stringify(null));
          const user = users.find((u) => u.id === sessionUserId);
          if (!user) return res.end(JSON.stringify(null));
          return res.end(JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.createdAt,
          }));
        }

        if (req.method === "POST" && url === "/api/tm/auth/login") {
          const body = await readBody(req);
          const user = users.find((u) => u.email === body.email && u.password === body.password);
          if (!user) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: "Invalid email or password" }));
          }
          const token = crypto.randomUUID();
          sessions.set(token, user.id);
          res.setHeader("Set-Cookie", `tm_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
          return res.end(JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.createdAt,
          }));
        }

        if (req.method === "POST" && url === "/api/tm/auth/register") {
          const body = await readBody(req);
          if (users.find((u) => u.email === body.email)) {
            res.statusCode = 409;
            return res.end(JSON.stringify({ error: "Email already registered" }));
          }
          const newUser: UserRecord = {
            id: `u-${crypto.randomUUID().slice(0, 8)}`,
            email: body.email,
            password: body.password,
            firstName: body.firstName || null,
            lastName: body.lastName || null,
            role: "user",
            createdAt: new Date().toISOString(),
            lastLogin: null,
          };
          users.push(newUser);
          const token = crypto.randomUUID();
          sessions.set(token, newUser.id);
          res.setHeader("Set-Cookie", `tm_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
          return res.end(JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            createdAt: newUser.createdAt,
            updatedAt: newUser.createdAt,
          }));
        }

        if (req.method === "POST" && url === "/api/tm/auth/logout") {
          if (sessionToken) sessions.delete(sessionToken);
          res.setHeader("Set-Cookie", "tm_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
          return res.end(JSON.stringify({ ok: true }));
        }

        if (req.method === "POST" && url === "/api/tm/auth/change-password") {
          const body = await readBody(req);
          if (!sessionUserId) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: "Unauthorized" }));
          }
          const user = users.find((u) => u.id === sessionUserId);
          if (!user || user.password !== body.currentPassword) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: "Incorrect current password" }));
          }
          user.password = body.newPassword;
          return res.end(JSON.stringify({ ok: true }));
        }

        // ── Passcodes CRUD & Validation ──────────────────────────────────
        if (req.method === "GET" && url === "/api/passcodes") {
          return res.end(JSON.stringify(passcodes));
        }

        if (req.method === "POST" && url === "/api/passcodes") {
          const body = await readBody(req);
          const { testType, maxUses = 1, expiresAt = null } = body;
          const code = generatePasscode();
          passcodeCounter += 1;
          const record: PasscodeRecord = {
            id: passcodeCounter,
            code,
            testType,
            status: "active",
            maxUses: Number(maxUses) || 1,
            currentUses: 0,
            expiresAt: expiresAt || null,
            createdAt: new Date().toISOString(),
            usedAt: null,
            usedBy: null,
          };
          passcodes.unshift(record);
          return res.end(JSON.stringify(record));
        }

        if (req.method === "POST" && url === "/api/passcodes/validate") {
          const body = await readBody(req);
          const { code, testType } = body;
          const match = passcodes.find(
            (p) =>
              p.code.toUpperCase() === (code || "").toUpperCase() &&
              (p.status === "active" || p.currentUses < p.maxUses) &&
              (!testType || p.testType === testType || testType === "couples_test" && p.testType === "couple_test"),
          );
          if (match) {
            return res.end(JSON.stringify({ valid: true, passcode: match }));
          }
          return res.end(JSON.stringify({ valid: false, message: "Invalid or expired passcode for this test type" }));
        }

        // ── Test Sessions ─────────────────────────────────────────────────
        if (req.method === "GET" && url === "/api/tests") {
          const params = parseQuery(req.url ?? "");
          let result = [...testSessions];
          if (params.userId) {
            result = result.filter((s) => s.userId === params.userId);
          }
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return res.end(JSON.stringify(result));
        }

        if (req.method === "POST" && url === "/api/tests") {
          const body = await readBody(req);
          const { testType, passcode: passcodeVal, userId, partnerSessionId } = body;
          const match = passcodes.find((p) => p.code.toUpperCase() === (passcodeVal || "").toUpperCase());
          if (match) {
            match.currentUses = (match.currentUses || 0) + 1;
            if (match.currentUses >= match.maxUses) {
              match.status = "used";
            }
            match.usedAt = new Date().toISOString();
            match.usedBy = userId || "tm-user";
          }
          const id = crypto.randomUUID();
          const currentUser = users.find((u) => u.id === (userId || sessionUserId));
          const newSession: TestSessionRecord = {
            id,
            userId: userId || sessionUserId || "guest-user",
            userEmail: currentUser?.email || "guest@temperamap.com",
            userName: currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Guest" : "Guest",
            testType: testType || "single_test",
            status: "paid",
            paid: true,
            primaryTemp: null,
            secondaryTemp: null,
            blend: null,
            passcodeUsed: passcodeVal || "FREE-ACCESS",
            partnerSessionId: partnerSessionId || null,
            createdAt: new Date().toISOString(),
            completedAt: null,
          };
          testSessions.unshift(newSession);
          return res.end(JSON.stringify({ id, session: newSession }));
        }

        if (req.method === "GET" && url.startsWith("/api/tests/")) {
          const id = url.split("/")[3];
          const found = testSessions.find((s) => s.id === id);
          if (found) {
            return res.end(JSON.stringify(found));
          }
          return res.end(JSON.stringify({
            id,
            testType: "single_test",
            status: "paid",
            paid: true,
            results: null,
            primaryTemp: null,
            secondaryTemp: null,
            blend: null,
            completedAt: null,
          }));
        }

        if (req.method === "PATCH" && url.startsWith("/api/tests/")) {
          const id = url.split("/")[3];
          const body = await readBody(req);
          const idx = testSessions.findIndex((s) => s.id === id);
          if (idx !== -1) {
            testSessions[idx] = { ...testSessions[idx], ...body, id };
            return res.end(JSON.stringify(testSessions[idx]));
          }
          return res.end(JSON.stringify({ ok: true }));
        }

        // ── Public Testimonials, FAQs, Features ───────────────────────────
        if (req.method === "GET" && url === "/api/testimonials") {
          const sorted = [...testimonials].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          return res.end(JSON.stringify(sorted));
        }

        if (req.method === "GET" && url === "/api/faqs") {
          return res.end(JSON.stringify([...faqs].sort((a, b) => a.order - b.order)));
        }

        if (req.method === "GET" && url === "/api/features") {
          return res.end(JSON.stringify([...features].sort((a, b) => a.order - b.order)));
        }

        // ── Admin: Testimonials CRUD ──────────────────────────────────────
        if (req.method === "GET" && url === "/api/admin/testimonials") {
          const sorted = [...testimonials].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          return res.end(JSON.stringify(sorted));
        }

        if (req.method === "POST" && url === "/api/admin/testimonials") {
          const body = await readBody(req);
          const record: TestimonialRecord = {
            id: `t-${crypto.randomUUID().slice(0, 8)}`,
            authorName: body.authorName,
            company: body.company,
            text: body.text,
            rating: Number(body.rating) || 5,
            createdAt: new Date().toISOString(),
          };
          testimonials.push(record);
          return res.end(JSON.stringify(record));
        }

        if (req.method === "PUT" && url.match(/^\/api\/admin\/testimonials\/.+$/)) {
          const id = url.split("/").pop()!;
          const body = await readBody(req);
          const idx = testimonials.findIndex((t) => t.id === id);
          if (idx === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Testimonial not found" }));
          }
          testimonials[idx] = { ...testimonials[idx], ...body, id };
          return res.end(JSON.stringify(testimonials[idx]));
        }

        if (req.method === "DELETE" && url.match(/^\/api\/admin\/testimonials\/.+$/)) {
          const id = url.split("/").pop()!;
          const idx = testimonials.findIndex((t) => t.id === id);
          if (idx !== -1) testimonials.splice(idx, 1);
          return res.end(JSON.stringify({ deleted: true }));
        }

        // ── Admin: FAQs CRUD ──────────────────────────────────────────────
        if (req.method === "GET" && url === "/api/admin/faqs") {
          return res.end(JSON.stringify([...faqs].sort((a, b) => a.order - b.order)));
        }

        if (req.method === "POST" && url === "/api/admin/faqs") {
          const body = await readBody(req);
          const maxOrder = faqs.reduce((max, f) => Math.max(max, f.order), 0);
          const record: FaqRecord = {
            id: `f-${crypto.randomUUID().slice(0, 8)}`,
            question: body.question,
            answer: body.answer,
            order: maxOrder + 1,
            createdAt: new Date().toISOString(),
          };
          faqs.push(record);
          return res.end(JSON.stringify(record));
        }

        if (req.method === "PUT" && url.match(/^\/api\/admin\/faqs\/.+$/)) {
          const id = url.split("/").pop()!;
          const body = await readBody(req);
          const idx = faqs.findIndex((f) => f.id === id);
          if (idx === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "FAQ not found" }));
          }
          faqs[idx] = { ...faqs[idx], ...body, id };
          return res.end(JSON.stringify(faqs[idx]));
        }

        if (req.method === "DELETE" && url.match(/^\/api\/admin\/faqs\/.+$/)) {
          const id = url.split("/").pop()!;
          const idx = faqs.findIndex((f) => f.id === id);
          if (idx !== -1) faqs.splice(idx, 1);
          return res.end(JSON.stringify({ deleted: true }));
        }

        if (req.method === "PATCH" && url === "/api/admin/faqs/reorder") {
          const body = await readBody(req);
          const { ids } = body as { ids: string[] };
          if (Array.isArray(ids)) {
            ids.forEach((id, i) => {
              const faq = faqs.find((f) => f.id === id);
              if (faq) faq.order = i + 1;
            });
          }
          return res.end(JSON.stringify([...faqs].sort((a, b) => a.order - b.order)));
        }

        // ── Admin: Features CRUD ──────────────────────────────────────────
        if (req.method === "GET" && url === "/api/admin/features") {
          return res.end(JSON.stringify([...features].sort((a, b) => a.order - b.order)));
        }

        if (req.method === "POST" && url === "/api/admin/features") {
          const body = await readBody(req);
          const maxOrder = features.reduce((max, f) => Math.max(max, f.order), 0);
          const record: FeatureRecord = {
            id: `feat-${crypto.randomUUID().slice(0, 8)}`,
            title: body.title,
            description: body.description,
            icon: body.icon || "star",
            order: maxOrder + 1,
            createdAt: new Date().toISOString(),
          };
          features.push(record);
          return res.end(JSON.stringify(record));
        }

        if (req.method === "PUT" && url.match(/^\/api\/admin\/features\/.+$/)) {
          const id = url.split("/").pop()!;
          const body = await readBody(req);
          const idx = features.findIndex((f) => f.id === id);
          if (idx === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Feature not found" }));
          }
          features[idx] = { ...features[idx], ...body, id };
          return res.end(JSON.stringify(features[idx]));
        }

        if (req.method === "DELETE" && url.match(/^\/api\/admin\/features\/.+$/)) {
          const id = url.split("/").pop()!;
          const idx = features.findIndex((f) => f.id === id);
          if (idx !== -1) features.splice(idx, 1);
          return res.end(JSON.stringify({ deleted: true }));
        }

        if (req.method === "PATCH" && url === "/api/admin/features/reorder") {
          const body = await readBody(req);
          const { ids } = body as { ids: string[] };
          if (Array.isArray(ids)) {
            ids.forEach((id, i) => {
              const feat = features.find((f) => f.id === id);
              if (feat) feat.order = i + 1;
            });
          }
          return res.end(JSON.stringify([...features].sort((a, b) => a.order - b.order)));
        }

        // ── Admin: Clear All Data Endpoints ──────────────────────────────
        if (req.method === "DELETE" && url === "/api/admin/testimonials/all") {
          testimonials = [];
          return res.end(JSON.stringify({ ok: true, cleared: "testimonials" }));
        }
        if (req.method === "DELETE" && url === "/api/admin/faqs/all") {
          faqs = [];
          return res.end(JSON.stringify({ ok: true, cleared: "faqs" }));
        }
        if (req.method === "DELETE" && url === "/api/admin/features/all") {
          features = [];
          return res.end(JSON.stringify({ ok: true, cleared: "features" }));
        }

        // ── Admin: Sessions Stats & List ──────────────────────────────────
        if (req.method === "GET" && url === "/api/admin/sessions/stats") {
          const total = testSessions.length;
          const byStatus: Record<string, number> = {};
          const byType: Record<string, number> = {};
          const temperamentDistribution: Record<string, number> = {};
          const userSet = new Set<string>();

          for (const s of testSessions) {
            byStatus[s.status] = (byStatus[s.status] || 0) + 1;
            byType[s.testType] = (byType[s.testType] || 0) + 1;
            userSet.add(s.userId);
            if (s.primaryTemp) {
              temperamentDistribution[s.primaryTemp] = (temperamentDistribution[s.primaryTemp] || 0) + 1;
            }
            if (s.secondaryTemp) {
              temperamentDistribution[s.secondaryTemp] = (temperamentDistribution[s.secondaryTemp] || 0) + 1;
            }
          }

          const totalPasscodesGenerated = passcodes.length;
          const totalPasscodesUsed = passcodes.reduce((sum, p) => sum + (p.currentUses || 0), 0);

          return res.end(JSON.stringify({
            total,
            byStatus,
            byType,
            temperamentDistribution,
            totalUsers: userSet.size,
            totalPasscodesUsed,
            totalPasscodesGenerated,
          }));
        }

        if (req.method === "GET" && url === "/api/admin/sessions") {
          const params = parseQuery(req.url ?? "");
          let result = [...testSessions];
          if (params.status) {
            result = result.filter((s) => s.status === params.status);
          }
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return res.end(JSON.stringify(result));
        }

        if (req.method === "DELETE" && url.match(/^\/api\/admin\/sessions\/.+$/)) {
          const id = url.split("/").pop()!;
          const idx = testSessions.findIndex((s) => s.id === id);
          if (idx === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Not found" }));
          }
          const session = testSessions[idx];
          if (session.status !== "pending") {
            res.statusCode = 409;
            return res.end(JSON.stringify({ error: "Only pending sessions can be deleted" }));
          }
          testSessions.splice(idx, 1);
          return res.end(JSON.stringify({ ok: true, freedPasscode: session.passcodeUsed || null }));
        }

        // ── Admin: Users ──────────────────────────────────────────────────
        if (req.method === "GET" && url === "/api/admin/users") {
          const sorted = [...users]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(({ password: _, ...u }) => u);
          return res.end(JSON.stringify(sorted));
        }

        // ── Corporate Teams ────────────────────────────────────────────────
        if (req.method === "GET" && url === "/api/corporate/sessions") {
          const corporate = testSessions.filter((s) => s.testType === "corporate_team");
          return res.end(JSON.stringify(corporate));
        }

        if (req.method === "GET" && url === "/api/corporate/teams") {
          return res.end(JSON.stringify(corporateTeams));
        }

        if (req.method === "POST" && url === "/api/corporate/teams") {
          const parsed = await readBody(req);
          if (!parsed.name || !Array.isArray(parsed.memberSessionIds) || parsed.memberSessionIds.length < 2) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: "Name and at least 2 member sessions required" }));
          }
          const team: CorporateTeamRecord = {
            id: `ct-mock-${Date.now().toString(36)}`,
            adminId: "u-001",
            name: parsed.name,
            memberSessionIds: parsed.memberSessionIds,
            report: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          corporateTeams.unshift(team);
          res.statusCode = 201;
          return res.end(JSON.stringify(team));
        }

        if (req.method === "POST" && url.match(/^\/api\/corporate\/teams\/[^/]+\/report$/)) {
          const teamId = url.split("/")[4];
          const team = corporateTeams.find((t) => t.id === teamId);
          if (!team) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Team not found" }));
          }
          if (team.report) {
            return res.end(JSON.stringify({ ...team.report, cached: true }));
          }
          const memberSessions = team.memberSessionIds
            .map((id) => testSessions.find((s) => s.id === id))
            .filter((s): s is TestSessionRecord => Boolean(s));
          const members = memberSessions.map((s) => ({
            memberId: s.id,
            memberName: s.userName || s.userEmail || "Team Member",
            primaryTemp: s.primaryTemp || "Sanguine",
            secondaryTemp: s.secondaryTemp || null,
            results: s.results || {},
            workplace: s.workplace || null,
          }));
          const payload = {
            team: { ...team, report: undefined },
            members,
            primaryTemps: members.map((m) => m.primaryTemp),
            cachedAt: new Date().toISOString(),
          };
          team.report = payload;
          return res.end(JSON.stringify({ ...payload, cached: false }));
        }

        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Not found" }));
  };

  return {
    name: "mock-api",
    configureServer(server) {
      server.middlewares.use(apiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware);
    },
  };
}

// ── Environment Configuration with Safe Fallbacks ────────────────────────────

const port = Number(process.env.PORT || "5000");
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [
    mockApiPlugin(),
    react(),
    tailwindcss(),
    ...(process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});

