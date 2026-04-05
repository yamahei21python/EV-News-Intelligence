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
 * 80個のカードを生成
 */
const GENERATED_NOISE_CARDS = Array.from({ length: 80 }).map((_, i) => {
  const template = NOISE_TEMPLATES[i % NOISE_TEMPLATES.length];
  const prefix = template.prefixes[Math.floor(Math.random() * template.prefixes.length)];
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];
  return {
    id: i,
    type: template.type,
    title: `${prefix} ${title} (ID:${i + 100})`,
  };
});

export default function Hero() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // カードサイズを固定（中心計算用）
  const CARD_WIDTH = 220;
  const CARD_HEIGHT = 70;

  const cardPositions = useMemo(() => {
    return GENERATED_NOISE_CARDS.map(() => {
      let x = 0, y = 0, angle = 0, radiusX = 0, radiusY = 0;
      let isOutsideSafeZone = false;

      // 【禁止区域(Forbidden Zone)回避ロジック】
      // 左右500px以内 かつ 上方向(y < -50) にカードを配置させない（文字があるエリア）
      let attempts = 0;
      while (!isOutsideSafeZone && attempts < 100) {
        attempts++;
        angle = Math.random() * Math.PI * 2;
        radiusX = Math.random() * 550 + 250; // 外側に大きく散らす
        radiusY = Math.random() * 350 + 150; 
        
        x = Math.cos(angle) * radiusX;
        y = Math.sin(angle) * radiusY;

        // 文字エリア判定: 文字は中央上部に位置するため、そこを避ける
        const isForbidden = Math.abs(x) < 550 && y < -20; // y < -20 以上のエリア（上側）を封鎖
        
        if (!isForbidden) {
          isOutsideSafeZone = true;
        }
      }

      return {
        x,
        y,
        rotate: (Math.random() - 0.5) * 60,
      };
    });
  }, []);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setShowResult(true);
    }, 1400); 
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#020617] text-white">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-900/40 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-900/40 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000" />
      </div>

      {/* 文字セクション - マージンを増やしてノイズ群との境界を明確化 */}
      <div className="relative z-20 text-center max-w-5xl mx-auto mb-32 mt-10">
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

      <div className="relative w-full max-w-6xl h-[400px] flex items-center justify-center z-10">
        
        {/* Executeボタン */}
        <AnimatePresence>
          {!showResult && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-50 pointer-events-none"
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="group pointer-events-auto relative px-12 py-6 bg-white text-black font-extrabold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-3 text-xl uppercase tracking-widest">
                  {isExecuting ? <Cpu className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-6 h-6" />}
                  {isExecuting ? "Compressing..." : "Execute AI Intelligence"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              {!isExecuting && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-gray-500 tracking-[0.5em] uppercase font-black"
                >
                  80 NEWS CHIPS DETECTED · READY TO ANALYZE
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 散らばる80個のノイズカード (文字避け済み) */}
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
                    className="absolute p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/5 shadow-xl"
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
                      scale: 0.5
                    }}
                    animate={isExecuting ? {
                      x: originX,
                      y: originY,
                      rotate: pos.rotate + 720,
                      opacity: 0,
                      scale: 0,
                    } : {
                      opacity: 0.4,
                      scale: 1,
                      x: originX + pos.x,
                      y: originY + pos.y,
                    }}
                    transition={isExecuting ? { 
                      duration: 1.1, 
                      delay: i * 0.012,
                      ease: "backIn"
                    } : { 
                      duration: 0.8,
                      delay: i * 0.005
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 opacity-40">
                        {card.type === "ad" && <Zap size={10} className="text-yellow-500" />}
                        {card.type === "duplicate" && <FileText size={10} className="text-blue-400" />}
                        {card.type === "noise" && <ShieldAlert size={10} className="text-red-500" />}
                      </div>
                      <div>
                        <p className="text-[7px] text-gray-500 leading-none mb-1 uppercase font-bold tracking-tighter">
                          {card.type}
                        </p>
                        <p className="text-[10px] font-medium text-gray-300 leading-tight line-clamp-2">
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

        {/* 抽出されたインサイトカード */}
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
                <span className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase">Strategic Insight Extracted</span>
              </div>
              
              <h3 className="font-noto-serif text-4xl font-bold mb-8 leading-tight text-white">
                テスラ、EVメーカーから<br/>「AI基盤プラットフォーム」へ
              </h3>
              
              <div className="relative pl-8 border-l-2 border-blue-500/20 mb-10">
                <p className="text-zinc-400 text-lg leading-relaxed">
                  80個のノイズを完全に除去。FSD v12の進展と特許群の分析により、単なるハードウェア製造を超えた「自律型AIエージェントの基盤企業」への構造的転換を検知しました。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-blue-500/10 text-blue-300 text-[11px] font-black rounded-xl border border-blue-500/20 uppercase tracking-widest">Structural Pivot</span>
                <span className="px-5 py-2 bg-purple-500/10 text-purple-300 text-[11px] font-black rounded-xl border border-purple-500/20 uppercase tracking-widest">AI Hegemony</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
