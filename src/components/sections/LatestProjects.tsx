"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  span: string;
  desc: string;
}

export default function LatestProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("ALL WORK");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  // Lấy dữ liệu dự án từ API khi tải trang
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error("Lỗi tải dự án:", err));
  }, []);

  // Lọc dự án theo danh mục
  const filteredProjects =
    activeFilter === "ALL WORK"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const categories = [
    "ALL WORK",
    "WEB DESIGN",
    "GRAPHIC",
    "PRINT",
    "ILLUSTRATION",
  ];

  return (
    <section
      id="projects"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white text-neutral-900 dark:bg-[#111] dark:text-white px-6 py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Tiêu đề "Latest Projects" căn giữa với khung chấm chấm lót sau chữ */}
        <div className="flex justify-center mb-10">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-4 -top-3 h-14 w-40 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Latest&nbsp;Projects
            </h2>
          </div>
        </div>

        {/* Thanh lọc danh mục (Filter Tabs) */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-16 text-xs font-bold tracking-widest text-neutral-500 dark:text-gray-400">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`cursor-pointer transition-colors duration-300 pb-1 border-b-2 ${
                activeFilter === cat
                  ? "text-neutral-900 border-neutral-900 dark:text-white dark:border-white"
                  : "border-transparent hover:text-neutral-900 dark:hover:text-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lưới dự án (Masonry / Grid nghệ thuật) */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-sm">
            Đang cập nhật danh sách dự án...
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`relative overflow-hidden bg-neutral-100 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 cursor-pointer group ${
                  project.span || "col-span-1 row-span-1"
                }`}
              >
                {/* Hình ảnh dự án */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Lớp phủ mờ khi hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
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
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 px-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-300 dark:border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 text-neutral-900 dark:text-white transition-colors duration-300 rounded-2xl"
            >
              {/* Nút đóng modal */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 bg-neutral-200 dark:bg-black/50 p-2 rounded-full text-neutral-700 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hình ảnh lớn trong popup */}
              <div className="h-64 md:h-full w-full bg-neutral-200 dark:bg-black">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thông tin chi tiết */}
              <div className="p-8 md:p-12 flex flex-col justify-between text-left">
                <div>
                  <span className="inline-block px-3 py-1 bg-neutral-200 dark:bg-white/10 text-[10px] font-bold tracking-widest text-neutral-700 dark:text-gray-300 mb-4 rounded-md">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl font-bold tracking-wide text-neutral-900 dark:text-white mb-4">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-gray-400 mb-8">
                    {selectedProject.desc}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 bg-neutral-900 text-white dark:bg-white dark:text-black py-3.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer rounded-xl"
                  >
                    ĐÓNG
                  </button>
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Đường dẫn chi tiết dự án!");
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
