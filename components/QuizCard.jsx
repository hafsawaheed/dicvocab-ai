"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

export default function QuizCard({ data }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [data]);

  // Fixed ESLint warning:
  // Keeps questions reference stable between renders
  const questions = useMemo(() => data?.questions || [], [data]);

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          total + (answers[index] === question.answer ? 1 : 0),
        0,
      ),
    [answers, questions],
  );

  if (!data) return null;

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-emerald-200/70 bg-emerald-50/75 p-6 shadow-lg backdrop-blur dark:border-emerald-400/20 dark:bg-emerald-400/[0.06] sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <CircleHelp className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Vocabulary quiz
            </p>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Test “{data.word}”
            </h3>
          </div>
        </div>

        {submitted ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-black text-white">
            <Trophy className="h-4 w-4" />
            {score}/{questions.length}
          </div>
        ) : null}
      </div>

      <div className="mt-7 space-y-5">
        {questions.map((question, index) => {
          const selected = answers[index];
          const isCorrect = selected === question.answer;

          return (
            <div
              key={`${question.question}-${index}`}
              className="rounded-2xl border border-white/80 bg-white/75 p-5 dark:border-white/10 dark:bg-slate-950/25"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                  {index + 1}
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {question.type}
                  </p>

                  <p className="mt-1 font-bold leading-7 text-slate-900 dark:text-white">
                    {question.question}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const chosen = selected === option;
                  const correctOption = submitted && option === question.answer;

                  const wrongOption =
                    submitted && chosen && option !== question.answer;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [index]: option,
                        }))
                      }
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        correctOption
                          ? "border-emerald-400 bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"
                          : wrongOption
                            ? "border-rose-400 bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200"
                            : chosen
                              ? "border-indigo-400 bg-indigo-50 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200"
                              : "border-slate-200 bg-white/70 text-slate-700 hover:border-indigo-300 dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-200"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {submitted ? (
                <div
                  className={`mt-4 flex gap-2 rounded-xl p-3 text-sm ${
                    isCorrect
                      ? "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
                      : "bg-rose-100/80 text-rose-800 dark:bg-rose-400/10 dark:text-rose-200"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}

                  <p>
                    <span className="font-black">
                      {isCorrect ? "Correct. " : `Answer: ${question.answer}. `}
                    </span>

                    {question.explanation}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {!submitted ? (
          <button
            type="button"
            disabled={Object.keys(answers).length !== questions.length}
            onClick={() => setSubmitted(true)}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check answers
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    </motion.section>
  );
}
