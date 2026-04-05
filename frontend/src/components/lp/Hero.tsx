"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ShieldAlert, FileText, Cpu } from "lucide-react";

/**
 * 📝 ノイズ記事データ
 * 画面上に散らばる「無価値な情報」のリストです。
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

  // 散らばる初期位置を計算（コンポーネントの再描画で位置が飛ばないようuseMemo化）
  const cardPositions = useMemo(() => {
    return NOISE_CARDS.map(() => {
      // 画面中央からの距離（半径）と角度をランダムに設定し、円状に綺麗に散らす
      const radius = Math.random() * 250 + 150; // 150px ~ 400pxの距離
      const angle = Math.random() * Math.PI * 2; // 360度ランダム
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotate: (Math.random() - 0.5) * 40, // 傾き
      };
    });
  }, []);

  const handleExecute = () => {
    setIsExecuting(true);
    // 吸い込みアニメーションが終わった頃にInsightを表示
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

      {/* Simulator Area */}
      <div className="relative w-full max-w-4xl h-[450px] flex items-center justify-center z-10">
        
        {/* 真ん中の「Execute」ボタン */}
        <AnimatePresence>
          {!showResult && (
            <motion.div 
              className="absolute z-50 flex flex-col items-center gap-4"
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isExecuting ? <Cpu className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
                  {isExecuting ? "Extracting Signals..." : "Execute AI Intelligence"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
              </button>
              {!isExecuting && (
                <span className="text-xs text-gray-500 tracking-widest uppercase">Click to compress 5,000+ news</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 散らばるノイズカード */}
        <AnimatePresence>
          {!showResult && (
            <div className="absolute inset-0 pointer-events-none">
              {NOISE_CARDS.map((card, i) => {
                const pos = cardPositions[i];
                return (
                  <motion.div
                    key={card.id}
                    className="absolute left-1/2 top-1/2 p-3 w-60 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
                    style={{ zIndex: 10 + i }}
                    initial={{ 
                      x: `calc(-50% + ${pos.x}px)`, 
                      y: `calc(-50% + ${pos.y}px)`, 
                      rotate: pos.rotate,
                      opacity: 0,
                      scale: 0.9
                    }}
                    animate={isExecuting ? {
                      x: "-50%",
                      y: "-50%",
                      rotate: pos.rotate + 180,
                      opacity: 0,
                      scale: 0,
                    } : {
                      opacity: 0.6,
                      scale: 1,
                      x: `calc(-50% + ${pos.x}px)`,
                      y: `calc(-50% + ${pos.y}px)`,
                    }}
                    transition={isExecuting ? { 
                      duration: 0.8, 
                      delay: i * 0.03,
                      ease: "backIn"
                    } : { 
                      duration: 0.5,
                      delay: i * 0.05
                    }}
                  >
                    <div className="flex items-start gap-3 opacity-70">
                      <div className="mt-1">
                        {card.type === "ad" && <Zap className="w-4 h-4 text-yellow-500" />}
                        {card.type === "duplicate" && <FileText className="w-4 h-4 text-blue-400" />}
                        {card.type === "noise" && <ShieldAlert className="w-4 h-4 text-red-400" />}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 tracking-wider">
                          {card.type.toUpperCase()}
                        </p>
                        <p className="text-xs font-medium text-gray-300 line-clamp-2">
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

        {/* 抽出されたインサイトカード（結果） */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              className="absolute z-50 p-8 w-full max-w-lg rounded-2xl bg-[#111] border border-blue-500/30 shadow-[0_0_60px_rgba(59,130,246,0.15)] backdrop-blur-xl"
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">AI Industry Insight</span>
                <span className="ml-auto text-xs text-gray-500">Just now</span>
              </div>
              <h3 className="font-noto-serif text-2xl font-bold mb-4 leading-snug">
                テスラ、EVメーカーから<br/>「AIプロバイダー」への構造的転換
              </h3>
              
              <div className="relative pl-4 border-l-2 border-purple-500/50 mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  最新の特許申請とFSD v12の展開速度から、単なるハードウェア企業ではない優位性が浮き彫りに。AIエージェントの基盤プラットフォーム化を狙う動きは、既存の自動車メーカーにとって最大の脅威となる。
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-[11px] font-bold rounded-full border border-blue-500/20">Structural Change</span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-300 text-[11px] font-bold rounded-full border border-purple-500/20">Market Dominance</span>
              </div>

              <motion.div 
                className="absolute -inset-[1px] rounded-2xl border border-white/10 pointer-events-none"
                animate={{ opacity: [0.1, 0.5, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
