"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useLanguage, type Lang } from "@/components/LanguageProvider";
import { translateText, translateList } from "@/lib/translator";

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  span: string;
  desc: string;
}

const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  VI: {
    "ALL WORK": "TẤT CẢ",
    "WEB DESIGN": "THIẾT KẾ WEB",
    "WEB DEVELOPMENT": "PHÁT TRIỂN WEB",
    GRAPHIC: "ĐỒ HỌA",
    "GRAPHIC DESIGN": "THIẾT KẾ ĐỒ HỌA",
    "UI/UX DESIGN": "THIẾT KẾ UI/UX",
    PRINT: "IN ẤN",
    ILLUSTRATION: "MINH HỌA",
  },
  EN: {
    "ALL WORK": "ALL WORK",
    "WEB DESIGN": "WEB DESIGN",
    "WEB DEVELOPMENT": "WEB DEVELOPMENT",
    GRAPHIC: "GRAPHIC",
    "GRAPHIC DESIGN": "GRAPHIC DESIGN",
    "UI/UX DESIGN": "UI/UX DESIGN",
    PRINT: "PRINT",
    ILLUSTRATION: "ILLUSTRATION",
  },
};

const uiText = {
  VI: {
    sectionTitle: "Dự Án Mới Nhất",
    emptyProjects: "Đang cập nhật danh sách dự án...",
    closeButton: "ĐÓNG",
    projectDetailAlert: "Đường dẫn chi tiết dự án!",
    fetchError: "Lỗi tải dự án:",
  },
  EN: {
    sectionTitle: "Latest Projects",
    emptyProjects: "Updating projects list...",
    closeButton: "CLOSE",
    projectDetailAlert: "Project detail link!",
    fetchError: "Failed to load projects:",
  },
};

async function translateProjectField(
  text: string,
  targetLang: Lang,
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || "";

  const upper = trimmed.toUpperCase();
  if (CATEGORY_LABELS[targetLang][upper]) {
    return CATEGORY_LABELS[targetLang][upper];
  }

  return translateText(trimmed, targetLang);
}

