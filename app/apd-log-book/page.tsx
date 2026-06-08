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
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-slate-600">{detail}</p>}
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
          <p className="text-green-400 text-xs font-mono tracking-widest mb-3">
            {"// บันทึก APD ส่วนตัว"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            สมุดบันทึก APD
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            บันทึกข้อมูลล้างไตทางช่องท้องและติดตามแนวโน้มประจำวัน
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/apd/new"
            className="rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-green-400 transition-colors"
          >
            + บันทึกใหม่
          </Link>
          <Link
            href="/apd/logs"
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
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
        <h2 className="text-xl font-semibold tracking-tight text-white">แนวโน้ม</h2>
        <div className="flex rounded-lg border border-slate-800 bg-slate-900/40 p-1">
          {[7, 30].map((range) => (
            <Link
              key={range}
              href={`/apd?days=${range}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                days === range
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:text-slate-300"
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
        <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-white">ใบสั่งการรักษาล่าสุด</h2>
            {latestLog.prescription.isDefaultProfile && (
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                โปรไฟล์เริ่มต้น
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <p><span className="block text-slate-500">น้ำยาถุงที่ 1</span>{latestLog.prescription.solutionBag1}</p>
            <p><span className="block text-slate-500">น้ำยาถุงที่ 2</span>{latestLog.prescription.solutionBag2}</p>
            <p><span className="block text-slate-500">ปริมาตรรวม</span>{latestLog.prescription.totalVolumeMl} ml</p>
            <p><span className="block text-slate-500">เวลารักษารวม</span>{latestLog.prescription.therapyTimeMinutes} นาที</p>
            <p><span className="block text-slate-500">ปริมาตรเติม</span>{latestLog.prescription.fillVolumeMl} ml</p>
            <p><span className="block text-slate-500">จำนวนรอบ</span>{latestLog.prescription.cycles}</p>
            <p><span className="block text-slate-500">เวลาค้างน้ำยา</span>{latestLog.prescription.dwellTimeMinutes} นาที</p>
            <p><span className="block text-slate-500">น้ำยาค้างสุดท้าย</span>{latestLog.prescription.lastFillMl ?? 0} ml</p>
          </div>
        </section>
      )}
    </ApdShell>
  );
}
