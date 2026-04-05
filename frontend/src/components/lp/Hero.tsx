"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ShieldAlert, FileText, Cpu } from "lucide-react";

/**
 * 📝 ノイズ記事データ
 */
const NOISE_CARDS = [
  { id: 1, title: "広告: 最新EV充電器がお買い得！", type: "ad" },
  { id: 2, title: "速報: テスラがまた値下げ（3回目）", type: "duplicate" },
  { id: 3, title: "コラム: 私が電気自動車を買わない理由", type: "noise" },
  { id: 4, title: "PR: 某メーカーの新車種発表会レポート", type: "ad" },
  { id: 5, title: "再掲: 昨日の欧州市場ニュースまとめ", type: "duplicate" },
  { id: 6, title: "スポンサー: EV保険の革命的なプラン", type: "ad" },
  { id: 7, title: "重複: トヨタの新型バッテリー技術（既報）", type: "duplicate" },
  { id: 8, title: "噂: Apple Carの計画が再び変更か？", type: "noise" },
  { id: 9, title: "PR: local充電ステーションのご案内", type: "ad" },
  { id: 10, title: "分析(?): EV vs ガソリン車の維持費対決", type: "noise" },
  { id: 11, title: "速報: BYDのアジア戦略（内容は昨日と同じ）", type: "duplicate" },
  { id: 12, title: "広告: 電気自動車用タイヤセール中", type: "ad" },
  { id: 13, title: "ブログ: 私のEVライフ（日記）", type: "noise" },
  { id: 14, title: "PR: 次世代急速充電ネットワーク", type: "ad" },
  { id: 15, title: "再掲: 中国の補助金政策の変更について", type: "duplicate" },
];

export default function Hero() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // カードサイズを固定（中心計算用）
  const CARD_WIDTH = 240;
  const CARD_HEIGHT = 80;

  const cardPositions = useMemo(() => {
    return NOISE_CARDS.map(() => {
      const radius = Math.random() * 250 + 180;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotate: (Math.random() - 0.5) * 40,
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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#020617] text-white">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-900/40 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-900/40 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-20 text-center max-w-5xl mx-auto mb-12 mt-10">
        <motion.h1 
          className="font-noto-serif text-[var(--text-hero)] font-bold leading-tight mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EV市場のノイズを、<br />戦略のアルファに変える。
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          AIが膨大なデータから「真のシグナル」だけを抽出する、<br />
          経営層・アナリストのためのインテリジェンス・ダッシュボード。
        </motion.p>
      </div>

      <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center z-10">
        
        {/* Executeボタンの完全なセンタリング */}
        <AnimatePresence>
          {!showResult && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-50"
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="group relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              >
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  {isExecuting ? <Cpu className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-6 h-6" />}
                  {isExecuting ? "Extracting Signals..." : "Execute AI Intelligence"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              {!isExecuting && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 tracking-[0.3em] uppercase"
                >
                  Click to compress 5,000+ news
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 散らばるノイズカード */}
        <AnimatePresence>
          {!showResult && (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {NOISE_CARDS.map((card, i) => {
                const pos = cardPositions[i];
                // 完璧な数学的センタリング: コンテナ中央(left:50%, top:50%)を原点とし、
                // カード自身のサイズ(width/2, height/2)分を差し引いて真の「中心」を合わせる
                const originX = -(CARD_WIDTH / 2);
                const originY = -(CARD_HEIGHT / 2);

                return (
                  <motion.div
                    key={card.id}
                    className="absolute p-4 w-[240px] rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl"
                    style={{ 
                      zIndex: 10 + i,
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ 
                      x: originX + pos.x, 
                      y: originY + pos.y, 
                      rotate: pos.rotate,
                      opacity: 0,
                      scale: 0.8
                    }}
                    animate={isExecuting ? {
                      x: originX, // 中心点へ吸い込まれる
                      y: originY,
                      rotate: pos.rotate + 360, // 激しく回転しながら吸い込まれる
                      opacity: 0,
                      scale: 0,
                    } : {
                      opacity: 0.6,
                      scale: 1,
                      x: originX + pos.x,
                      y: originY + pos.y,
                    }}
                    transition={isExecuting ? { 
                      duration: 0.9, 
                      delay: i * 0.02,
                      ease: "backIn"
                    } : { 
                      duration: 0.6,
                      delay: i * 0.04
                    }}
                  >
                    <div className="flex items-start gap-3 opacity-60">
                      <div className="mt-1">
                        {card.type === "ad" && <Zap className="w-4 h-4 text-yellow-500" />}
                        {card.type === "duplicate" && <FileText className="w-4 h-4 text-blue-400" />}
                        {card.type === "noise" && <ShieldAlert className="w-4 h-4 text-red-500" />}
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 mb-1 tracking-widest">
                          {card.type.toUpperCase()}
                        </p>
                        <p className="text-xs font-semibold text-gray-300 line-clamp-2">
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

        {/* インサイトカードの出現 */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 40, rotateX: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              className="absolute z-50 p-10 w-full max-w-lg rounded-3xl bg-[#0a0a0a] border border-blue-500/40 shadow-[0_0_80px_rgba(59,130,246,0.15)] backdrop-blur-2xl"
              transition={{ type: "spring", damping: 18, stiffness: 120 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-black tracking-[0.3em] text-blue-400 uppercase">AI Strategic Insight</span>
              </div>
              
              <h3 className="font-noto-serif text-3xl font-bold mb-6 leading-snug text-white">
                テスラ、EVメーカーから<br/>「AIプロバイダー」への構造的転換
              </h3>
              
              <div className="relative pl-6 border-l-2 border-blue-500/30 mb-8">
                <p className="text-zinc-400 text-base leading-relaxed">
                  最新の特許申請とFSD v12の展開速度から、単なるハードウェア企業ではない優位性が浮き彫りに。AIエージェントの基盤プラットフォーム化を狙う動きは、既存の自動車メーカーにとって最大の脅威。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-300 text-[10px] font-black rounded-full border border-blue-500/20 uppercase tracking-wider">Structural Change</span>
                <span className="px-4 py-1.5 bg-purple-500/10 text-purple-300 text-[10px] font-black rounded-full border border-purple-500/20 uppercase tracking-wider">Market Dominance</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
