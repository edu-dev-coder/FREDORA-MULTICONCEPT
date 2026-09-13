import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import FrederaLogo from "@/components/FrederaLogo";
import { CHILD_GUIDANCE, COUPLES_COMPATIBILITY } from "@/lib/child-guidance";
import { getCouplesPairing } from "@/lib/couples-data";
import { PartnerComparison } from "@/components/couples/PartnerComparison";
import { LoveLanguageCard } from "@/components/couples/LoveLanguageCard";
import { CommunicationGuide } from "@/components/couples/CommunicationGuide";
import { IndividualCommunicationGuide } from "@/components/corporate/IndividualCommunicationGuide";
import { LifeAreasCard } from "@/components/couples/LifeAreasCard";
import { ConflictPlaybook } from "@/components/couples/ConflictPlaybook";
import { getAdultLearning } from "@/lib/adult-learning";
import { WORKPLACE_SCALES, type WorkplaceProfile } from "@/lib/workplace";
import { commPairsForRow } from "@/lib/corporate-data";
import { renderCommBlocks, renderCommGrid } from "@/lib/communication-pdf";

interface TestSession {
  id: string;
  testType: string;
  status: string;
  paid: boolean;
  results?: Record<string, number> | null;
  primaryTemp?: string | null;
  secondaryTemp?: string | null;
  blend?: string | null;
  workplace?: WorkplaceProfile | null;
  partnerSessionId?: string | null;
  userName?: string | null;
  completedAt?: string | null;
}

const TEMPERAMENT_INFO: Record<string, {
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  headline: string;
  description: string;
  strengths: string[];
  growth: string[];
  relationships: string;
  emotionalProfile: { angerStyle: string; underStress: string; coreFear: string; coreNeed: string };
  famousExamples: string[];
}> = {
  Sanguine: {
    emoji: "🌟",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    headline: "The Enthusiastic Optimist",
    description: "You are the person who walks into a room and shifts the energy — warm, expressive, and genuinely magnetic. You experience life at full volume: your highs are brilliant and contagious, and your love for people is completely authentic. Where others see obstacles, you instinctively see possibilities, and your enthusiasm is not performance — it is who you are.",
    strengths: [
      "Radiantly charismatic — enters a room and shifts the energy instantly",
      "Makes strangers feel like old friends within minutes of meeting",
      "Naturally optimistic — sees opportunity where others see problems",
      "Gifted storyteller with an instinct for humor and human connection",
      "Quick to forgive and genuinely slow to hold grudges",
      "Creative and spontaneous — generates fresh ideas constantly",
    ],
    growth: [
      "Follow-through: Enthusiasm must be matched by execution — build systems to close the gap",
      "Emotional consistency: Your mood can shift rapidly; pause before reacting to regulate well",
      "Deep listening: You are a gifted talker — learn the strategic power of silence and presence",
      "Time management: Structure is not the enemy of spontaneity — it creates freedom within it",
    ],
    relationships: "You are deeply affectionate, spontaneous, and full of romantic energy. You thrive where there is laughter, affirmation, and shared adventure. Your love language is words of affirmation and quality time — you need your partner to verbally celebrate you.",
    emotionalProfile: {
      angerStyle: "Flares up quickly and loudly, but cools down fast and rarely holds lasting grudges",
      underStress: "Talks more, scatters energy, seeks distraction and social escapism",
      coreFear: "Rejection, being unloved, or being seen as a failure by those who matter to you",
      coreNeed: "Approval, verbal affirmation, and genuine social connection",
    },
    famousExamples: ["Peter the Apostle", "Oprah Winfrey", "Robin Williams", "Bill Clinton"],
  },
  Choleric: {
    emoji: "🔥",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    headline: "The Bold Leader",
    description: "You are built for impact — decisive, driven, and absolutely certain of where you are going. You don't wait for permission to lead; you step forward naturally when others hesitate. Your capacity for work, your self-reliance, and your refusal to accept mediocrity make you one of the most formidably effective temperaments when properly directed.",
    strengths: [
      "Natural commanding leader — takes charge instinctively when others freeze",
      "Decisively cuts through ambiguity and acts under pressure without hesitation",
      "Visionary thinker — sees the destination clearly and architects the path",
      "Relentlessly competitive and driven by an inner engine that never fully switches off",
      "Courageous in confronting challenges, risks, and difficult conversations directly",
      "Born entrepreneur — identifies problems and builds solutions instinctively",
    ],
    growth: [
      "Empathy: Build the habit of pausing to understand others' experience before responding",
      "Impatience: Not everyone operates at your speed — this is not always a deficit in them",
      "Control: Delegation is a leadership skill; trusting others' process builds stronger teams",
      "Vulnerability: Letting others see your humanity deepens trust and influence",
    ],
    relationships: "You are intensely loyal, protective, and deeply committed once you choose someone. You love with action — fixing problems, providing, and going to war for those you care about. However, your directness can wound without warning, and your need for control can turn a relationship into a power dynamic.",
    emotionalProfile: {
      angerStyle: "Hot, direct, and confrontational — says sharp things they may later regret, but rarely initiates the apology",
      underStress: "Becomes domineering, hypercritical, and controlling — pushes harder when slowing down is what is needed",
      coreFear: "Losing control, being seen as weak, incompetent, or taken advantage of",
      coreNeed: "Loyalty, measurable results, and genuine freedom to lead without interference",
    },
    famousExamples: ["Winston Churchill", "Steve Jobs", "Paul the Apostle", "Margaret Thatcher"],
  },
  Melancholic: {
    emoji: "🌊",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    headline: "The Deep Thinker",
    description: "You experience life with extraordinary depth and sensitivity — where others skim the surface, you dive. Your inner world is rich, complex, and constantly active, and your eye for beauty, meaning, and pattern gives you gifts that most people simply do not possess.",
    strengths: [
      "Gifted analyst — sees patterns, connections, and flaws that most people completely miss",
      "Deeply empathetic — feels others' pain acutely and responds with genuine, thoughtful care",
      "Detail master — precision and thoroughness come naturally, not as effort",
      "Artistically and aesthetically gifted — sensitive to beauty, meaning, and creative depth",
      "Fiercely loyal — once trust is earned, commitment is wholehearted and lasting",
      "Long-range strategic thinker — plans carefully and anticipates consequences before acting",
    ],
    growth: [
      "Perfectionism: 'Done and genuinely good' usually beats 'perfect and still incomplete'",
      "Self-compassion: Apply the same grace you freely give others to yourself",
      "Mood management: Learn to separate feelings from facts; not every dark thought is the truth",
      "Openness: Those who love you cannot help you if you will not let them in",
    ],
    relationships: "You love faithfully, thoughtfully, and with extraordinary depth. You remember the details — anniversaries, preferences, the exact words someone said on a significant day. You need a relationship where you feel genuinely safe to be imperfect.",
    emotionalProfile: {
      angerStyle: "Slow to anger but deeply wounded — may simmer silently for extended periods before expressing hurt",
      underStress: "Withdraws inward, becomes self-critical, moody, and emotionally unavailable to others",
      coreFear: "Criticism, failure, and being exposed as imperfect, incompetent, or not enough",
      coreNeed: "Quality interactions, genuine understanding, deep connection, and unhurried time to process",
    },
    famousExamples: ["Abraham Lincoln", "Beethoven", "Isaac Newton", "Mother Teresa"],
  },
  Phlegmatic: {
    emoji: "🌿",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    headline: "The Steady Peacemaker",
    description: "You are the human anchor — the person everyone else instinctively gravitates toward when the world becomes uncertain, chaotic, or tense. Your calmness is not passivity; it is a deeply rooted steadiness that comes from knowing who you are.",
    strengths: [
      "Unshakeable calmness — the reliable anchor when everyone around them is overwhelmed",
      "Master mediator — sees all sides instinctively and finds common ground where others only see division",
      "Deeply trustworthy — word is bond; consistently follows through without need for reminders",
      "Exceptional listener — creates deep emotional safety; people open up freely and honestly",
      "Diplomatically gifted — delivers difficult messages in ways that don't damage relationships",
      "Deeply loyal — commits to people, causes, and organizations with rare durability",
    ],
    growth: [
      "Self-assertion: Your needs, opinions, and boundaries are legitimate and important — voice them",
      "Procrastination: Avoiding conflict can quietly become avoiding necessary and important action",
      "Resistance to change: Stability is a real strength, but chosen inflexibility becomes a ceiling",
      "Ambition: Contentment with the current state can quietly rob you of meaningful future growth",
    ],
    relationships: "You are one of the most patient, accepting, and dependable romantic partners. You rarely trigger conflict and almost always put your partner's peace above your own comfort. However, your tendency to suppress your own needs to preserve harmony can breed quiet resentment over time.",
    emotionalProfile: {
      angerStyle: "Avoids conflict almost entirely; anger eventually surfaces as passive resistance, stubbornness, or quiet withdrawal",
      underStress: "Shuts down emotionally, becomes stubborn and immovable, retreats into comfortable routine",
      coreFear: "Conflict, confrontation, instability, and the loss of relational peace and harmony",
      coreNeed: "Genuine stability, mutual respect, consistent peace, and time to process and adapt to change",
    },
    famousExamples: ["Mahatma Gandhi", "Fred Rogers (Mr. Rogers)", "Queen Elizabeth II", "Abraham (Patriarch)"],
  },
};

