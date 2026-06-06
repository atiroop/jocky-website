import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import ApdShell from "../_components/ApdShell";
import { deleteDailyLog } from "../actions";
import { formatDisplayDate, toNumber } from "../_lib";

export const dynamic = "force-dynamic";

export default async function ApdLogsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const logs = await prisma.aPDDailyLog.findMany({
    where: { userId: session.userId },
    include: { prescription: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  return (
    <ApdShell>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-green-400 text-xs font-mono tracking-widest mb-3">
            {"// history"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">APD logs</h1>
          <p className="mt-2 text-sm text-slate-500">{logs.length} entries</p>
        </div>
        <Link
          href="/apd-log-book/new"
          className="w-fit rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-green-400 transition-colors"
        >
          + New entry
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 px-6 py-14 text-center">
          <p className="text-sm text-slate-500">No APD logs yet.</p>
          <Link
            href="/apd-log-book/new"
            className="mt-3 inline-block text-sm font-medium text-green-400 hover:text-green-300"
          >
            Create first entry
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-slate-900 text-left text-xs uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Start</th>
                <th className="px-4 py-3 font-medium">Weight</th>
                <th className="px-4 py-3 font-medium">BP</th>
                <th className="px-4 py-3 font-medium">Pulse</th>
                <th className="px-4 py-3 font-medium">Glucose</th>
                <th className="px-4 py-3 font-medium">I-Drain</th>
                <th className="px-4 py-3 font-medium">Total UF</th>
                <th className="px-4 py-3 font-medium">Urine AVG/Day</th>
                <th className="px-4 py-3 font-medium">Prescription</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-800 hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-medium text-white">
                    {formatDisplayDate(log.date)}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{log.treatmentStartTime}</td>
                  <td className="px-4 py-3 text-slate-300">{toNumber(log.weightKg)} kg</td>
                  <td className="px-4 py-3 text-slate-300">{log.systolicBp}/{log.diastolicBp}</td>
                  <td className="px-4 py-3 text-slate-400">{log.pulse}</td>
                  <td className="px-4 py-3 text-slate-400">{log.bloodGlucoseMgDl ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{log.iDrainVolumeMl} ml</td>
                  <td className="px-4 py-3 text-slate-300">{log.totalUfMl} ml</td>
                  <td className="px-4 py-3 text-slate-400">{log.urineAvgDayMl} ml</td>
                  <td className="px-4 py-3 text-slate-400 max-w-[12rem] truncate">
                    {log.prescription?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/apd-log-book/${log.id}/edit`}
                        className="text-slate-300 hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      <form action={deleteDailyLog}>
                        <input type="hidden" name="id" value={log.id} />
                        <button
                          type="submit"
                          className="text-red-300 hover:text-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ApdShell>
  );
}
