"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ShieldAlert, FileText, Target, TrendingUp } from "lucide-react";

/**
 * 📝 デモデータ設定（DashboardPreviewと同期）
 */
const DEMO_DATA = {
  topic_id: "3",
  title: "ホンダEV開発中止で赤字転落",
  summary_points: [
    "米国でのEV需要減退を理由に予定していた3車種のEV開発を中止してHV強化へと戦略転換した。",
    "エンジンの成功体験に固執する「日本病」への批判と、多角的な「マルチパスウェイ」回帰という対立軸がある。",
    "北米でのキャッシュ創出とソニーとの協業で得た知見を量産車へ還元できるかが再建の鍵を握る。"
  ],
  insight: "ホンダのEV戦略縮小は、EV減速期における戦略的後退を象徴する。独自戦略による「時間稼ぎ」を選択したが、SDV開発の遅れは事実だ。単なるHV回帰に満足すれば、次世代の覇権争いから脱落する致命傷になり得る。"
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

export default function Hero() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // カードサイズ
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 90;

  // 1秒後に自動実行
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExecuting(true);
      const resultTimer = setTimeout(() => {
        setShowResult(true);
      }, 1800); // 完璧な同期 (1.8秒)
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
        radiusX = Math.random() * 350 + 100; 
        radiusY = Math.random() * 250 + 100; 
        
        x = Math.cos(angle) * radiusX;
        y = Math.sin(angle) * radiusY;

        const isTopForbidden = Math.abs(x) < 450 && y < -180;
        const isSideForbidden = Math.abs(x) > 420;

        if (!isTopForbidden && !isSideForbidden) {
          isOutsideSafeZone = true;
        }
      }

      return {
        x,
        y,
        rotate: (Math.random() - 0.5) * 45,
      };
    });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#020617] text-white selection:bg-blue-500/30">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-900/40 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-900/40 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000" />
      </div>

      {/* メインタイトル */}
      <div className="relative z-20 text-center max-w-5xl mx-auto mb-16 mt-10">
        <motion.h1 
          className="font-noto-serif text-3xl md:text-5xl font-bold leading-tight mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EV市場のノイズを、<br />戦略のアルファに変える。
        </motion.h1>
        
        <motion.p 
          className="text-zinc-400 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          AIが膨大なデータから「真のシグナル」だけを抽出する、<br className="hidden md:block" />
          経営層・アナリストのためのインテリジェンス・ダッシュボード。
        </motion.p>
      </div>

      <div className="relative w-full max-w-3xl h-[450px] flex items-center justify-center z-10">
        
        {/* 凝縮されたノイズカード */}
        <AnimatePresence>
          {!showResult && (
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
                      top: "50%",
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
            <div className="absolute z-50 flex items-center justify-center w-full max-w-4xl px-4">
              {/* Backlight Glow Effect */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full scale-150 pointer-events-none"
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative z-10 w-full p-8 md:p-10 rounded-[2.5rem] bg-[#030712]/80 border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.15)] backdrop-blur-3xl overflow-hidden"
                transition={{ type: "spring", damping: 20, stiffness: 80 }}
              >
                {/* Internal accent light */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -mr-32 -mt-32 pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-10 text-left">
                  {/* Left: Metadata & Summary */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black border border-blue-500/20 uppercase tracking-widest">
                        <Target size={12} />
                        <span>TOPIC #{DEMO_DATA.topic_id}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 text-zinc-500 text-[10px] font-black border border-white/5 uppercase tracking-widest">
                        <Sparkles size={12} className="text-blue-400/50" />
                        <span>INSIGHTS EXTRACTED</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight tracking-tight">
                      {DEMO_DATA.title}
                    </h3>

                    <div className="space-y-4">
                      {DEMO_DATA.summary_points.map((point, idx) => (
                        <div key={idx} className="flex gap-4 group">
                          <div className="mt-2 w-1 h-1 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light group-hover:text-zinc-200 transition-colors">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Analytical Insight Box */}
                  <div className="lg:w-[40%]">
                    <div className="h-full bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 lg:p-8 relative ring-1 ring-white/5 shadow-inner">
                      <div className="flex items-center gap-2 mb-5 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        <TrendingUp size={14} />
                        <span>Analysis Insight</span>
                      </div>
                      
                      <div className="text-zinc-400 leading-relaxed italic text-sm md:text-base font-light border-l-2 border-blue-500/20 pl-4 py-1">
                        "{DEMO_DATA.insight}"
                      </div>

                      <div className="mt-8 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/5 text-zinc-500 text-[9px] font-black rounded-lg border border-white/5 uppercase tracking-widest">
                          Structural Pivot
                        </span>
                        <span className="px-3 py-1 bg-white/5 text-zinc-500 text-[9px] font-black rounded-lg border border-white/5 uppercase tracking-widest">
                          Market Shift
                        </span>
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
