"use client";
import React from 'react';
import { usePathname } from 'next/navigation';

export default function MobileFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  if (isDashboard) {
    return (
      <div className="w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] overflow-auto">
        {children}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[100dvh] w-screen bg-neutral-950 overflow-hidden">
      <div className="relative w-full h-full max-w-2xl mx-auto bg-neutral-950 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
