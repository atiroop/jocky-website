"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export type ChangePasswordState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function changePassword(
  _state: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const currentPassword = getFormString(formData, "currentPassword");
  const newPassword = getFormString(formData, "newPassword");
  const confirmPassword = getFormString(formData, "confirmPassword");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { status: "error", message: "กรอกข้อมูลให้ครบทุกช่อง" };
  }

  if (newPassword.length < 10) {
    return { status: "error", message: "รหัสใหม่ควรมีอย่างน้อย 10 ตัวอักษร" };
  }

  if (newPassword !== confirmPassword) {
    return { status: "error", message: "รหัสใหม่กับช่องยืนยันไม่ตรงกัน" };
  }

  if (newPassword === currentPassword) {
    return { status: "error", message: "รหัสใหม่ควรต่างจากรหัสเดิม" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, passwordHash: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return { status: "error", message: "ไม่พบสิทธิ์ผู้ดูแลระบบ" };
  }

  const passwordMatched = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!passwordMatched) {
    return { status: "error", message: "รหัสผ่านเดิมไม่ถูกต้อง" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { status: "success", message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" };
}
