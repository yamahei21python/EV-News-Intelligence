"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ShieldAlert, FileText, Cpu } from "lucide-react";

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

  // カードサイズを大きく設定
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 90;

  const cardPositions = useMemo(() => {
    return GENERATED_NOISE_CARDS.map(() => {
      let x = 0, y = 0, angle = 0, radiusX = 0, radiusY = 0;
      let isOutsideSafeZone = false;

      // 【高密度化のための制限エリア定義】
      let attempts = 0;
      while (!isOutsideSafeZone && attempts < 100) {
        attempts++;
        angle = Math.random() * Math.PI * 2;
        // 以前より半径を小さくして凝縮させる
        radiusX = Math.random() * 350 + 100; 
        radiusY = Math.random() * 250 + 100; 
        
        x = Math.cos(angle) * radiusX;
        y = Math.sin(angle) * radiusY;

        // 判定1: 最上部のテキストエリア（y < -180 & 中央付近）を避ける
        const isTopForbidden = Math.abs(x) < 450 && y < -180;
        
        // 判定2: 左右の端（|x| > 450）を封鎖して中央に押し込める
        const isSideForbidden = Math.abs(x) > 450;

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

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setShowResult(true);
    }, 1200); 
  };

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
          className="font-noto-serif text-[var(--text-hero)] font-bold leading-tight mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EV市場のノイズを、<br />戦略のアルファに変える。
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          AIが膨大なデータから「真のシグナル」だけを抽出する、<br />
          経営層・アナリストのためのインテリジェンス・ダッシュボード。
        </motion.p>
      </div>

      <div className="relative w-full max-w-3xl h-[450px] flex items-center justify-center z-10">
        
        {/* Executeボタン */}
        <AnimatePresence>
          {!showResult && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-50 pointer-events-none"
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="group pointer-events-auto relative px-12 py-6 bg-white text-black font-extrabold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-3 text-xl uppercase tracking-widest">
                  {isExecuting ? <Cpu className="w-7 h-7 animate-pulse" /> : <Sparkles className="w-7 h-7" />}
                  {isExecuting ? "Analyzing..." : "Execute AI Intelligence"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              {!isExecuting && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-400 tracking-[0.5em] uppercase font-black"
                >
                  40 UNSTRUCTURED DATA CHIPS FOUND
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
                      opacity: 0.7, // 密度を高く見せるため少し濃くする
                      scale: 1,
                      x: originX + pos.x,
                      y: originY + pos.y,
                    }}
                    transition={isExecuting ? { 
                      duration: 0.8, 
                      delay: i * 0.015,
                      ease: "backIn"
                    } : { 
                      duration: 0.6,
                      delay: i * 0.01
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
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute z-50 p-12 w-full max-w-xl rounded-3xl bg-[#0a0a0a] border border-blue-500/30 shadow-[0_0_100px_rgba(59,130,246,0.3)] backdrop-blur-3xl"
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs font-black tracking-[0.5em] text-blue-400 uppercase">Insights Extracted</span>
              </div>
              
              <h3 className="font-noto-serif text-4xl font-bold mb-8 leading-tight text-white">
                テスラ、次世代AI基盤企業の覇権
              </h3>
              
              <div className="relative pl-8 border-l-2 border-blue-500/20 mb-10">
                <p className="text-zinc-400 text-lg leading-relaxed text-justify">
                  市場の膨大なノイズを完全に除去。FSD v12の進展と独自のAIチップ開発により、単なる製造業から「自律型社会の基盤」へと変貌するテスラの真の姿を検出しました。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-blue-500/10 text-blue-300 text-[11px] font-black rounded-xl border border-blue-500/20 uppercase tracking-widest">Structural Pivot</span>
                <span className="px-5 py-2 bg-purple-500/10 text-purple-300 text-[11px] font-black rounded-xl border border-purple-500/20 uppercase tracking-widest">AI Supremacy</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
