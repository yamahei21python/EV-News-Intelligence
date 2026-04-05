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
          <div className="mb-40">
            <Link 
              href="/"
              className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-[#020617] hover:bg-zinc-200 transition-all font-bold group shadow-2xl shadow-white/5"
            >
              ダッシュボードへアクセス
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

      {/* 5. Final CTA Section */}
      <section className="py-48 px-4 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Start your intelligence journey</span>
            </div>
            
            <h2 className="font-noto-serif text-[var(--text-section)] font-bold mb-12">
              インテリジェンスを、あなたの日常に。
            </h2>
            
            <Link href="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 border border-white/20 rounded-full font-bold text-xl overflow-hidden hover:border-blue-500/50 transition-colors bg-white/5"
              >
                <span className="relative z-10 flex items-center gap-3">
                  ダッシュボードへアクセス
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-all" />
              </motion.div>
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
