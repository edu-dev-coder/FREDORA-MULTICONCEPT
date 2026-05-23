import PDFDocument from "pdfkit";

// ─── Brand ───────────────────────────────────────────────────────────────────
const B = {
  blue:   "#1B3A6B",
  blueMid:"#2A4F8A",
  blueLight:"#3B6FBF",
  gold:   "#C8961E",
  goldLight:"#F0BB5A",
  white:  "#FFFFFF",
  offWhite:"#F8FAFD",
  slate:  "#475569",
  slateLight:"#94A3B8",
  border: "#E2E8F0",
  text:   "#1E293B",
  Sanguine:   "#D97706",
  Choleric:   "#DC2626",
  Melancholic:"#2563EB",
  Phlegmatic: "#16A34A",
};

// ─── Static content ───────────────────────────────────────────────────────────
const TEMPERAMENT_INFO: Record<string, {
  headline: string; description: string; relationships: string;
  emotionalProfile: { angerStyle: string; underStress: string; coreFear: string; coreNeed: string };
  famousExamples: string[];
}> = {
  Sanguine: {
    headline: "The Enthusiastic Optimist",
    description: "You are the person who walks into a room and shifts the energy — warm, expressive, and genuinely magnetic. You experience life at full volume: your highs are brilliant and contagious, and your love for people is completely authentic. Where others see obstacles, you instinctively see possibilities, and your enthusiasm is not performance — it is who you are.",
    relationships: "You are deeply affectionate, spontaneous, and full of romantic energy. You thrive where there is laughter, affirmation, and shared adventure. Your love language is words of affirmation and quality time — you need your partner to verbally celebrate you. You can struggle with emotional inconsistency and monotony in long-term relationships, and your natural optimism can sometimes prevent you from addressing deeper relational issues that need honest, uncomfortable conversation.",
    emotionalProfile: { angerStyle: "Flares up quickly and loudly but cools down fast — rarely holds lasting grudges", underStress: "Talks more, scatters energy, seeks distraction and social escapism", coreFear: "Rejection, being unloved, or being seen as a failure by those who matter", coreNeed: "Approval, verbal affirmation, and genuine social connection" },
    famousExamples: ["Peter the Apostle", "Oprah Winfrey", "Robin Williams", "Bill Clinton"],
  },
  Choleric: {
    headline: "The Bold Leader",
    description: "You are built for impact — decisive, driven, and absolutely certain of where you are going. You don't wait for permission to lead; you step forward naturally when others hesitate. Your capacity for work, your self-reliance, and your refusal to accept mediocrity make you one of the most formidably effective temperaments when properly directed.",
    relationships: "You are intensely loyal, protective, and deeply committed once you choose someone. You love with action — fixing problems, providing, and going to war for those you care about. However, your directness can wound without warning, and your need for control can turn a relationship into a power dynamic. Your relationships will flourish when you learn that vulnerability is not weakness — it is the deepest bridge between two people.",
    emotionalProfile: { angerStyle: "Hot, direct, and confrontational — says sharp things they may later regret", underStress: "Becomes domineering, hypercritical, and controlling under pressure", coreFear: "Losing control, being seen as weak, incompetent, or taken advantage of", coreNeed: "Loyalty, measurable results, and genuine freedom to lead" },
    famousExamples: ["Winston Churchill", "Steve Jobs", "Paul the Apostle", "Margaret Thatcher"],
  },
  Melancholic: {
    headline: "The Deep Thinker",
    description: "You experience life with extraordinary depth and sensitivity — where others skim the surface, you dive. Your inner world is rich, complex, and constantly active, and your eye for beauty, meaning, and pattern gives you gifts that most people simply do not possess. You feel both deeply and quietly, love faithfully and thoroughly, and hold yourself to a standard of excellence.",
    relationships: "You love faithfully, thoughtfully, and with extraordinary depth — you remember the details, anniversaries, preferences, and exact words said on significant days. You are not easily impressed, but once you love someone, you love them profoundly and lastingly. You can struggle to communicate your emotional needs openly, and your tendency to withdraw when hurt can leave partners confused and shut out.",
    emotionalProfile: { angerStyle: "Slow to anger but deeply wounded — may simmer silently for extended periods", underStress: "Withdraws inward, becomes self-critical, moody, and emotionally unavailable", coreFear: "Criticism, failure, and being exposed as imperfect or not enough", coreNeed: "Quality interactions, genuine understanding, deep connection, and time to process" },
    famousExamples: ["Abraham Lincoln", "Ludwig van Beethoven", "Isaac Newton", "Mother Teresa"],
  },
  Phlegmatic: {
    headline: "The Steady Peacemaker",
    description: "You are the human anchor — the person everyone else instinctively gravitates toward when the world becomes uncertain, chaotic, or tense. Your calmness is not passivity; it is a deeply rooted steadiness that comes from knowing who you are. You are unfailingly kind, remarkably patient, and one of the most genuinely trustworthy people in any room.",
    relationships: "You are one of the most patient, accepting, and dependable romantic partners. You rarely trigger conflict and almost always put your partner's peace above your own comfort. You show love through consistency, steadiness, and quiet acts of reliable presence. However, suppressing your own needs to preserve harmony can breed quiet resentment over time — sharing your inner life is not a burden; it is a gift.",
    emotionalProfile: { angerStyle: "Avoids conflict entirely; anger surfaces as passive resistance or quiet withdrawal", underStress: "Shuts down emotionally, becomes stubborn, retreats into comfortable routine", coreFear: "Conflict, confrontation, instability, and the loss of relational peace", coreNeed: "Genuine stability, mutual respect, consistent peace, and time to adapt" },
    famousExamples: ["Mahatma Gandhi", "Fred Rogers (Mr. Rogers)", "Queen Elizabeth II", "Abraham (Patriarch)"],
  },
};

