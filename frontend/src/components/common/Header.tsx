"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f1011]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-7 rounded-sm bg-[#10b981] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transform -skew-x-6">
              <span className="text-[10px] font-bold text-black italic">EV</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
              News.Intelligence
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/lp" 
              className="text-[13px] font-medium text-[#d0d6e0] transition-colors hover:text-[#f7f8f8]"
            >
              Technology
            </Link>
            <Link 
              href="/" 
              className="text-[13px] font-medium text-[#d0d6e0] transition-colors hover:text-[#f7f8f8]"
            >
              Data Portal
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
}
