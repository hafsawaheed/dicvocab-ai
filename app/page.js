"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookHeart,
  BookOpen,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  Heart,
  Library,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";
import WordCard from "@/components/WordCard";
import Loader from "@/components/Loader";
import QuizCard from "@/components/QuizCard";
import TranslationCard from "@/components/TranslationCard";

const DAILY_WORDS = [
  { word: "serendipity", hint: "A happy discovery made by chance." },
  { word: "resilient", hint: "Able to recover quickly from difficulty." },
  { word: "eloquent", hint: "Clear, graceful, and persuasive in expression." },
  { word: "meticulous", hint: "Very careful about small details." },
  { word: "pragmatic", hint: "Focused on practical results." },
  { word: "empathy", hint: "Understanding another person’s feelings." },
  { word: "versatile", hint: "Able to adapt to many uses or roles." },
  { word: "candid", hint: "Honest and direct without hiding feelings." },
  { word: "tenacious", hint: "Persistent and unwilling to give up." },
  { word: "nuance", hint: "A small but meaningful difference." },
  { word: "contemplate", hint: "To think about something deeply." },
  { word: "ubiquitous", hint: "Present or found almost everywhere." },
];

const storageKeys = {
  history: "dicvocab ai-history",
  favorites: "dicvocab ai-favorites",
  notebook: "dicvocab ai-notebook",
};

