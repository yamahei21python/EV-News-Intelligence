import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0f1011] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-6 w-7 rounded-sm bg-[#10b981] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transform -skew-x-6">
                <span className="text-[10px] font-bold text-black italic">EV</span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                News.Intelligence
              </span>
            </Link>
            
            <nav className="flex items-center gap-6">
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

          <div className="flex items-center gap-6">
            <p className="text-[11px] text-[#62666d]">
              © {new Date().getFullYear()} EV News.Intelligence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
