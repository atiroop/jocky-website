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

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#E5EAF5] bg-white/95 px-5 py-4 shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">{value}</p>
      {detail && <p className="mt-1 text-xs font-medium text-[#6B7280]">{detail}</p>}
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
          <p className="text-[#2F6BFF] text-xs font-bold tracking-[0.18em] mb-3">
            {"// บันทึก APD ส่วนตัว"}
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#111827]">
            สมุดบันทึก APD
          </h1>
          <p className="mt-2 text-sm font-medium text-[#6B7280]">
            บันทึกข้อมูลล้างไตทางช่องท้องและติดตามแนวโน้มประจำวัน
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/apd/new"
            className="rounded-2xl bg-[#2F6BFF] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(47,107,255,0.28)] hover:bg-[#1D4ED8] transition-colors"
          >
            + บันทึกใหม่
          </Link>
          <Link
            href="/apd/logs"
            className="rounded-2xl border border-[#DDE5F3] bg-white px-5 py-3 text-sm font-semibold text-[#2F6BFF] shadow-[0_8px_24px_rgba(31,41,55,0.05)] hover:border-[#BFD0FF] hover:bg-[#F6F8FF] transition-colors"
          >
            ดูรายการย้อนหลัง
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total UF ล่าสุด"
          value={formatNumber(latestLog?.totalUfMl, " ml")}
          detail={latestLog ? formatDisplayDate(latestLog.date) : undefined}
        />
        <StatCard
          label="น้ำหนักล่าสุด"
          value={latestLog ? formatNumber(toNumber(latestLog.weightKg), " kg") : "—"}
          detail={latestLog ? formatDisplayDate(latestLog.date) : undefined}
        />
        <StatCard
          label="ความดันล่าสุด"
          value={latestLog ? `${latestLog.systolicBp}/${latestLog.diastolicBp}` : "—"}
          detail={latestLog ? `ชีพจร ${latestLog.pulse}` : undefined}
        />
        <StatCard
          label="ค่าเฉลี่ย Total UF 7 วัน"
          value={formatNumber(sevenDayUf, " ml")}
          detail={`${sevenDayLogs.length} รายการ`}
        />
        <StatCard
          label="ค่าเฉลี่ยน้ำหนัก 7 วัน"
          value={formatNumber(sevenDayWeight, " kg")}
          detail={`${sevenDayLogs.length} รายการ`}
        />
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-[#111827]">แนวโน้ม</h2>
        <div className="flex rounded-full border border-[#E5EAF5] bg-white/80 p-1 shadow-[0_8px_24px_rgba(31,41,55,0.05)]">
          {[7, 30].map((range) => (
            <Link
              key={range}
              href={`/apd?days=${range}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                days === range
                  ? "bg-[#2F6BFF] text-white shadow-[0_8px_18px_rgba(47,107,255,0.22)]"
                  : "text-[#6B7280] hover:text-[#2F6BFF]"
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
        <section className="rounded-[24px] border border-[#E5EAF5] bg-white/95 p-5 shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold tracking-tight text-[#111827]">ใบสั่งการรักษาล่าสุด</h2>
            {latestLog.prescription.isDefaultProfile && (
              <span className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-bold text-[#7C3AED]">
                โปรไฟล์เริ่มต้น
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-[#111827] md:grid-cols-4">
            <p><span className="block text-xs font-semibold text-[#6B7280]">น้ำยาถุงที่ 1</span>{latestLog.prescription.solutionBag1}</p>
            <p><span className="block text-xs font-semibold text-[#6B7280]">น้ำยาถุงที่ 2</span>{latestLog.prescription.solutionBag2}</p>
            <p><span className="block text-xs font-semibold text-[#6B7280]">ปริมาตรรวม</span>{latestLog.prescription.totalVolumeMl} ml</p>
            <p><span className="block text-xs font-semibold text-[#6B7280]">เวลารักษารวม</span>{latestLog.prescription.therapyTimeMinutes} นาที</p>
            <p><span className="block text-xs font-semibold text-[#6B7280]">ปริมาตรเติม</span>{latestLog.prescription.fillVolumeMl} ml</p>
            <p><span className="block text-xs font-semibold text-[#6B7280]">จำนวนรอบ</span>{latestLog.prescription.cycles}</p>
            <p><span className="block text-xs font-semibold text-[#6B7280]">เวลาค้างน้ำยา</span>{latestLog.prescription.dwellTimeMinutes} นาที</p>
            <p><span className="block text-xs font-semibold text-[#6B7280]">น้ำยาค้างสุดท้าย</span>{latestLog.prescription.lastFillMl ?? 0} ml</p>
          </div>
        </section>
      )}
    </ApdShell>
  );
}
