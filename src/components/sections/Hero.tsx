"use client";

import { useState, useEffect } from "react";
import { ArrowDown, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface HeroData {
  roles?: string[] | string;
  greeting?: string;
  description?: string;
  darkBgUrl?: string;
  lightBgUrl?: string;
  socials?:
    | {
        platform: string;
        url: string;
      }[]
    | string;
}

export default function Hero() {
  const [heroData, setHeroData] = useState<HeroData>({
    roles: ["Electrical Engineer", "Developer", "Creator"],
    greeting: "Hello,",
    description:
      "Tôi xây dựng những sản phẩm đơn giản, hữu ích\nvà luôn thích khám phá những công nghệ mới.",
    darkBgUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80",
    lightBgUrl:
      "https://images.pexels.com/photos/38510810/pexels-photo-38510810.jpeg",
    socials: [],
  });

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Lấy dữ liệu từ Backend khi load trang và xử lý parse an toàn cho socials
  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          let parsedSocials = [];
          try {
            if (data.socials) {
              parsedSocials =
                typeof data.socials === "string"
                  ? JSON.parse(data.socials)
                  : data.socials;
            }
          } catch (e) {
            parsedSocials = [];
          }

          setHeroData({
            roles: data.roles || [
              "Electrical Engineer",
              "Developer",
              "Creator",
            ],
            greeting: data.greeting || "Hello,",
            description: data.description || "",
            darkBgUrl: data.darkBgUrl || "",
            lightBgUrl: data.lightBgUrl || "",
            socials: parsedSocials,
          });
        }
      })
      .catch((err) => console.error("Không thể tải dữ liệu Hero từ BE:", err));
  }, []);

  const roles: string[] = Array.isArray(heroData.roles)
    ? heroData.roles
    : typeof heroData.roles === "string"
      ? heroData.roles.split(",").map((r) => r.trim())
      : ["Electrical Engineer", "Developer", "Creator"];

  useEffect(() => {
    const checkTheme = () => {
      const root = document.documentElement;
      setIsDarkMode(root.classList.contains("dark"));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fullText = roles[currentRoleIndex] || "";

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
          setTypingSpeed(100);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(150);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, typingSpeed, roles]);

  const getSocialIconAndColor = (platform: string) => {
    const name = platform.toLowerCase();

    if (name.includes("github") || name.includes("git")) {
      return {
        svgPath:
          "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
        hoverBg: "hover:bg-[#24292e] hover:border-[#24292e]",
      };
    }
    if (name.includes("linkedin")) {
      return {
        svgPath:
          "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z",
        hoverBg: "hover:bg-[#0a66c2] hover:border-[#0a66c2]",
      };
    }
    if (name.includes("facebook") || name.includes("fb")) {
      return {
        svgPath:
          "M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.581 9 4.75V8z",
        hoverBg: "hover:bg-[#1877f2] hover:border-[#1877f2]",
      };
    }
    if (name.includes("instagram")) {
      return {
        svgPath:
          "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
        hoverBg:
          "hover:bg-gradient-to-tr hover:from-[#feda75] hover:via-[#d62976] hover:to-[#962fbf] hover:border-transparent",
      };
    }
    if (name.includes("tiktok")) {
      return {
        svgPath:
          "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.5.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.25 1.07-.24 1.62.12 1.25.92 2.36 2.06 2.83 1.16.49 2.53.37 3.56-.3 1.01-.66 1.67-1.78 1.75-3 .05-3.44.02-6.88.03-10.31V.02z",
        hoverBg:
          "hover:bg-black hover:border-black dark:hover:bg-white dark:hover:text-black",
      };
    }
    if (name.includes("youtube") || name.includes("yt")) {
      return {
        svgPath:
          "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
        hoverBg: "hover:bg-[#ff0000] hover:border-[#ff0000]",
      };
    }
    if (name.includes("twitter") || name.includes("x")) {
      return {
        svgPath:
          "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
        hoverBg:
          "hover:bg-neutral-900 hover:border-neutral-900 dark:hover:bg-white dark:hover:text-black",
      };
    }

    return {
      svgPath:
        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
      hoverBg: "hover:bg-[#d99b00] dark:hover:bg-[#ffb400]",
    };
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-200 text-neutral-900 dark:bg-[#111] dark:text-white transition-colors duration-300"
    >
      <div
        className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500 ${
          isDarkMode ? "opacity-30" : "opacity-75"
        }`}
        style={{
          backgroundImage: isDarkMode
            ? heroData.darkBgUrl
              ? `url('${heroData.darkBgUrl}')`
              : undefined
            : heroData.lightBgUrl
              ? `url('${heroData.lightBgUrl}')`
              : undefined,
        }}
      />

      <div className="relative z-10 w-full px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg font-medium text-neutral-700 dark:text-gray-300 sm:text-xl md:text-2xl"
        >
          {heroData.greeting || "Hello,"}
        </motion.p>

        <div className="my-2 flex flex-wrap items-center justify-center">
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl md:text-5xl lg:text-6xl">
            I&apos;m{" "}
            <span className="text-neutral-900 dark:text-white">
              {currentText}
            </span>
            <span className="ml-1 inline-block w-[3px] h-[0.8em] bg-neutral-900 dark:bg-white animate-pulse align-middle" />
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold tracking-widest text-neutral-700 dark:text-gray-400 sm:text-sm md:text-base uppercase"
        >
          {roles.map((role, idx) => (
            <span key={idx} className="flex items-center gap-3">
              {idx > 0 && (
                <span className="text-[#d99b00] dark:text-[#ffb400]">◆</span>
              )}
              {role}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl px-6 text-sm leading-7 text-neutral-700 dark:text-gray-400 sm:text-base font-medium whitespace-pre-line"
        >
          {heroData.description}
        </motion.p>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex justify-center items-center gap-4 flex-wrap"
        >
          {(() => {
            const socialLinks = Array.isArray(heroData.socials)
              ? heroData.socials.filter((s) => s.url && s.url.trim() !== "")
              : [];

            if (socialLinks.length > 0) {
              return socialLinks.map((social: any, index: number) => {
                const { svgPath, hoverBg } = getSocialIconAndColor(
                  social.platform,
                );

                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex h-12 w-12 items-center justify-center rounded-full border border-neutral-400/50 dark:border-white/20 text-neutral-800 dark:text-white bg-white/70 dark:bg-white/5 backdrop-blur-md transition-all duration-300 ${hoverBg} hover:text-white hover:-translate-y-1 shadow-sm`}
                    title={social.platform}
                  >
                    <svg
                      className="w-5 h-5 fill-current transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path d={svgPath} />
                    </svg>
                  </a>
                );
              });
            }

            return null;
          })()}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
      >
        <div className="flex flex-col items-center gap-1 text-neutral-600 dark:text-gray-500">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={14} />
          </motion.div>
        </div>
      </motion.a>
    </section>
  );
}
