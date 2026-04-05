"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const typewriterText = "近年のBYDの急成長は、単なる低価格戦略の結果ではない。垂直統合されたサプライチェーン、特に自社製ブレードバッテリーの供給能力が、競合他社が直面する『調達のボトルネック』を無効化している点にある。これは2026年以降の欧州メーカーにとって最大の脅威であり...";

export default function BentoGrid() {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(typewriterText.slice(0, i));
      i++;
      if (i > typewriterText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-noto-serif text-[var(--text-section)] font-bold mb-4">
          The Intelligence
        </h2>
        <p className="text-gray-500 tracking-widest uppercase text-xs font-bold">
          AIアナリストが生成する、驚異的なアウトプットの展示
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
        {/* Large Panel: Main Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 md:row-span-2 glass-card p-8 rounded-3xl relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-400 tracking-tighter uppercase">Deep Strategic Analysis</span>
          </div>
          <h3 className="font-noto-serif text-2xl font-bold mb-6 text-white/90">
            BYDの「垂直統合」が欧州供給網に与える構造的衝撃
          </h3>
          <div className="font-mono text-gray-400 leading-relaxed text-lg border-l-2 border-blue-500/30 pl-6">
            {displayedText}
            <span className="animate-pulse">|</span>
          </div>
          <div className="absolute bottom-8 right-8 opacity-20">
            <MessageSquareQuote className="w-24 h-24" />
          </div>
        </motion.div>

        {/* Medium Panel: Summary Points */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:row-span-1 glass-card p-6 rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-4 text-purple-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Key Takeaways</span>
          </div>
          <ul className="space-y-3">
            {[
              "自社製ブレードバッテリーによるコスト優位性",
              "欧州RoRo船の自社保有による物流支配",
              "半導体内製化による供給安定性の確保"
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Small Panels: Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 rounded-3xl flex flex-col justify-between"
        >
          <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Data Compression</div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">99.6%</div>
            <p className="text-xs text-gray-400">ノイズ除去率（対取得記事数）</p>
          </div>
          <BarChart3 className="w-6 h-6 text-blue-500/50" />
        </motion.div>
      </div>
    </section>
  );
}
