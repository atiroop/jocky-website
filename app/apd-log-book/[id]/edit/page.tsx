import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import ApdShell from "../../_components/ApdShell";
import DailyLogForm from "../../_components/DailyLogForm";
import { updateDailyLog } from "../../actions";
import { ensureDefaultPrescription, formatDateInput, toNumber } from "../../_lib";

export const dynamic = "force-dynamic";

export default async function EditApdLogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const log = await prisma.aPDDailyLog.findFirst({
    where: { id: Number(id), userId: session.userId },
    include: { prescription: true },
  });

  if (!log) notFound();

  const fallbackPrescription = log.prescription ?? (await ensureDefaultPrescription(session.userId));

  return (
    <ApdShell>
      <div className="mb-8">
        <p className="text-green-400 text-xs font-mono tracking-widest mb-3">
          {"// แก้ไขบันทึก"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">แก้ไขบันทึก APD</h1>
      </div>
      <DailyLogForm
        action={updateDailyLog}
        error={query.error}
        log={{
          id: log.id,
          date: formatDateInput(log.date),
          treatmentStartTime: log.treatmentStartTime,
          weightKg: String(toNumber(log.weightKg)),
          systolicBp: log.systolicBp,
          diastolicBp: log.diastolicBp,
          pulse: log.pulse,
          bloodGlucoseMgDl: log.bloodGlucoseMgDl,
          iDrainVolumeMl: log.iDrainVolumeMl,
          totalUfMl: log.totalUfMl,
          urineAvgDayMl: log.urineAvgDayMl,
          drainageAppearance: log.drainageAppearance,
          remark: log.remark,
        }}
        prescription={{
          id: fallbackPrescription.id,
          name: fallbackPrescription.name,
          solutionBag1: fallbackPrescription.solutionBag1,
          solutionBag2: fallbackPrescription.solutionBag2,
          totalVolumeMl: fallbackPrescription.totalVolumeMl,
          therapyTimeMinutes: fallbackPrescription.therapyTimeMinutes,
          fillVolumeMl: fallbackPrescription.fillVolumeMl,
          cycles: fallbackPrescription.cycles,
          dwellTimeMinutes: fallbackPrescription.dwellTimeMinutes,
          lastFillMl: fallbackPrescription.lastFillMl ?? 0,
          manualExchange: fallbackPrescription.manualExchange,
          isDefaultProfile: fallbackPrescription.isDefaultProfile,
        }}
      />
    </ApdShell>
  );
}
