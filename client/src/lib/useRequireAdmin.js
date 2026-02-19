"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function useRequireAdmin() {
  const router = useRouter();
  const hasWindow = typeof window !== "undefined";
  const token = hasWindow ? getToken() : "";
  const ready = hasWindow && Boolean(token);

  useEffect(() => {
    if (hasWindow && !token) {
      router.replace("/admin/login");
    }
  }, [hasWindow, token, router]);

  return { token, ready };
}
