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
    label: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(log.date),
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
            {"// private dialysis log"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            APD Log Book
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Daily peritoneal dialysis data and prescription trend record.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/apd-log-book/new"
            className="rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-green-400 transition-colors"
          >
            + New entry
          </Link>
          <Link
            href="/apd-log-book/logs"
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
          >
            View logs
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Latest Total UF"
          value={formatNumber(latestLog?.totalUfMl, " ml")}
          detail={latestLog ? formatDisplayDate(latestLog.date) : undefined}
        />
        <StatCard
          label="Latest Weight"
          value={latestLog ? formatNumber(toNumber(latestLog.weightKg), " kg") : "—"}
          detail={latestLog ? formatDisplayDate(latestLog.date) : undefined}
        />
        <StatCard
          label="Latest BP"
          value={latestLog ? `${latestLog.systolicBp}/${latestLog.diastolicBp}` : "—"}
          detail={latestLog ? `Pulse ${latestLog.pulse}` : undefined}
        />
        <StatCard
          label="7-day avg Total UF"
          value={formatNumber(sevenDayUf, " ml")}
          detail={`${sevenDayLogs.length} entries`}
        />
        <StatCard
          label="7-day avg Weight"
          value={formatNumber(sevenDayWeight, " kg")}
          detail={`${sevenDayLogs.length} entries`}
        />
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">Trends</h2>
        <div className="flex rounded-lg border border-slate-800 bg-slate-900/40 p-1">
          {[7, 30].map((range) => (
            <Link
              key={range}
              href={`/apd-log-book?days=${range}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                days === range
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {range} days
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
          title="Weight"
          unit="kg"
          points={chartPoints.map((point) => ({
            label: point.label,
            value: point.weightKg,
          }))}
        />
        <TrendChart
          title="Blood Pressure"
          unit="mmHg"
          primaryLabel="Systolic"
          secondLabel="Diastolic"
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
            <h2 className="text-lg font-semibold tracking-tight text-white">Latest prescription</h2>
            {latestLog.prescription.isDefaultProfile && (
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                Default profile
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <p><span className="block text-slate-500">Bag 1</span>{latestLog.prescription.solutionBag1}</p>
            <p><span className="block text-slate-500">Bag 2</span>{latestLog.prescription.solutionBag2}</p>
            <p><span className="block text-slate-500">Total volume</span>{latestLog.prescription.totalVolumeMl} ml</p>
            <p><span className="block text-slate-500">Therapy time</span>{latestLog.prescription.therapyTimeMinutes} min</p>
            <p><span className="block text-slate-500">Fill volume</span>{latestLog.prescription.fillVolumeMl} ml</p>
            <p><span className="block text-slate-500">Cycles</span>{latestLog.prescription.cycles}</p>
            <p><span className="block text-slate-500">Dwell time</span>{latestLog.prescription.dwellTimeMinutes} min</p>
            <p><span className="block text-slate-500">Last fill</span>{latestLog.prescription.lastFillMl ?? 0} ml</p>
          </div>
        </section>
      )}
    </ApdShell>
  );
}
