"use client";

import RequestForm from "../components/RequestForm1";

export default function RequestPage() {
  return (
    // <div className="relative min-h-screen bg-[#0F1115] overflow-hidden">
    <div className="relative min-h-screen bg-[#0a0f1e] overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(88,101,242,0.15),transparent_50%)]" />

      {/* <div className="relative max-w-2xl mx-auto px-35 py-30">
        <RequestForm />
      </div> */}
      <RequestForm />
    </div>
  );
}