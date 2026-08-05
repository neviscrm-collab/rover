"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

/** Reads theme from the store and stamps data-theme on <html>. No UI. */
export default function ThemeApplier() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
