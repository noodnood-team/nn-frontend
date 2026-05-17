"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Camera, LayoutDashboard, History } from "lucide-react";
import { NUTRITION_APP } from "@/constants/nutrition-app";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Scan Food", icon: <Camera size={20} strokeWidth={3} />, hoverClass: "hover:bg-[#de4b28] hover:text-white" },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} strokeWidth={3} />, hoverClass: "hover:bg-[#b5d5e2] hover:text-[#13202e]" },
    { href: "/history", label: "Scan History", icon: <History size={20} strokeWidth={3} />, hoverClass: "hover:bg-[#61859b] hover:text-white" }
  ];
  
  const visibleLinks = navLinks.filter(link => link.href !== pathname);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="absolute top-0 left-0 right-0 z-[60] p-6 flex justify-between items-start pointer-events-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/logo.png" 
          alt={NUTRITION_APP?.alt?.logo || "Logo"} 
          className="w-14 h-14 rounded-full border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] bg-[#f2ead6] object-cover" 
        />
        <span className="font-black uppercase tracking-tight text-[#13202e] text-lg bg-[#f2ead6] px-4 py-1.5 rounded-xl border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] mt-2">
          {NUTRITION_APP?.brand?.name || "Noodnood"}
        </span>
      </div>

      {/* Hamburger Menu & Dropdown */}
      <div className="relative pointer-events-auto" ref={dropdownRef}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#f2ead6] rounded-xl border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] flex items-center justify-center text-[#13202e] hover:bg-[#e8dec7] transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} strokeWidth={3} /> : <Menu size={28} strokeWidth={3} />}
        </button>

        {/* Dropdown Card */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-4 w-64 bg-[#f2ead6] border-4 border-[#13202e] rounded-2xl shadow-[8px_8px_0px_#13202e] overflow-hidden flex flex-col">
            {visibleLinks.map((link, index) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-6 py-4 text-[#13202e] font-black uppercase tracking-wider ${link.hoverClass} transition-colors ${
                  index < visibleLinks.length - 1 ? "border-b-4 border-[#13202e]" : ""
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
