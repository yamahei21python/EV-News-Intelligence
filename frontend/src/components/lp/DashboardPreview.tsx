"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Zap, Sparkles } from "lucide-react";

/**
 * 📝 デモデータ設定
 * LP上で表示される「実際のダッシュボード画面」の中身をここで簡単に書き換えられます。
 */
const DEMO_DATA = {
  topic_id: "1",
  title: "LEXUS急速充電サービス開始、PCA連携で全国1000基",
  summary_points: [
    "LEXUSは新急速充電サービス「LEXUS Charging」を開始。ポルシェ・アウディ・VWの「Premium Charging Alliance（PCA）」とローミング連携し、利用可能な急速充電器が全国約1000基に拡大した。",
    "ブランド横断で充電網を相互接続する日本初の取り組み。LEXUSユーザーはPCA加盟ブランドの充電器もシームレスに利用可能となり、充電インフラ不足というBEV最大の課題を直接解決する。",
    "プレミアムセグメントからのインフラ相互開放が、日本全体のEVシフトを加速する起爆剤となる。業界横断連携の第一歩として、他ブランドの追随も予想される。"
  ],
  insight: "LEXUSのPCA参画は、日本におけるEV充電インフラ「相互運用時代」の幕開けだ。これまで各社が個別に充電網を張ってきたが、ブランド横断連携が進めばユーザーの充電不安は劇的に減る。欧州プレミアム勢とのアライアンスでインフラ投資の好循環が生まれ、日本のEV普及を根本から押し上げる。レクサスがこの動きを主導したことは象徴的であり、日本のEV戦略にとって極めて前向きなシグナルである。",
  sources: [
    { title: "トヨタ公式: LEXUS、新急速充電サービス「LEXUS Charging」を開始", link: "https://global.toyota/jp/newsroom/lexus/44152328.html" },
    { title: "Impress Watch: レクサス、ポルシェやアウディの急速充電器も使えるプレミアム充電サービス", link: "https://www.watch.impress.co.jp/docs/news/2098337.html" },
    { title: "PR TIMES: VWグループ、PCAとLEXUS Chargingの相互利用を開始", link: "https://prtimes.jp/main/html/rd/p/000000159.000058804.html" }
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
                    <a
                      key={idx}
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-between gap-4 text-[11px] text-ui-muted hover:text-brand-emerald transition-all bg-white/[0.01] hover:bg-white/[0.04] p-3 rounded-md border border-white/5"
                    >
                      <span className="truncate flex-1 font-medium italic">
                        {source.title}
                      </span>
                      <Zap size={10} strokeWidth={1.5} className="shrink-0 text-brand-emerald/40 group-hover/link:text-brand-emerald" />
                    </a>
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
