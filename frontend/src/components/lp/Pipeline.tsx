"use client";

import { motion } from "framer-motion";
import { Search, Users, Brain, LayoutDashboard, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Raw Extraction",
    desc: "Playwrightによる全文抽出。広告や不要なナビゲーションを100%排除。",
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "Semantic Grouping",
    desc: "AIが文脈を理解。重複する同一トピックの記事を瞬時に統合。",
    color: "text-indigo-500",
  },
  {
    icon: Brain,
    title: "Deep Analysis",
    desc: "Gemini 1.5 Proによる深層分析。地政学・サプライチェーンの視点を付与。",
    highlight: true,
    color: "text-purple-500",
  },
  {
    icon: LayoutDashboard,
    title: "Real-time Delivery",
    desc: "Next.jsダッシュボードへ即時配信。アーカイブ化と連動。",
    color: "text-cyan-500",
  },
];

export default function Pipeline() {
  return (
    <section className="py-32 px-4 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="font-noto-serif text-3xl md:text-4xl font-bold mb-8 text-white">
            The AI Engine
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
            4つのフェーズを経て、生の情報は「戦略的インテリジェンス」へと昇華されます。
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
              <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${step.color} group-hover:scale-110 transition-transform`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                {step.title}
                {step.highlight && (
                  <span className="text-[10px] bg-purple-500 px-1.5 py-0.5 rounded text-white font-black uppercase">Core</span>
                )}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
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
