"use client";

import { useEffect, useState } from "react";

export type ToastData = {
  type: "success" | "error";
  message: string;
};

export function Toast({ toast, onDone }: { toast: ToastData | null; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [toast]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${
        toast.type === "success"
          ? "bg-neutral-800 border border-green-700 text-green-400"
          : "bg-neutral-800 border border-red-700 text-red-400"
      }`}
    >
      <span>{toast.type === "success" ? "✓" : "✕"}</span>
      {toast.message}
    </div>
  );
}
