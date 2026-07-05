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
          <p className="text-[#DB2777] text-xs font-black tracking-[0.18em] mb-3">
            {"// รายการย้อนหลัง"}
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#18122B]">รายการบันทึก APD</h1>
          <p className="mt-2 text-sm font-bold text-[#18122B]/60">{logs.length} รายการ</p>
        </div>
        <Link
          href="/apd/new"
          className="w-fit rounded-2xl border-[3px] border-[#18122B] bg-[linear-gradient(90deg,#EC4899_0%,#F97316_100%)] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_0_#18122B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#18122B] transition-all"
        >
          + บันทึกใหม่
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl border-[3px] border-[#18122B] bg-white px-6 py-14 text-center shadow-[5px_5px_0_0_#18122B]">
          <p className="text-sm font-bold text-[#18122B]/60">ยังไม่มีบันทึก APD</p>
          <Link
            href="/apd/new"
            className="mt-3 inline-block text-sm font-black text-[#DB2777] hover:text-[#9D174D]"
          >
            สร้างบันทึกแรก
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border-[3px] border-[#18122B] bg-white shadow-[5px_5px_0_0_#18122B]">
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="bg-[linear-gradient(90deg,#EDE9FE_0%,#FCE7F3_100%)] text-left text-xs uppercase tracking-widest text-[#18122B] border-b-[3px] border-[#18122B]">
              <tr>
                <th className="px-4 py-3 font-black">วันที่</th>
                <th className="px-4 py-3 font-black">เริ่ม</th>
                <th className="px-4 py-3 font-black">น้ำหนัก</th>
                <th className="px-4 py-3 font-black">ความดัน</th>
                <th className="px-4 py-3 font-black">ชีพจร</th>
                <th className="px-4 py-3 font-black">น้ำตาล</th>
                <th className="px-4 py-3 font-black">I-Drain</th>
                <th className="px-4 py-3 font-black">Total UF</th>
                <th className="px-4 py-3 font-black">ปัสสาวะ/วัน</th>
                <th className="px-4 py-3 font-black">น้ำยาออก</th>
                <th className="px-4 py-3 font-black">ใบสั่งฯ</th>
                <th className="px-4 py-3 font-black">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t-[2px] border-[#18122B]/10 hover:bg-[#FFF7ED]">
                  <td className="px-4 py-3 font-black text-[#18122B]">
                    {formatDisplayDate(log.date)}
                  </td>
                  <td className="px-4 py-3 text-[#18122B]/60 font-semibold">{log.treatmentStartTime}</td>
                  <td className="px-4 py-3 font-bold text-[#18122B]">{toNumber(log.weightKg)} kg</td>
                  <td className="px-4 py-3 font-bold text-[#18122B]">{log.systolicBp}/{log.diastolicBp}</td>
                  <td className="px-4 py-3 text-[#18122B]/60 font-semibold">{log.pulse}</td>
                  <td className="px-4 py-3 text-[#18122B]/60 font-semibold">{log.bloodGlucoseMgDl ?? "—"}</td>
                  <td className="px-4 py-3 text-[#18122B]/60 font-semibold">{log.iDrainVolumeMl} ml</td>
                  <td className="px-4 py-3 font-bold text-[#18122B]">{log.totalUfMl} ml</td>
                  <td className="px-4 py-3 text-[#18122B]/60 font-semibold">{log.urineAvgDayMl} ml</td>
                  <td className="px-4 py-3 text-[#18122B]/60 font-semibold">
                    {formatDrainageAppearance(log.drainageAppearance)}
                  </td>
                  <td className="px-4 py-3 text-[#18122B]/60 font-semibold max-w-[12rem] truncate">
                    {log.prescription?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/apd/${log.id}/edit`}
                        className="rounded-full px-3 py-1 font-black text-[#7C3AED] hover:bg-[#EDE9FE] transition-colors"
                      >
                        แก้ไข
                      </Link>
                      <form action={deleteDailyLog}>
                        <input type="hidden" name="id" value={log.id} />
                        <button
                          type="submit"
                          className="rounded-full px-3 py-1 font-black text-[#E11D48] hover:bg-[#FCE7F3] transition-colors"
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
