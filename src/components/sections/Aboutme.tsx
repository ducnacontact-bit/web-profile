"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage, type Lang } from "@/components/LanguageProvider";

interface AboutData {
  image?: string;
  paragraph1?: string;
  paragraph2?: string;
  hireMeUrl?: string;
  cvUrl?: string;
}

interface SkillData {
  id: number;
  name: string;
  percentage: number;
  category: string;
}

const uiText = {
  VI: {
    loading: "Đang tải nội dung...",
    aboutTitle: "Về Tôi",
    hireMe: "LIÊN HỆ NGAY",
    downloadCv: "TẢI CV",
    skillsTitle: "Kỹ Năng Của Tôi",
    loadAboutError: "Lỗi tải About:",
    loadSkillsError: "Lỗi tải Skills:",
  },
  EN: {
    loading: "Loading content...",
    aboutTitle: "About Me",
    hireMe: "HIRE ME",
    downloadCv: "DOWNLOAD CV",
    skillsTitle: "My Skills",
    loadAboutError: "Failed to load About:",
    loadSkillsError: "Failed to load Skills:",
  },
};

const translationCache = new Map<string, string>();

async function translateDynamicText(
  text: string,
  targetLang: Lang,
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || "";

  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, targetLang }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.translatedText) {
        translationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }
    }
  } catch {
    // Fallback về bản gốc nếu chưa có /api/translate
  }

  return text;
}

export default function About() {
  const { lang } = useLanguage();
  const t = uiText[lang];

  const [aboutData, setAboutData] = useState<AboutData>({
    image: "",
    paragraph1: "",
    paragraph2: "",
    hireMeUrl: "#contact",
    cvUrl: "/cv.pdf",
  });

  const [translatedAbout, setTranslatedAbout] = useState<AboutData>({
    image: "",
    paragraph1: "",
    paragraph2: "",
    hireMeUrl: "#contact",
    cvUrl: "/cv.pdf",
  });

  const [skills, setSkills] = useState<SkillData[]>([]);
  const [translatedSkills, setTranslatedSkills] = useState<SkillData[]>([]);
  const [isLoadingAbout, setIsLoadingAbout] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/about", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data && !data.error) {
          setAboutData({
            ...data,
            image: data.image?.trim() ? data.image.trim() : "/shinn.jpg",
          });
        } else {
          setAboutData((prev) => ({
            ...prev,
            image: prev.image || "/shinn.jpg",
          }));
        }
      })
      .catch((err) => {
        console.error(t.loadAboutError, err);
        if (active) {
          setAboutData((prev) => ({
            ...prev,
            image: prev.image || "/shinn.jpg",
          }));
        }
      })
      .finally(() => {
        if (active) setIsLoadingAbout(false);
      });

    fetch("/api/skills", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data)) {
          setSkills(data);
        }
      })
      .catch((err) => console.error(t.loadSkillsError, err));

    return () => {
      active = false;
    };
  }, [t.loadAboutError, t.loadSkillsError]);

  useEffect(() => {
    let active = true;

    async function applyLanguage() {
      const [p1, p2] = await Promise.all([
        aboutData.paragraph1
          ? translateDynamicText(aboutData.paragraph1, lang)
          : Promise.resolve(""),
        aboutData.paragraph2
          ? translateDynamicText(aboutData.paragraph2, lang)
          : Promise.resolve(""),
      ]);

      if (active) {
        setTranslatedAbout({
          ...aboutData,
          paragraph1: p1,
          paragraph2: p2,
        });
      }

      if (skills.length > 0) {
        const nextSkills = await Promise.all(
          skills.map(async (skill) => ({
            ...skill,
            name: await translateDynamicText(skill.name, lang),
            category: skill.category
              ? await translateDynamicText(skill.category, lang)
              : skill.category,
          })),
        );
        if (active) {
          setTranslatedSkills(nextSkills);
        }
      } else if (active) {
        setTranslatedSkills([]);
      }
    }

    applyLanguage();

    return () => {
      active = false;
    };
  }, [aboutData, skills, lang]);

  const avatarSrc = translatedAbout.image || aboutData.image;

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white text-neutral-900 dark:bg-[#111] dark:text-white px-4 sm:px-6 py-16 sm:py-20 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Cột trái: Khung ảnh cá nhân */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center lg:justify-start lg:col-span-5"
        >
          <div
            className="absolute -bottom-6 -left-6 h-56 w-56 hidden sm:block z-0 text-neutral-900 dark:text-white opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "10px 10px",
            }}
          />

          <div className="relative z-10 w-full max-w-[270px] sm:max-w-sm bg-neutral-100 dark:bg-[#1a1a1a] p-2.5 sm:p-3 border border-black/5 dark:border-white/5 shadow-2xl transition-colors duration-300">
            <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
              {isLoadingAbout || !avatarSrc ? (
                <div className="h-full w-full animate-pulse bg-neutral-300/80 dark:bg-neutral-800/80" />
              ) : (
                <img
                  src={avatarSrc}
                  alt="Đức Nguyễn"
                  className="h-full w-full object-cover grayscale contrast-125 transition-all duration-500 hover:grayscale-0"
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Cột phải: Nội dung giới thiệu */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col text-left lg:col-span-7"
        >
          <div className="relative inline-block">
            <div
              className="absolute -left-2 sm:-left-3 -top-2 sm:-top-2.5 h-10 sm:h-12 w-24 sm:w-28 z-0 text-neutral-900 dark:text-white opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t.aboutTitle}
            </h2>
          </div>

          <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4 text-xs sm:text-base leading-relaxed text-neutral-600 dark:text-gray-400 whitespace-pre-line">
            {isLoadingAbout ? (
              <p>{t.loading}</p>
            ) : (
              <>
                <p>{translatedAbout.paragraph1}</p>
                <p>{translatedAbout.paragraph2}</p>
              </>
            )}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <a
              href={translatedAbout.hireMeUrl || "#contact"}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-black px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              {t.hireMe}
            </a>

            <a
              href={translatedAbout.cvUrl || "/cv.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-neutral-400 dark:border-white/40 px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white transition-all duration-300 hover:border-neutral-900 dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t.downloadCv}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Phần My Skills động từ DB */}
      <div className="mx-auto mt-14 sm:mt-20 lg:mt-24 w-full max-w-6xl">
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-2 sm:-left-3 -top-2 sm:-top-2.5 h-10 sm:h-12 w-28 sm:w-32 z-0 text-neutral-900 dark:text-white opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h3 className="relative z-10 text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t.skillsTitle}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 lg:gap-x-16 gap-y-6 sm:gap-y-8 md:grid-cols-2">
          {translatedSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col space-y-2"
            >
              <div className="flex justify-between gap-2 text-xs font-semibold tracking-wider text-neutral-700 dark:text-gray-300">
                <span className="truncate">{skill.name}</span>
                <span className="shrink-0">{skill.percentage}%</span>
              </div>
              <div className="relative h-[2px] w-full bg-neutral-200 dark:bg-neutral-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-neutral-900 dark:bg-white"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