const BLEND_DESC: Record<string, string> = {
  "Sanguine-Choleric": "You are one of the most energetically magnetic personality combinations — a rare blend of charisma and drive. You can walk into a room, inspire everyone in it, and then lead them toward a goal they didn't even know they had.",
  "Sanguine-Melancholic": "You are the poet and the performer — a beautiful paradox of depth and expression. You feel life intensely and have the extraordinary gift of translating that inner richness into words, art, or heartfelt communication.",
  "Sanguine-Phlegmatic": "You are one of the warmest, most socially gifted temperament combinations — genuinely people-loving, non-threatening, and effortlessly easy to be around.",
  "Choleric-Sanguine": "You are a powerhouse with a people touch — bold, inspiring, and results-driven, but with enough warmth and humor to bring others along willingly rather than reluctantly.",
  "Choleric-Melancholic": "You are among the most formidably capable temperament combinations — decisive and analytical, driven by both ambition and a relentless pursuit of excellence.",
  "Choleric-Phlegmatic": "You are a calm but unstoppable force — decisive when it matters, patient enough to build properly, and strong enough to stay the course when others abandon ship.",
  "Melancholic-Choleric": "You are the precision strategist — combining analytical depth with decisive action. You do not just identify problems; you build detailed, carefully considered solutions.",
  "Melancholic-Sanguine": "You are the creative communicator — capable of profound depth and brilliant expressiveness. You move between your rich inner world and warm social connection with unique fluidity.",
  "Melancholic-Phlegmatic": "You are one of the most sensitive, thoughtful, and deeply principled temperament combinations. Your inner world is extraordinarily rich, and your loyalty to people you love is absolute.",
  "Phlegmatic-Choleric": "You are the quiet executive — steady and deliberate, but with a backbone of iron when it matters. You lead without ego, decide without drama, and build without burning things down.",
  "Phlegmatic-Sanguine": "You are the approachable peacemaker — easy to be around, emotionally warm, and quietly steady. People love being near you because you are both safe and fun.",
  "Phlegmatic-Melancholic": "You are the thoughtful nurturer — one of the most deeply caring and genuinely sensitive combinations. You feel the weight of others' pain acutely and respond with extraordinary empathy.",
};

