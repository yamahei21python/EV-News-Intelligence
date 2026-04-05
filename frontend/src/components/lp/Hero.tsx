"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ShieldAlert, FileText } from "lucide-react";

const NOISE_CARDS = [
  { id: 1, title: "広告: 最新EV充電器がお買い得！", type: "ad" },
  { id: 2, title: "速報: テスラがまた値下げ（3回目）", type: "duplicate" },
  { id: 3, title: "コラム: 私が電気自動車を買わない理由", type: "noise" },
  { id: 4, title: "PR: 某メーカーの新車種発表会レポート", type: "ad" },
  { id: 5, title: "再掲: 昨日の欧州市場ニュースまとめ", type: "duplicate" },
];

export default function Hero() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setShowResult(true);
    }, 1500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleExecute();
    }, 1000); // 1秒後に自動実行
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto mb-16">
        <motion.h1 
          className="font-noto-serif text-[var(--text-hero)] font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EV市場のノイズを、<br />戦略のアルファに変える。
        </motion.h1>
        
        <motion.p 
          className="text-[var(--text-body)] text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          AIが膨大なデータから「真のシグナル」だけを抽出する、<br />
          経営層・アナリストのためのインテリジェンス・ダッシュボード。
        </motion.p>

        {!showResult && (
          <motion.button
            onClick={handleExecute}
            disabled={isExecuting}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            animate={isExecuting ? { scale: 0.9, opacity: 0 } : {}}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Execute AI Intelligence
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>
        )}
      </div>

      {/* Simulator Area */}
      <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center">
        <AnimatePresence>
          {!showResult && (
            <div className="relative w-full h-full">
              {NOISE_CARDS.map((card, i) => (
                <motion.div
                  key={card.id}
                  className="absolute left-1/2 top-1/2 glass-card p-4 w-72 rounded-xl border-white/10"
                  style={{ 
                    x: "-50%", 
                    y: "-50%",
                    zIndex: 10 + i,
                    rotate: (i - 2) * 5,
                    transformOrigin: "center center"
                  }}
                  animate={isExecuting ? {
                    x: (i - 2) * 200 + (Math.random() - 0.5) * 100,
                    y: (i - 2) * 50 - 400,
                    rotate: (Math.random() - 0.5) * 90,
                    opacity: 0,
                    scale: 0.5,
                  } : {
                    y: "-50%",
                    opacity: 1
                  }}
                  transition={{ duration: 0.8, ease: "easeIn" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {card.type === "ad" && <Zap className="w-4 h-4 text-yellow-500" />}
                      {card.type === "duplicate" && <FileText className="w-4 h-4 text-blue-500" />}
                      {card.type === "noise" && <ShieldAlert className="w-4 h-4 text-red-500" />}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {card.type.toUpperCase()}
                      </p>
                      <p className="text-sm font-medium text-gray-300">
                        {card.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 360 }}
              className="glass-card p-8 w-full max-w-md rounded-2xl border-blue-500/30 ring-1 ring-blue-500/20"
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            >
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-bold tracking-widest uppercase">Intelligence Insight</span>
              </div>
              <h3 className="font-noto-serif text-2xl font-bold mb-4">
                テスラ、EV企業からAI企業への構造的転換を加速
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                最新の特許申請とFSD v12の展開速度から、単なるハードウェア企業ではない「AIエージェント・プロバイダー」としての優位性が浮き彫りに...
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 uppercase">Structural Change</span>
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/20 uppercase">Dominance</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
