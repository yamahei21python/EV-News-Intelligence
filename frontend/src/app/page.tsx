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
      <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold tracking-widest uppercase text-sm">
            <Zap size={16} />
            <span>Market Intelligence</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-6">
            EV News<span className="text-blue-500">.</span>Intelligence
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl font-medium leading-relaxed">
            次世代 EV 業界の精密な分析。ノイズを排除し、<br className="hidden md:block" />
            構造化されたインサイトをリアルタイムに提供します。
          </p>
        </div>

        {/* New Grid Calendar Component */}
        <CalendarGrid availableDates={availableDates} selectedDate={selectedDate} />
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8">
        {reports.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <div className="inline-flex p-6 rounded-full bg-white/5 text-zinc-500 mb-6">
              <CalendarIcon size={48} className="opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400 mb-2">レポートが見つかりません</h3>
            <p className="text-zinc-600">選択された日付 {selectedDate} の分析データはまだ生成されていません。</p>
          </div>
        ) : (
          reports.map((report: AnalysisReport, idx: number) => (
          <section
            key={idx}
            className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />

            <div className="flex flex-col lg:flex-row gap-10 relative z-10">
              {/* Left: Main Content */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold mb-6 border border-blue-500/20">
                  <Target size={12} />
                  <span>TOPIC #{idx + 1}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-8 leading-tight">
                  {report.topic_name}
                </h2>

                <div className="space-y-4">
                  {report.analysis.summary_points.map((point: string, pIdx: number) => (
                    <div key={pIdx} className="flex gap-4">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                      <p className="text-zinc-300 leading-relaxed font-medium">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Insight Section */}
              <div className="lg:w-1/3 flex flex-col">
                <div className="h-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative">
                  <div className="flex items-center gap-2 mb-4 text-amber-400 font-bold text-sm uppercase tracking-wider">
                    <TrendingUp size={16} />
                    <span>Industry Insight</span>
                  </div>
                  <div className="text-zinc-400 leading-relaxed italic text-sm md:text-base">
                    "{report.analysis.insight}"
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    {/* Article Sources - Shown only if articles exist */}
                    {report.articles && report.articles.length > 0 && (
                      <div className="flex flex-col gap-2.5">
                        {report.articles.map((article: ArticleDetail, aIdx: number) => (
                          <a
                            key={aIdx}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center justify-between gap-3 text-xs text-zinc-500 hover:text-blue-400 transition-colors bg-white/[0.01] hover:bg-white/[0.03] p-2 rounded-lg border border-white/5 active:scale-[0.98]"
                          >
                            <span className="truncate flex-1 font-medium italic">
                              {article.title}
                            </span>
                            <Zap size={10} className="shrink-0 text-blue-500/50 group-hover/link:text-blue-400 group-hover/link:animate-pulse" />
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
      <footer className="mt-32 pb-12 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600">
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs tracking-widest">© 2026 EV NEWS INTELLIGENCE</span>
        </div>
      </footer>
    </div>
  );
}