export default function LatestProjects() {
  const { lang } = useLanguage();
  const t = uiText[lang];

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [translatedState, setTranslatedState] = useState<{
    lang: Lang | null;
    items: ProjectItem[];
  }>({
    lang: null,
    items: [],
  });
  const [activeFilter, setActiveFilter] = useState<string>("ALL WORK");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error(t.fetchError, err));
  }, [t.fetchError]);

  useEffect(() => {
    let active = true;

    async function syncProjectsLanguage() {
      if (projects.length === 0) {
        if (active) setTranslatedState({ lang, items: [] });
        return;
      }

      const nextProjects = await translateList(
        projects,
        lang,
        async (project, translate) => {
          const upperCat = project.category?.trim().toUpperCase() || "";
          const translatedCategory = CATEGORY_LABELS[lang][upperCat]
            ? CATEGORY_LABELS[lang][upperCat]
            : await translate(project.category);

          const [translatedTitle, translatedDesc] = await Promise.all([
            translate(project.title),
            translate(project.desc),
          ]);

          return {
            ...project,
            title: translatedTitle,
            category: translatedCategory,
            desc: translatedDesc,
          };
        },
        2,
      );

      if (active) {
        setTranslatedState({ lang, items: nextProjects });
      }
    }

    syncProjectsLanguage();

    return () => {
      active = false;
    };
  }, [projects, lang]);

  const displayProjects =
    translatedState.lang === lang && translatedState.items.length > 0
      ? translatedState.items
      : projects;

  useEffect(() => {
    let active = true;

    if (selectedProjectId === null) {
      setModalProject(null);
      return;
    }

    const fromTranslated =
      translatedState.lang === lang
        ? translatedState.items.find((p) => p.id === selectedProjectId) || null
        : null;

    if (fromTranslated) {
      setModalProject(fromTranslated);
      return;
    }

    const rawProject = projects.find((p) => p.id === selectedProjectId) || null;
    if (!rawProject) {
      setModalProject(null);
      return;
    }

    setModalProject(rawProject);

    Promise.all([
      translateProjectField(rawProject.title, lang),
      translateProjectField(rawProject.category, lang),
      translateProjectField(rawProject.desc, lang),
    ]).then(([title, category, desc]) => {
      if (active) {
        setModalProject({
          ...rawProject,
          title,
          category,
          desc,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [selectedProjectId, projects, translatedState, lang]);

  const dynamicCategoryKeys = useMemo(() => {
    const categoriesFromData = Array.from(
      new Set(
        projects
          .map((p) => p.category?.trim())
          .filter((cat): cat is string => Boolean(cat)),
      ),
    );
    return ["ALL WORK", ...categoriesFromData];
  }, [projects]);

  useEffect(() => {
    if (!dynamicCategoryKeys.includes(activeFilter)) {
      setActiveFilter("ALL WORK");
    }
  }, [dynamicCategoryKeys, activeFilter]);

  const getCategoryTabLabel = (catKey: string) => {
    const upper = catKey.trim().toUpperCase();
    return CATEGORY_LABELS[lang][upper] || catKey;
  };

  const filteredProjectIds = new Set(
    (activeFilter === "ALL WORK"
      ? projects
      : projects.filter((p) => p.category?.trim() === activeFilter)
    ).map((p) => p.id),
  );

  const filteredProjects = displayProjects.filter((p) =>
    filteredProjectIds.has(p.id),
  );

  return (
    <section
      id="projects"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white text-neutral-900 dark:bg-[#111] dark:text-white px-4 py-16 sm:px-6 sm:py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Tiêu đề "Latest Projects" căn giữa với khung chấm chấm lót sau chữ */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-4 -top-3 h-14 w-40 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t.sectionTitle}
            </h2>
          </div>
        </div>

        {/* Thanh lọc danh mục (Filter Tabs) */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2.5 sm:gap-10 mb-10 sm:mb-16 text-[11px] sm:text-xs font-bold tracking-widest text-neutral-500 dark:text-gray-400">
          {dynamicCategoryKeys.map((catKey) => (
            <button
              key={catKey}
              onClick={() => setActiveFilter(catKey)}
              className={`cursor-pointer transition-colors duration-300 pb-1 border-b-2 ${
                activeFilter === catKey
                  ? "text-neutral-900 border-neutral-900 dark:text-white dark:border-white"
                  : "border-transparent hover:text-neutral-900 dark:hover:text-gray-200"
              }`}
            >
              {getCategoryTabLabel(catKey)}
            </button>
          ))}
        </div>

        {/* Lưới dự án (Masonry / Grid nghệ thuật) - giữ nguyên project.span từ admin trên máy tính */}
        {displayProjects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-sm">
            {t.emptyProjects}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[280px]"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`relative overflow-hidden bg-neutral-100 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 cursor-pointer group max-sm:!col-span-1 ${
                  project.span || "col-span-1 row-span-1"
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                  <span className="text-[10px] uppercase tracking-widest text-gray-300 mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold tracking-wider text-white">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal Popup hiển thị chi tiết khi bấm vào dự án */}
      <AnimatePresence>
        {modalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 px-4 py-6 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-300 dark:border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 text-neutral-900 dark:text-white transition-colors duration-300 rounded-2xl"
            >
              <button
                onClick={() => setSelectedProjectId(null)}
                className="absolute top-4 right-4 z-20 bg-neutral-200 dark:bg-black/50 p-2 rounded-full text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-56 sm:h-64 md:h-full w-full bg-neutral-200 dark:bg-black">
                <img
                  src={modalProject.image}
                  alt={modalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-between text-left">
                <div>
                  <span className="inline-block px-3 py-1 bg-neutral-200 dark:bg-white/10 text-[10px] font-bold tracking-widest text-neutral-700 dark:text-gray-300 mb-4 rounded-md">
                    {modalProject.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-wide text-neutral-900 dark:text-white mb-4">
                    {modalProject.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-gray-400 mb-6 sm:mb-8">
                    {modalProject.desc}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    className="flex-1 bg-neutral-900 text-white dark:bg-white dark:text-black py-3.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer rounded-xl"
                  >
                    {t.closeButton}
                  </button>
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(t.projectDetailAlert);
                    }}
                    className="p-3.5 border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors rounded-xl flex items-center justify-center"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
