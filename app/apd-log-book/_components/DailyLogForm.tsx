import Link from "next/link";
import { deleteDailyLog } from "../actions";

type PrescriptionFormData = {
  id?: number | null;
  name: string;
  solutionBag1: string;
  solutionBag2: string;
  totalVolumeMl: number;
  therapyTimeMinutes: number;
  fillVolumeMl: number;
  cycles: number;
  dwellTimeMinutes: number;
  lastFillMl: number | null;
  manualExchange: string | null;
  isDefaultProfile: boolean;
};

type DailyLogFormData = {
  id?: number;
  date: string;
  treatmentStartTime: string;
  weightKg: string;
  systolicBp: number;
  diastolicBp: number;
  pulse: number;
  bloodGlucoseMgDl: number | null;
  iDrainVolumeMl: number;
  totalUfMl: number;
  urineAvgDayMl: number;
  drainageAppearance: string | null;
  remark: string | null;
};

type DailyLogFormProps = {
  action: (formData: FormData) => Promise<void>;
  log?: DailyLogFormData;
  prescription: PrescriptionFormData;
  error?: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-black text-[#18122B] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl bg-white border-[2px] border-[#18122B]/15 text-[#18122B] px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#EC4899]/20 focus:border-[#EC4899]";

const textareaClass = `${inputClass} resize-none`;
const panelClass =
  "rounded-2xl border-[3px] border-[#18122B] bg-white p-5 shadow-[5px_5px_0_0_#18122B] md:p-6";

const drainageAppearanceOptions = [
  { value: "ใส", label: "ใส" },
  { value: "เหลืองอ่อน", label: "เหลืองอ่อน" },
  { value: "ขุ่น", label: "ขุ่น" },
  { value: "มีเส้นไฟบริน", label: "มีเส้นไฟบริน" },
  { value: "ชมพู/มีเลือดปน", label: "ชมพู/มีเลือดปน" },
  { value: "อื่น ๆ - ดูหมายเหตุ", label: "อื่น ๆ - ดูหมายเหตุ" },
];

export default function DailyLogForm({
  action,
  log,
  prescription,
  error,
}: DailyLogFormProps) {
  const isEditing = Boolean(log?.id);
  const selectedDrainageAppearance = log?.drainageAppearance ?? "";
  const hasCustomDrainageAppearance =
    selectedDrainageAppearance !== "" &&
    !drainageAppearanceOptions.some((option) => option.value === selectedDrainageAppearance);

  return (
    <form action={action} className="space-y-7">
      {log?.id && <input type="hidden" name="id" value={log.id} />}

      {error === "duplicate-date" && (
        <p className="rounded-2xl border-[3px] border-[#18122B] bg-[#FFF1F2] px-4 py-3 text-sm font-black text-[#E11D48] shadow-[4px_4px_0_0_#18122B]">
          มีบันทึกของวันที่นี้อยู่แล้ว
        </p>
      )}

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#18122B]">ข้อมูลประจำวัน</h2>
            <p className="mt-1 text-xs font-bold text-[#18122B]/50">
              หากค่าต่างจากรูปแบบปกติของคุณ ควรสังเกต และควรปรึกษาทีมไต
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="วันที่">
            <input
              className={inputClass}
              name="date"
              type="date"
              required
              defaultValue={log?.date ?? new Date().toISOString().slice(0, 10)}
            />
          </Field>
          <Field label="เวลาเริ่มทำ APD">
            <input
              className={inputClass}
              name="treatmentStartTime"
              type="time"
              required
              defaultValue={log?.treatmentStartTime ?? ""}
            />
          </Field>
          <Field label="น้ำหนัก (kg)">
            <input
              className={inputClass}
              name="weightKg"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={log?.weightKg ?? ""}
            />
          </Field>
          <Field label="ความดันตัวบน (Systolic BP)">
            <input
              className={inputClass}
              name="systolicBp"
              type="number"
              min="0"
              required
              defaultValue={log?.systolicBp ?? ""}
            />
          </Field>
          <Field label="ความดันตัวล่าง (Diastolic BP)">
            <input
              className={inputClass}
              name="diastolicBp"
              type="number"
              min="0"
              required
              defaultValue={log?.diastolicBp ?? ""}
            />
          </Field>
          <Field label="ชีพจร">
            <input
              className={inputClass}
              name="pulse"
              type="number"
              min="0"
              required
              defaultValue={log?.pulse ?? ""}
            />
          </Field>
          <Field label="น้ำตาลในเลือด (mg/dL)">
            <input
              className={inputClass}
              name="bloodGlucoseMgDl"
              type="number"
              min="0"
              defaultValue={log?.bloodGlucoseMgDl ?? ""}
            />
          </Field>
          <Field label="ปริมาณ I-Drain (ml)">
            <input
              className={inputClass}
              name="iDrainVolumeMl"
              type="number"
              required
              defaultValue={log?.iDrainVolumeMl ?? ""}
            />
          </Field>
          <Field label="Total UF (ml)">
            <input
              className={inputClass}
              name="totalUfMl"
              type="number"
              required
              defaultValue={log?.totalUfMl ?? ""}
            />
          </Field>
          <Field label="ปัสสาวะเฉลี่ย/วัน (ml)">
            <input
              className={inputClass}
              name="urineAvgDayMl"
              type="number"
              min="0"
              required
              defaultValue={log?.urineAvgDayMl ?? ""}
            />
          </Field>
          <Field label="ลักษณะน้ำยาออก">
            <select
              className={inputClass}
              name="drainageAppearance"
              defaultValue={selectedDrainageAppearance}
            >
              <option value="">ไม่ได้บันทึก</option>
              {hasCustomDrainageAppearance && (
                <option value={selectedDrainageAppearance}>
                  {selectedDrainageAppearance}
                </option>
              )}
              {drainageAppearanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="หมายเหตุ">
            <textarea
              className={textareaClass}
              name="remark"
              rows={3}
              defaultValue={log?.remark ?? ""}
            />
          </Field>
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-black tracking-tight text-[#18122B]">ใบสั่งการรักษา</h2>
          <label className="inline-flex items-center gap-2 rounded-full border-[2px] border-[#18122B] bg-[#EDE9FE] px-3 py-2 text-sm font-bold text-[#18122B]">
            <input
              type="checkbox"
              name="isDefaultProfile"
              defaultChecked={prescription.isDefaultProfile}
              className="h-4 w-4 rounded border-[#18122B] bg-white text-[#7C3AED]"
            />
            ใช้เป็นโปรไฟล์เริ่มต้น
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="ชื่อโปรไฟล์">
            <input
              className={inputClass}
              name="prescriptionName"
              type="text"
              required
              defaultValue={prescription.name}
            />
          </Field>
          <Field label="น้ำยาถุงที่ 1">
            <input
              className={inputClass}
              name="solutionBag1"
              type="text"
              required
              defaultValue={prescription.solutionBag1}
            />
          </Field>
          <Field label="น้ำยาถุงที่ 2">
            <input
              className={inputClass}
              name="solutionBag2"
              type="text"
              required
              defaultValue={prescription.solutionBag2}
            />
          </Field>
          <Field label="ปริมาตรรวม (ml)">
            <input
              className={inputClass}
              name="totalVolumeMl"
              type="number"
              min="0"
              required
              defaultValue={prescription.totalVolumeMl}
            />
          </Field>
          <Field label="เวลารักษารวม (นาที)">
            <input
              className={inputClass}
              name="therapyTimeMinutes"
              type="number"
              min="0"
              required
              defaultValue={prescription.therapyTimeMinutes}
            />
          </Field>
          <Field label="ปริมาตรเติมแต่ละรอบ (ml)">
            <input
              className={inputClass}
              name="fillVolumeMl"
              type="number"
              min="0"
              required
              defaultValue={prescription.fillVolumeMl}
            />
          </Field>
          <Field label="จำนวนรอบ">
            <input
              className={inputClass}
              name="cycles"
              type="number"
              min="0"
              required
              defaultValue={prescription.cycles}
            />
          </Field>
          <Field label="เวลาค้างน้ำยา (นาที)">
            <input
              className={inputClass}
              name="dwellTimeMinutes"
              type="number"
              min="0"
              required
              defaultValue={prescription.dwellTimeMinutes}
            />
          </Field>
          <Field label="น้ำยาค้างสุดท้าย (Last fill ml)">
            <input
              className={inputClass}
              name="lastFillMl"
              type="number"
              min="0"
              defaultValue={prescription.lastFillMl ?? 0}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="การเปลี่ยนน้ำยาแบบ Manual">
            <textarea
              className={textareaClass}
              name="manualExchange"
              rows={2}
              defaultValue={prescription.manualExchange ?? ""}
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-2xl border-[3px] border-[#18122B] bg-[linear-gradient(90deg,#EC4899_0%,#F97316_100%)] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_0_#18122B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#18122B] transition-all"
        >
          {isEditing ? "อัปเดตบันทึก" : "บันทึกข้อมูล"}
        </button>
        <Link
          href={isEditing ? "/apd/logs" : "/apd"}
          className="rounded-2xl border-[3px] border-[#18122B] bg-white px-5 py-3 text-sm font-black text-[#7C3AED] shadow-[4px_4px_0_0_#18122B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#18122B] transition-all"
        >
          ยกเลิก
        </Link>
        {log?.id && (
          <button
            type="submit"
            formAction={deleteDailyLog}
            className="rounded-2xl border-[3px] border-[#18122B] bg-white px-5 py-3 text-sm font-black text-[#E11D48] shadow-[4px_4px_0_0_#18122B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#18122B] transition-all"
          >
            ลบ
          </button>
        )}
      </div>
    </form>
  );
}
