import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import ApdShell from "./_components/ApdShell";
import TrendChart from "./_components/TrendChart";
import {
  average,
  ensureDefaultPrescription,
  formatDisplayDate,
  formatNumber,
  startOfRange,
  toNumber,
} from "./_lib";

export const dynamic = "force-dynamic";

const statAccents = [
  { bg: "#FCE7F3", border: "#F472B6" },
  { bg: "#EDE9FE", border: "#A78BFA" },
  { bg: "#CFFAFE", border: "#22D3EE" },
  { bg: "#ECFCCB", border: "#A3E635" },
  { bg: "#FFEDD5", border: "#FB923C" },
];

function StatCard({
  label,
  value,
  detail,
  accent = 0,
}: {
  label: string;
  value: string;
  detail?: string;
  accent?: number;
}) {
  const { bg, border } = statAccents[accent % statAccents.length];
  return (
    <div
      className="rounded-2xl border-[3px] px-5 py-4 shadow-[5px_5px_0_0_#18122B]"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <p className="text-xs font-black uppercase tracking-widest text-[#18122B]/70">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-[#18122B]">{value}</p>
      {detail && <p className="mt-1 text-xs font-bold text-[#18122B]/60">{detail}</p>}
    </div>
  );
}

export default async function ApdLogBookPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const days = params.days === "30" ? 30 : 7;
  await ensureDefaultPrescription(session.userId);

  const [latestLog, sevenDayLogs, chartLogs] = await Promise.all([
    prisma.aPDDailyLog.findFirst({
      where: { userId: session.userId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      include: { prescription: true },
    }),
    prisma.aPDDailyLog.findMany({
      where: { userId: session.userId, date: { gte: startOfRange(7) } },
      orderBy: { date: "asc" },
    }),
    prisma.aPDDailyLog.findMany({
      where: { userId: session.userId, date: { gte: startOfRange(days) } },
      orderBy: { date: "asc" },
    }),
  ]);

  const sevenDayUf = average(sevenDayLogs.map((log) => log.totalUfMl));
  const sevenDayWeight = average(sevenDayLogs.map((log) => toNumber(log.weightKg)));
  const chartPoints = chartLogs.map((log) => ({
    label: new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short" }).format(log.date),
    totalUfMl: log.totalUfMl,
    weightKg: toNumber(log.weightKg),
    systolicBp: log.systolicBp,
    diastolicBp: log.diastolicBp,
  }));

  return (
    <ApdShell>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-[#DB2777] text-xs font-black tracking-[0.18em] mb-3">
            {"// บันทึก APD ส่วนตัว"}
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#18122B]">
            สมุดบันทึก APD
          </h1>
          <p className="mt-2 text-sm font-bold text-[#18122B]/60">
            บันทึกข้อมูลล้างไตทางช่องท้องและติดตามแนวโน้มประจำวัน
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/apd/new"
            className="rounded-2xl border-[3px] border-[#18122B] bg-[linear-gradient(90deg,#EC4899_0%,#F97316_100%)] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_0_#18122B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#18122B] transition-all"
          >
            + บันทึกใหม่
          </Link>
          <Link
            href="/apd/logs"
            className="rounded-2xl border-[3px] border-[#18122B] bg-white px-5 py-3 text-sm font-black text-[#7C3AED] shadow-[4px_4px_0_0_#18122B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#18122B] transition-all"
          >
            ดูรายการย้อนหลัง
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          accent={0}
          label="Total UF ล่าสุด"
          value={formatNumber(latestLog?.totalUfMl, " ml")}
          detail={latestLog ? formatDisplayDate(latestLog.date) : undefined}
        />
        <StatCard
          accent={1}
          label="น้ำหนักล่าสุด"
          value={latestLog ? formatNumber(toNumber(latestLog.weightKg), " kg") : "—"}
          detail={latestLog ? formatDisplayDate(latestLog.date) : undefined}
        />
        <StatCard
          accent={2}
          label="ความดันล่าสุด"
          value={latestLog ? `${latestLog.systolicBp}/${latestLog.diastolicBp}` : "—"}
          detail={latestLog ? `ชีพจร ${latestLog.pulse}` : undefined}
        />
        <StatCard
          accent={3}
          label="ค่าเฉลี่ย Total UF 7 วัน"
          value={formatNumber(sevenDayUf, " ml")}
          detail={`${sevenDayLogs.length} รายการ`}
        />
        <StatCard
          accent={4}
          label="ค่าเฉลี่ยน้ำหนัก 7 วัน"
          value={formatNumber(sevenDayWeight, " kg")}
          detail={`${sevenDayLogs.length} รายการ`}
        />
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black tracking-tight text-[#18122B]">แนวโน้ม</h2>
        <div className="flex rounded-full border-[3px] border-[#18122B] bg-white p-1 shadow-[3px_3px_0_0_#18122B]">
          {[7, 30].map((range) => (
            <Link
              key={range}
              href={`/apd?days=${range}`}
              className={`rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                days === range
                  ? "bg-[#7C3AED] text-white"
                  : "text-[#18122B]/60 hover:text-[#7C3AED]"
              }`}
            >
              {range} วัน
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <TrendChart
          title="Total UF"
          unit="ml"
          points={chartPoints.map((point) => ({
            label: point.label,
            value: point.totalUfMl,
          }))}
        />
        <TrendChart
          title="น้ำหนัก"
          unit="kg"
          points={chartPoints.map((point) => ({
            label: point.label,
            value: point.weightKg,
          }))}
        />
        <TrendChart
          title="ความดันโลหิต"
          unit="mmHg"
          primaryLabel="ตัวบน"
          secondLabel="ตัวล่าง"
          points={chartPoints.map((point) => ({
            label: point.label,
            value: point.systolicBp,
            secondValue: point.diastolicBp,
          }))}
        />
      </div>

      {latestLog?.prescription && (
        <section className="rounded-2xl border-[3px] border-[#18122B] bg-white p-5 shadow-[5px_5px_0_0_#18122B]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-black tracking-tight text-[#18122B]">ใบสั่งการรักษาล่าสุด</h2>
            {latestLog.prescription.isDefaultProfile && (
              <span className="rounded-full border-[2px] border-[#18122B] bg-[#FDE047] px-3 py-1 text-xs font-black text-[#18122B]">
                โปรไฟล์เริ่มต้น
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-[#18122B] md:grid-cols-4">
            <p><span className="block text-xs font-bold text-[#18122B]/50">น้ำยาถุงที่ 1</span>{latestLog.prescription.solutionBag1}</p>
            <p><span className="block text-xs font-bold text-[#18122B]/50">น้ำยาถุงที่ 2</span>{latestLog.prescription.solutionBag2}</p>
            <p><span className="block text-xs font-bold text-[#18122B]/50">ปริมาตรรวม</span>{latestLog.prescription.totalVolumeMl} ml</p>
            <p><span className="block text-xs font-bold text-[#18122B]/50">เวลารักษารวม</span>{latestLog.prescription.therapyTimeMinutes} นาที</p>
            <p><span className="block text-xs font-bold text-[#18122B]/50">ปริมาตรเติม</span>{latestLog.prescription.fillVolumeMl} ml</p>
            <p><span className="block text-xs font-bold text-[#18122B]/50">จำนวนรอบ</span>{latestLog.prescription.cycles}</p>
            <p><span className="block text-xs font-bold text-[#18122B]/50">เวลาค้างน้ำยา</span>{latestLog.prescription.dwellTimeMinutes} นาที</p>
            <p><span className="block text-xs font-bold text-[#18122B]/50">น้ำยาค้างสุดท้าย</span>{latestLog.prescription.lastFillMl ?? 0} ml</p>
          </div>
        </section>
      )}
    </ApdShell>
  );
}
