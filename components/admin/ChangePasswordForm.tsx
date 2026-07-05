"use client";

import { useActionState } from "react";
import {
  changePassword,
  type ChangePasswordState,
} from "@/app/admin/account/actions";

const initialState: ChangePasswordState = {
  status: "idle",
  message: "",
};

const inputClass =
  "w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20";

function PasswordField({
  label,
  name,
  autoComplete,
}: {
  label: string;
  name: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-300 mb-1">
        {label}
      </span>
      <input
        className={inputClass}
        type="password"
        name={name}
        autoComplete={autoComplete}
        required
      />
    </label>
  );
}

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.status !== "idle" && (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            state.status === "success"
              ? "border-green-700 bg-green-950/40 text-green-300"
              : "border-red-700 bg-red-950/40 text-red-300"
          }`}
        >
          {state.message}
        </p>
      )}

      <PasswordField
        label="รหัสผ่านเดิม"
        name="currentPassword"
        autoComplete="current-password"
      />

      <PasswordField
        label="รหัสผ่านใหม่"
        name="newPassword"
        autoComplete="new-password"
      />

      <PasswordField
        label="ยืนยันรหัสผ่านใหม่"
        name="confirmPassword"
        autoComplete="new-password"
      />

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-xs leading-6 text-neutral-500">
        รหัสใหม่ควรมีอย่างน้อย 10 ตัวอักษร และควรต่างจากรหัสเดิม
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white text-neutral-950 px-5 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
      >
        {pending ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
      </button>
    </form>
  );
}
