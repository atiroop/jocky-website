"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { ensureDefaultPrescription } from "./_lib";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim();
}

function requiredInt(formData: FormData, key: string) {
  const value = Number(requiredString(formData, key));
  if (!Number.isInteger(value)) throw new Error(`${key} must be a whole number`);
  return value;
}

function optionalInt(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${key} must be a whole number`);
  return parsed;
}

function requiredFloat(formData: FormData, key: string) {
  const value = Number(requiredString(formData, key));
  if (!Number.isFinite(value)) throw new Error(`${key} must be a number`);
  return value;
}

function parseDate(formData: FormData) {
  const value = requiredString(formData, "date");
  return new Date(`${value}T00:00:00.000Z`);
}

function prescriptionData(formData: FormData) {
  return {
    name: requiredString(formData, "prescriptionName"),
    solutionBag1: requiredString(formData, "solutionBag1"),
    solutionBag2: requiredString(formData, "solutionBag2"),
    totalVolumeMl: requiredInt(formData, "totalVolumeMl"),
    therapyTimeMinutes: requiredInt(formData, "therapyTimeMinutes"),
    fillVolumeMl: requiredInt(formData, "fillVolumeMl"),
    cycles: requiredInt(formData, "cycles"),
    dwellTimeMinutes: requiredInt(formData, "dwellTimeMinutes"),
    lastFillMl: optionalInt(formData, "lastFillMl"),
    manualExchange: optionalString(formData, "manualExchange"),
  };
}

function logData(formData: FormData) {
  return {
    date: parseDate(formData),
    treatmentStartTime: requiredString(formData, "treatmentStartTime"),
    weightKg: requiredFloat(formData, "weightKg"),
    systolicBp: requiredInt(formData, "systolicBp"),
    diastolicBp: requiredInt(formData, "diastolicBp"),
    pulse: requiredInt(formData, "pulse"),
    bloodGlucoseMgDl: optionalInt(formData, "bloodGlucoseMgDl"),
    iDrainVolumeMl: requiredInt(formData, "iDrainVolumeMl"),
    totalUfMl: requiredInt(formData, "totalUfMl"),
    urineAvgDayMl: requiredInt(formData, "urineAvgDayMl"),
    drainageAppearance: optionalString(formData, "drainageAppearance"),
    remark: optionalString(formData, "remark"),
  };
}

function isUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

async function requireSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

async function savePrescription(userId: number, formData: FormData, existingId?: number | null) {
  const shouldBeDefault = formData.get("isDefaultProfile") === "on";
  const data = prescriptionData(formData);

  if (shouldBeDefault) {
    await prisma.aPDPrescription.updateMany({
      where: { userId, isDefaultProfile: true },
      data: { isDefaultProfile: false },
    });
  }

  if (existingId) {
    return prisma.aPDPrescription.update({
      where: { id: existingId },
      data: { ...data, isDefaultProfile: shouldBeDefault },
    });
  }

  return prisma.aPDPrescription.create({
    data: {
      ...data,
      isDefaultProfile: shouldBeDefault,
      userId,
    },
  });
}

export async function createDailyLog(formData: FormData) {
  const session = await requireSession();
  const defaultPrescription = await ensureDefaultPrescription(session.userId);
  const useDefaultPrescription = formData.get("isDefaultProfile") === "on";
  const prescription = await savePrescription(
    session.userId,
    formData,
    useDefaultPrescription ? defaultPrescription.id : null
  );

  try {
    await prisma.aPDDailyLog.create({
      data: {
        ...logData(formData),
        userId: session.userId,
        prescriptionId: prescription.id,
      },
    });
  } catch (error) {
    if (isUniqueError(error)) redirect("/apd/new?error=duplicate-date");
    throw error;
  }

  revalidatePath("/apd");
  revalidatePath("/apd/logs");
  redirect("/apd");
}

export async function updateDailyLog(formData: FormData) {
  const session = await requireSession();
  const id = requiredInt(formData, "id");
  const existingLog = await prisma.aPDDailyLog.findFirst({
    where: { id, userId: session.userId },
    select: { id: true, prescriptionId: true },
  });

  if (!existingLog) redirect("/apd/logs");

  const prescription = await savePrescription(
    session.userId,
    formData,
    existingLog.prescriptionId
  );

  try {
    await prisma.aPDDailyLog.update({
      where: { id },
      data: {
        ...logData(formData),
        prescriptionId: prescription.id,
      },
    });
  } catch (error) {
    if (isUniqueError(error)) {
      redirect(`/apd/${id}/edit?error=duplicate-date`);
    }
    throw error;
  }

  revalidatePath("/apd");
  revalidatePath("/apd/logs");
  redirect("/apd/logs");
}

export async function deleteDailyLog(formData: FormData) {
  const session = await requireSession();
  const id = requiredInt(formData, "id");
  const log = await prisma.aPDDailyLog.findFirst({
    where: { id, userId: session.userId },
    select: { prescriptionId: true },
  });

  if (!log) redirect("/apd/logs");

  await prisma.aPDDailyLog.delete({ where: { id } });

  if (log.prescriptionId) {
    const [usageCount, prescription] = await Promise.all([
      prisma.aPDDailyLog.count({ where: { prescriptionId: log.prescriptionId } }),
      prisma.aPDPrescription.findUnique({
        where: { id: log.prescriptionId },
        select: { isDefaultProfile: true },
      }),
    ]);

    if (usageCount === 0 && prescription && !prescription.isDefaultProfile) {
      await prisma.aPDPrescription.delete({ where: { id: log.prescriptionId } });
    }
  }

  revalidatePath("/apd");
  revalidatePath("/apd/logs");
  redirect("/apd/logs");
}