function readStored(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function normalizeKey(word) {
  return String(word || "")
    .trim()
    .toLowerCase();
}

function MiniPanel({ icon: Icon, title, count, children, action }) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-xs text-slate-400">{count} saved</p>
          </div>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyCollection({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-400 dark:border-white/10">
      {text}
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notebook, setNotebook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [assist, setAssist] = useState({
    simplify: null,
    translate: null,
    quiz: null,
    similar: null,
  });

  useEffect(() => {
    setHistory(readStored(storageKeys.history));
    setFavorites(readStored(storageKeys.favorites));
    setNotebook(readStored(storageKeys.notebook));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated)
      localStorage.setItem(storageKeys.history, JSON.stringify(history));
  }, [history, hydrated]);

  useEffect(() => {
    if (hydrated)
      localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (hydrated)
      localStorage.setItem(storageKeys.notebook, JSON.stringify(notebook));
  }, [notebook, hydrated]);

  const dailyWord = useMemo(() => {
    const dayNumber = Math.floor(Date.now() / 86400000);
    return DAILY_WORDS[dayNumber % DAILY_WORDS.length];
  }, []);

  const isFavorite = result
    ? favorites.some(
        (item) => normalizeKey(item.word) === normalizeKey(result.word),
      )
    : false;
  const isInNotebook = result
    ? notebook.some(
        (item) => normalizeKey(item.word) === normalizeKey(result.word),
      )
    : false;

  async function requestDictionary(word, action = "lookup") {
    const response = await fetch("/api/dictionary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, action }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        payload.error || "The AI dictionary could not complete this request.",
      );
    }

    return payload.data;
  }

  async function handleSearch(value) {
    const cleanWord = String(value ?? query)
      .trim()
      .replace(/\s+/g, " ");

    if (!cleanWord) {
      setError("Please enter an English word before searching.");
      return;
    }

    setQuery(cleanWord);
    setError("");
    setLoading(true);
    setAssist({ simplify: null, translate: null, quiz: null, similar: null });

    try {
      const data = await requestDictionary(cleanWord, "lookup");
      setResult(data);
      setHistory((current) =>
        [
          cleanWord,
          ...current.filter(
            (item) => normalizeKey(item) !== normalizeKey(cleanWord),
          ),
        ].slice(0, 12),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action) {
    if (!result?.word || actionLoading) return;

    setActionLoading(action);
    setError("");

    try {
      const data = await requestDictionary(result.word, action);
      setAssist((current) => ({ ...current, [action]: data }));
      setTimeout(() => {
        document.getElementById(`ai-${action}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionLoading("");
    }
  }

  function toggleFavorite() {
    if (!result) return;
    setFavorites((current) => {
      const exists = current.some(
        (item) => normalizeKey(item.word) === normalizeKey(result.word),
      );
      return exists
        ? current.filter(
            (item) => normalizeKey(item.word) !== normalizeKey(result.word),
          )
        : [{ word: result.word, meaning: result.meaning }, ...current].slice(
            0,
            30,
          );
    });
  }

  function toggleNotebook() {
    if (!result) return;
    setNotebook((current) => {
      const exists = current.some(
        (item) => normalizeKey(item.word) === normalizeKey(result.word),
      );
      return exists
        ? current.filter(
            (item) => normalizeKey(item.word) !== normalizeKey(result.word),
          )
        : [
            {
              word: result.word,
              meaning: result.meaning,
              partOfSpeech: result.partOfSpeech,
              savedAt: new Date().toISOString(),
            },
            ...current,
          ].slice(0, 50);
    });
  }

  const clearHistory = () => setHistory([]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-[-8rem] top-32 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-80 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

      <header className="sticky top-0 z-40 border-b border-white/50 bg-slate-50/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b16]/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                DicVocab AI
              </p>
              <p className="hidden text-xs font-medium text-slate-400 sm:block">
                AI Dictionary & Tutor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-xs font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:flex">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Powered by Gemini
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <section className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300"
          >
            <BookHeart className="h-4 w-4" />
            Learn words, not definitions
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-6 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl dark:text-white"
          >
            Your intelligent vocabulary companion.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300"
          >
            Search a word to get clear meanings, natural examples, Urdu help,
            pronunciation, memory tips, quizzes, and closely related vocabulary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-9"
          >
            <SearchBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              history={history}
              isLoading={loading}
            />
          </motion.div>
        </section>

        <section className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleSearch(dailyWord.word)}
            className="group flex items-center gap-3 rounded-2xl border border-white/60 bg-white/60 p-4 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.035] sm:col-span-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Daily word
              </p>
              <p className="font-black text-slate-900 dark:text-white">
                {dailyWord.word}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {dailyWord.hint}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
          </button>

          <div className="flex items-center justify-center gap-5 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.035]">
            <div className="text-center">
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {favorites.length}
              </p>
              <p className="text-xs text-slate-400">Favorites</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {notebook.length}
              </p>
              <p className="text-xs text-slate-400">Notebook</p>
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key={error}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-7 flex max-w-3xl items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-800 shadow-sm dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {loading ? <Loader /> : null}

        <div className="mt-10 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-7">
            {!loading && result ? (
              <WordCard
                data={result}
                isFavorite={isFavorite}
                isInNotebook={isInNotebook}
                onToggleFavorite={toggleFavorite}
                onToggleNotebook={toggleNotebook}
                onAction={handleAction}
                actionLoading={actionLoading}
                onSearchWord={handleSearch}
              />
            ) : null}

            {actionLoading ? (
              <Loader
                label={`Creating ${actionLoading} learning material for “${result?.word}”...`}
              />
            ) : null}

            {assist.simplify ? (
              <motion.section
                id="ai-simplify"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-sky-200/70 bg-sky-50/80 p-6 shadow-lg backdrop-blur dark:border-sky-400/20 dark:bg-sky-400/[0.07] sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                      Simple English
                    </p>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {assist.simplify.word}
                    </h3>
                  </div>
                </div>
                <p className="mt-5 text-lg font-semibold leading-8 text-slate-800 dark:text-slate-100">
                  {assist.simplify.simpleMeaning}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-5 dark:bg-white/[0.05]">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Easy example
                    </p>
                    <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">
                      {assist.simplify.simpleExample}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-5 dark:bg-white/[0.05]">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Picture it
                    </p>
                    <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">
                      {assist.simplify.everydayComparison}
                    </p>
                  </div>
                </div>
              </motion.section>
            ) : null}

            <div id="ai-translate">
              <TranslationCard data={assist.translate} />
            </div>

            <div id="ai-quiz">
              <QuizCard data={assist.quiz} />
            </div>

            {assist.similar ? (
              <motion.section
                id="ai-similar"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-fuchsia-200/70 bg-fuchsia-50/75 p-6 shadow-lg backdrop-blur dark:border-fuchsia-400/20 dark:bg-fuchsia-400/[0.06] sm:p-7"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-300">
                    Vocabulary network
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    Words related to “{assist.similar.word}”
                  </h3>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {assist.similar.relatedWords.map((item) => (
                    <button
                      type="button"
                      onClick={() => handleSearch(item.word)}
                      key={item.word}
                      className="group rounded-2xl border border-white/80 bg-white/75 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-fuchsia-700 dark:text-white dark:group-hover:text-fuchsia-300">
                          {item.word}
                        </h4>
                        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-fuchsia-500" />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {item.meaning}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                        {item.difference}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.section>
            ) : null}

            {!loading && !result ? (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-[2rem] border border-dashed border-slate-300 bg-white/35 px-6 py-14 text-center dark:border-white/10 dark:bg-white/[0.02]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                  <Library className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                  Start your vocabulary journey
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                  Try words such as “resilient,” “infrastructure,” “ambiguous,”
                  or today’s featured word.
                </p>
              </motion.section>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <MiniPanel icon={Star} title="Favorites" count={favorites.length}>
              {favorites.length ? (
                <div className="space-y-2">
                  {favorites.slice(0, 6).map((item) => (
                    <button
                      type="button"
                      key={item.word}
                      onClick={() => handleSearch(item.word)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 text-left transition hover:border-slate-200 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
                    >
                      <Heart className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-800 dark:text-slate-100">
                          {item.word}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {item.meaning}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyCollection text="Star useful words to keep them close." />
              )}
            </MiniPanel>

            <MiniPanel icon={Bookmark} title="Notebook" count={notebook.length}>
              {notebook.length ? (
                <div className="space-y-2">
                  {notebook.slice(0, 6).map((item) => (
                    <button
                      type="button"
                      key={item.word}
                      onClick={() => handleSearch(item.word)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 text-left transition hover:border-slate-200 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
                    >
                      <Bookmark className="h-4 w-4 shrink-0 text-emerald-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-800 dark:text-slate-100">
                          {item.word}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {item.partOfSpeech} · {item.meaning}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyCollection text="Save complete entries to your vocabulary notebook." />
              )}
            </MiniPanel>

            <MiniPanel
              icon={Clock3}
              title="Search history"
              count={history.length}
              action={
                history.length ? (
                  <button
                    type="button"
                    onClick={clearHistory}
                    aria-label="Clear history"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null
              }
            >
              {history.length ? (
                <div className="flex flex-wrap gap-2">
                  {history.slice(0, 10).map((word) => (
                    <button
                      type="button"
                      key={word}
                      onClick={() => handleSearch(word)}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-indigo-400/10 dark:hover:text-indigo-300"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyCollection text="Your latest searches will appear here." />
              )}
            </MiniPanel>
          </aside>
        </div>
      </div>

      <footer className="border-t border-slate-200/70 bg-white/40 py-7 text-center text-xs text-slate-400 backdrop-blur dark:border-white/10 dark:bg-white/[0.02]">
        Built with Next.js, Tailwind CSS, Framer Motion, and Google Gemini.
      </footer>
    </main>
  );
}
