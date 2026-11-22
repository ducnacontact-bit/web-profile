"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Briefcase } from "lucide-react";
import { useLanguage, type Lang } from "@/components/LanguageProvider";

interface ResumeItem {
  id: number;
  type: string;
  time: string;
  title: string;
  desc: string;
  institution?: string | null;
  role?: string | null;
}

const uiText = {
  VI: {
    sectionTitle: "Hồ Sơ Năng Lực",
    educationTitle: "Học vấn:",
    experienceTitle: "Kinh nghiệm:",
    emptyEducation: "Đang cập nhật học vấn...",
    emptyExperience: "Đang cập nhật kinh nghiệm...",
    fetchError: "Lỗi tải dữ liệu Resume:",
  },
  EN: {
    sectionTitle: "Resume",
    educationTitle: "Education:",
    experienceTitle: "Experience:",
    emptyEducation: "Updating education...",
    emptyExperience: "Updating experience...",
    fetchError: "Failed to load Resume data:",
  },
};

const resumeTranslationCache = new Map<string, string>();

async function translateResumeText(
  text: string,
  targetLang: Lang,
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || "";

  const cacheKey = `${targetLang}:${trimmed}`;
  if (resumeTranslationCache.has(cacheKey)) {
    return resumeTranslationCache.get(cacheKey)!;
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
        resumeTranslationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }
    }
  } catch {
    // Giữ nguyên text gốc nếu không có endpoint dịch
  }

  return text;
}

export default function Resume() {
  const { lang } = useLanguage();
  const t = uiText[lang];

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [translatedResumes, setTranslatedResumes] = useState<ResumeItem[]>([]);

  useEffect(() => {
    fetch("/api/resume", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResumes(data);
        }
      })
      .catch((err) => console.error(t.fetchError, err));
  }, [t.fetchError]);

  useEffect(() => {
    let active = true;

    async function syncResumesLanguage() {
      if (resumes.length === 0) {
        if (active) setTranslatedResumes([]);
        return;
      }

      const nextResumes = await Promise.all(
        resumes.map(async (item) => ({
          ...item,
          time: item.time
            ? await translateResumeText(item.time, lang)
            : item.time,
          title: await translateResumeText(item.title, lang),
          desc: await translateResumeText(item.desc, lang),
          institution: item.institution
            ? await translateResumeText(item.institution, lang)
            : item.institution,
          role: item.role
            ? await translateResumeText(item.role, lang)
            : item.role,
        })),
      );

      if (active) {
        setTranslatedResumes(nextResumes);
      }
    }

    syncResumesLanguage();

    return () => {
      active = false;
    };
  }, [resumes, lang]);

  const educationList = translatedResumes.filter(
    (item) => item.type === "education",
  );
  const experienceList = translatedResumes.filter(
    (item) => item.type === "experience",
  );

  return (
    <section
      id="resume"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-[#1116] dark:text-white px-4 sm:px-6 py-16 sm:py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex justify-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white bg-neutral-200 dark:bg-[#1a1a1a] px-6 sm:px-8 py-2 border border-neutral-300 dark:border-white/5 shadow-md transition-colors duration-300 rounded-xl text-center">
            {t.sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-900 dark:text-white shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold tracking-wide text-neutral-900 dark:text-white">
                {t.educationTitle}
              </h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {educationList.length === 0 ? (
                <p className="text-xs text-neutral-500">{t.emptyEducation}</p>
              ) : (
                educationList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-4 sm:p-6 lg:p-8 relative group hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl"
                  >
                    <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-gray-400 block mb-2 sm:mb-3 font-medium">
                      {item.time}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 leading-relaxed mb-4 sm:mb-6 whitespace-pre-line">
                      {item.desc}
                    </p>
                    {item.institution && (
                      <span className="text-xs font-semibold text-neutral-700 dark:text-gray-300 block mb-3 sm:mb-4">
                        {item.institution}
                      </span>
                    )}
                    <div className="w-full h-[1px] bg-neutral-300 dark:bg-white/10" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-900 dark:text-white shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold tracking-wide text-neutral-900 dark:text-white">
                {t.experienceTitle}
              </h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {experienceList.length === 0 ? (
                <p className="text-xs text-neutral-500">{t.emptyExperience}</p>
              ) : (
                experienceList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-4 sm:p-6 lg:p-8 relative group hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl"
                  >
                    <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-gray-400 block mb-2 sm:mb-3 font-medium">
                      {item.time}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 leading-relaxed mb-4 sm:mb-6 whitespace-pre-line">
                      {item.desc}
                    </p>
                    {item.role && (
                      <span className="text-xs font-semibold text-neutral-700 dark:text-gray-300 block mb-3 sm:mb-4">
                        {item.role}
                      </span>
                    )}
                    <div className="w-full h-[1px] bg-neutral-300 dark:bg-white/10" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
