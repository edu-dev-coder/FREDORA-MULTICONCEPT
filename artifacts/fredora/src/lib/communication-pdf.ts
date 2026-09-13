import { MEDIUM_PAIRS, type CommPairDetail } from "./corporate-data.ts";
import type { jsPDF } from "jspdf";

export interface CommPdfLayout {
  startY: number;
  margin: number;
  contentW: number;
}

const COMM_TEMPERAMENTS = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];

const TEMP_COLORS: Record<string, [number, number, number]> = {
  Sanguine: [245, 158, 11],
  Choleric: [239, 68, 68],
  Melancholic: [59, 130, 246],
  Phlegmatic: [34, 197, 94],
};

function cellColors(a: string, b: string): { fill: [number, number, number]; border: [number, number, number] } {
  if (a === b) return { fill: [240, 253, 244], border: [34, 197, 94] };
  if (MEDIUM_PAIRS.includes(`${a}-${b}`)) return { fill: [255, 251, 235], border: [245, 158, 11] };
  return { fill: [254, 242, 242], border: [239, 68, 68] };
}

export function renderCommGrid(doc: jsPDF, pairs: CommPairDetail[], layout: CommPdfLayout): number {
  const { startY, margin, contentW } = layout;
  const h = doc.internal.pageSize.getHeight();
  let y = startY;
  const labelW = 28;
  const cellW = (contentW - labelW) / COMM_TEMPERAMENTS.length;
  const headerH = 10;
  const rowH = 15;

  if (y > h - 90) { doc.addPage(); y = 20; }

  doc.setFillColor(30, 69, 128);
  doc.rect(margin, y, contentW, headerH, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Pair", margin + 3, y + 6);
  for (let c = 0; c < COMM_TEMPERAMENTS.length; c++) {
    doc.text(COMM_TEMPERAMENTS[c], margin + labelW + c * cellW + cellW / 2, y + 6, { align: "center" });
  }
  y += headerH;

  const rows = [...new Set(pairs.map((p) => p.row))];
  for (const row of rows) {
    if (y > h - 35) { doc.addPage(); y = 20; }
    doc.setFillColor(250, 251, 253);
    doc.rect(margin, y, labelW, rowH, "F");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(row, margin + 3, y + 6);
    for (let c = 0; c < COMM_TEMPERAMENTS.length; c++) {
      const col = COMM_TEMPERAMENTS[c];
      const pair = pairs.find((p) => p.row === row && p.col === col);
      const cc = cellColors(row, col);
      doc.setFillColor(...cc.fill);
      doc.rect(margin + labelW + c * cellW, y, cellW, rowH, "F");
      doc.setDrawColor(...cc.border);
      doc.setLineWidth(0.3);
      doc.rect(margin + labelW + c * cellW, y, cellW, rowH, "S");
      if (pair) {
        const snippet = pair.data.bestApproach.length > 38 ? pair.data.bestApproach.slice(0, 38) + "…" : pair.data.bestApproach;
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 70, 70);
        doc.splitTextToSize(snippet, cellW - 3).slice(0, 3).forEach((line: string, li: number) => {
          doc.text(line, margin + labelW + c * cellW + 1.5, y + 4 + li * 3);
        });
      }
    }
    y += rowH;
  }
  return y + 4;
}

export function renderCommBlocks(doc: jsPDF, pairs: CommPairDetail[], layout: CommPdfLayout): number {
  const { startY, margin, contentW } = layout;
  const h = doc.internal.pageSize.getHeight();
  let y = startY;

  const addLabeled = (label: string, value: string) => {
    if (y > h - 40) { doc.addPage(); y = 20; }
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(217, 119, 6);
    doc.text(label.toUpperCase(), margin + 2, y);
    y += 4;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(value, contentW - 4);
    for (const line of lines) {
      if (y > h - 20) { doc.addPage(); y = 20; }
      doc.text(line, margin + 2, y);
      y += 4;
    }
    y += 2;
  };

  for (const pair of pairs) {
    if (y > h - 65) { doc.addPage(); y = 20; }
    const color = TEMP_COLORS[pair.row] || [120, 120, 120];
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...color);
    doc.text(`${pair.row} → ${pair.col}`, margin + 2, y);
    y += 5;
    addLabeled("Best Approach", pair.data.bestApproach);
    addLabeled("Meeting Style", pair.data.meetingStyle);
    addLabeled("Feedback Style", pair.data.feedbackStyle);
    addLabeled("Friction Point", pair.data.frictionPoint);
    addLabeled("Tip", pair.data.tip);
    doc.setDrawColor(230, 230, 235);
    doc.setLineWidth(0.2);
    doc.line(margin + 2, y, margin + contentW - 2, y);
    y += 4;
  }
  return y;
}