const STRENGTHS: Record<string, string[]> = {
  Sanguine: ["Radiantly charismatic — shifts the energy of any room instantly", "Makes strangers feel like old friends within minutes", "Naturally optimistic — sees opportunity where others see problems", "Gifted storyteller with an instinct for humor and connection", "Quick to forgive and genuinely slow to hold grudges", "Creative and spontaneous — generates fresh ideas constantly", "Natural encourager who lifts team morale effortlessly", "Emotionally expressive — people always know where they stand"],
  Choleric: ["Natural commanding leader — takes charge when others freeze", "Decisively cuts through ambiguity and acts under pressure", "Visionary thinker — sees the destination and architects the path", "Relentlessly competitive with an inner engine that never switches off", "Courageous in confronting challenges and difficult conversations", "Extraordinary capacity for work — high output under high pressure", "Born entrepreneur — identifies problems and builds solutions", "Loyal and fiercely protective of those who earn their trust"],
  Melancholic: ["Gifted analyst — sees patterns and flaws that most people miss", "Deeply empathetic — feels others' pain and responds with genuine care", "Detail master — precision and thoroughness come naturally", "Artistically gifted — sensitive to beauty, meaning, and creative depth", "Fiercely loyal — once trust is earned, commitment is wholehearted", "Principled and morally grounded — lives by a strong personal code", "Long-range strategic thinker — plans and anticipates consequences", "Raises the quality standard of every team and project they join"],
  Phlegmatic: ["Unshakeable calmness — the anchor when everyone is overwhelmed", "Master mediator — finds common ground where others see only division", "Deeply trustworthy — word is bond; follows through without reminders", "Exceptional listener — creates deep safety; people open up freely", "Diplomatically gifted — delivers hard messages without damage", "Steady and reliable under pressure — never burns out", "Deeply loyal — commits to people and organizations with rare durability", "Genuinely humble — deflects credit and uplifts others naturally"],
};

const GROWTH: Record<string, string[]> = {
  Sanguine: ["Follow-through: Enthusiasm must be matched by execution — build systems to close the gap", "Emotional consistency: Your mood shifts rapidly — pause before reacting", "Deep listening: You are a gifted talker — learn the power of strategic silence", "Time management: Structure creates freedom, not imprisonment", "Depth over breadth: Invest in fewer relationships with genuine depth", "Financial discipline: Impulsive decisions follow emotional highs — build guardrails"],
  Choleric: ["Empathy: Pause to understand others' experience before responding", "Impatience: Not everyone operates at your speed — and that's okay", "Control: Delegation is a leadership skill; trusting others builds stronger teams", "Emotional awareness: Choleric leaders often damage relationships without realizing it", "Vulnerability: Letting others see your humanity deepens trust — not the opposite", "Appreciation: Your team needs recognition as much as results"],
  Melancholic: ["Perfectionism: 'Done and genuinely good' beats 'perfect and still incomplete'", "Self-compassion: Apply the grace you give others to yourself — you deserve it", "Mood management: Not every dark thought is the truth — separate feelings from facts", "Openness: Those who love you cannot help if you won't let them in", "Decision-making: Imperfect action today beats the perfect plan never executed", "Unforgiveness: Quietly carrying past hurts is slow poison — release is for your freedom"],
  Phlegmatic: ["Self-assertion: Your needs, opinions, and boundaries are legitimate — voice them", "Procrastination: Avoiding conflict can become avoiding necessary action", "Resistance to change: Stability is a strength, but inflexibility becomes a ceiling", "Passivity: Being peaceable is not the same as being passive — know the difference", "Ambition: Contentment with the status quo can rob you of meaningful growth", "Emotional expression: Those who love you need to know what you actually feel"],
};

