"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData>({
    image: "/shinn.jpg",
    paragraph1: "Đang tải nội dung...",
    paragraph2: "",
    hireMeUrl: "#contact",
    cvUrl: "/cv.pdf",
  });

  const [skills, setSkills] = useState<SkillData[]>([]);

  useEffect(() => {
    // 1. Tải dữ liệu phần About Me
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setAboutData(data);
        }
      })
      .catch((err) => console.error("Lỗi tải About:", err));

    // 2. Tải danh sách Skills từ Database
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSkills(data);
        }
      })
      .catch((err) => console.error("Lỗi tải Skills:", err));
  }, []);

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white text-neutral-900 dark:bg-[#111] dark:text-white px-6 py-20 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
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

          <div className="relative z-10 w-full max-w-sm bg-neutral-100 dark:bg-[#1a1a1a] p-3 border border-black/5 dark:border-white/5 shadow-2xl transition-colors duration-300">
            <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
              <img
                src={aboutData.image || "/shinn.jpg"}
                alt="Đức Nguyễn"
                className="h-full w-full object-cover grayscale contrast-125 transition-all duration-500 hover:grayscale-0"
              />
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
              className="absolute -left-3 -top-2.5 h-12 w-28 z-0 text-neutral-900 dark:text-white opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              About&nbsp;Me
            </h2>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-gray-400 sm:text-base whitespace-pre-line">
            <p>{aboutData.paragraph1}</p>
            <p>{aboutData.paragraph2}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={aboutData.hireMeUrl || "#contact"}
              className="inline-flex items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              HIRE ME
            </a>

            <a
              href={aboutData.cvUrl || "/cv.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-neutral-400 dark:border-white/40 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white transition-all duration-300 hover:border-neutral-900 dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/10"
            >
              DOWNLOAD CV
            </a>
          </div>
        </motion.div>
      </div>

      {/* Phần My Skills động từ DB */}
      <div className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex justify-center mb-16">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-3 -top-2.5 h-12 w-32 z-0 text-neutral-900 dark:text-white opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h3 className="relative z-10 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              My&nbsp;Skills
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col space-y-2"
            >
              <div className="flex justify-between text-xs font-semibold tracking-wider text-neutral-700 dark:text-gray-300">
                <span>{skill.name}</span>
                <span>{skill.percentage}%</span>
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
