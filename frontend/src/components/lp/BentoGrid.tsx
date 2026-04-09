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
          className="md:col-span-2 md:row-span-2 intelligence-card p-10 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse shadow-[0_0_8px_rgba(62,207,142,0.6)]" />
            <span className="text-[10px] font-bold text-brand-emerald tracking-[0.2em] uppercase">Deep Strategic Analysis</span>
          </div>
          <h3 className="text-3xl font-medium mb-8 text-white leading-tight text-hero-dense">
            BYDの「垂直統合」が欧州供給網に与える構造的衝撃
          </h3>
          <div className="font-mono text-ui-secondary leading-relaxed text-lg border-l-2 border-brand-emerald/30 pl-8">
            {displayedText}
            <span className="animate-pulse text-brand-emerald">|</span>
          </div>
          <div className="absolute bottom-10 right-10 opacity-10 text-brand-emerald">
            <MessageSquareQuote size={120} strokeWidth={1} />
          </div>
        </motion.div>

        {/* Medium Panel: Summary Points */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:row-span-1 intelligence-card p-8 bg-brand-emerald/[0.02]"
        >
          <div className="flex items-center gap-2 mb-6 text-brand-emerald">
            <TrendingUp size={16} strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Key Takeaways</span>
          </div>
          <ul className="space-y-4">
            {[
              "自社製ブレードバッテリーによるコスト優位性",
              "欧州RoRo船の自社保有による物流支配",
              "半導体内製化による供給安定性の確保"
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ui-secondary font-light">
                <CheckCircle2 size={16} strokeWidth={2} className="mt-0.5 text-brand-emerald flex-shrink-0" />
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
          className="intelligence-card p-8 flex flex-col justify-between"
        >
          <div className="text-ui-muted text-[10px] font-bold uppercase tracking-[0.2em]">Data Compression</div>
          <div>
            <div className="text-5xl font-medium text-white mb-2 tracking-tighter">99.6%</div>
            <p className="text-xs text-ui-muted font-light">ノイズ除去率（対取得記事数）</p>
          </div>
          <BarChart3 size={24} strokeWidth={1.5} className="text-brand-emerald/50" />
        </motion.div>
      </div>
    </section>
  );
}
