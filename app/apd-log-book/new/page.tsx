import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import ApdShell from "../_components/ApdShell";
import DailyLogForm from "../_components/DailyLogForm";
import { createDailyLog } from "../actions";
import { ensureDefaultPrescription } from "../_lib";

export const dynamic = "force-dynamic";

export default async function NewApdLogPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const prescription = await ensureDefaultPrescription(session.userId);

  return (
    <ApdShell>
      <div className="mb-8">
        <p className="text-[#DB2777] text-xs font-black tracking-[0.18em] mb-3">
          {"// บันทึกใหม่"}
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[#18122B]">บันทึก APD ประจำวัน</h1>
      </div>
      <DailyLogForm
        action={createDailyLog}
        error={params.error}
        prescription={{
          id: prescription.id,
          name: prescription.name,
          solutionBag1: prescription.solutionBag1,
          solutionBag2: prescription.solutionBag2,
          totalVolumeMl: prescription.totalVolumeMl,
          therapyTimeMinutes: prescription.therapyTimeMinutes,
          fillVolumeMl: prescription.fillVolumeMl,
          cycles: prescription.cycles,
          dwellTimeMinutes: prescription.dwellTimeMinutes,
          lastFillMl: prescription.lastFillMl,
          manualExchange: prescription.manualExchange,
          isDefaultProfile: prescription.isDefaultProfile,
        }}
      />
    </ApdShell>
  );
}
