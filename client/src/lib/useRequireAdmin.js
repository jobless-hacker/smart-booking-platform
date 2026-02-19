"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessCode, getToken } from "@/lib/auth";

export default function useRequireAdmin() {
  const router = useRouter();
  const hasWindow = typeof window !== "undefined";
  const accessCode = hasWindow ? getAccessCode() : "";
  const token = hasWindow ? getToken() : "";
  const ready = hasWindow && Boolean(accessCode) && Boolean(token);

  useEffect(() => {
    if (!hasWindow) return;

    if (!accessCode) {
      router.replace("/staff-access");
      return;
    }

    if (!token) {
      router.replace("/admin/login");
    }
  }, [hasWindow, accessCode, token, router]);

  return { token, accessCode, ready };
}
