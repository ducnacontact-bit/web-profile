"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  PenTool,
  Paintbrush,
  Camera,
  Code,
  Smartphone,
  Globe,
  Layers,
  X,
} from "lucide-react";
import { useLanguage, type Lang } from "@/components/LanguageProvider";
import { translateText, translateList } from "@/lib/translator";

interface ServiceItem {
  id: number;
  title: string;
  iconName: string;
  shortDesc: string;
  fullDetail: string;
}

const uiText = {
  VI: {
    sectionTitle: "Dịch Vụ Của Tôi",
    emptyServices: "Đang cập nhật dịch vụ...",
    viewDetail: "Xem chi tiết",
    closeButton: "ĐÓNG",
    fetchError: "Lỗi tải dịch vụ:",
  },
  EN: {
    sectionTitle: "My Services",
    emptyServices: "Updating services...",
    viewDetail: "View details",
    closeButton: "CLOSE",
    fetchError: "Failed to load services:",
  },
};

const getServiceIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Monitor: (
      <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
    PenTool: (
      <PenTool className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
    Paintbrush: (
      <Paintbrush className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
    Camera: (
      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
    Code: (
      <Code className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
    Smartphone: (
      <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
    Globe: (
      <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
    Layers: (
      <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    ),
  };

  return (
    iconMap[iconName] || (
      <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-900 dark:text-white" />
    )
  );
};

export default function Services() {
  const { lang } = useLanguage();
  const t = uiText[lang];

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [translatedState, setTranslatedState] = useState<{
    lang: Lang | null;
    items: ServiceItem[];
  }>({
    lang: null,
    items: [],
  });
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [modalService, setModalService] = useState<ServiceItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    fetch("/api/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((err) => console.error(t.fetchError, err));
  }, [t.fetchError]);

  useEffect(() => {
    let active = true;

    async function syncServicesLanguage() {
      if (services.length === 0) {
        if (active) setTranslatedState({ lang, items: [] });
        return;
      }

      const nextServices = await translateList(
        services,
        lang,
        async (service, translate) => ({
          ...service,
          title: await translate(service.title),
          shortDesc: await translate(service.shortDesc),
          fullDetail: await translate(service.fullDetail),
        }),
        2,
      );

      if (active) {
        setTranslatedState({ lang, items: nextServices });
      }
    }

    syncServicesLanguage();

    return () => {
      active = false;
    };
  }, [services, lang]);

  const displayServices =
    translatedState.lang === lang && translatedState.items.length > 0
      ? translatedState.items
      : services;

  useEffect(() => {
    let active = true;

    if (selectedServiceId === null) {
      setModalService(null);
      return;
    }

    const fromTranslated =
      translatedState.lang === lang
        ? translatedState.items.find((s) => s.id === selectedServiceId) || null
        : null;

    if (fromTranslated) {
      setModalService(fromTranslated);
      return;
    }

    const rawService = services.find((s) => s.id === selectedServiceId) || null;
    if (!rawService) {
      setModalService(null);
      return;
    }

    setModalService(rawService);

    Promise.all([
      translateText(rawService.title, lang),
      translateText(rawService.shortDesc, lang),
      translateText(rawService.fullDetail, lang),
    ]).then(([title, shortDesc, fullDetail]) => {
      if (active) {
        setModalService({
          ...rawService,
          title,
          shortDesc,
          fullDetail,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [selectedServiceId, services, translatedState, lang]);

  const chunks: ServiceItem[][] = [];
  for (let i = 0; i < displayServices.length; i += 4) {
    chunks.push(displayServices.slice(i, i + 4));
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      if (clientWidth > 0) {
        const index = Math.round(scrollLeft / clientWidth);
        setActiveIndex(
          Math.min(Math.max(index, 0), Math.max(chunks.length - 1, 0)),
        );
      }
    }
  };

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const clientWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({
        left: index * clientWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="services"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-[#161616] dark:text-white px-4 sm:px-6 py-16 sm:py-20 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-2 sm:-left-3 -top-2 sm:-top-2.5 h-10 sm:h-12 w-28 sm:w-32 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t.sectionTitle}
            </h2>
          </div>
        </div>

        <div className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 shadow-2xl py-1 sm:py-2 overflow-hidden transition-colors duration-300">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing select-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {chunks.length === 0 ? (
              <div className="w-full text-center py-12 sm:py-16 text-neutral-500 text-xs sm:text-sm">
                {t.emptyServices}
              </div>
            ) : (
              chunks.map((slideGroup, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-300 dark:divide-white/5 snap-start pointer-events-auto"
                >
                  {slideGroup.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => {
                        if (!isDragging) {
                          setSelectedServiceId(service.id);
                        }
                      }}
                      className="flex flex-col items-center text-center p-5 sm:p-8 lg:p-10 cursor-pointer transition-colors duration-300 hover:bg-neutral-300/50 dark:hover:bg-[#1e1e1e] group"
                    >
                      <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                        {getServiceIcon(service.iconName)}
                      </div>

                      <h3 className="mb-2.5 sm:mb-4 text-xs sm:text-sm font-bold tracking-wider sm:tracking-widest text-neutral-900 dark:text-white transition-colors pointer-events-none">
                        {service.title}
                      </h3>

                      <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-gray-400 mb-4 sm:mb-6 transition-colors pointer-events-none">
                        {service.shortDesc}
                      </p>

                      <span className="mt-auto text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white underline underline-offset-4 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {t.viewDetail}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {chunks.length > 1 && (
          <div className="mt-6 sm:mt-8 flex justify-center items-center space-x-2.5 sm:space-x-3">
            {chunks.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                aria-label={`Slide ${index + 1}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === index
                    ? "bg-neutral-900 dark:bg-white w-5 sm:w-6"
                    : "bg-neutral-400 dark:bg-neutral-600 w-2 sm:w-2.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 px-4 py-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-300 dark:border-white/10 p-5 sm:p-8 shadow-2xl text-left transition-colors duration-300 rounded-2xl"
            >
              <button
                onClick={() => setSelectedServiceId(null)}
                aria-label={t.closeButton}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pr-8">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 rounded-xl">
                  {getServiceIcon(modalService.iconName)}
                </div>
                <h3 className="text-base sm:text-xl font-bold tracking-wide text-neutral-900 dark:text-white">
                  {modalService.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-gray-300 mb-6 sm:mb-8 whitespace-pre-line">
                {modalService.fullDetail}
              </p>

              <button
                onClick={() => setSelectedServiceId(null)}
                className="w-full bg-neutral-900 text-white dark:bg-white dark:text-black py-3 sm:py-3.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer rounded-xl"
              >
                {t.closeButton}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
