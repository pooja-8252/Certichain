"use client";

import { usePathname, useRouter } from "next/navigation";

export default function StudentTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "Certificates", path: "/student" },
    // { name: "Request Certificate", path: "/student/request" },
  ];

  return (
    <div className="flex space-x-2 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">

      {tabs.map((tab) => {
        const active = pathname === tab.path;

        return (
          <button
            key={tab.path}
            onClick={() => router.push(tab.path)}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${active
                ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md"
                : "text-gray-400 hover:text-white hover:bg-white/10"}
            `}
          >
            {tab.name}
          </button>
        );
      })}

    </div>
  );
}