"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Zap, Sparkles } from "lucide-react";

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
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium mb-8 text-white text-hero-dense">
          Dashboard
        </h2>
        <p className="text-lg md:text-xl text-ui-secondary font-light max-w-3xl mx-auto leading-relaxed">
          精密な分析体験を凝縮した、インテリジェンス・インターフェース。
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="intelligence-card p-8 md:p-10 relative overflow-hidden group shadow-2xl shadow-brand-emerald/10"
      >
        {/* Background Accent from page.tsx */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/5 blur-3xl -mr-32 -mt-32 group-hover:bg-brand-emerald/10 transition-colors" />

        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Left: Main Content (Summaries) */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-emerald/10 text-brand-emerald text-[10px] font-bold mb-8 border border-brand-emerald/20 shadow-inner uppercase tracking-widest">
              <Target size={12} strokeWidth={1.5} />
              <span>TOPIC #{DEMO_DATA.topic_id}</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-medium text-white mb-10 leading-tight tracking-tight">
              {DEMO_DATA.title}
            </h3>

            <div className="space-y-6">
              {DEMO_DATA.summary_points.map((point, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand-emerald shrink-0 shadow-[0_0_8px_rgba(62,207,142,0.8)]" />
                  <p className="text-ui-secondary leading-relaxed font-light">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Insight Section */}
          <div className="lg:w-[38%] flex flex-col">
            <div className="h-full bg-white/[0.03] border border-white/5 rounded-lg p-8 relative ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-6 text-brand-emerald/80 font-bold text-[10px] uppercase tracking-[0.2em]">
                <TrendingUp size={18} strokeWidth={1.5} />
                <span>Industry Insight</span>
              </div>
              
              <div className="text-ui-secondary leading-relaxed italic text-base font-light mb-10">
                "{DEMO_DATA.insight}"
              </div>

              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex flex-col gap-3">
                  {DEMO_DATA.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="group/link flex items-center justify-between gap-4 text-[11px] text-ui-muted hover:text-brand-emerald transition-all bg-white/[0.01] hover:bg-white/[0.04] p-3 rounded-md border border-white/5"
                    >
                      <span className="truncate flex-1 font-medium italic">
                        {source.title}
                      </span>
                      <Zap size={10} strokeWidth={1.5} className="shrink-0 text-brand-emerald/40 group-hover/link:text-brand-emerald" />
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
