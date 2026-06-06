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
      <span className="block text-sm font-medium text-slate-300 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg bg-slate-900/70 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400/60";

const textareaClass = `${inputClass} resize-none`;

const drainageAppearanceOptions = [
  "Clear",
  "Light yellow",
  "Cloudy",
  "Fibrin strands",
  "Pink/blood-tinged",
  "Other - see remark",
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
    !drainageAppearanceOptions.includes(selectedDrainageAppearance);

  return (
    <form action={action} className="space-y-7">
      {log?.id && <input type="hidden" name="id" value={log.id} />}

      {error === "duplicate-date" && (
        <p className="rounded-lg border border-red-700/70 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          There is already an entry for this date.
        </p>
      )}

      <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">Daily data</h2>
            <p className="mt-1 text-xs text-slate-500">
              หากค่าต่างจากรูปแบบปกติของคุณ ควรสังเกต และควรปรึกษาทีมไต
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Date">
            <input
              className={inputClass}
              name="date"
              type="date"
              required
              defaultValue={log?.date ?? new Date().toISOString().slice(0, 10)}
            />
          </Field>
          <Field label="Treatment start time">
            <input
              className={inputClass}
              name="treatmentStartTime"
              type="time"
              required
              defaultValue={log?.treatmentStartTime ?? ""}
            />
          </Field>
          <Field label="Weight kg">
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
          <Field label="Systolic BP">
            <input
              className={inputClass}
              name="systolicBp"
              type="number"
              min="0"
              required
              defaultValue={log?.systolicBp ?? ""}
            />
          </Field>
          <Field label="Diastolic BP">
            <input
              className={inputClass}
              name="diastolicBp"
              type="number"
              min="0"
              required
              defaultValue={log?.diastolicBp ?? ""}
            />
          </Field>
          <Field label="Pulse">
            <input
              className={inputClass}
              name="pulse"
              type="number"
              min="0"
              required
              defaultValue={log?.pulse ?? ""}
            />
          </Field>
          <Field label="Blood glucose mg/dL">
            <input
              className={inputClass}
              name="bloodGlucoseMgDl"
              type="number"
              min="0"
              defaultValue={log?.bloodGlucoseMgDl ?? ""}
            />
          </Field>
          <Field label="I-Drain Volume ml">
            <input
              className={inputClass}
              name="iDrainVolumeMl"
              type="number"
              required
              defaultValue={log?.iDrainVolumeMl ?? ""}
            />
          </Field>
          <Field label="Total UF ml">
            <input
              className={inputClass}
              name="totalUfMl"
              type="number"
              required
              defaultValue={log?.totalUfMl ?? ""}
            />
          </Field>
          <Field label="Urine AVG/Day ml">
            <input
              className={inputClass}
              name="urineAvgDayMl"
              type="number"
              min="0"
              required
              defaultValue={log?.urineAvgDayMl ?? ""}
            />
          </Field>
          <Field label="Drainage appearance">
            <select
              className={inputClass}
              name="drainageAppearance"
              defaultValue={selectedDrainageAppearance}
            >
              <option value="">Not recorded</option>
              {hasCustomDrainageAppearance && (
                <option value={selectedDrainageAppearance}>
                  {selectedDrainageAppearance}
                </option>
              )}
              {drainageAppearanceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Remark">
            <textarea
              className={textareaClass}
              name="remark"
              rows={3}
              defaultValue={log?.remark ?? ""}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-white">Prescription</h2>
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="isDefaultProfile"
              defaultChecked={prescription.isDefaultProfile}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-green-500"
            />
            Default prescription profile
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Profile name">
            <input
              className={inputClass}
              name="prescriptionName"
              type="text"
              required
              defaultValue={prescription.name}
            />
          </Field>
          <Field label="Solution bag 1">
            <input
              className={inputClass}
              name="solutionBag1"
              type="text"
              required
              defaultValue={prescription.solutionBag1}
            />
          </Field>
          <Field label="Solution bag 2">
            <input
              className={inputClass}
              name="solutionBag2"
              type="text"
              required
              defaultValue={prescription.solutionBag2}
            />
          </Field>
          <Field label="Total volume ml">
            <input
              className={inputClass}
              name="totalVolumeMl"
              type="number"
              min="0"
              required
              defaultValue={prescription.totalVolumeMl}
            />
          </Field>
          <Field label="Therapy time minutes">
            <input
              className={inputClass}
              name="therapyTimeMinutes"
              type="number"
              min="0"
              required
              defaultValue={prescription.therapyTimeMinutes}
            />
          </Field>
          <Field label="Fill volume ml">
            <input
              className={inputClass}
              name="fillVolumeMl"
              type="number"
              min="0"
              required
              defaultValue={prescription.fillVolumeMl}
            />
          </Field>
          <Field label="Cycles">
            <input
              className={inputClass}
              name="cycles"
              type="number"
              min="0"
              required
              defaultValue={prescription.cycles}
            />
          </Field>
          <Field label="Dwell time minutes">
            <input
              className={inputClass}
              name="dwellTimeMinutes"
              type="number"
              min="0"
              required
              defaultValue={prescription.dwellTimeMinutes}
            />
          </Field>
          <Field label="Last fill ml">
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
          <Field label="Manual exchange">
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
          className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-green-400 transition-colors"
        >
          {isEditing ? "Update entry" : "Save entry"}
        </button>
        <Link
          href={isEditing ? "/apd-log-book/logs" : "/apd-log-book"}
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
        >
          Cancel
        </Link>
        {log?.id && (
          <button
            type="submit"
            formAction={deleteDailyLog}
            className="rounded-lg border border-red-800 px-5 py-2.5 text-sm font-medium text-red-300 hover:bg-red-950/40 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
