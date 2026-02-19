"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({
  children,
  allowedType,
}: {
  children: React.ReactNode;
  allowedType: "student" | "institute";
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // Not logged in → go to home
      if (!user) {
        router.push("/");
        return;
      }

      // Check their role in Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.data()?.role;

      // Wrong role → redirect to their correct dashboard
      if (role !== allowedType) {
        router.push(role === "student" ? "/student" : "/institute");
        return;
      }

      // All good → show the page
      setChecking(false);
    });

    return () => unsub();
  }, [allowedType, router]);

  // Loading spinner while checking auth
  if (checking) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.05]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}