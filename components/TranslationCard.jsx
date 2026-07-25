"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export default function TranslationCard({ data }) {
  if (!data) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-violet-200/70 bg-violet-50/80 p-6 shadow-lg backdrop-blur dark:border-violet-400/20 dark:bg-violet-400/[0.07] sm:p-7"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
          <Languages className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">
            Urdu guide
          </p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">{data.word}</h3>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-5 dark:bg-white/[0.05]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Meaning</p>
          <p dir="rtl" className="mt-3 text-right text-2xl font-bold leading-10 text-slate-900 dark:text-white">
            {data.urduMeaning}
          </p>
          <p className="mt-3 text-sm font-semibold text-violet-700 dark:text-violet-300">
            Roman Urdu: {data.transliteration}
          </p>
        </div>
        <div className="rounded-2xl bg-white/70 p-5 dark:bg-white/[0.05]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Explanation</p>
          <p dir="rtl" className="mt-3 text-right text-base leading-8 text-slate-700 dark:text-slate-200">
            {data.urduExplanation}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-violet-200/70 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.035]">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Urdu example</p>
        <p dir="rtl" className="mt-2 text-right text-lg leading-9 text-slate-800 dark:text-slate-100">
          {data.urduExample}
        </p>
      </div>
    </motion.section>
  );
}
