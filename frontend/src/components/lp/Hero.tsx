"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ShieldAlert, FileText, Target, TrendingUp } from "lucide-react";

/**
 * 📝 デモデータ設定（DashboardPreviewと同期）
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

/**
 * 📝 ノイズ生成テンプレート
 */
const NOISE_TEMPLATES = [
  { type: "ad", prefixes: ["広告:", "PR:", "スポンサー:"], titles: ["EVタイヤセール", "充電ステーション案内", "格安EV保険", "新車発表会招待状", "家庭用充電器", "EVライフブログ", "急速充電ネットワーク"] },
  { type: "duplicate", prefixes: ["速報:", "再掲:", "重複:"], titles: ["テスラ値下げ", "トヨタ新バッテリー", "欧州市場まとめ", "中国の補助金政策", "BYDのアジア戦略", "ホンダの提携話", "日産の生産計画"] },
  { type: "noise", prefixes: ["コラム:", "噂:", "分析(?):"], titles: ["EVを買わない理由", "Apple Carの噂", "EV vs ガソリン車", "私のEV日記", "昨日の出来事", "市場の独り言", "未来予想図"] },
];

/**
 * 40個のカードを生成
 */
const GENERATED_NOISE_CARDS = Array.from({ length: 40 }).map((_, i) => {
  const template = NOISE_TEMPLATES[i % NOISE_TEMPLATES.length];
  const prefix = template.prefixes[Math.floor(Math.random() * template.prefixes.length)];
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];
  return {
    id: i,
    type: template.type,
    title: `${prefix} ${title}`,
  };
});

const CARD_WIDTH = 240;
const CARD_HEIGHT = 80;

export default function Hero() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // 1秒後に自動実行 & マウント確認
  useEffect(() => {
    setHasMounted(true);
    const timer = setTimeout(() => {
      setIsExecuting(true);
      const resultTimer = setTimeout(() => {
        setShowResult(true);
      }, 1800);
      return () => clearTimeout(resultTimer);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const cardPositions = useMemo(() => {
    return GENERATED_NOISE_CARDS.map(() => {
      let x = 0, y = 0, angle = 0, radiusX = 0, radiusY = 0;
      let isOutsideSafeZone = false;

      let attempts = 0;
      while (!isOutsideSafeZone && attempts < 100) {
        attempts++;
        angle = Math.random() * Math.PI * 2;
        radiusX = Math.random() * 500 + 100;
        radiusY = Math.random() * 400 + 50;
        x = Math.cos(angle) * radiusX;
        y = Math.sin(angle) * radiusY;
        const isTopForbidden = Math.abs(x) < 450 && y < -180;
        const isSideForbidden = Math.abs(x) > 420;
        if (!isTopForbidden && !isSideForbidden) isOutsideSafeZone = true;
      }
      return { x, y, rotate: (Math.random() - 0.5) * 45 };
    });
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-28 pb-12 flex flex-col items-center justify-start px-4 bg-[#08090a] text-[#f7f8f8] selection:bg-emerald-500/30 overflow-visible">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* メインタイトル */}
      <div className="relative z-20 text-center max-w-5xl mx-auto mb-10">
        <motion.h1
          className="text-6xl md:text-8xl font-bold leading-[1.1] mb-10 tracking-tighter text-white flex flex-wrap items-center justify-center gap-1 md:gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-5 bg-[#10b981] text-black rounded-2xl italic shadow-[0_0_50px_rgba(16,185,129,0.5)] transform -skew-x-6">
            <span className="text-4xl md:text-6xl font-black tracking-tighter">EV</span>
          </span>
          <span className="ml-2 md:ml-4 drop-shadow-[0_0_25px_rgba(16,185,129,0.75)]">
            News.Intelligence
          </span>
        </motion.h1>

        <motion.p
          className="text-[#d0d6e0] max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          膨大なデータから本質を抽出。<br className="hidden md:block" />
          構造化されたインサイトを提供。
        </motion.p>
      </div>

      <div className="relative w-full max-w-7xl min-h-[500px] flex items-start justify-center z-10 mb-6">

        {/* 凝縮されたノイズカード (Client Side only to avoid hydration mismatch) */}
        <AnimatePresence>
          {!showResult && hasMounted && (
            <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
              {GENERATED_NOISE_CARDS.map((card, i) => {
                const pos = cardPositions[i];
                const originX = -(CARD_WIDTH / 2);
                const originY = -(CARD_HEIGHT / 2);

                return (
                  <motion.div
                    key={card.id}
                    className="absolute p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
                    style={{
                      width: CARD_WIDTH,
                      zIndex: 10 + i,
                      left: "50%",
                      top: "40%",
                    }}
                    initial={{
                      x: originX + pos.x,
                      y: originY + pos.y,
                      rotate: pos.rotate,
                      opacity: 0,
                      scale: 0.7
                    }}
                    animate={isExecuting ? {
                      x: originX,
                      y: originY,
                      rotate: pos.rotate + 360,
                      opacity: 0,
                      scale: 0,
                    } : {
                      opacity: 0.7,
                      scale: 1,
                      x: originX + pos.x,
                      y: originY + pos.y,
                    }}
                    transition={isExecuting ? {
                      duration: 1.08, // 1.2x (0.9 * 1.2)
                      delay: i * 0.018, // 1.2x (0.015 * 1.2)
                      ease: "backIn"
                    } : {
                      duration: 1.20, // さらにゆったり (1.2s)
                      delay: i * 0.012 // 1.2x (0.01 * 1.2)
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 opacity-60">
                        {card.type === "ad" && <Zap size={16} className="text-yellow-500" />}
                        {card.type === "duplicate" && <FileText size={16} className="text-blue-400" />}
                        {card.type === "noise" && <ShieldAlert size={16} className="text-red-500" />}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 leading-none mb-1.5 uppercase font-bold tracking-widest">
                          {card.type}
                        </p>
                        <p className="text-xs md:text-sm font-semibold text-gray-200 leading-snug line-clamp-2">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

      {/* 結果セクション */}
        <AnimatePresence>
          {showResult && (
            <div className="relative w-full flex items-center justify-center">
              {/* Subtle Backlight Glow (Emerald & Indigo) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
              >
                <div className="w-[120%] h-[120%] bg-brand-emerald/10 blur-[150px] rounded-full" />
                <div className="absolute w-[80%] h-[80%] bg-indigo-500/5 blur-[120px] rounded-full translate-x-20 -translate-y-20" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full intelligence-card p-8 md:p-10 relative overflow-hidden group shadow-2xl shadow-brand-emerald/10"
                transition={{ duration: 0.8 }}
              >
                {/* Internal accent light */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/5 blur-3xl -mr-32 -mt-32 group-hover:bg-brand-emerald/10 transition-colors" />

                <div className="flex flex-col lg:flex-row gap-12 relative z-10 text-left">
                  {/* Left Column: Facts */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-emerald/10 text-brand-emerald text-[10px] font-bold mb-8 border border-brand-emerald/20 shadow-inner uppercase tracking-widest">
                      <Target size={12} strokeWidth={1.5} />
                      <span>Topic #{DEMO_DATA.topic_id}</span>
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

                  {/* Right Column: Insight Box */}
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
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
