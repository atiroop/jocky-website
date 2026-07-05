import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import ApdShell from "../_components/ApdShell";
import { deleteDailyLog } from "../actions";
import { formatDisplayDate, formatDrainageAppearance, toNumber } from "../_lib";

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
          <p className="text-[#2F6BFF] text-xs font-bold tracking-[0.18em] mb-3">
            {"// รายการย้อนหลัง"}
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#111827]">รายการบันทึก APD</h1>
          <p className="mt-2 text-sm font-medium text-[#6B7280]">{logs.length} รายการ</p>
        </div>
        <Link
          href="/apd/new"
          className="w-fit rounded-2xl bg-[#2F6BFF] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(47,107,255,0.28)] hover:bg-[#1D4ED8] transition-colors"
        >
          + บันทึกใหม่
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-[24px] border border-[#E5EAF5] bg-white/95 px-6 py-14 text-center shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
          <p className="text-sm font-medium text-[#6B7280]">ยังไม่มีบันทึก APD</p>
          <Link
            href="/apd/new"
            className="mt-3 inline-block text-sm font-bold text-[#2F6BFF] hover:text-[#1D4ED8]"
          >
            สร้างบันทึกแรก
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[24px] border border-[#E5EAF5] bg-white/95 shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="bg-[#F8FAFF] text-left text-xs uppercase tracking-widest text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 font-medium">วันที่</th>
                <th className="px-4 py-3 font-medium">เริ่ม</th>
                <th className="px-4 py-3 font-medium">น้ำหนัก</th>
                <th className="px-4 py-3 font-medium">ความดัน</th>
                <th className="px-4 py-3 font-medium">ชีพจร</th>
                <th className="px-4 py-3 font-medium">น้ำตาล</th>
                <th className="px-4 py-3 font-medium">I-Drain</th>
                <th className="px-4 py-3 font-medium">Total UF</th>
                <th className="px-4 py-3 font-medium">ปัสสาวะ/วัน</th>
                <th className="px-4 py-3 font-medium">น้ำยาออก</th>
                <th className="px-4 py-3 font-medium">ใบสั่งฯ</th>
                <th className="px-4 py-3 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-[#E5EAF5] hover:bg-[#F6F8FF]">
                  <td className="px-4 py-3 font-semibold text-[#111827]">
                    {formatDisplayDate(log.date)}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{log.treatmentStartTime}</td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{toNumber(log.weightKg)} kg</td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{log.systolicBp}/{log.diastolicBp}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{log.pulse}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{log.bloodGlucoseMgDl ?? "—"}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{log.iDrainVolumeMl} ml</td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{log.totalUfMl} ml</td>
                  <td className="px-4 py-3 text-[#6B7280]">{log.urineAvgDayMl} ml</td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {formatDrainageAppearance(log.drainageAppearance)}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] max-w-[12rem] truncate">
                    {log.prescription?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/apd/${log.id}/edit`}
                        className="font-semibold text-[#2F6BFF] hover:text-[#1D4ED8] transition-colors"
                      >
                        แก้ไข
                      </Link>
                      <form action={deleteDailyLog}>
                        <input type="hidden" name="id" value={log.id} />
                        <button
                          type="submit"
                          className="font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                          ลบ
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
