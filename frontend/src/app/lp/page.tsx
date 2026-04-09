"use client";

import { motion } from "framer-motion";
import Hero from "@/components/lp/Hero";
import Pipeline from "@/components/lp/Pipeline";
import DashboardPreview from "@/components/lp/DashboardPreview";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LPPage() {
  return (
    <div className="bg-ui-marketing text-ui-primary selection:bg-brand-emerald/30">
      <Hero />

      {/* 2. The Pain Section */}
      <section className="py-20 px-4 flex flex-col items-center justify-center text-center bg-white/[0.01]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-32 flex justify-center">
            <Link href="/" className="group relative inline-block">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 px-14 py-6 bg-[#3ecf8e] text-black rounded-full font-bold text-xl items-center shadow-[0_0_40px_rgba(62,207,142,0.3)] group-hover:shadow-[0_0_60px_rgba(62,207,142,0.5)] transition-all overflow-hidden"
              >
                <span className="relative z-10">
                  ダッシュボードへアクセス
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>
            </Link>
          </div>

          <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight tracking-tighter text-hero-dense text-white">
            ニュースのチェックに、<br />もう時間を奪われない。
          </h2>
          <div className="w-16 h-[1px] bg-brand-emerald/30 mx-auto mb-10" />
          <p className="text-lg md:text-xl text-ui-secondary font-light leading-relaxed max-w-3xl mx-auto">
            毎日届く数百のEVニュース。その多くは、実は似たような情報ばかり。<br className="hidden md:block" />
            そんな無駄なチェックはAIに任せて、本来の仕事に集中。
          </p>
        </motion.div>
      </section>

      {/* 3. Comparison Section (Side-by-Side) */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="intelligence-card p-10 flex flex-col items-center text-center gap-8"
          >
            <div className="px-5 py-2 rounded-md bg-white/5 text-ui-muted border border-white/5">
              <span className="font-bold tracking-[0.2em] text-[10px] uppercase">Manual</span>
            </div>
            <p className="text-ui-secondary text-base font-light leading-relaxed">
              100記事のスクロール ＋ 重複確認 ＋ 要約抽出 ＝ <span className="text-white font-medium text-lg italic uppercase">約20分 / 日</span>
            </p>
          </motion.div>

          {/* AI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="intelligence-card p-10 border-brand-emerald/20 bg-brand-emerald/[0.02] flex flex-col items-center text-center gap-8 group shadow-[0_0_50px_rgba(62,207,142,0.05)]"
          >
            <div className="px-5 py-2 rounded-md bg-brand-emerald/10 text-brand-emerald border border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="font-bold tracking-[0.25em] text-[11px] uppercase">AI</span>
            </div>
            <p className="text-ui-primary text-base font-medium leading-relaxed">
              本当に必要なニュースを10件だけ確認 ＝ <span className="text-brand-emerald font-bold text-2xl drop-shadow-[0_0_10px_rgba(62,207,142,0.3)]">約5分 / 日</span>
            </p>
          </motion.div>
        </div>
      </section>

      <Pipeline />

      <DashboardPreview />

      {/* 5. Final CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-emerald/5 blur-[120px] rounded-full opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h3 className="text-3xl md:text-4xl font-medium mb-8 tracking-tight text-white leading-tight">
              未来の市場への、最短経路。
            </h3>
            <Link href="/" className="group relative inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-20 py-7 bg-[#3ecf8e] text-black rounded-full font-bold text-2xl flex items-center shadow-[0_0_50px_rgba(62,207,142,0.3)] hover:shadow-[0_0_70px_rgba(62,207,142,0.5)] transition-all relative overflow-hidden"
              >
                <span className="relative z-10">
                  ダッシュボードへアクセス
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
