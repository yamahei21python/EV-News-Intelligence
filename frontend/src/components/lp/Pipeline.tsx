"use client";

import { motion } from "framer-motion";
import { Search, Users, Brain, LayoutDashboard, ArrowRight, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "01 Extraction",
    subtitle: "データ抽出",
    points: ["広告・不要情報の排除", "純粋な事実のみを抽出"],
    color: "text-brand-emerald",
  },
  {
    icon: Users,
    title: "02 Aggregation",
    subtitle: "情報統合",
    points: ["メディア重複の単一化", "ノイズの極限低減"],
    color: "text-brand-emerald",
  },
  {
    icon: Brain,
    title: "03 Analysis",
    subtitle: "本質解析",
    points: ["AIによる核心の判別", "多角的インサイトの生成"],
    color: "text-brand-emerald",
  },
  {
    icon: LayoutDashboard,
    title: "04 Delivery",
    subtitle: "即時配信",
    points: ["構造化データの即時提供", "意思決定プロセスの最短化"],
    color: "text-brand-emerald",
  },
];

export default function Pipeline() {
  return (
    <section className="py-20 px-4 bg-ui-marketing border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium mb-8 text-white text-hero-dense">
            Pipeline
          </h2>
          <p className="text-lg md:text-xl text-ui-secondary font-light max-w-3xl mx-auto leading-relaxed">
            膨大なデータから本質を抽出。意思決定を研ぎ澄ますインテリジェンス・コア。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-emerald/20 to-transparent -translate-y-1/2" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative intelligence-card p-8 flex flex-col items-center text-center group"
            >
              <div className={`mb-6 p-4 rounded-md bg-white/5 w-fit ${step.color} group-hover:scale-110 transition-transform shadow-lg shadow-black/20 flex items-center justify-center`}>
                <step.icon size={28} strokeWidth={1.5} />
              </div>

              <h3 className="font-medium text-lg mb-1 text-white">
                {step.title}
              </h3>

              <p className="text-[10px] font-bold text-brand-emerald/60 mb-6 uppercase tracking-[0.2em] text-center">
                {step.subtitle}
              </p>

              <div className="flex justify-center w-full">
                <ul className="space-y-3 text-left w-fit">
                  {step.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[11px] text-ui-secondary leading-tight">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.9),0_0_24px_rgba(16,185,129,0.4)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {i < STEPS.length - 1 && (
                <div className="md:hidden flex justify-center py-6">
                  <ArrowRight size={20} strokeWidth={1.5} className="text-brand-emerald/40 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
