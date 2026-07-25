"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Brain,
  Languages,
  Lightbulb,
  ListChecks,
  Network,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import AudioButton from "@/components/AudioButton";

function TagList({ items = [], emptyText, onTagClick }) {
  if (!items.length) {
    return <p className="text-sm text-slate-400">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onTagClick?.(item)}
          className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-indigo-400/30 dark:hover:text-indigo-300"
    >
      <Icon className="h-4 w-4" />
      {loading ? "Generating..." : label}
    </button>
  );
}

export default function WordCard({
  data,
  isFavorite,
  isInNotebook,
  onToggleFavorite,
  onToggleNotebook,
  onAction,
  actionLoading,
  onSearchWord,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75"
    >
      <div className="relative overflow-hidden border-b border-slate-200/70 p-6 sm:p-8 dark:border-white/10">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                {data.word}
              </h2>
              <AudioButton word={data.word} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-bold text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-300">
                {data.partOfSpeech}
              </span>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {data.pronunciation}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-label="Toggle favorite"
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                isFavorite
                  ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"
                  : "border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">Favorite</span>
            </button>
            <button
              type="button"
              onClick={onToggleNotebook}
              aria-label="Toggle notebook"
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                isInNotebook
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              {isInNotebook ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Notebook</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.035]">
          <div className="mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-black">Simple meaning</h3>
          </div>
          <p className="text-lg font-semibold leading-8 text-slate-800 dark:text-slate-100">
            {data.meaning}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.035]">
          <div className="mb-3 flex items-center gap-2 text-violet-600 dark:text-violet-300">
            <Languages className="h-5 w-5" />
            <h3 className="font-black">Urdu meaning</h3>
          </div>
          <p dir="rtl" className="text-right text-xl font-semibold leading-9 text-slate-800 dark:text-slate-100">
            {data.urduMeaning || "ترجمہ دستیاب نہیں"}
          </p>
        </section>

        <section className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Detailed explanation
          </h3>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            {data.detailedMeaning}
          </p>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg shadow-indigo-500/20 lg:col-span-2">
          <div className="flex gap-3">
            <Quote className="mt-1 h-6 w-6 shrink-0 text-indigo-200" />
            <div>
              <h3 className="font-black">Example sentence</h3>
              <p className="mt-2 text-lg leading-8 text-indigo-50">{data.exampleSentence}</p>
            </div>
          </div>
        </section>

        {data.additionalExamples?.length ? (
          <section className="lg:col-span-2">
            <h3 className="mb-3 font-black text-slate-900 dark:text-white">More examples</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {data.additionalExamples.map((example, index) => (
                <div
                  key={`${example}-${index}`}
                  className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                >
                  <span className="mr-2 font-black text-indigo-500">{index + 1}.</span>
                  {example}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h3 className="mb-3 font-black text-slate-900 dark:text-white">Synonyms</h3>
          <TagList
            items={data.synonyms}
            emptyText="No close synonyms found."
            onTagClick={onSearchWord}
          />
        </section>

        <section>
          <h3 className="mb-3 font-black text-slate-900 dark:text-white">Antonyms</h3>
          <TagList
            items={data.antonyms}
            emptyText="No direct antonyms found."
            onTagClick={onSearchWord}
          />
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 dark:border-amber-400/20 dark:bg-amber-400/[0.07] lg:col-span-2">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
            <div>
              <h3 className="font-black text-amber-900 dark:text-amber-200">Learning tip</h3>
              <p className="mt-1 leading-7 text-amber-900/80 dark:text-amber-100/80">
                {data.learningTip}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200/70 bg-slate-50/70 p-6 sm:p-8 dark:border-white/10 dark:bg-white/[0.025]">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-500" />
          <h3 className="font-black text-slate-900 dark:text-white">Learn with Gemini</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ActionButton
            icon={Sparkles}
            label="Explain simply"
            loading={actionLoading === "simplify"}
            onClick={() => onAction("simplify")}
          />
          <ActionButton
            icon={Languages}
            label="Translate to Urdu"
            loading={actionLoading === "translate"}
            onClick={() => onAction("translate")}
          />
          <ActionButton
            icon={ListChecks}
            label="Create quiz"
            loading={actionLoading === "quiz"}
            onClick={() => onAction("quiz")}
          />
          <ActionButton
            icon={Network}
            label="Similar words"
            loading={actionLoading === "similar"}
            onClick={() => onAction("similar")}
          />
        </div>
      </div>
    </motion.article>
  );
}