const CAREERS: Record<string, string[]> = {
  Sanguine: ["Sales Executive / Business Development Director", "Marketing & Brand Manager", "Public Relations & Communications Officer", "Training & Development Facilitator", "Media Personality / Broadcaster / TV Host", "Event Planner & Experience Designer", "Life Coach / Motivational Speaker", "Customer Success & Client Relations Manager"],
  Choleric: ["Chief Executive Officer / Managing Director", "Entrepreneur / Founder", "Operations Director / COO", "Project & Programme Manager", "Strategy & Management Consultant", "Military / Law Enforcement Officer", "Lawyer / Barrister", "Real Estate Developer / Investor"],
  Melancholic: ["Financial Analyst / Chief Financial Officer", "Software Engineer / System Architect", "Auditor / Compliance & Risk Officer", "Research & Development Lead", "Quality Assurance Manager", "Medical Doctor / Surgeon", "Architect / Urban Planner", "Psychologist / Clinical Therapist"],
  Phlegmatic: ["Human Resources Manager / People Director", "Customer Success & Account Manager", "Operations & Process Coordinator", "Counsellor / Therapist / Social Worker", "Office & Administrative Manager", "Nurse / Healthcare Professional", "Teacher / Educational Counsellor", "Mediator / Diplomat / Community Relations Officer"],
};

const BLEND_DESC: Record<string, string> = {
  "Sanguine-Choleric": "You are one of the most energetically magnetic combinations — a rare blend of charisma and drive. You can walk into a room, inspire everyone in it, and lead them toward a goal they didn't know they had. Your greatest challenge is channeling that explosive energy into focused execution rather than scattered, brilliant-but-unfinished enthusiasm.",
  "Sanguine-Melancholic": "You are the poet and the performer — a beautiful paradox of depth and expression. You feel life intensely and have the gift of translating that inner richness into words, art, and heartfelt connection. You can be the life of the party and yet return home to a deep interior world that few people ever fully see.",
  "Sanguine-Phlegmatic": "You are one of the warmest, most socially gifted combinations — genuinely people-loving, non-threatening, and easy to be around. You navigate social environments with natural ease, balancing friendliness with calm steadiness. Your challenge is developing the drive to convert your remarkable relational gifts into sustained impact.",
  "Choleric-Sanguine": "You are a powerhouse with a people touch — bold and results-driven, but warm enough to bring others along willingly. You don't just lead; you lead in a way people want to follow. Your challenge is patience — with the pace of others and with yourself when results don't come fast enough.",
  "Choleric-Melancholic": "You are among the most formidably capable combinations — decisive and analytical, driven by ambition and a relentless pursuit of excellence. You set a standard of quality few can match. Your challenge is perfectionism in overdrive — Choleric urgency plus Melancholic standards can become crushing internal pressure.",
  "Choleric-Phlegmatic": "You are a calm but unstoppable force — decisive when it matters, patient enough to build properly. You have the rare ability to lead without needing to dominate, and people trust you because you get the job done without sacrificing the people doing it.",
  "Melancholic-Sanguine": "You are the artist with an audience — someone who feels deeply and expresses beautifully, drawing others into your rich inner world. You carry both depth and warmth, making you capable of profound thought and genuine human connection. Your challenge is emotional volatility between your Sanguine highs and Melancholic lows.",
  "Melancholic-Choleric": "You are an intense, exacting achiever — thorough, quality-driven, and relentlessly pursuing. You hold yourself to an extraordinarily high standard and combine rare analytical depth with the drive to actually execute. Your challenge is remembering that people are not projects to be optimized.",
  "Melancholic-Phlegmatic": "You are a deeply sensitive, quietly faithful soul — someone who thinks before speaking, feels before acting, and values depth and authenticity above all. You are one of the most trustworthy blends — people confide in, depend on, and return to you. Your challenge is bringing your significant gifts forward.",
  "Phlegmatic-Sanguine": "You are a warm, gentle, and socially easy presence — someone who never makes others feel judged or pressured, and whose positive energy is contagious without being overwhelming. You are easy to love, easy to befriend, and easy to work with. Your challenge is intentionality about where you invest your relational energy.",
  "Phlegmatic-Choleric": "You are a quiet, determined force — steady on the surface but driven underneath, patient in method but unwavering in purpose. You achieve through persistence and reliability, and those who underestimate you are consistently surprised by what you accomplish. Your challenge is letting your inner convictions surface in your external voice.",
  "Phlegmatic-Melancholic": "You are a deeply reflective, emotionally attuned, and profoundly loyal blend — someone who cares for others quietly and moves through the world with a grace that leaves lasting impressions. You are the person others return to for real wisdom and unconditional presence. Your challenge is self-direction — not losing yourself while caring for others.",
};

