"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Briefcase } from "lucide-react";

interface ResumeItem {
  id: number;
  type: string;
  time: string;
  title: string;
  desc: string;
  institution?: string | null;
  role?: string | null;
}

export default function Resume() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);

  // Lấy dữ liệu Resume từ API /api/resume khi tải trang
  useEffect(() => {
    fetch("/api/resume")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResumes(data);
        }
      })
      .catch((err) => console.error("Lỗi tải dữ liệu Resume:", err));
  }, []);

  // Phân loại danh sách thành Education và Experience
  const educationList = resumes.filter((item) => item.type === "education");
  const experienceList = resumes.filter((item) => item.type === "experience");

  return (
    <section
      id="resume"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-[#1116] dark:text-white px-6 py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Tiêu đề "Resume" căn giữa */}
        <div className="flex justify-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl bg-neutral-200 dark:bg-[#1a1a1a] px-8 py-2 border border-neutral-300 dark:border-white/5 shadow-md transition-colors duration-300 rounded-xl">
            Resume
          </h2>
        </div>

        {/* Lưới 2 cột: Education & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Cột 1: Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-6 h-6 text-neutral-900 dark:text-white" />
              <h3 className="text-xl font-bold tracking-wide text-neutral-900 dark:text-white">
                Education:
              </h3>
            </div>

            <div className="space-y-6">
              {educationList.length === 0 ? (
                <p className="text-xs text-neutral-500">
                  Đang cập nhật học vấn...
                </p>
              ) : (
                educationList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-6 sm:p-8 relative group hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl"
                  >
                    <span className="text-xs text-neutral-500 dark:text-gray-400 block mb-3 font-medium">
                      {item.time}
                    </span>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 leading-relaxed mb-6">
                      {item.desc}
                    </p>
                    <span className="text-xs font-semibold text-neutral-700 dark:text-gray-300 block mb-4">
                      {item.institution}
                    </span>
                    <div className="w-full h-[1px] bg-neutral-300 dark:bg-white/10" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cột 2: Experience */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-6 h-6 text-neutral-900 dark:text-white" />
              <h3 className="text-xl font-bold tracking-wide text-neutral-900 dark:text-white">
                Experience:
              </h3>
            </div>

            <div className="space-y-6">
              {experienceList.length === 0 ? (
                <p className="text-xs text-neutral-500">
                  Đang cập nhật kinh nghiệm...
                </p>
              ) : (
                experienceList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-6 sm:p-8 relative group hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl"
                  >
                    <span className="text-xs text-neutral-500 dark:text-gray-400 block mb-3 font-medium">
                      {item.time}
                    </span>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 leading-relaxed mb-6">
                      {item.desc}
                    </p>
                    <span className="text-xs font-semibold text-neutral-700 dark:text-gray-300 block mb-4">
                      {item.role}
                    </span>
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
