"use client";

import { motion } from "framer-motion";
import { Search, Users, Brain, LayoutDashboard, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Raw Extraction",
    subtitle: "情報源の浄化",
    desc: "独自クローラーが不要なUIや広告を100%排除。恣意的なアルゴリズムによる情報の歪みを防ぎ、本質的なデータのみを取得します。",
    color: "text-blue-500",
    lineColor: "bg-blue-500",
  },
  {
    icon: Users,
    title: "Semantic Grouping",
    subtitle: "時間の最適化",
    desc: "AIが複数報道を横断分析し、重複トピックを統合。不必要な重複確認による「時間の損失」をシステムレベルで防ぎます。",
    color: "text-indigo-500",
    lineColor: "bg-indigo-500",
  },
  {
    icon: Brain,
    title: "Deep Analysis",
    subtitle: "アナリストの視座",
    desc: "EV市場の覇権争いや技術優位性、マクロ経済への影響など、プロのアナリストと同等の深い考察を自動生成します。",
    highlight: true,
    color: "text-purple-500",
    lineColor: "bg-purple-500",
  },
  {
    icon: LayoutDashboard,
    title: "Real-time Delivery",
    subtitle: "意思決定の加速",
    desc: "洗練されたボードへ即時配信。複雑な情報を視覚的に整理し、経営層や投資家の迅速で的確な意思決定をサポートします。",
    color: "text-cyan-500",
    lineColor: "bg-cyan-500",
  },
];

export default function Pipeline() {
  return (
    <section className="py-32 px-4 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="font-noto-serif text-3xl md:text-4xl font-bold mb-8 text-white">
            The Intelligence Pipeline
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
            膨大なノイズを解体し、純度100%のシグナルを精製する。<br className="hidden md:block" />人間の認知限界を超える4つのプロセス。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`relative glass-card p-8 rounded-3xl group ${
                step.highlight ? "ring-2 ring-purple-500/50 scale-105 bg-purple-500/5" : ""
              }`}
            >
              <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${step.color} group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>
                <step.icon className="w-8 h-8" />
              </div>
              
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-white">
                {step.title}
                {step.highlight && (
                  <span className="text-[10px] bg-purple-500 px-1.5 py-0.5 rounded text-white font-black uppercase">Core</span>
                )}
              </h3>

              {/* Accent Line */}
              <div className={`w-12 h-[2px] ${step.lineColor} opacity-40 mb-6 group-hover:w-20 transition-all duration-500`} />

              <p className="text-[11px] font-black text-zinc-500 mb-3 uppercase tracking-[0.2em]">
                {step.subtitle}
              </p>

              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {step.desc}
              </p>
              
              {i < STEPS.length - 1 && (
                <div className="md:hidden flex justify-center py-4">
                  <ArrowRight className="w-6 h-6 text-gray-700 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
