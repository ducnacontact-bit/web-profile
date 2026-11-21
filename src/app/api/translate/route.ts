import { NextResponse } from "next/server";

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

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(
      text,
    )}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ translatedText: text });
    }

    const data = await res.json();
    const translatedText = Array.isArray(data?.[0])
      ? data[0].map((item: any) => item?.[0] || "").join("")
      : text;

    return NextResponse.json({ translatedText: translatedText || text });
  } catch {
    return NextResponse.json({ translatedText: "" }, { status: 500 });
  }
}
