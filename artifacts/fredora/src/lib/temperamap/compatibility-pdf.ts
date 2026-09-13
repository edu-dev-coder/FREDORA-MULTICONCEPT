import type { CouplesCompatibility } from "./couples-compatibility.ts";
import type { jsPDF as JsPDF } from "jspdf";

export interface PdfSessionInput {
  userName?: string | null;
  primaryTemp?: string | null;
  secondaryTemp?: string | null;
  results?: Record<string, number> | null;
}

export interface BuildCompatibilityPdfInput {
  compat: CouplesCompatibility;
  mySession: PdfSessionInput;
  partnerSession: PdfSessionInput;
}

const TEMP_COLORS: Record<string, [number, number, number]> = {
  Sanguine: [245, 158, 11],
  Choleric: [239, 68, 68],
  Melancholic: [59, 130, 246],
  Phlegmatic: [34, 197, 94],
};

const LEVEL_RGB: Record<string, [number, number, number]> = {
  "Exceptional Compatibility": [22, 163, 74],
  "Highly Compatible": [22, 163, 74],
  "Good Compatibility": [37, 99, 235],
  "Moderate Compatibility": [217, 119, 6],
  "Challenging but Workable": [234, 88, 12],
  "High-Care Relationship": [168, 85, 247],
};

const SECTION_COLORS: [number, number, number][] = [
  [30, 69, 128],
  [124, 58, 237],
  [22, 163, 74],
  [217, 119, 6],
  [220, 38, 38],
  [59, 130, 246],
];

const BRAND = "TemperaMap Couples Compatibility";

export function pdfFileName(tempA: string, tempB: string): string {
  return `TemperaMap-Compatibility-${tempA}-${tempB}.pdf`;
}

export async function buildCompatibilityPdf(
  input: BuildCompatibilityPdfInput
): Promise<{ doc: JsPDF; filename: string }> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { compat, mySession, partnerSession } = input;
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = w - margin * 2;
  let y = 0;
  let sectionIdx = 0;

  const myTemp = mySession.primaryTemp || "Sanguine";
  const partnerTemp = partnerSession.primaryTemp || "Sanguine";
  const filename = pdfFileName(myTemp, partnerTemp);

  const addFooter = (pageNum: number) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`${BRAND} — page ${pageNum}`, w / 2, h - 8, { align: "center" });
  };

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

  doc.setFillColor(25, 55, 115);
  doc.rect(0, 0, w, 88, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Couples Compatibility Report", w / 2, 32, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    mySession.userName ? `${mySession.userName} (${myTemp})` : `Partner 1 (${myTemp})`,
    w / 2,
    56,
    { align: "center" }
  );
  doc.text(
    partnerSession.userName ? `${partnerSession.userName} (${partnerTemp})` : `Partner 2 (${partnerTemp})`,
    w / 2,
    64,
    { align: "center" }
  );

  y = 104;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(44);
  doc.setFont("helvetica", "bold");
  doc.text(`${compat.overall}%`, w / 2, y, { align: "center" });
  y += 14;
  doc.setFontSize(14);
  doc.setTextColor(...(LEVEL_RGB[compat.level] || [25, 55, 115]));
  doc.text(compat.level, w / 2, y, { align: "center" });
  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.text(compat.pairingLabel, w / 2, y, { align: "center" });
  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  const framingLines = doc.splitTextToSize(compat.framing, contentW - 20);
  for (const line of framingLines) {
    doc.text(line, w / 2, y, { align: "center" });
    y += 4;
  }

  doc.addPage();
  y = 20;

  addSectionHeader("Compatibility by Area");
  for (const d of compat.dimensions) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(d.label, margin + 2, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${d.score}%`, w - margin - 2, y, { align: "right" });
    y += 3;
    doc.setDrawColor(230, 230, 235);
    doc.setLineWidth(1);
    doc.line(margin + 2, y, w - margin - 2, y);
    doc.setDrawColor(25, 55, 115);
    doc.setLineWidth(1.4);
    doc.line(margin + 2, y, margin + 2 + (contentW - 4) * (d.score / 100), y);
    y += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110, 110, 110);
    const meaningLines = doc.splitTextToSize(d.meaning, contentW - 8);
    for (const line of meaningLines) {
      if (y > 268) { doc.addPage(); y = 20; }
      doc.text(line, margin + 2, y);
      y += 3.2;
    }
    doc.setTextColor(25, 55, 115);
    doc.setFont("helvetica", "bold");
    const tipLines = doc.splitTextToSize(`Tip: ${d.tip}`, contentW - 8);
    for (const line of tipLines) {
      if (y > 268) { doc.addPage(); y = 20; }
      doc.text(line, margin + 2, y);
      y += 3.2;
    }
    y += 4;
  }

  addSectionHeader("Temperament Score Breakdown");
  const myRes = mySession.results || {};
  const partnerRes = partnerSession.results || {};
  const myMax = Math.max(...Object.values(myRes), 1);
  const partnerMax = Math.max(...Object.values(partnerRes), 1);
  for (const t of ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"]) {
    if (y > 245) { doc.addPage(); y = 20; }
    const myVal = myRes[t] || 0;
    const partnerVal = partnerRes[t] || 0;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(`${t}   ${myVal} vs ${partnerVal}`, margin + 2, y);
    y += 3;
    const half = (contentW - 4) / 2;
    const myW = half * (myVal / myMax);
    const partnerW = half * (partnerVal / partnerMax);
    doc.setFillColor(232, 235, 242);
    doc.roundedRect(margin + 2, y, half, 3, 1, 1, "F");
    doc.setFillColor(25, 55, 115);
    doc.roundedRect(margin + 2 + half - myW, y, myW, 3, 1, 1, "F");
    doc.setFillColor(232, 235, 242);
    doc.roundedRect(margin + 2 + half, y, half, 3, 1, 1, "F");
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(margin + 2 + half + half - partnerW, y, partnerW, 3, 1, 1, "F");
    y += 9;
  }
  addText("You (navy) vs Partner (purple) — share of each temperament in each profile.", 8, false, [130, 130, 130]);

  addSectionHeader("Your Pairing");
  addText(compat.pairingLabel, 11, true);
  addText(compat.pairSummary, 9);
  addBullet(compat.bestStrength, [22, 163, 74]);
  addBullet(compat.biggestChallenge, [217, 119, 6]);

  addSectionHeader("Major Risk Areas");
  for (const risk of compat.majorRisks) addBullet(risk, [220, 38, 38]);

  addSectionHeader("Growth Areas");
  for (const area of compat.growthAreas) addBullet(area, [22, 163, 74]);

  addSectionHeader("Relationship Advice");
  for (const advice of compat.relationshipAdvice) addBullet(advice, [25, 55, 115]);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(i);
  }

  return { doc, filename };
}

export async function generateCompatibilityPdf(input: BuildCompatibilityPdfInput): Promise<string> {
  const { doc, filename } = await buildCompatibilityPdf(input);
  doc.save(filename);
  return filename;
}