// ─── Layout constants ─────────────────────────────────────────────────────────
const W = 595.28;
const H = 841.89;
const ML = 48;
const MR = 48;
const CW = W - ML - MR;

// ─── Drawing helpers ──────────────────────────────────────────────────────────
function roundedRect(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, r: number) {
  doc.moveTo(x + r, y)
    .lineTo(x + w - r, y).quadraticCurveTo(x + w, y, x + w, y + r)
    .lineTo(x + w, y + h - r).quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    .lineTo(x + r, y + h).quadraticCurveTo(x, y + h, x, y + h - r)
    .lineTo(x, y + r).quadraticCurveTo(x, y, x + r, y);
}

function sectionHeader(doc: PDFKit.PDFDocument, title: string, y: number, accent: string): number {
  doc.rect(ML, y, CW, 32).fill(B.offWhite);
  doc.rect(ML, y, 4, 32).fill(accent);
  doc.fillColor(B.blue).fontSize(11).font("Helvetica-Bold")
    .text(title.toUpperCase(), ML + 16, y + 10, { characterSpacing: 0.8 });
  return y + 44;
}

function bulletItem(doc: PDFKit.PDFDocument, text: string, x: number, y: number, maxW: number, dotColor: string): number {
  doc.circle(x + 5, y + 5.5, 3.5).fill(dotColor);
  doc.fillColor(B.text).fontSize(10).font("Helvetica")
    .text(text, x + 16, y, { width: maxW - 16, lineGap: 2 });
  return doc.y + 5;
}

function numberedItem(doc: PDFKit.PDFDocument, text: string, num: number, x: number, y: number, maxW: number, accent: string): number {
  roundedRect(doc, x, y, 20, 20, 4);
  doc.fill(accent);
  doc.fillColor(B.white).fontSize(9).font("Helvetica-Bold")
    .text(String(num), x, y + 5, { width: 20, align: "center" });
  doc.fillColor(B.text).fontSize(10).font("Helvetica")
    .text(text, x + 28, y + 3, { width: maxW - 28, lineGap: 2 });
  return doc.y + 8;
}

function pageFooter(doc: PDFKit.PDFDocument, pageNum: number, total: number) {
  const footY = H - 28;
  doc.rect(0, footY, W, 28).fill("#F1F5F9");
  doc.moveTo(0, footY).lineTo(W, footY).strokeColor(B.border).lineWidth(0.5).stroke();
  doc.fillColor(B.slateLight).fontSize(8).font("Helvetica")
    .text("FREDORA TEMPEAMAP  ·  Fredora Eduservices  ·  Confidential Report", ML, footY + 9, { width: CW / 2 });
  doc.fillColor(B.slateLight).fontSize(8).font("Helvetica")
    .text(`Page ${pageNum} of ${total}`, ML + CW / 2, footY + 9, { width: CW / 2, align: "right" });
}

function pageTopStrip(doc: PDFKit.PDFDocument, color: string) {
  doc.rect(0, 0, W, 5).fill(color);
}

function infoCard(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, label: string, value: string, bg: string, labelColor: string, textColor: string): number {
  roundedRect(doc, x, y, w, h, 8);
  doc.fill(bg);
  doc.fillColor(labelColor).fontSize(8).font("Helvetica-Bold")
    .text(label.toUpperCase(), x + 12, y + 11, { characterSpacing: 0.6 });
  doc.fillColor(textColor).fontSize(9.5).font("Helvetica")
    .text(value, x + 12, y + 26, { width: w - 24, lineGap: 2 });
  return y + h;
}

// ─── Main export ──────────────────────────────────────────────────────────────
interface SessionData { testType: string; results: { primary: string; secondary: string; blend: string; percentages: Record<string, number> } }
interface UserData { fullName?: string | null; email?: string | null }

