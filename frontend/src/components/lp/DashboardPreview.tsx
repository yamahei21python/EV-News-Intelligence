"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Zap } from "lucide-react";

/**
 * 📝 デモデータ設定
 * LP上で表示される「実際のダッシュボード画面」の中身をここで簡単に書き換えられます。
 */
const DEMO_DATA = {
  topic_id: "3",
  title: "ホンダEV開発中止で赤字転落",
  summary_points: [
    "ホンダは2026年3月期に最大6900億円の最終赤字転落を見込み、米国でのEV需要減退を理由に予定していた3車種のEV開発を中止してHV強化へと戦略転換した。",
    "同社の撤退はエンジンの成功体験に固執する「日本病」やイノベーションのジレンマと批判される一方、無理なEV一極化から脱却し現場の実情に合わせた柔軟な戦略（マルチパスウェイ）への回帰とする再建シナリオの対立軸がある。",
    "中長期的な復活の鍵は、北米でのHV販売によるキャッシュ創出とインド市場での地盤固め、そしてソニー・ホンダモビリティとの協業で得た知見を量産車へ還元できるかにかかっている。"
  ],
  insight: "ホンダの巨額赤字とEV戦略縮小は、EV減速期における日系メーカーの戦略的後退を象徴する。中国EV勢の猛追に対し、ホンダは得意なHVで利鞘を稼ぐ「時間稼ぎ」を選択した。しかし、一部で指摘される「エンジンへの固執」がソフトウェア定義車両（SDV）開発の遅れを招いたのは事実だ。インド市場での立て直しやソニーとの協業が成功の鍵を握るが、単なるHV回帰で満足すれば、米中の次世代モビリティ覇権争いから完全に脱落する致命傷になり得る。",
  sources: [
    { title: "ホンダがアメリカ市場からEV完全撤退：ホンダの敗北...", link: "#" },
    { title: "ホンダ、EV減で巨額赤字転落へ 最大6900億円、2...", link: "#" },
    { title: "「技術の魂を取り戻せ」ホンダ、最大2.5兆円損失から...", link: "#" }
  ]
};

export default function DashboardPreview() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-noto-serif text-[var(--text-section)] font-bold mb-4">
          The Intelligence
        </h2>
        <p className="text-gray-500 tracking-widest uppercase text-xs font-bold">
          実際のダッシュボードが提供する、精密な分析体験のプレビュー
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group border border-white/10 shadow-2xl shadow-blue-500/10"
      >
        {/* Background Accent from page.tsx */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/10 transition-colors" />

        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Left: Main Content (Summaries) */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold mb-8 border border-blue-500/20 shadow-inner">
              <Target size={12} />
              <span>TOPIC #{DEMO_DATA.topic_id}</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-tight">
              {DEMO_DATA.title}
            </h3>

            <div className="space-y-6">
              {DEMO_DATA.summary_points.map((point, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <p className="text-zinc-300 leading-relaxed font-medium">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Insight Section */}
          <div className="lg:w-[38%] flex flex-col">
            <div className="h-full bg-white/[0.03] border border-white/5 rounded-3xl p-8 relative ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-6 text-amber-500 font-bold text-sm uppercase tracking-[0.2em]">
                <TrendingUp size={18} />
                <span>Industry Insight</span>
              </div>
              
              <div className="text-zinc-400 leading-relaxed italic text-base font-medium mb-10">
                "{DEMO_DATA.insight}"
              </div>

              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex flex-col gap-3">
                  {DEMO_DATA.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="group/link flex items-center justify-between gap-4 text-xs text-zinc-500 hover:text-blue-400 transition-all bg-white/[0.01] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5"
                    >
                      <span className="truncate flex-1 font-medium italic">
                        {source.title}
                      </span>
                      <Zap size={10} className="shrink-0 text-blue-500/40 group-hover/link:text-blue-400 group-hover/link:animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
