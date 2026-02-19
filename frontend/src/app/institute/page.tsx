"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import InstituteDashboard from "./components/InstituteDashboard";

export default function InstitutePage() {
  const { isLoggedIn, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Not logged in at all → back to home
    if (!isLoggedIn) {
      router.replace("/");
      return;
    }
    // Logged in but wrong role → send to student portal
    if (userType !== "institute") {
      router.replace("/student");
    }
  }, [isLoggedIn, userType, router]);

  // Still checking / wrong role — show nothing while redirecting
  if (!isLoggedIn || userType !== "institute") {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-white/30 text-xs tracking-[0.3em] font-mono uppercase">
            Checking Access…
          </p>
        </div>
      </div>
    );
  }

  return <InstituteDashboard />;
}