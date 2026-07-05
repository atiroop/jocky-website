import path from "node:path";
import PDFDocument from "pdfkit";
import * as XLSX from "xlsx";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  formatDisplayDate,
  formatDrainageAppearance,
  startOfRange,
  toNumber,
} from "@/app/apd-log-book/_lib";

export const dynamic = "force-dynamic";

const FONT_PATH = path.join(process.cwd(), "assets/fonts/NotoSansThai-Regular.ttf");

const columns = [
  { header: "วันที่", key: "date", width: 70 },
  { header: "เวลาเริ่ม", key: "startTime", width: 50 },
  { header: "น้ำหนัก (kg)", key: "weight", width: 55 },
  { header: "ความดัน", key: "bp", width: 50 },
  { header: "ชีพจร", key: "pulse", width: 40 },
  { header: "น้ำตาล (mg/dL)", key: "glucose", width: 60 },
  { header: "I-Drain (ml)", key: "iDrain", width: 55 },
  { header: "Total UF (ml)", key: "totalUf", width: 60 },
  { header: "ปัสสาวะ/วัน (ml)", key: "urine", width: 65 },
  { header: "น้ำยาออก", key: "drainage", width: 90 },
  { header: "ใบสั่งฯ", key: "prescription", width: 90 },
  { header: "หมายเหตุ", key: "remark", width: 110 },
] as const;

type ExportRow = Record<(typeof columns)[number]["key"], string | number>;

async function getExportRows(userId: number, days: number): Promise<ExportRow[]> {
  const logs = await prisma.aPDDailyLog.findMany({
    where: { userId, date: { gte: startOfRange(days) } },
    include: { prescription: true },
    orderBy: { date: "asc" },
  });

  return logs.map((log) => ({
    date: formatDisplayDate(log.date),
    startTime: log.treatmentStartTime,
    weight: toNumber(log.weightKg),
    bp: `${log.systolicBp}/${log.diastolicBp}`,
    pulse: log.pulse,
    glucose: log.bloodGlucoseMgDl ?? "",
    iDrain: log.iDrainVolumeMl,
    totalUf: log.totalUfMl,
    urine: log.urineAvgDayMl,
    drainage: formatDrainageAppearance(log.drainageAppearance),
    prescription: log.prescription?.name ?? "",
    remark: log.remark ?? "",
  }));
}

function buildXlsx(rows: ExportRow[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: columns.map((column) => column.key),
    skipHeader: true,
  });
  XLSX.utils.sheet_add_aoa(worksheet, [columns.map((column) => column.header)], {
    origin: "A1",
  });
  worksheet["!cols"] = columns.map((column) => ({ wch: Math.round(column.width / 4) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "APD Log");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

function buildPdf(rows: ExportRow[], days: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.registerFont("thai", FONT_PATH);
    doc.font("thai");

    doc.fontSize(16).text(`สมุดบันทึก APD - ย้อนหลัง ${days} วัน`, { align: "center" });
    doc.moveDown(1.2);

    const startX = doc.page.margins.left;
    const rowHeight = 20;
    let y = doc.y;

    const drawRow = (values: (string | number)[], isHeader: boolean) => {
      let x = startX;
      doc.fontSize(isHeader ? 9 : 8.5);
      values.forEach((value, i) => {
        doc.text(String(value), x, y, { width: columns[i].width, ellipsis: true });
        x += columns[i].width;
      });
      y += rowHeight;

      if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
        doc.addPage({ margin: 30, size: "A4", layout: "landscape" });
        doc.font("thai");
        y = doc.page.margins.top;
      }
    };

    drawRow(
      columns.map((column) => column.header),
      true
    );
    const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);
    doc
      .moveTo(startX, y - 4)
      .lineTo(startX + tableWidth, y - 4)
      .strokeColor("#18122B")
      .stroke();

    if (rows.length === 0) {
      doc.fontSize(10).text("ยังไม่มีข้อมูลในช่วงเวลานี้", startX, y);
    }

    rows.forEach((row) => {
      drawRow(
        columns.map((column) => row[column.key]),
        false
      );
    });

    doc.end();
  });
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const days = searchParams.get("days") === "30" ? 30 : 7;
  const format = searchParams.get("format") === "pdf" ? "pdf" : "xlsx";

  const rows = await getExportRows(session.userId, days);

  if (format === "xlsx") {
    const buffer = buildXlsx(rows);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="apd-log-${days}-days.xlsx"`,
      },
    });
  }

  const pdfBuffer = await buildPdf(rows, days);
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="apd-log-${days}-days.pdf"`,
    },
  });
}
