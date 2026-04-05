"use client";

import { motion } from "framer-motion";
import Hero from "@/components/lp/Hero";
import Pipeline from "@/components/lp/Pipeline";
import DashboardPreview from "@/components/lp/DashboardPreview";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LPPage() {
  return (
    <main className="bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX: "0%" }}
      />

      <Hero />

      {/* 2. The Pain Section */}
      <section className="pt-16 pb-16 px-4 flex flex-col items-center justify-center text-center bg-white/[0.01]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* CTA at the beginning of the section */}
          <div className="mb-40 flex justify-center">
            <Link href="/" className="group relative inline-block">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 px-14 py-7 bg-white text-[#020617] rounded-full font-bold text-xl flex items-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                  ダッシュボードへアクセス
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-100/50 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>

              {/* Outer Glow Effect */}
              <div className="absolute inset-x-0 inset-y-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </Link>
          </div>

          <h2 className="font-noto-serif text-3xl md:text-4xl font-bold mb-8 leading-tight text-white">
            情報過多は、最大の「時間の損失」である。
          </h2>
          <div className="w-16 h-[1px] bg-blue-500/50 mx-auto mb-10" />
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
            毎日配信される数千のEVニュース。その95%は、重複・広告・表面的な事実の羅列に過ぎません。<br className="hidden md:block" />
            人間がそれを処理する時代は終わりました。
          </p>
        </motion.div>
      </section>

      {/* 3. Comparison Section (Glassmorphism) */}
      <section className="pb-32 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Manual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 text-zinc-500">
                <span className="font-bold tracking-widest text-xs uppercase">[ Manual ]</span>
              </div>
            </div>
            <p className="text-zinc-400 text-base md:text-lg font-light">
              50記事のスクロール ＋ 重複の確認 ＋ 要点の抽出 ＝ <span className="text-zinc-200 font-medium whitespace-nowrap text-lg md:text-xl">約20分 / 日</span>
            </p>
          </motion.div>

          {/* AI Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-blue-500/[0.03] border border-blue-500/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-blue-500/[0.06] transition-all shadow-[0_0_50px_rgba(59,130,246,0.05)]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <span className="font-bold tracking-widest text-xs uppercase">[ AI Engine ]</span>
              </div>
            </div>
            <p className="text-blue-100/90 text-base md:text-lg font-medium">
              純度100%のインサイトを10件確認 ＝ <span className="text-white font-bold text-xl md:text-2xl whitespace-nowrap drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">約5分 / 日</span>
            </p>
          </motion.div>
        </div>
      </section>

      <Pipeline />

      <DashboardPreview />

      {/* 5. Final CTA Section - Polished */}
      <section className="py-5 px-4 relative overflow-hidden">
        {/* Spotlight Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full opacity-60" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <Link href="/" className="group relative inline-block">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 px-14 py-7 bg-white text-[#020617] rounded-full font-bold text-xl flex items-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                  ダッシュボードへアクセス
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-100/50 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>

              {/* Outer Glow Effect */}
              <div className="absolute inset-x-0 inset-y-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-4 border-t border-white/5 text-center text-zinc-600 text-[10px] tracking-widest uppercase font-bold">
        © 2026 EV News Intelligence Pipeline. Driven by Gemini 1.5 Pro.
      </footer>
    </main>
  );
}
