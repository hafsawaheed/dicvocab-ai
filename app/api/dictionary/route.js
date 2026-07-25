import { NextResponse } from "next/server";
import { generateDictionaryResponse } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_ACTIONS = new Set([
  "lookup",
  "simplify",
  "translate",
  "quiz",
  "similar",
]);

function normalizeWord(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function isValidWord(word) {
  return (
    word.length >= 1 &&
    word.length <= 60 &&
    /^[A-Za-z][A-Za-z\s'-]*$/.test(word)
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const word = normalizeWord(body.word);
    const action = body.action || "lookup";

    if (!word) {
      return NextResponse.json(
        { error: "Please enter an English word." },
        { status: 400 }
      );
    }

    if (!isValidWord(word)) {
      return NextResponse.json(
        {
          error:
            "Use English letters, spaces, apostrophes, or hyphens only (maximum 60 characters).",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { error: "That dictionary action is not supported." },
        { status: 400 }
      );
    }

    const data = await generateDictionaryResponse({ word, action });

    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Dictionary API error:", error);

    const message =
      error instanceof SyntaxError
        ? "The request body must be valid JSON."
        : error instanceof Error
          ? error.message
          : "Unable to generate this dictionary entry.";

    const status = message.includes("not configured") ? 503 : 500;

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    );
  }
}
