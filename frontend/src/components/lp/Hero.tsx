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
  { id: 16, title: "広告: 中古EVの買取はこちら", type: "ad" },
  { id: 17, title: "噂: 新型モデル3の隠れた機能", type: "noise" },
  { id: 18, title: "PR: EV専用車載アクセサリー", type: "ad" },
  { id: 19, title: "重複: 日産の全固体電池開発ロードマップ", type: "duplicate" },
  { id: 20, title: "速報: テスラの四半期決算（5分前と同じ）", type: "duplicate" },
  { id: 21, title: "コラム: EVの航続距離は本当に十分か？", type: "noise" },
  { id: 22, title: "PR: 充電待機時間を快適にするアプリ", type: "ad" },
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
              {NOISE_CARDS.map((card, i) => {
                const randomX = (i % 2 === 0 ? 1 : -1) * (Math.random() * 400 + 100);
                const randomY = (Math.random() - 0.5) * 600;
                const randomRotate = (Math.random() - 0.5) * 60;
                
                return (
                  <motion.div
                    key={card.id}
                    className="absolute glass-card p-4 w-64 rounded-xl border-white/10 shadow-2xl"
                    style={{ zIndex: 10 + i }}
                    initial={{ 
                      x: randomX, 
                      y: randomY, 
                      rotate: randomRotate,
                      opacity: 0,
                      scale: 0.8
                    }}
                    animate={isExecuting ? {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      opacity: 0,
                      scale: 0,
                    } : {
                      opacity: 1,
                      scale: 1,
                      x: randomX + Math.sin(Date.now() / 2000 + i) * 10, // 微かな揺らぎ
                      y: randomY + Math.cos(Date.now() / 2000 + i) * 10,
                    }}
                    transition={isExecuting ? { 
                      duration: 0.8, 
                      delay: i * 0.02, // わずかな時差で吸い込まれる
                      ease: [0.4, 0, 0.2, 1] 
                    } : { 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
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
                );
              })}
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