const TEMP_BG: Record<string, string> = {
  Sanguine:    "from-amber-600 to-amber-700",
  Choleric:    "from-red-600 to-red-700",
  Melancholic: "from-blue-700 to-blue-800",
  Phlegmatic:  "from-green-600 to-green-700",
};

type TabKey = "overview" | "strengths" | "relationships" | "emotional" | "parenting" | "learning" | "workplace" | "compatibility" | "career" | "communication" | "love" | "life";

function isChildTest(testType: string) {
  return ["child_3_5", "child_6_9", "preteen_10_12", "teen_13_17"].includes(testType);
}

function usesChildScoring(testType: string) {
  return ["child_3_5", "child_6_9", "preteen_10_12"].includes(testType);
}

function isCouplesTest(testType: string) {
  return testType === "couples_test";
}

function isAdultTest(testType: string) {
  return ["single_test", "corporate_team", "school_license", "individual_student"].includes(testType);
}

export default function Results() {
  const { user } = useAuth();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const { data: session, isLoading } = useQuery<TestSession>({
    queryKey: ["test-result", sessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${sessionId}`);
      if (!r.ok) throw new Error("Session not found");
      return r.json();
    },
    enabled: !!sessionId,
  });

  const { data: partnerSession } = useQuery<TestSession>({
    queryKey: ["test-result-partner", session?.partnerSessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${session!.partnerSessionId}`);
      if (!r.ok) throw new Error("Partner session not found");
      return r.json();
    },
    enabled: !!session?.partnerSessionId,
  });

  const handleDownloadPdf = async () => {
    if (!sessionId || !session) return;
    setGeneratingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const w = doc.internal.pageSize.getWidth();
      const h = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentW = w - margin * 2;
      let y = 0;

      const TEMP_COLORS: Record<string, [number, number, number]> = {
        Sanguine: [245, 158, 11],
        Choleric: [239, 68, 68],
        Melancholic: [59, 130, 246],
        Phlegmatic: [34, 197, 94],
      };

      const SECTION_COLORS: [number, number, number][] = [
        [30, 69, 128],
        [124, 58, 237],
        [22, 163, 74],
        [217, 119, 6],
        [220, 38, 38],
        [59, 130, 246],
        [168, 85, 247],
      ];
      let sectionIdx = 0;

      const addSectionHeader = (text: string) => {
        if (y > 235) { doc.addPage(); y = 20; }
        const color = SECTION_COLORS[sectionIdx % SECTION_COLORS.length];
        sectionIdx++;
        doc.setFillColor(...color);
        doc.roundedRect(margin, y, contentW, 9, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(text, margin + 5, y + 6);
        y += 14;
      };

      const addSubHeader = (text: string, color: [number, number, number] = [60, 60, 60]) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...color);
        doc.text(text, margin + 2, y);
        y += 5;
      };

      const addText = (text: string, size: number, isBold = false, color: [number, number, number] = [70, 70, 70], indent = 0) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentW - 6 - indent);
        for (const line of lines) {
          if (y > 272) { doc.addPage(); y = 20; }
          doc.text(line, margin + 2 + indent, y);
          y += size * 0.42;
        }
        y += 2;
      };

      const addBullet = (text: string, bulletColor: [number, number, number] = [34, 197, 94]) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFillColor(...bulletColor);
        doc.circle(margin + 5, y - 1.2, 1.2, "F");
        addText(text, 9, false, [60, 60, 60], 8);
      };

      const addDivider = () => {
        doc.setDrawColor(230, 230, 235);
        doc.setLineWidth(0.2);
        doc.line(margin + 2, y, w - margin - 2, y);
        y += 4;
      };

      const userName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.firstName || user?.email || "User";

      const pColor = TEMP_COLORS[primary] || [100, 100, 100];
      const sColor = secondary ? (TEMP_COLORS[secondary] || [150, 150, 150]) : null;

      // ══════════════════════════════════════════════════════════
      // PAGE 1: COVER
      // ══════════════════════════════════════════════════════════
      doc.setFillColor(25, 55, 115);
      doc.rect(0, 0, w, 88, "F");
      doc.setFillColor(...pColor);
      doc.rect(0, 83, w, 8, "F");

      y = 20;
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("FREDORA TEMPERAMAP", margin, y);
      y += 12;
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("Temperament", margin, y);
      y += 10;
      doc.text("Assessment Report", margin, y);
      y += 16;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 215, 255);
      doc.text(`Prepared for ${userName}`, margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.text(new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }), margin, y);

      y = 102;

      // Temperament hero card
      doc.setFillColor(250, 251, 253);
      doc.roundedRect(margin, y, contentW, 48, 4, 4, "F");
      doc.setDrawColor(...pColor);
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, y, contentW, 48, 4, 4, "S");
      doc.setFillColor(...pColor);
      doc.roundedRect(margin, y, 4, 48, 2, 2, "F");

      y += 8;
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      doc.setFont("helvetica", "normal");
      doc.text("YOUR PRIMARY TEMPERAMENT", margin + 10, y);
      y += 10;
      doc.setFontSize(30);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...pColor);
      doc.text(primary, margin + 10, y);
      y += 7;

      if (info?.headline) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text(`"${info.headline}"`, margin + 10, y);
        y += 8;
      }

      if (secondary) {
        doc.setFontSize(9);
        doc.setTextColor(140, 140, 140);
        doc.setFont("helvetica", "normal");
        doc.text("SECONDARY:", margin + 10, y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...(sColor || [100, 100, 100]));
        doc.text(secondary, margin + 34, y);
        y += 6;
      }

      if (blend) {
        doc.setFontSize(9);
        doc.setTextColor(140, 140, 140);
        doc.setFont("helvetica", "normal");
        doc.text("BLEND:", margin + 10, y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text(blend, margin + 28, y);
      }

      y += 14;

      // Blend description
      const blendKey = secondary ? `${primary}-${secondary}` : primary;
      const blendDesc = (BLEND_DESC as Record<string, string>)[blendKey];
      if (blendDesc) {
        addSectionHeader("Your Temperament Blend");
        addText(blendDesc, 10, false, [60, 60, 60]);
        y += 3;
      }

      // About temperament
      if (info) {
        addSectionHeader("About Your Temperament");
        addText(info.description, 10);
        y += 4;
      }

      // ══════════════════════════════════════════════════════════
      // SCORE BREAKDOWN
      // ══════════════════════════════════════════════════════════
      if (results && Object.keys(results).length > 0) {
        addSectionHeader("Score Breakdown");
        const maxScore = usesChildScoring(testType) ? 75 : 60;
        const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
        const barX = margin + 38;
        const barW = contentW - 60;

        for (const [temp, score] of sorted) {
          const pct = Math.round((score / maxScore) * 100);
          const tc = TEMP_COLORS[temp] || [150, 150, 150];

          if (y > 260) { doc.addPage(); y = 20; }

          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(60, 60, 60);
          doc.text(temp === primary ? `${temp}  *` : temp, margin + 2, y + 3);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(...tc);
          doc.text(`${pct}%`, barX + barW + 3, y + 3);

          doc.setFillColor(238, 238, 243);
          doc.roundedRect(barX, y, barW, 6, 3, 3, "F");
          doc.setFillColor(...tc);
          doc.roundedRect(barX, y, Math.max(2, barW * (pct / 100)), 6, 3, 3, "F");

          y += 14;
        }
        y += 2;
      }

      // ══════════════════════════════════════════════════════════
      // STRENGTHS
      // ══════════════════════════════════════════════════════════
      if (info?.strengths) {
        addSectionHeader("Key Strengths");
        for (const s of info.strengths) {
          addBullet(s, [34, 197, 94]);
        }
        y += 4;
      }

      // ══════════════════════════════════════════════════════════
      // GROWTH
      // ══════════════════════════════════════════════════════════
      if (info?.growth) {
        addSectionHeader("Growth Opportunities");
        for (const g of info.growth) {
          addBullet(g, [245, 158, 11]);
        }
        y += 4;
      }

      // ══════════════════════════════════════════════════════════
      // RELATIONSHIPS
      // ══════════════════════════════════════════════════════════
      if (info?.relationships) {
        if (y > 220) { doc.addPage(); y = 20; }
        addSectionHeader("Relationships & Love");
        addText(info.relationships, 10);
        y += 4;
      }

      // ══════════════════════════════════════════════════════════
      // EMOTIONAL PROFILE
      // ══════════════════════════════════════════════════════════
      if (info?.emotionalProfile) {
        if (y > 200) { doc.addPage(); y = 20; }
        addSectionHeader("Emotional Profile");

        const emoItems = [
          { label: "Anger Style", value: info.emotionalProfile.angerStyle, color: [239, 68, 68] as [number, number, number] },
          { label: "Under Stress", value: info.emotionalProfile.underStress, color: [245, 158, 11] as [number, number, number] },
          { label: "Core Fear", value: info.emotionalProfile.coreFear, color: [124, 58, 237] as [number, number, number] },
          { label: "Core Need", value: info.emotionalProfile.coreNeed, color: [34, 197, 94] as [number, number, number] },
        ];

        for (const e of emoItems) {
          if (y > 250) { doc.addPage(); y = 20; }
          doc.setFillColor(...e.color);
          doc.roundedRect(margin + 2, y, 2, 12, 1, 1, "F");

          doc.setFontSize(8);
          doc.setTextColor(...e.color);
          doc.setFont("helvetica", "bold");
          doc.text(e.label.toUpperCase(), margin + 8, y + 3);

          doc.setFontSize(9);
          doc.setTextColor(70, 70, 70);
          doc.setFont("helvetica", "normal");
          const valLines = doc.splitTextToSize(e.value, contentW - 14);
          for (const line of valLines) {
            if (y > 272) { doc.addPage(); y = 20; }
            doc.text(line, margin + 8, y + 8);
            y += 4;
          }
          y += 6;
        }
        y += 3;
      }

      // ══════════════════════════════════════════════════════════
      // WORKPLACE PROFILE
      // ══════════════════════════════════════════════════════════
      if (session.workplace) {
        if (y > 200) { doc.addPage(); y = 20; }
        addSectionHeader("Workplace Profile");
        addText(
          "How you show up in work settings: six workplace dimensions with provisional percentile norms.",
          9,
          false,
          [70, 70, 70]
        );

        const barX = margin + 60;
        const barW = contentW - 100;

        for (const scale of WORKPLACE_SCALES) {
          const s = session.workplace.scales[scale.key];
          if (!s) continue;
          if (y > 260) { doc.addPage(); y = 20; }

          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(60, 60, 60);
          doc.text(scale.label, margin + 2, y + 3);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(90, 90, 90);
          doc.text(`P${s.pct} · Sten ${s.sten}`, barX + barW + 2, y + 3);

          doc.setFillColor(238, 238, 243);
          doc.roundedRect(barX, y, barW, 5, 2.5, 2.5, "F");
          doc.setFillColor(59, 130, 246);
          doc.roundedRect(barX, y, Math.max(2, barW * (s.mean / 4)), 5, 2.5, 2.5, "F");

          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text(s.mean.toFixed(2), barX - 4, y + 3, { align: "right" });

          y += 13;
        }
        y += 4;

        if (session.workplace.topScales.length > 0) {
          addSubHeader("Top Workplace Strengths", [60, 60, 60]);
          for (const key of session.workplace.topScales.slice(0, 2)) {
            const scale = WORKPLACE_SCALES.find((sc) => sc.key === key);
            if (scale) addBullet(`${scale.label}: ${scale.strengths[0]}`, [59, 130, 246]);
          }
          y += 2;
        }

        if (session.workplace.responseQuality.flag !== "ok") {
          addText(
            "Interpretation note: some answers followed a pattern consistent with presenting yourself very favourably (or with rushing through). Results should be read with some caution.",
            9,
            false,
            [180, 120, 40]
          );
          y += 2;
        }

        addText(
          "Percentiles use a provisional working-adult model, not a real norm sample.",
          8,
          false,
          [120, 120, 120]
        );
        y += 4;
      }

      // ══════════════════════════════════════════════════════════
      // COMMUNICATION MATRIX (corporate)
      // ══════════════════════════════════════════════════════════
      if (session.testType === "corporate_team") {
        const commPairs = commPairsForRow(primary);
        if (y > 200) { doc.addPage(); y = 20; }
        addSectionHeader("Communication Matrix");
        addText(
          `How you, a ${primary}, communicate best with each temperament type, from the FREDORA TemperaMap guide.`,
          9,
          false,
          [70, 70, 70]
        );
        y = renderCommGrid(doc, commPairs, { startY: y, margin, contentW });
        y = renderCommBlocks(doc, commPairs, { startY: y, margin, contentW });
      }

      // ══════════════════════════════════════════════════════════
      // FAMOUS EXAMPLES
      // ══════════════════════════════════════════════════════════
      if (info?.famousExamples && info.famousExamples.length > 0) {
        if (y > 240) { doc.addPage(); y = 20; }
        addSectionHeader("Famous People With Your Temperament");
        addText(info.famousExamples.join("  •  "), 10, false, [80, 80, 80]);
        y += 4;
      }

      // ══════════════════════════════════════════════════════════
      // ADULT LEARNING STYLE
      // ══════════════════════════════════════════════════════════
      if (testType === "single_test" && adultLearning?.profile) {
        if (y > 190) { doc.addPage(); y = 20; }
        const lp = adultLearning.profile;
        addSectionHeader("Learning Style");
        addSubHeader(lp.style, [245, 158, 11]);
        addText(lp.description, 10);
        addSubHeader(`Primary Modality: ${lp.primaryModality}`, [30, 69, 128]);
        if (adultLearning.secondaryNote) {
          addText(adultLearning.secondaryNote, 9, false, [124, 58, 237]);
        }
        addSubHeader("Best Study Methods", [34, 197, 94]);
        for (const m of lp.studyMethods) addBullet(m);
        addSubHeader("Ideal Study Environment", [59, 130, 246]);
        addText(lp.idealEnvironment, 9);
        addSubHeader("How You Retain Best", [168, 85, 247]);
        addText(lp.retention, 9);
        addSubHeader("Recommended Tools", [217, 119, 6]);
        addText(lp.tools.join("  •  "), 9, false, [80, 80, 80]);
        addSubHeader("What to Avoid", [220, 38, 38]);
        for (const a of lp.avoid) addBullet(a, [220, 38, 38]);
        y += 4;
      }

      // ══════════════════════════════════════════════════════════
      // CHILD GUIDANCE
      // ══════════════════════════════════════════════════════════
      if (isChildTest(testType) && guidance) {
        if (y > 180) { doc.addPage(); y = 20; }
        addSectionHeader("Parenting Guide");

        const guideItems = [
          { label: "Learning Style", value: guidance.learning.style },
          { label: "Discipline Approach", value: guidance.discipline.why },
          { label: "Love Language", value: guidance.love.bestLanguage },
          { label: "What Hurts Them", value: guidance.hurts },
        ];

        for (const g of guideItems) {
          if (y > 250) { doc.addPage(); y = 20; }
          doc.setFillColor(30, 69, 128);
          doc.roundedRect(margin + 2, y, contentW - 4, 14, 2, 2, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.text(g.label.toUpperCase(), margin + 7, y + 4);

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const gLines = doc.splitTextToSize(g.value, contentW - 16);
          doc.text(gLines[0], margin + 7, y + 10);
          y += 17;
        }
        y += 3;
      }

      // ══════════════════════════════════════════════════════════
      // FOOTER
      // ══════════════════════════════════════════════════════════
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(220, 220, 225);
        doc.setLineWidth(0.2);
        doc.line(margin, h - 14, w - margin, h - 14);
        doc.setFontSize(7);
        doc.setTextColor(170, 170, 170);
        doc.text("Fredora TemperaMap — For self-insight only, not a clinical diagnosis.", margin, h - 9);
        doc.text(`Page ${i} of ${pageCount}`, w - margin - 16, h - 9);
        doc.setTextColor(30, 69, 128);
        doc.setFont("helvetica", "bold");
        doc.text("FREDORA", w - margin - 32, h - 9);
      }

      doc.save(`TemperaMap-${primary}-Report.pdf`);
    } catch {
      toast({ title: "Error", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleShare = async () => {
    const primary = session?.primaryTemp ?? "";
    const secondary = session?.secondaryTemp ?? "";
    const blend = secondary ? `${primary}/${secondary}` : primary;
    const name = user?.firstName ? `${user.firstName} ` : "";
    const shareText = `${name}just discovered their temperament blend on Fredora TemperaMap — a ${blend}! Take the 60-question assessment to find yours. 🧠`;
    const shareUrl = `${window.location.origin}/temperamap`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "My Temperament — Fredora TemperaMap", text: shareText, url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({ title: "Copied to clipboard!", description: "Share your result with friends." });
      } catch {
        toast({ title: "Share", description: shareText });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.status !== "completed" || !session.primaryTemp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium text-primary mb-2">Results not available</p>
          <p className="text-muted-foreground text-sm mb-6">Complete your assessment to see your temperament results.</p>
          <Button onClick={() => setLocation("/temperamap/dashboard")}>← Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const primary = session.primaryTemp;
  const secondary = session.secondaryTemp;
  const blend = session.blend ?? (secondary ? `${primary}-${secondary}` : primary);
  const info = TEMPERAMENT_INFO[primary];
  const blendDesc = BLEND_DESC[blend] ?? (secondary ? `You carry the essence of ${primary} with ${secondary} undertones.` : info?.description ?? "");
  const results = session.results ?? {};
  const partnerPrimary = partnerSession?.primaryTemp ?? "Sanguine";
  const partnerSecondary = partnerSession?.secondaryTemp ?? undefined;
  const partnerName = partnerSession?.userName || "Partner 2";
  const bgGradient = TEMP_BG[primary] ?? "from-primary to-primary/80";

  const testType = (session as any)?.testType ?? "single_test";
  const guidance = isChildTest(testType) ? (CHILD_GUIDANCE[testType]?.[primary] ?? null) : null;
  const compat = isCouplesTest(testType) ? (COUPLES_COMPATIBILITY[primary]?.[secondary ?? primary] ?? null) : null;
  const couplesPairing = isCouplesTest(testType) ? getCouplesPairing(primary, secondary ?? primary) : null;

  const adultLearning = testType === "single_test" ? getAdultLearning(primary, secondary) : null;

  const tabs: { key: TabKey; label: string }[] = (() => {
    const base: { key: TabKey; label: string }[] = [{ key: "overview", label: "Overview" }, { key: "strengths", label: "Strengths" }];
    if (isChildTest(testType)) {
      base.push({ key: "parenting", label: "Parenting Guide" }, { key: "learning", label: "Learning" });
      if (testType === "preteen_10_12" || testType === "teen_13_17") {
        base.push({ key: "career", label: "Career Paths" });
      }
    } else if (isCouplesTest(testType)) {
      base.push({ key: "compatibility", label: "Compatibility" }, { key: "communication", label: "Communication" }, { key: "love", label: "Love & Intimacy" }, { key: "life", label: "Life Together" });
    } else {
      base.push({ key: "relationships", label: "Relationships" }, { key: "emotional", label: "Emotional Profile" });
      if (adultLearning?.profile) base.push({ key: "learning", label: "Learning Style" });
      if (session.workplace) base.push({ key: "workplace", label: "Workplace Profile" });
      if (testType === "corporate_team") base.push({ key: "communication", label: "Communication" });
    }
    return base;
  })();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className={`bg-linear-to-br ${bgGradient} text-white px-4 py-12`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setLocation("/temperamap/dashboard")} className="text-white/70 hover:text-white text-sm transition-colors">
              ← Dashboard
            </button>
            <div className="cursor-pointer" onClick={() => setLocation("/temperamap")}>
              <FrederaLogo size="sm" onDark />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors"
                title="Share your result"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm mb-4">
              🏆 {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName} - Results` : user?.firstName ? `${user.firstName} - Results` : "Your Results"}
            </div>
            {info && <div className="text-4xl sm:text-5xl mb-2">{info.emoji}</div>}
            <h1 className="text-3xl sm:text-5xl font-black mb-2">{primary}</h1>
            {info && <p className="text-lg sm:text-xl text-white/80 mb-2">{info.headline}</p>}
            {secondary && (
              <div className="inline-block bg-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm mb-4">
                Secondary: {secondary}
              </div>
            )}
            {blendDesc && (
              <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-6 italic">
                {blendDesc}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
              <Button
                onClick={handleDownloadPdf}
                disabled={generatingPdf}
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold"
              >
                {generatingPdf ? "Generating..." : "⬇ Download PDF Report"}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-semibold"
              >
                Share My Result
              </Button>
              {isCouplesTest(testType) && (
                <Button
                  onClick={() => setLocation(`/compatibility/${sessionId}`)}
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-semibold"
                >
                  View Couples Compatibility Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — horizontally scrollable with smooth touch */}
      <div className="sticky top-0 z-10 bg-white border-b border-border shadow-sm">
        <div className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold shrink-0 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            {isCouplesTest(testType) && couplesPairing && (
              <PartnerComparison
                partner1={{ primary, secondary: secondary ?? undefined }}
                partner2={{ primary: partnerPrimary, secondary: partnerSecondary }}
                pairing={couplesPairing}
              />
            )}
            {Object.keys(results).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary text-base">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const maxScore = usesChildScoring(testType) ? 75 : 60;
                    return Object.entries(results)
                      .sort((a, b) => b[1] - a[1])
                      .map(([t, p]) => {
                        const pct = Math.round((p / maxScore) * 100);
                        return (
                          <div key={t}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className={`font-semibold ${t === primary ? "text-primary" : "text-muted-foreground"}`}>
                                {t} {t === primary ? "★" : ""}
                              </span>
                              <span className="font-bold text-foreground">{pct}%</span>
                            </div>
                            <Progress value={pct} className="h-2.5" />
                          </div>
                        );
                      });
                  })()}
                </CardContent>
              </Card>
            )}
            {info && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-foreground leading-relaxed">{info.description}</p>
                </CardContent>
              </Card>
            )}
            {info?.famousExamples && (
              <Card>
                <CardHeader><CardTitle className="text-base text-muted-foreground">Famous {primary}s</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {info.famousExamples.map(name => (
                      <Badge key={name} variant="secondary" className="text-sm px-3 py-1">{name}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Strengths */}
        {activeTab === "strengths" && info && (
          <>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">Key Strengths</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {info.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm">
                      <span className="text-accent font-bold mt-0.5">✓</span>
                      <span className="text-foreground leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">Growth Opportunities</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {info.growth.map((g, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm">
                      <span className="text-blue-500 font-bold mt-0.5">→</span>
                      <span className="text-foreground leading-relaxed">{g}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {/* Relationships */}
        {activeTab === "relationships" && info && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-primary">❤️ Relationships & Love</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{info.relationships}</p>
            </CardContent>
          </Card>
        )}

        {/* Emotional Profile */}
        {activeTab === "emotional" && info && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Anger Style", value: info.emotionalProfile.angerStyle, bg: "bg-red-50", border: "border-red-200", color: "text-red-700", labelColor: "text-red-600" },
              { label: "Under Stress", value: info.emotionalProfile.underStress, bg: "bg-amber-50", border: "border-amber-200", color: "text-amber-800", labelColor: "text-amber-600" },
              { label: "Core Fear", value: info.emotionalProfile.coreFear, bg: "bg-purple-50", border: "border-purple-200", color: "text-purple-800", labelColor: "text-purple-600" },
              { label: "Core Need", value: info.emotionalProfile.coreNeed, bg: "bg-green-50", border: "border-green-200", color: "text-green-800", labelColor: "text-green-600" },
            ].map(item => (
              <div key={item.label} className={`${item.bg} ${item.border} border rounded-xl p-4`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${item.labelColor} mb-2`}>{item.label}</p>
                <p className={`text-sm leading-relaxed ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Parenting Guide (child tests) */}
        {activeTab === "parenting" && guidance && (
          <>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">🎯 Discipline That Works</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground italic">{guidance.discipline.why}</p>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2">Do This</p>
                  <ul className="space-y-2">
                    {guidance.discipline.works.map((s, i) => (
                      <li key={i} className="flex gap-2 items-start text-sm"><span className="text-green-500 font-bold mt-0.5">✓</span><span>{s}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">Avoid</p>
                  <ul className="space-y-2">
                    {guidance.discipline.avoid.map((s, i) => (
                      <li key={i} className="flex gap-2 items-start text-sm"><span className="text-red-500 font-bold mt-0.5">✗</span><span>{s}</span></li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">❤️ Love & Expression</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">How They Express Love</p><p className="text-sm">{guidance.love.expresses}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">How They Receive Love</p><p className="text-sm">{guidance.love.receives}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Best Love Language</p><p className="text-sm font-medium">{guidance.love.bestLanguage}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">What Hurts Them</p><p className="text-sm">{guidance.hurts}</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">🌱 Leadership & School</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Leadership Potential</p><p className="text-sm">{guidance.leadership.potential}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">How to Develop Leadership</p>
                  <ul className="space-y-1 mt-1">
                    {guidance.leadership.howToDevelop.map((s, i) => <li key={i} className="text-sm">• {s}</li>)}
                  </ul>
                </div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">School Performance</p><p className="text-sm">{guidance.school.performance}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Tips for Teachers</p>
                  <ul className="space-y-1 mt-1">
                    {guidance.school.teacherTips.map((s, i) => <li key={i} className="text-sm">• {s}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">🌟 Encouragement</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Phrases That Build Them</p>
                  <ul className="space-y-2">
                    {guidance.encouragement.phrases.map((s, i) => <li key={i} className="text-sm bg-amber-50 rounded-lg px-3 py-2 text-amber-800">"{s}"</li>)}
                  </ul>
                </div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Actions That Matter</p>
                  <ul className="space-y-1 mt-1">
                    {guidance.encouragement.actions.map((s, i) => <li key={i} className="text-sm">• {s}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Learning (child tests) */}
        {activeTab === "learning" && guidance && (
          <>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">📚 Learning Profile</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Learning Style</p><p className="text-sm">{guidance.learning.style}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Best Teaching Methods</p>
                  <ul className="space-y-2">
                    {guidance.learning.tips.map((s, i) => <li key={i} className="flex gap-2 items-start text-sm"><span className="text-green-500 font-bold mt-0.5">✓</span><span>{s}</span></li>)}
                  </ul>
                </div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Best Subjects</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {guidance.learning.bestSubjects.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
                  </div>
                </div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Avoid</p>
                  <ul className="space-y-2">
                    {guidance.learning.avoid.map((s, i) => <li key={i} className="flex gap-2 items-start text-sm"><span className="text-red-500 font-bold mt-0.5">✗</span><span>{s}</span></li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Learning Style (adult test) */}
        {activeTab === "learning" && adultLearning?.profile && (
          <Card>
            <CardHeader><CardTitle className="text-base text-primary">📚 Learning Style</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Learning Style</p>
                <p className="text-lg font-bold text-amber-900">{adultLearning.profile.style}</p>
                <p className="text-xs text-amber-700 mt-1">
                  Primary Modality: <span className="font-semibold">{adultLearning.profile.primaryModality}</span>
                </p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{adultLearning.profile.description}</p>
              {adultLearning.secondaryNote && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Your Blend at Work</p>
                  <p className="text-sm text-foreground leading-relaxed">{adultLearning.secondaryNote}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2">Best Study Methods</p>
                <ul className="space-y-2">
                  {adultLearning.profile.studyMethods.map((s, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm"><span className="text-green-500 font-bold mt-0.5">✓</span><span className="text-foreground leading-relaxed">{s}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Ideal Study Environment</p>
                <p className="text-sm text-foreground leading-relaxed">{adultLearning.profile.idealEnvironment}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">How You Retain Best</p>
                <p className="text-sm text-foreground leading-relaxed">{adultLearning.profile.retention}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">Recommended Tools</p>
                <div className="flex flex-wrap gap-2">
                  {adultLearning.profile.tools.map((s, i) => (
                    <Badge key={i} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">What to Avoid</p>
                <ul className="space-y-2">
                  {adultLearning.profile.avoid.map((s, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm"><span className="text-red-500 font-bold mt-0.5">✗</span><span className="text-foreground leading-relaxed">{s}</span></li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workplace Profile (corporate test) */}
        {activeTab === "workplace" && session.workplace && (
          <Card>
            <CardHeader><CardTitle className="text-base text-primary">💼 Workplace Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {session.workplace.strength.coPrimary && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    You are a near-equal blend of your top two temperaments — both sides show up strongly in how you work.
                  </p>
                </div>
              )}
              {WORKPLACE_SCALES.map((scale) => {
                const s = session.workplace?.scales[scale.key];
                if (!s) return null;
                return (
                  <div key={scale.key} className="bg-muted/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold">{scale.label}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">P{s.pct}</Badge>
                        <Badge>Sten {s.sten}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(s.mean / 4) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{s.mean.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{scale.description}</p>
                  </div>
                );
              })}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2">Your Top Workplace Strengths</p>
                <ul className="space-y-2">
                  {session.workplace.topScales.slice(0, 2).map((key) => {
                    const scale = WORKPLACE_SCALES.find((w) => w.key === key);
                    return scale ? (
                      <li key={key} className="text-sm text-foreground leading-relaxed">
                        <span className="font-semibold">{scale.label}:</span> {scale.strengths[0]}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
              {session.workplace.responseQuality.flag !== "ok" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Interpretation note</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    Some answers followed a pattern consistent with presenting yourself very favourably (or with rushing through).
                    Results should be read with some caution.
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Percentiles compare you against a provisional working-adult model (normVersion: {session.workplace.normVersion}),
                not a real sample. Raw per-item means are stored so a real norm group can be applied later.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Communication Guide (corporate) */}
        {activeTab === "communication" && testType === "corporate_team" && (
          <IndividualCommunicationGuide row={primary} />
        )}

        {/* Career Paths (older children) */}
        {activeTab === "career" && guidance?.career && (
          <>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">💼 Career Paths</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{guidance.career.description}</p>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">Key Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {guidance.career.strengths.map((s, i) => (
                      <Badge key={i} className="bg-amber-50 text-amber-700 border-amber-200">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Suggested Careers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {guidance.career.suggestions.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                        <span className="text-blue-500 font-bold">→</span>
                        <span className="text-sm text-blue-900">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Compatibility (couples test) */}
        {activeTab === "compatibility" && compat && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-primary">{primary} × {secondary ?? primary}</CardTitle>
                <p className="text-sm text-muted-foreground">Compatibility Score: <span className="font-bold text-amber-600">{compat.score}/5</span> — {compat.label}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{compat.summary}</p>
                <div><p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Strengths</p>
                  <ul className="space-y-2">
                    {compat.strengths.map((s, i) => <li key={i} className="flex gap-2 items-start text-sm"><span className="text-green-500 font-bold mt-0.5">✓</span><span>{s}</span></li>)}
                  </ul>
                </div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Challenges</p>
                  <ul className="space-y-2">
                    {compat.challenges.map((s, i) => <li key={i} className="flex gap-2 items-start text-sm"><span className="text-amber-500 font-bold mt-0.5">!</span><span>{s}</span></li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">💬 Communication Guide</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {compat.communication.map((s, i) => <li key={i} className="text-sm bg-blue-50 rounded-lg px-3 py-2 text-blue-800">{s}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-primary">✨ Advice for This Pair</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {compat.advice.map((s, i) => <li key={i} className="flex gap-2 items-start text-sm"><span className="text-accent font-bold mt-0.5">→</span><span>{s}</span></li>)}
                </ul>
              </CardContent>
            </Card>
            {couplesPairing && <ConflictPlaybook pairing={couplesPairing} />}
          </>
        )}

        {/* Communication Guide (couples) */}
        {activeTab === "communication" && couplesPairing && (
          <CommunicationGuide pairing={couplesPairing} />
        )}

        {/* Love & Intimacy (couples) */}
        {activeTab === "love" && couplesPairing && (
          <LoveLanguageCard pairing={couplesPairing} partner1Name={user?.firstName || "Partner 1"} partner2Name={partnerName} />
        )}

        {/* Life Together (couples) */}
        {activeTab === "life" && couplesPairing && (
          <LifeAreasCard pairing={couplesPairing} />
        )}

        {/* Share CTA at bottom */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <p className="text-primary font-semibold mb-1">Know someone who should take this?</p>
            <p className="text-muted-foreground text-sm mb-4">Share your result and invite them to discover their temperament</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleShare} className="bg-accent hover:bg-amber-600 text-white font-bold">
                Share My Result
              </Button>
              <Button variant="outline" onClick={() => setLocation("/select-test")} className="border-primary/30 text-primary">
                Take Another Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-8 py-6 px-4 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          Results are for self-insight only — not a clinical diagnosis.{" "}
          <a href="/temperamap/terms" className="text-accent hover:underline">Terms</a>
          {" · "}
          <a href="/temperamap/privacy" className="text-accent hover:underline">Privacy</a>
        </p>
      </footer>
    </div>
  );
}
