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
      // 角度と半径の計算
      let angle = Math.random() * Math.PI * 2;
      let radiusX = Math.random() * 450 + 200; // 横に広く
      let radiusY = Math.random() * 250 + 150; // 縦は少し抑える

      // 【文字避けロジック】
      // 真上（文字がある方向）付近の角度を避けさせる、または半径を大きくして文字を飛び越えさせる
      const angleDeg = (angle * 180) / Math.PI;
      const isTopZone = angleDeg > 220 && angleDeg < 320;
      
      if (isTopZone) {
        // 文字がある上方向の場合は、半径を強制的に大きくして文字の上に被らないようにする
        radiusY += 200;
        radiusX += 50;
      }

      return {
        x: Math.cos(angle) * radiusX,
        y: Math.sin(angle) * (isTopZone ? radiusY : radiusY),
        rotate: (Math.random() - 0.5) * 60,
      };
    });
  }, []);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setShowResult(true);
    }, 1400); // 80個なので少しだけ時間をかける
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#020617] text-white">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-900/40 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-900/40 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000" />
      </div>

      {/* 文字セクション - カードが被らないようにmb-24に設定 */}
      <div className="relative z-20 text-center max-w-5xl mx-auto mb-24 mt-10">
        <motion.h1 
          className="font-noto-serif text-[var(--text-hero)] font-bold leading-tight mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EV市場のノイズを、<br />戦略のアルファに変える。
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed"
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
                className="group pointer-events-auto relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-2 text-lg uppercase tracking-wider">
                  {isExecuting ? <Cpu className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-6 h-6" />}
                  {isExecuting ? "Compressing Noise Swarm..." : "Execute AI Intelligence"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              {!isExecuting && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 tracking-[0.4em] uppercase font-bold"
                >
                  80 NEWS CHIPS FOUND · CLICK TO ANALYZE
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 散らばる80個のノイズカード */}
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
                    className="absolute p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"
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
                      rotate: pos.rotate + 720, // 激しく回転
                      opacity: 0,
                      scale: 0,
                    } : {
                      opacity: 0.4, // 数が多いので透過度を上げる
                      scale: 1,
                      x: originX + pos.x,
                      y: originY + pos.y,
                    }}
                    transition={isExecuting ? { 
                      duration: 1.0, 
                      delay: i * 0.01, // 0.01秒ずつずらすことで「渦」に見える
                      ease: "backIn"
                    } : { 
                      duration: 0.7,
                      delay: i * 0.005
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 opacity-50">
                        {card.type === "ad" && <Zap size={12} className="text-yellow-500" />}
                        {card.type === "duplicate" && <FileText size={12} className="text-blue-400" />}
                        {card.type === "noise" && <ShieldAlert size={12} className="text-red-500" />}
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-500 leading-none mb-1 uppercase tracking-tighter">
                          {card.type}
                        </p>
                        <p className="text-[10px] font-medium text-gray-300 leading-[1.2] line-clamp-2">
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
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute z-50 p-10 w-full max-w-lg rounded-3xl bg-[#0a0a0a] border border-blue-500/40 shadow-[0_0_80px_rgba(59,130,246,0.2)] backdrop-blur-3xl"
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-black tracking-[0.4em] text-blue-400 uppercase">Intelligence Extracted</span>
              </div>
              
              <h3 className="font-noto-serif text-3xl font-bold mb-6 leading-tight text-white">
                テスラ、EVメーカーから<br/>「AI基盤企業」への転換
              </h3>
              
              <div className="relative pl-6 border-l-2 border-blue-500/30 mb-8">
                <p className="text-zinc-400 text-base leading-relaxed">
                  80以上のノイズを排除した結果、重要なシグナルを検出：FSD v12の進展と特許群は、単なる自動車販売を超えた「AIエージェントプラットフォーム」への進化を物語っています。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-300 text-[10px] font-black rounded-full border border-blue-500/20 uppercase">Strategic Pivot</span>
                <span className="px-4 py-1.5 bg-purple-500/10 text-purple-300 text-[10px] font-black rounded-full border border-purple-500/20 uppercase">AI Hegemony</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
