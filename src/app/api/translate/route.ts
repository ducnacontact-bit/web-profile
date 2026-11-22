import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchGoogleTranslate(
  text: string,
  sl: "en" | "vi",
  tl: "vi" | "en",
): Promise<{ translatedText: string; ok: boolean }> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(
    text,
  )}`;

  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    return { translatedText: text, ok: false };
  }

  const data = await res.json();
  const translatedText = Array.isArray(data?.[0])
    ? data[0].map((item: any) => item?.[0] || "").join("")
    : text;

  return {
    translatedText: translatedText || text,
    ok: Boolean(translatedText),
  };
}

export async function POST(request: Request) {
  try {
    const { text, targetLang } = await request.json();
    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing text or targetLang" },
        { status: 400 },
      );
    }

    const sl = targetLang === "VI" ? "en" : "vi";
    const tl = targetLang === "VI" ? "vi" : "en";

    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fetchGoogleTranslate(String(text), sl, tl);
        if (result.ok) {
          return NextResponse.json({
            translatedText: result.translatedText,
            fallback: false,
          });
        }
      } catch {
        // Thử lại ở lần kế tiếp nếu còn lượt
      }

      if (attempt < maxRetries) {
        await sleep(250 * (attempt + 1));
      }
    }

    return NextResponse.json({
      translatedText: String(text),
      fallback: true,
    });
  } catch {
    return NextResponse.json(
      { translatedText: "", fallback: true },
      { status: 500 },
    );
  }
}
