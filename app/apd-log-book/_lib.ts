import { prisma } from "@/lib/prisma";

export const defaultPrescriptionValues = {
  name: "Default prescription profile",
  solutionBag1: "1.5% 5000 ml",
  solutionBag2: "2.5% 5000 ml",
  totalVolumeMl: 10000,
  therapyTimeMinutes: 600,
  fillVolumeMl: 2000,
  cycles: 5,
  dwellTimeMinutes: 90,
  lastFillMl: 0,
  manualExchange: null as string | null,
  isDefaultProfile: true,
};

export async function ensureDefaultPrescription(userId: number) {
  const existing = await prisma.aPDPrescription.findFirst({
    where: { userId, isDefaultProfile: true },
    orderBy: { updatedAt: "desc" },
  });

  if (existing) {
    if (existing.lastFillMl === null) {
      return prisma.aPDPrescription.update({
        where: { id: existing.id },
        data: { lastFillMl: 0 },
      });
    }

    return existing;
  }

  return prisma.aPDPrescription.create({
    data: {
      ...defaultPrescriptionValues,
      userId,
    },
  });
}

export function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatNumber(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined) return "—";
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)}${suffix}`;
}

export function startOfRange(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (days - 1));
  return date;
}

export function average(values: Array<number | null | undefined>) {
  const valid = values.filter((value): value is number => typeof value === "number");
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

export function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "toNumber" in value) {
    const decimal = value as { toNumber: () => number };
    return decimal.toNumber();
  }
  return Number(value ?? 0);
}
