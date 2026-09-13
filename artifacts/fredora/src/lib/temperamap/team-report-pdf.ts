import { WORKPLACE_SCALES, type WorkplaceProfile } from "./workplace.ts";
import type { WorkplaceAggregation } from "./corporate-workplace.ts";
import { TEAM_ROLES, commPairsAll } from "./corporate-data.ts";
import { renderCommBlocks, renderCommGrid } from "./communication-pdf.ts";
import type { TeamComposition, ConflictPair } from "./corporate-data.ts";

export interface RoleMember {
  memberId: string;
  memberName: string;
  role: string;
  temperament: string;
  icon: string;
}

export interface PdfMember {
  memberId: string;
  memberName: string;
  primaryTemp: string;
  results: Record<string, number>;
  workplace?: WorkplaceProfile | null;
}

export interface TeamReportPdfParams {
  teamName: string;
  generatedAt: string;
  cachedAt: string | null;
  composition: TeamComposition;
  conflictPairs: ConflictPair[];
  roleMembers: RoleMember[];
  members: PdfMember[];
  agg: WorkplaceAggregation;
}

const TEMPERAMENTS = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];

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

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function downloadTeamReportPdf(params: TeamReportPdfParams): Promise<void> {
  const { teamName, generatedAt, cachedAt, composition, conflictPairs, roleMembers, members, agg } =
    params;
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = w - margin * 2;
  let y = 0;
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

  const addText = (
    text: string,
    size: number,
    isBold = false,
    color: [number, number, number] = [70, 70, 70],
    indent = 0
  ) => {
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

  // ── COVER ─────────────────────────────────────────────────────────────
  doc.setFillColor(25, 55, 115);
  doc.rect(0, 0, w, 52, "F");
  y = 22;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("FREDORA TEMPERAMAP", margin, y);
  y += 12;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Team Report", margin, y);
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(200, 215, 255);
  doc.text(teamName, margin, y);
  y += 8;
  doc.setFontSize(9);
  doc.text(
    new Date(generatedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }),
    margin,
    y
  );
  if (cachedAt) {
    y += 6;
    doc.text(`Generated from cached report — ${new Date(cachedAt).toLocaleString("en-NG")}`, margin, y);
  }
  y = 64;

  // ── EXECUTIVE SUMMARY ──────────────────────────────────────────────────
  addSectionHeader("Executive Summary");
  addText(composition.executiveSummary, 10);
  addText(`Dominant style: ${composition.dominantStyle}`, 10, true, [30, 30, 30]);
  y += 2;

  addText("Balance Score", 9, true, [60, 60, 60]);
  const balX = margin + 45;
  const balW = contentW - 65;
  doc.setFillColor(238, 238, 243);
  doc.roundedRect(balX, y, balW, 5, 2.5, 2.5, "F");
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(balX, y, Math.max(2, balW * (composition.balanceScore / 100)), 5, 2.5, 2.5, "F");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`${composition.balanceScore}/100`, balX + balW + 3, y + 3);
  y += 10;

  if (composition.balanceGaps.length > 0) {
    addSubHeader("Balance Gaps");
    for (const gap of composition.balanceGaps) addBullet(gap, [245, 158, 11]);
    y += 2;
  }
  if (composition.recommendations.length > 0) {
    addSubHeader("Recommendations");
    composition.recommendations.forEach((rec, i) => addText(`${i + 1}. ${rec}`, 9, false, [60, 60, 60], 4));
  }

  // ── TEAM DNA ───────────────────────────────────────────────────────────
  addSectionHeader("Team DNA");
  const cx = margin + 24;
  const cy = y + 22;
  const radius = 18;
  let angleStart = 0;
  for (const temp of TEMPERAMENTS) {
    const pct = composition.percentages[temp] || 0;
    if (pct <= 0) continue;
    const sweep = (pct / 100) * 360;
    const steps = Math.max(8, Math.ceil(sweep / 5));
    const color = TEMP_COLORS[temp] || [120, 120, 120];
    doc.setDrawColor(...color);
    doc.setLineWidth(6);
    doc.setLineCap("round");
    for (let i = 0; i < steps; i++) {
      const a0 = ((angleStart + (sweep * i) / steps) * Math.PI) / 180;
      const a1 = ((angleStart + (sweep * (i + 1)) / steps) * Math.PI) / 180;
      doc.line(
        cx + radius * Math.cos(a0),
        cy + radius * Math.sin(a0),
        cx + radius * Math.cos(a1),
        cy + radius * Math.sin(a1)
      );
    }
    angleStart += sweep;
  }
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(`${composition.balanceScore}`, cx - 4, cy + 1);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("BALANCE /100", cx - 4, cy + 6);

  const lx = margin + 54;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Dominant Style", lx, y + 2);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.text(composition.dominantStyle, lx, y + 8);
  doc.setFontSize(8);
  TEMPERAMENTS.forEach((temp, i) => {
    const ly = y + 16 + i * 5;
    doc.setFillColor(...(TEMP_COLORS[temp] || [120, 120, 120]));
    doc.circle(lx + 1.5, ly - 1.2, 1.5, "F");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(temp, lx + 5, ly);
    doc.setTextColor(120, 120, 120);
    doc.text(`${composition.percentages[temp] || 0}%`, lx + 34, ly);
  });
  y += 44;

  // ── WORKPLACE AGGREGATION ──────────────────────────────────────────────
  addSectionHeader("Workplace Aggregation");
  const barX = margin + 60;
  const barW = contentW - 100;
  for (const scale of WORKPLACE_SCALES) {
    const s = agg.scales[scale.key];
    if (!s || s.n === 0) continue;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(scale.label, margin + 2, y + 3);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 90);
    doc.text(`P${s.pct} · H ${s.high} / M ${s.mid} / L ${s.low}`, barX + barW + 2, y + 3);
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
  if (agg.topScales.length > 0) {
    addSubHeader("Top Team Strengths");
    for (const t of agg.topScales) {
      const scale = WORKPLACE_SCALES.find((sc) => sc.key === t.key);
      if (!scale) continue;
      addText(`${scale.label}: ${t.strengths[0]}`, 9);
      addText(`Work with: ${t.workWith}`, 8, false, [120, 120, 120]);
    }
    y += 2;
  }

  // ── TEAM ROLES ─────────────────────────────────────────────────────────
  addSectionHeader("Team Roles");
  for (const rm of roleMembers) {
    if (y > 200) { doc.addPage(); y = 20; }
    const roleData = TEAM_ROLES[rm.role] || TEAM_ROLES[rm.temperament];
    addSubHeader(`${roleData?.icon || rm.icon || ""} ${roleData?.role || rm.role}`, [30, 69, 128]);
    addText(`${rm.memberName} — ${rm.temperament}`, 9, true, [100, 100, 100]);
    if (roleData) {
      addText(roleData.description, 9);
      addSubHeader("Strengths");
      for (const s of roleData.strengths) addBullet(s, [34, 197, 94]);
      addSubHeader("Ideal Responsibilities");
      for (const s of roleData.idealResponsibilities) addBullet(s, [59, 130, 246]);
      addSubHeader("Watch Out For");
      for (const s of roleData.watchOutFor) addBullet(s, [245, 158, 11]);
      addSubHeader("Motivators");
      for (const s of roleData.motivators) addBullet(s, [168, 85, 247]);
    }
    addDivider();
  }

  // ── COMMUNICATION MATRIX ───────────────────────────────────────────────
  addSectionHeader("Communication Matrix");
  addText("How each temperament pair works together best, from the FREDORA TemperaMap guide.", 8, false, [120, 120, 120]);
  if (y > h - 95) { doc.addPage(); y = 20; }
  y = renderCommGrid(doc, commPairsAll(), { startY: y, margin, contentW });
  y = renderCommBlocks(doc, commPairsAll(), { startY: y, margin, contentW });

  // ── CONFLICT RISK ──────────────────────────────────────────────────────
  addSectionHeader("Conflict Risk Assessment");
  if (conflictPairs.length === 0) {
    addText("No high-risk temperament pairings found in this team.", 9, false, [120, 120, 120]);
  }
  for (const pair of conflictPairs) {
    if (y > 220) { doc.addPage(); y = 20; }
    const riskColor: [number, number, number] =
      pair.risk === "high" ? [220, 38, 38] : pair.risk === "medium" ? [245, 158, 11] : [34, 197, 94];
    addSubHeader(`${pair.pair[0]} & ${pair.pair[1]} — ${capitalize(pair.risk)} Risk`, riskColor);
    addText(pair.description, 9);
    addSubHeader("Mitigation Strategies");
    pair.mitigation.forEach((m, i) => addText(`${i + 1}. ${m}`, 9, false, [60, 60, 60], 4));
    addDivider();
  }

  // ── MEMBER PROFILES ────────────────────────────────────────────────────
  addSectionHeader("Member Profiles");
  let footnoteAdded = false;
  for (const member of members) {
    if (y > 190) { doc.addPage(); y = 20; }
    addSubHeader(member.memberName, [30, 69, 128]);
    addText(`Primary temperament: ${member.primaryTemp}`, 9, true, [100, 100, 100]);

    for (const temp of TEMPERAMENTS) {
      const score = member.results[temp] || 0;
      const tc = TEMP_COLORS[temp] || [120, 120, 120];
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.text(temp, margin + 2, y + 3);
      const mBarX = margin + 40;
      const mBarW = contentW - 70;
      doc.setFillColor(238, 238, 243);
      doc.roundedRect(mBarX, y, mBarW, 4, 2, 2, "F");
      doc.setFillColor(...tc);
      doc.roundedRect(mBarX, y, Math.max(2, mBarW * (score / 60)), 4, 2, 2, "F");
      doc.setTextColor(90, 90, 90);
      doc.text(`${score}`, mBarX + mBarW + 3, y + 3);
      y += 7;
    }
    y += 3;

    if (member.workplace) {
      addSubHeader("Workplace Profile", [59, 130, 246]);
      const wBarX = margin + 52;
      const wBarW = contentW - 82;
      for (const scale of WORKPLACE_SCALES) {
        const s = member.workplace.scales[scale.key];
        if (!s) continue;
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(90, 90, 90);
        doc.text(scale.label, margin + 2, y + 3);
        doc.setFillColor(238, 238, 243);
        doc.roundedRect(wBarX, y, wBarW, 4, 2, 2, "F");
        doc.setFillColor(59, 130, 246);
        doc.roundedRect(wBarX, y, Math.max(2, wBarW * (s.mean / 4)), 4, 2, 2, "F");
        doc.setTextColor(120, 120, 120);
        doc.text(`P${s.pct}`, wBarX + wBarW + 3, y + 3);
        y += 7;
      }
      y += 2;
      if (member.workplace.responseQuality.flag !== "ok") {
        addText("Note: response pattern warrants caution when interpreting this member's workplace profile.", 8, false, [180, 120, 40]);
      }
      if (!footnoteAdded) {
        addText("Percentiles use a provisional working-adult model, not a real norm sample.", 8, false, [120, 120, 120]);
        footnoteAdded = true;
      }
    }

    const roleData = TEAM_ROLES[member.primaryTemp];
    if (roleData) {
      addSubHeader(roleData.role, [124, 58, 237]);
      addText(roleData.description, 9);
      addSubHeader("Strengths");
      for (const s of roleData.strengths.slice(0, 4)) addBullet(s, [34, 197, 94]);
      addSubHeader("Growth Areas");
      for (const g of roleData.watchOutFor) addBullet(g, [245, 158, 11]);
    }
    addDivider();
  }

  // ── PAGE FOOTER ─────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`TemperaMap Team Report — ${teamName} · Page ${i} of ${pageCount}`, w / 2, h - 8, { align: "center" });
  }

  const safeName =
    teamName.replace(/[^a-zA-Z0-9- ]/g, "").trim().replace(/\s+/g, "-") || "Team";
  doc.save(`TemperaMap-TeamReport-${safeName}.pdf`);
}
