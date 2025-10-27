import { Sidebar } from "@shared/ui/sidebar";
import React from "react";

export const Certificates = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6"></main>
    </div>
  );
};
