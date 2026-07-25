"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loader({ label = "Gemini is building your word guide..." }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/60 bg-white/70 p-7 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-900 dark:text-white">AI dictionary in progress</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {["w-11/12", "w-full", "w-8/12"].map((width) => (
          <div
            key={width}
            className={`relative h-3 ${width} overflow-hidden rounded-full bg-slate-200 dark:bg-white/10`}
          >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/10" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