export async function generateReport(session: SessionData, userData: UserData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: false });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const { primary, secondary, blend, percentages } = session.results;
    const accent = B[primary as keyof typeof B] as string ?? B.blue;
    const info = TEMPERAMENT_INFO[primary] ?? TEMPERAMENT_INFO.Sanguine;
    const blendKey = blend ?? `${primary}-${secondary}`;
    const blendText = BLEND_DESC[blendKey] ?? `You carry the essence of ${primary} with ${secondary} undertones.`;
    const testLabel = session.testType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const userName = userData.fullName ?? "Your Name";
    const today = new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });

    // ═════════════════════════════════════════════════════
    // PAGE 1 — COVER
    // ═════════════════════════════════════════════════════
    doc.addPage();

    // Top blue block
    doc.rect(0, 0, W, 320).fill(B.blue);
    // Gold accent strip at top
    doc.rect(0, 0, W, 5).fill(B.gold);

    // Subtle diagonal decorative stripe
    doc.save();
    doc.opacity(0.07);
    for (let i = 0; i < 12; i++) {
      doc.moveTo(W - 30 + i * 40, 0).lineTo(W + i * 40, 320).lineWidth(28).strokeColor(B.white).stroke();
    }
    doc.restore();

    // "FREDORA TEMPEAMAP" wordmark
    doc.fillColor(B.gold).fontSize(9).font("Helvetica-Bold")
      .text("FREDORA  TEMPEAMAP", ML, 28, { characterSpacing: 3, width: CW, align: "center" });

    // Temperament name — large
    doc.fillColor(B.white).fontSize(52).font("Helvetica-Bold")
      .text(primary.toUpperCase(), ML, 62, { width: CW, align: "center", characterSpacing: 1 });

    // Headline
    doc.fillColor(B.goldLight).fontSize(16).font("Helvetica")
      .text(info.headline, ML, 125, { width: CW, align: "center" });

    // Divider line
    doc.moveTo(W / 2 - 60, 153).lineTo(W / 2 + 60, 153).strokeColor(B.gold).lineWidth(1).stroke();

    // Blend badge
    if (secondary) {
      doc.fillColor("rgba(255,255,255,0.15)").roundedRect ? null : null;
      roundedRect(doc, W / 2 - 80, 162, 160, 24, 12);
      doc.fill("rgba(255,255,255,0.15)");
      doc.fillColor(B.white).fontSize(10).font("Helvetica")
        .text(`Blend: ${blendKey}`, W / 2 - 80, 168, { width: 160, align: "center" });
    }

    // User info row
    const uY = 202;
    doc.fillColor("rgba(255,255,255,0.5)").fontSize(8).font("Helvetica")
      .text("PREPARED FOR", ML + 20, uY, { characterSpacing: 1 });
    doc.fillColor(B.white).fontSize(13).font("Helvetica-Bold")
      .text(userName, ML + 20, uY + 12);

    doc.fillColor("rgba(255,255,255,0.5)").fontSize(8).font("Helvetica")
      .text("DATE", ML + CW / 2, uY, { characterSpacing: 1 });
    doc.fillColor(B.white).fontSize(13).font("Helvetica-Bold")
      .text(today, ML + CW / 2, uY + 12);

    doc.fillColor("rgba(255,255,255,0.5)").fontSize(8).font("Helvetica")
      .text("ASSESSMENT TYPE", ML + CW * 0.75, uY, { characterSpacing: 1 });
    doc.fillColor(B.white).fontSize(10).font("Helvetica-Bold")
      .text(testLabel, ML + CW * 0.75, uY + 12, { width: CW * 0.25 });

    // White bottom section
    doc.rect(0, 320, W, H - 320).fill(B.white);

    // Gold accent left bar on description card
    let cY = 340;
    doc.rect(ML, cY, 3, 110).fill(accent);

    // Description
    doc.fillColor(B.blue).fontSize(11).font("Helvetica-Bold")
      .text("Your Profile", ML + 18, cY + 4);
    doc.fillColor(B.slate).fontSize(10.5).font("Helvetica")
      .text(info.description, ML + 18, cY + 22, { width: CW - 18, lineGap: 4 });

    cY = doc.y + 28;

    // Famous examples row
    doc.fillColor(B.slateLight).fontSize(8).font("Helvetica-Bold")
      .text("FAMOUS EXAMPLES", ML, cY, { characterSpacing: 1 });
    cY += 14;
    const exW = (CW - 12) / 4;
    info.famousExamples.forEach((name, i) => {
      const ex = ML + i * (exW + 4);
      roundedRect(doc, ex, cY, exW, 28, 6);
      doc.fill(accent + "18");
      doc.fillColor(accent).fontSize(9).font("Helvetica-Bold")
        .text(name, ex + 6, cY + 9, { width: exW - 12, align: "center" });
    });
    cY += 44;

    // Blend description card
    roundedRect(doc, ML, cY, CW, 80, 8);
    doc.fill(B.offWhite);
    doc.rect(ML, cY, 4, 80).fill(B.gold);
    doc.fillColor(B.gold).fontSize(8).font("Helvetica-Bold")
      .text("YOUR BLEND", ML + 16, cY + 10, { characterSpacing: 1 });
    doc.fillColor(B.text).fontSize(9.5).font("Helvetica")
      .text(blendText, ML + 16, cY + 26, { width: CW - 24, lineGap: 3 });

    pageFooter(doc, 1, 6);

    // ═════════════════════════════════════════════════════
    // PAGE 2 — SCORE PROFILE
    // ═════════════════════════════════════════════════════
    doc.addPage();
    pageTopStrip(doc, accent);

    doc.fillColor(B.blue).fontSize(20).font("Helvetica-Bold")
      .text("Temperament Profile", ML, 28);
    doc.fillColor(B.slateLight).fontSize(10).font("Helvetica")
      .text("Your score breakdown across the four temperament dimensions", ML, 54);
    doc.moveTo(ML, 70).lineTo(W - MR, 70).strokeColor(B.border).lineWidth(0.5).stroke();

    const temps = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];
    let bY = 88;

    temps.forEach((t) => {
      const pct = Math.round(parseFloat(String(percentages[t])) || 0);
      const tColor = B[t as keyof typeof B] as string ?? B.blue;
      const isPrimary = t === primary;
      const isSecondary = t === secondary;

      // Card background
      roundedRect(doc, ML, bY, CW, 68, 8);
      doc.fill(isPrimary ? B.blue + "0D" : B.offWhite);
      if (isPrimary) {
        doc.roundedRect ? null : null;
        doc.moveTo(ML, bY + 8).lineTo(ML, bY + 60).strokeColor(tColor).lineWidth(3).stroke();
      }

      // Temperament label
      doc.fillColor(isPrimary ? B.blue : B.slate).fontSize(13).font(isPrimary ? "Helvetica-Bold" : "Helvetica")
        .text(t, ML + 20, bY + 11);
      if (isPrimary) {
        roundedRect(doc, ML + 88, bY + 13, 48, 14, 7);
        doc.fill(tColor);
        doc.fillColor(B.white).fontSize(7.5).font("Helvetica-Bold")
          .text("PRIMARY", ML + 88, bY + 17, { width: 48, align: "center", characterSpacing: 0.5 });
      } else if (isSecondary) {
        roundedRect(doc, ML + 98, bY + 13, 58, 14, 7);
        doc.fill(tColor + "33");
        doc.fillColor(tColor).fontSize(7.5).font("Helvetica-Bold")
          .text("SECONDARY", ML + 98, bY + 17, { width: 58, align: "center", characterSpacing: 0.5 });
      }

      // Percentage
      doc.fillColor(tColor).fontSize(22).font("Helvetica-Bold")
        .text(`${pct}%`, W - MR - 52, bY + 9, { width: 52, align: "right" });

      // Bar track
      const barX = ML + 20;
      const barW = CW - 78;
      const barY = bY + 44;
      doc.rect(barX, barY, barW, 10).fill(B.border);
      const filled = Math.max((pct / 100) * barW, 2);
      roundedRect(doc, barX, barY, filled, 10, 5);
      doc.fill(tColor);

      bY += 80;
    });

    // Blend insight box
    bY += 8;
    roundedRect(doc, ML, bY, CW, 72, 8);
    doc.fill(B.offWhite);
    doc.rect(ML, bY, 4, 72).fill(B.gold);
    doc.fillColor(B.gold).fontSize(8).font("Helvetica-Bold")
      .text("WHAT YOUR SCORES MEAN", ML + 16, bY + 10, { characterSpacing: 0.8 });
    doc.fillColor(B.text).fontSize(9.5).font("Helvetica")
      .text(`Your primary temperament (${primary}) represents your strongest natural tendencies — how you instinctively respond, lead, and relate. Your secondary (${secondary}) adds important nuance and depth to your profile. Together they form the ${blendKey} blend.`, ML + 16, bY + 26, { width: CW - 28, lineGap: 3 });

    pageFooter(doc, 2, 6);

    // ═════════════════════════════════════════════════════
    // PAGE 3 — STRENGTHS & GROWTH
    // ═════════════════════════════════════════════════════
    doc.addPage();
    pageTopStrip(doc, accent);

    doc.fillColor(B.blue).fontSize(20).font("Helvetica-Bold").text("Strengths & Growth", ML, 28);
    doc.fillColor(B.slateLight).fontSize(10).font("Helvetica")
      .text("Your natural gifts and the areas where intentional growth will unlock your potential", ML, 54);
    doc.moveTo(ML, 70).lineTo(W - MR, 70).strokeColor(B.border).lineWidth(0.5).stroke();

    // Strengths
    let sY = sectionHeader(doc, "Your Key Strengths", 82, accent);
    const str = STRENGTHS[primary] ?? [];
    const col = Math.ceil(str.length / 2);
    const colW = CW / 2 - 8;

    for (let i = 0; i < str.length; i++) {
      const isRight = i >= col;
      const row = isRight ? i - col : i;
      const x = isRight ? ML + CW / 2 + 8 : ML;
      const baseY = sY + row * 38;
      roundedRect(doc, x, baseY, colW, 32, 6);
      doc.fill(accent + "0F");
      doc.circle(x + 14, baseY + 16, 4).fill(accent);
      doc.fillColor(B.text).fontSize(9.5).font("Helvetica")
        .text(str[i], x + 26, baseY + 8, { width: colW - 34, lineGap: 2 });
    }

    sY += col * 38 + 20;

    // Growth
    sY = sectionHeader(doc, "Growth Opportunities", sY, B.gold);
    (GROWTH[primary] ?? []).forEach((g) => {
      // Split label: value at colon
      const colonIdx = g.indexOf(":");
      const label = colonIdx > -1 ? g.slice(0, colonIdx) : "";
      const rest = colonIdx > -1 ? g.slice(colonIdx + 1).trim() : g;

      doc.circle(ML + 6, sY + 6, 4).fill(B.gold + "80");
      if (label) {
        doc.fillColor(B.blue).fontSize(10).font("Helvetica-Bold")
          .text(label + ": ", ML + 18, sY, { continued: true, width: CW - 18 });
        doc.fillColor(B.slate).fontSize(10).font("Helvetica")
          .text(rest, { lineGap: 1 });
      } else {
        doc.fillColor(B.slate).fontSize(10).font("Helvetica")
          .text(rest, ML + 18, sY, { width: CW - 18, lineGap: 1 });
      }
      sY = doc.y + 8;
    });

    pageFooter(doc, 3, 6);

    // ═════════════════════════════════════════════════════
    // PAGE 4 — EMOTIONAL PROFILE & RELATIONSHIPS
    // ═════════════════════════════════════════════════════
    doc.addPage();
    pageTopStrip(doc, accent);

    doc.fillColor(B.blue).fontSize(20).font("Helvetica-Bold").text("Emotional Profile", ML, 28);
    doc.fillColor(B.slateLight).fontSize(10).font("Helvetica")
      .text("How you process emotion, handle pressure, and what you need to thrive", ML, 54);
    doc.moveTo(ML, 70).lineTo(W - MR, 70).strokeColor(B.border).lineWidth(0.5).stroke();

    const ep = info.emotionalProfile;
    const eCards = [
      { label: "Anger Style",  value: ep.angerStyle,  bg: "#FEF2F2", lc: "#B91C1C", tc: "#7F1D1D" },
      { label: "Under Stress", value: ep.underStress, bg: "#FFFBEB", lc: "#B45309", tc: "#78350F" },
      { label: "Core Fear",    value: ep.coreFear,    bg: "#F5F3FF", lc: "#6D28D9", tc: "#4C1D95" },
      { label: "Core Need",    value: ep.coreNeed,    bg: "#F0FDF4", lc: "#16A34A", tc: "#14532D" },
    ];

    const cardW = (CW - 12) / 2;
    const cardH = 100;
    eCards.forEach((c, i) => {
      const cx = i % 2 === 0 ? ML : ML + cardW + 12;
      const cy = 88 + Math.floor(i / 2) * (cardH + 12);
      roundedRect(doc, cx, cy, cardW, cardH, 8);
      doc.fill(c.bg);
      doc.rect(cx, cy, 4, cardH).fill(c.lc);
      doc.fillColor(c.lc).fontSize(8).font("Helvetica-Bold")
        .text(c.label.toUpperCase(), cx + 14, cy + 12, { characterSpacing: 0.6 });
      doc.fillColor(c.tc).fontSize(10).font("Helvetica")
        .text(c.value, cx + 14, cy + 28, { width: cardW - 24, lineGap: 3 });
    });

    let rY = 88 + 2 * (cardH + 12) + 20;

    // Relationships
    rY = sectionHeader(doc, "Relationships & Love", rY, "#E11D48");

    roundedRect(doc, ML, rY, CW, 115, 8);
    doc.fill(B.offWhite);
    doc.rect(ML, rY, 4, 115).fill("#E11D48");
    doc.fillColor(B.text).fontSize(10).font("Helvetica")
      .text(info.relationships, ML + 16, rY + 14, { width: CW - 28, lineGap: 4 });

    pageFooter(doc, 4, 6);

    // ═════════════════════════════════════════════════════
    // PAGE 5 — CAREER RECOMMENDATIONS
    // ═════════════════════════════════════════════════════
    doc.addPage();
    pageTopStrip(doc, accent);

    doc.fillColor(B.blue).fontSize(20).font("Helvetica-Bold").text("Career Recommendations", ML, 28);
    doc.fillColor(B.slateLight).fontSize(10).font("Helvetica")
      .text("Roles and industries that align with your natural temperament and working style", ML, 54);
    doc.moveTo(ML, 70).lineTo(W - MR, 70).strokeColor(B.border).lineWidth(0.5).stroke();

    let caY = 88;
    const careers = CAREERS[primary] ?? [];
    careers.forEach((c, i) => {
      const isEven = i % 2 === 0;
      roundedRect(doc, ML, caY, CW, 40, 7);
      doc.fill(isEven ? B.offWhite : B.white);

      // Numbered circle
      doc.circle(ML + 22, caY + 20, 13).fill(accent + (isEven ? "33" : "22"));
      doc.fillColor(accent).fontSize(10).font("Helvetica-Bold")
        .text(String(i + 1), ML + 14, caY + 14, { width: 18, align: "center" });

      doc.fillColor(B.text).fontSize(11).font(isEven ? "Helvetica-Bold" : "Helvetica")
        .text(c, ML + 46, caY + 13, { width: CW - 56 });

      caY += 48;
    });

    // Superpower banner
    caY += 8;
    doc.rect(ML, caY, CW, 68).fill(B.blue);
    doc.rect(ML, caY, 4, 68).fill(B.gold);
    doc.fillColor(B.gold).fontSize(8.5).font("Helvetica-Bold")
      .text("YOUR WORKPLACE SUPERPOWER", ML + 16, caY + 13, { characterSpacing: 0.8 });

    const superpowers: Record<string, string> = {
      Sanguine: "You can sell an idea, energize a room, and build key relationships faster than anyone on the team.",
      Choleric: "You can take a failing project, create a clear strategy, and execute it at speed. Crisis is where you shine.",
      Melancholic: "You will find the flaw in the plan, the error in the data, and the hidden risk — before it becomes a costly problem.",
      Phlegmatic: "You keep the team functioning, united, and human when everything around them is chaotic. Your calm is priceless.",
    };
    doc.fillColor(B.white).fontSize(12).font("Helvetica-BoldOblique")
      .text(`"${superpowers[primary] ?? ""}"`, ML + 16, caY + 30, { width: CW - 28, lineGap: 3 });

    pageFooter(doc, 5, 6);

    // ═════════════════════════════════════════════════════
    // PAGE 6 — CLOSING / HOW TO USE THIS REPORT
    // ═════════════════════════════════════════════════════
    doc.addPage();
    pageTopStrip(doc, accent);

    doc.fillColor(B.blue).fontSize(20).font("Helvetica-Bold").text("How to Use This Report", ML, 28);
    doc.moveTo(ML, 60).lineTo(W - MR, 60).strokeColor(B.border).lineWidth(0.5).stroke();

    const tips = [
      { title: "Start with your Primary", body: "Your primary temperament is the most reliable guide to your natural instincts. Begin by deeply understanding its strengths — they are your most reliable tools in any season of life." },
      { title: "Honour your Secondary", body: "Your secondary temperament adds texture and nuance. It often shows up most clearly in your closest relationships and under pressure. Understand how it modifies and complements your primary." },
      { title: "Revisit your Growth Areas", body: "The growth opportunities in this report are not criticisms — they are invitations. Revisit them regularly. Personal growth is not a one-time event; it is a lifelong practice." },
      { title: "Share with Someone Who Knows You", body: "Ask a trusted friend, partner, or mentor to read your profile. Their feedback on whether it rings true — and where it doesn't — is invaluable data about your self-awareness." },
      { title: "Apply it to your Relationships", body: "Use the relationships section to open better conversations with the people you love. Understanding one another's temperaments dissolves many misunderstandings that felt like moral failures." },
      { title: "Return to it in Different Seasons", body: "Your temperament doesn't change, but your expression of it does. A report read at 25 hits differently at 40. Retake the assessment every two to three years to track your growth journey." },
    ];

    let tY = 80;
    tips.forEach((tip, i) => {
      roundedRect(doc, ML, tY, CW, 76, 8);
      doc.fill(i % 2 === 0 ? B.offWhite : B.white);
      doc.circle(ML + 14, tY + 18, 9).fill(accent);
      doc.fillColor(B.white).fontSize(9).font("Helvetica-Bold")
        .text(String(i + 1), ML + 7, tY + 13, { width: 16, align: "center" });
      doc.fillColor(B.blue).fontSize(11).font("Helvetica-Bold").text(tip.title, ML + 34, tY + 11);
      doc.fillColor(B.slate).fontSize(9.5).font("Helvetica")
        .text(tip.body, ML + 34, tY + 27, { width: CW - 44, lineGap: 2 });
      tY += 83;
    });

    // Closing banner
    doc.rect(0, H - 90, W, 62).fill(B.blue);
    doc.fillColor(B.gold).fontSize(10.5).font("Helvetica-Bold")
      .text("Thank you for choosing Fredora TemperaMap", 0, H - 75, { width: W, align: "center" });
    doc.fillColor("rgba(255,255,255,0.7)").fontSize(9).font("Helvetica")
      .text("This report was generated exclusively for your personal development. Please do not share or redistribute without permission.", 0, H - 55, { width: W, align: "center" });

    pageFooter(doc, 6, 6);

    doc.end();
  });
}
