import { getReports, getAvailableDates, AnalysisReport, ArticleDetail } from "@/lib/get-reports";
import { Zap, Target, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import CalendarGrid from "@/components/CalendarGrid";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: selectedParam } = await searchParams;
  const availableDates = await getAvailableDates();
  
  // デフォルトの日付：パラメータがない場合は最新のアーカイブ、それもなければ今日
  const selectedDate = selectedParam || availableDates[0] || new Date().toISOString().split('T')[0];
  const reports = await getReports(selectedDate);
  
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen px-6 py-6 lg:px-24">
      {/* Header */}
      <header className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center justify-center px-6 py-2 bg-[#10b981] text-black rounded-xl italic shadow-[0_0_20px_rgba(16,185,129,0.3)] transform -skew-x-6">
              EV
            </span>
            <span className="drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">News.Intelligence</span>
          </h1>
          <p className="text-ui-secondary text-lg max-w-xl font-light leading-relaxed">
            次世代 EV 業界の精密な分析。ノイズを排除し、<br className="hidden md:block" />
            構造化されたインサイトをリアルタイムに提供します。
          </p>
        </div>

        {/* New Grid Calendar Component */}
        <div className="intelligence-card p-1">
          <CalendarGrid availableDates={availableDates} selectedDate={selectedDate} />
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6">
        {reports.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-lg intelligence-card">
            <div className="inline-flex p-6 rounded-full bg-white/5 text-ui-muted mb-6">
              <CalendarIcon size={48} strokeWidth={1} className="opacity-20" />
            </div>
            <h3 className="text-xl font-medium text-ui-secondary mb-2">レポートが見つかりません</h3>
            <p className="text-ui-muted">選択された日付 {selectedDate} の分析データはまだ生成されていません。</p>
          </div>
        ) : (
          reports.map((report: AnalysisReport, idx: number) => (
          <section
            key={idx}
            className="intelligence-card p-8 md:p-10 relative overflow-hidden group"
          >
            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
              {/* Left: Main Content */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-emerald/10 text-brand-emerald text-[10px] font-bold mb-8 border border-brand-emerald/20 uppercase tracking-widest">
                  <Target size={12} strokeWidth={1.5} />
                  <span>Topic #{idx + 1}</span>
                </div>
                
                <h2 className="text-3xl font-medium text-white mb-8 leading-tight tracking-tight">
                  {report.topic_name}
                </h2>

                <div className="space-y-5">
                  {report.analysis.summary_points.map((point: string, pIdx: number) => (
                    <div key={pIdx} className="flex gap-4">
                      <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand-emerald shrink-0 shadow-[0_0_8px_rgba(62,207,142,0.6)]" />
                      <p className="text-ui-secondary leading-relaxed font-light">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Insight Section */}
              <div className="lg:w-1/3 flex flex-col">
                <div className="h-full bg-white/[0.02] border border-white/5 rounded-lg p-8 relative">
                  <div className="flex items-center gap-2 mb-6 text-brand-emerald/80 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <TrendingUp size={16} strokeWidth={1.5} />
                    <span>Industry Insight</span>
                  </div>
                  <div className="text-ui-secondary leading-relaxed italic text-sm md:text-base font-light">
                    "{report.analysis.insight}"
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5">
                    {/* Article Sources - Shown only if articles exist */}
                    {report.articles && report.articles.length > 0 && (
                      <div className="flex flex-col gap-3">
                        {report.articles.map((article: ArticleDetail, aIdx: number) => (
                          <a
                            key={aIdx}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center justify-between gap-4 text-[11px] text-ui-muted hover:text-brand-emerald transition-all bg-white/[0.01] hover:bg-white/[0.03] p-3 rounded-md border border-white/5 active:scale-[0.98]"
                          >
                            <span className="truncate flex-1 font-medium italic">
                              {article.title}
                            </span>
                            <Zap size={12} strokeWidth={1.5} className="shrink-0 text-brand-emerald/30 group-hover/link:text-brand-emerald" />
                          </a>
                        ))}
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </div>
          </section>
        )))}
      </div>

      {/* Footer */}
      <footer className="mt-32 pb-12 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-ui-muted">
        <div className="flex items-center gap-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">© 2026 EV News.Intelligence</span>
        </div>
      </footer>
    </div>
  );
}
