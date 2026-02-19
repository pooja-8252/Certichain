"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import CertificateList from "./components/CertificateList1";
import StudentTabs from "./components/StudentTabs";

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedType="student">
      {/* <div className="relative min-h-screen bg-[#0F1115] overflow-hidden"> */}
      <div className="relative min-h-screen bg-[#0a0f1e] overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(88,101,242,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(0,212,255,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-16 space-y-10">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Student Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your certificate requests and track approval status.
            </p>
            <StudentTabs />
          </div>
          
          {/* Certificate List */}
          <CertificateList />
        </div>
      </div>
    </ProtectedRoute>
  );
}

