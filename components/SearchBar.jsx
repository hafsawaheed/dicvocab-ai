"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, Search, X } from "lucide-react";

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  history = [],
  isLoading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    setIsOpen(false);
    onSearch(query);
  };

  const chooseHistory = (word) => {
    setQuery(word);
    setIsOpen(false);
    onSearch(word);
  };

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-3xl">
      <form
        onSubmit={submit}
        className="group flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 p-2 shadow-glow backdrop-blur-xl transition focus-within:border-indigo-400 dark:border-white/10 dark:bg-slate-900/75"
      >
        <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          maxLength={60}
          autoComplete="off"
          aria-label="Search an English word"
          placeholder="Search any English word..."
          className="h-12 min-w-0 flex-1 bg-transparent px-1 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white sm:text-lg"
        />
        {query && !isLoading ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-7 sm:text-base"
        >
          {isLoading ? "Thinking..." : "Search"}
        </button>
      </form>

      {isOpen && history.length > 0 ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Recent searches
          </p>
          <div className="max-h-56 overflow-y-auto">
            {history.slice(0, 8).map((word) => (
              <button
                type="button"
                key={word}
                onClick={() => chooseHistory(word)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
              >
                <Clock3 className="h-4 w-4 text-slate-400" />
                {word}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
