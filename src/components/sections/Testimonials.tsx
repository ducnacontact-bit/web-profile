"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Heart, Briefcase, Award, Quote } from "lucide-react";
import { useLanguage, type Lang } from "@/components/LanguageProvider";
import { translateList } from "@/lib/translator";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
}

const uiText = {
  VI: {
    sectionTitle: "Đánh Giá Khách Hàng",
    emptyTestimonials: "Đang cập nhật đánh giá từ khách hàng...",
    fetchError: "Lỗi tải testimonials:",
    stats: [
      { id: 1, label: "Tách Trà", value: "1200" },
      { id: 2, label: "Khách Hàng Hài Lòng", value: "1080" },
      { id: 3, label: "Dự Án Hoàn Thành", value: "1170" },
      { id: 4, label: "Giải Thưởng Đạt Được", value: "750" },
    ],
  },
  EN: {
    sectionTitle: "Testimonials",
    emptyTestimonials: "Updating client testimonials...",
    fetchError: "Failed to load testimonials:",
    stats: [
      { id: 1, label: "Cup of Tea", value: "1200" },
      { id: 2, label: "Happy Client", value: "1080" },
      { id: 3, label: "Project Complete", value: "1170" },
      { id: 4, label: "Awards Win", value: "750" },
    ],
  },
};

export default function Testimonials() {
  const { lang } = useLanguage();
  const t = uiText[lang];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [translatedState, setTranslatedState] = useState<{
    lang: Lang | null;
    items: TestimonialItem[];
  }>({
    lang: null,
    items: [],
  });
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    fetch("/api/testimonials", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch((err) => console.error(t.fetchError, err));
  }, [t.fetchError]);

  useEffect(() => {
    let active = true;

    async function syncTestimonialsLanguage() {
      if (testimonials.length === 0) {
        if (active) setTranslatedState({ lang, items: [] });
        return;
      }

      const nextItems = await translateList(
        testimonials,
        lang,
        async (item, translate) => ({
          ...item,
          role: item.role ? await translate(item.role) : item.role,
          content: await translate(item.content),
        }),
        2,
      );

      if (active) {
        setTranslatedState({ lang, items: nextItems });
      }
    }

    syncTestimonialsLanguage();

    return () => {
      active = false;
    };
  }, [testimonials, lang]);

  const displayTestimonials =
    translatedState.lang === lang && translatedState.items.length > 0
      ? translatedState.items
      : testimonials;

  const visibleCards = isMobileView ? 1 : 2;
  const maxIndex = Math.max(0, displayTestimonials.length - visibleCards);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  const statIcons = [
    <Trophy
      key={1}
      className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900 dark:text-white"
    />,
    <Heart
      key={2}
      className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900 dark:text-white"
    />,
    <Briefcase
      key={3}
      className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900 dark:text-white"
    />,
    <Award
      key={4}
      className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900 dark:text-white"
    />,
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (_e: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -threshold && currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const slideOffset = isMobileView
    ? `calc(${currentIndex} * (-100% - 24px))`
    : `calc(${currentIndex} * (-50% - 12px))`;

  return (
    <section
      id="testimonials"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white text-neutral-900 dark:bg-[#111] dark:text-white px-4 sm:px-6 py-16 sm:py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-3 sm:-left-4 -top-2 sm:-top-3 h-12 sm:h-14 w-32 sm:w-40 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white bg-neutral-200 dark:bg-[#1a1a1a] px-6 sm:px-8 py-2 border border-neutral-300 dark:border-white/5 shadow-md transition-colors duration-300 rounded-xl">
              {t.sectionTitle}
            </h2>
          </div>
        </div>

        {displayTestimonials.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-neutral-500 text-xs sm:text-sm">
            {t.emptyTestimonials}
          </div>
        ) : (
          <>
            <div className="overflow-hidden cursor-grab active:cursor-grabbing mb-8 sm:mb-10 pt-8">
              <motion.div
                className="flex gap-6"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={{ x: slideOffset }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {displayTestimonials.map((item) => (
                  <div
                    key={item.id}
                    className="w-full lg:w-[calc(50%-12px)] flex-shrink-0 relative bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-5 sm:p-8 pt-14 sm:pt-16 hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                        <div className="w-full h-full overflow-hidden rounded-full border-4 border-neutral-200 dark:border-[#161616] bg-neutral-300 dark:bg-[#222] shadow-md transition-colors duration-300">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-neutral-900 text-white dark:bg-white dark:text-black p-1 rounded-full shadow transition-colors duration-300">
                          <Quote className="w-2.5 h-2.5 fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-3 sm:mb-4 mt-2">
                      <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                        {item.name}
                      </h3>
                      <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-gray-400 font-medium">
                        {item.role}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 text-center leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {maxIndex > 0 && (
              <div className="flex justify-center items-center gap-2 mb-12 sm:mb-16">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      currentIndex === idx
                        ? "bg-neutral-900 dark:bg-white w-5"
                        : "bg-neutral-400/50 dark:bg-white/30 w-2"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-neutral-300 dark:border-white/10 transition-colors duration-300">
          {t.stats.map((stat, idx) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="mb-2.5 sm:mb-3 p-2 sm:p-2.5 bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 group-hover:border-neutral-400 dark:group-hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl">
                {statIcons[idx]}
              </div>
              <h4 className="text-[11px] sm:text-sm font-bold text-neutral-500 dark:text-gray-400 tracking-wide mb-1">
                {stat.label}
              </h4>
              <span className="text-lg sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
