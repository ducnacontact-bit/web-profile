// src/lib/translator.ts
import type { Lang } from "@/components/LanguageProvider";

const translationCache = new Map<string, string>();
const inflightMap = new Map<string, Promise<string>>();

export function hasVietnameseDiacritics(text: string): boolean {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
    text,
  );
}

export async function translateText(
  text: string,
  targetLang: Lang,
  retries = 2,
): Promise<string> {
  const original = text ?? "";
  const trimmed = original.trim();
  if (!trimmed) return original;

  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    if (!(targetLang === "EN" && hasVietnameseDiacritics(cached))) {
      return cached;
    }
    translationCache.delete(cacheKey);
  }

  if (inflightMap.has(cacheKey)) {
    return inflightMap.get(cacheKey)!;
  }

  const task = (async () => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, targetLang }),
        });

        if (res.ok) {
          const data = await res.json();
          const translated =
            data?.translatedText ??
            data?.translated ??
            data?.text ??
            data?.result ??
            data?.data?.translatedText;

          if (typeof translated === "string" && translated.trim()) {
            const clean = translated.trim();
            const isValidForTarget =
              targetLang === "EN" ? !hasVietnameseDiacritics(clean) : true;

            if (isValidForTarget) {
              translationCache.set(cacheKey, clean);
              return clean;
            }
          }
        }
      } catch {
        // Thử lại nếu còn lượt
      }

      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
      }
    }

    return original;
  })();

  inflightMap.set(cacheKey, task);
  try {
    return await task;
  } finally {
    inflightMap.delete(cacheKey);
  }
}

export async function translateList<T>(
  items: T[],
  targetLang: Lang,
  mapItem: (item: T, translate: (val: string) => Promise<string>) => Promise<T>,
  batchSize = 2,
): Promise<T[]> {
  const result: T[] = [];
  const run = (val: string) => translateText(val, targetLang);

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const translatedBatch = await Promise.all(
      batch.map((item) => mapItem(item, run)),
    );
    result.push(...translatedBatch);
  }

  return result;
}
