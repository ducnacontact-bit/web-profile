"use client";

import {
  X,
  Globe,
  Sun,
  Moon,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

const translations = {
  EN: {
    settingsTitle: "Menu & Settings",
    settingsDesc: "Quick navigation and custom preferences",
    categories: "Categories",
    options: "Preferences",
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    close: "Close Menu",
  },
  VI: {
    settingsTitle: "Menu & Cài đặt",
    settingsDesc: "Điều hướng nhanh và tùy chỉnh giao diện",
    categories: "Danh mục",
    options: "Tùy chọn",
    language: "Ngôn ngữ",
    theme: "Giao diện",
    dark: "Tối",
    light: "Sáng",
    close: "Đóng bảng",
  },
};

interface NavbarChild {
  id: number;
  title: string;
  url: string;
  desc?: string;
}

interface NavbarItem {
  id: number;
  title: string;
  url: string;
  children?: NavbarChild[];
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavbarItem[]>([]);
  const [language, setLanguage] = useState<"EN" | "VI">("EN");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State lưu thông tin cấu hình Logo từ API
  const [logoConfig, setLogoConfig] = useState({
    logo_dark: "/logo.png",
    logo_light: "/logodark.png",
    logo_height: "40",
    logo_width: "auto",
  });

  // State quản lý trạng thái mở/đóng menu con trong sidebar
  const [openMobileMenus, setOpenMobileMenus] = useState<
    Record<number, boolean>
  >({});

  const t = translations[language];

  // Hàm gọi API lấy cấu hình logo và cài đặt chung
  const fetchSettings = () => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setLogoConfig({
            logo_dark: data.logo_dark || "/logo.png",
            logo_light: data.logo_light || "/logodark.png",
            logo_height: data.logo_height || "40",
            logo_width: data.logo_width || "auto",
          });
        }
      })
      .catch((err) => console.error("Lỗi tải cấu hình logo:", err));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    const root = document.documentElement;
    if (!root.classList.contains("light")) {
      root.classList.add("dark");
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    // Load logo và menu lần đầu
    fetchSettings();

    // Lắng nghe sự kiện "logoChanged" từ trang Admin để cập nhật ngay lập tức mà không cần F5
    window.addEventListener("logoChanged", fetchSettings);

    // Fetch dữ liệu Navbar từ API
    fetch("/api/navbar")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNavItems(data);
        }
      })
      .catch((err) => console.error("Lỗi tải menu navbar:", err));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("logoChanged", fetchSettings);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "VI" : "EN"));
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const root = document.documentElement;
    if (newMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const toggleMobileSubmenu = (id: number) => {
    setOpenMobileMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-neutral-300 bg-neutral-200/95 dark:border-white/10 dark:bg-[#0b0b0b]/90 shadow-md backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#home" className="flex items-center">
            {/* Sử dụng dữ liệu logo và kích thước tùy chỉnh từ cơ sở dữ liệu */}
            <img
              src={isDarkMode ? logoConfig.logo_dark : logoConfig.logo_light}
              alt="Logo"
              style={{
                height: `${logoConfig.logo_height}px`,
                width:
                  logoConfig.logo_width === "auto"
                    ? "auto"
                    : `${logoConfig.logo_width}px`,
              }}
              className="object-contain transition-all duration-300"
            />
          </a>

          {/* Desktop Menu */}
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-7 md:flex">
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                return (
                  <div key={item.id} className="relative group py-2">
                    <a
                      href={item.url}
                      className="flex items-center text-sm font-semibold text-neutral-700 dark:text-gray-300 hover:text-neutral-950 dark:hover:text-white transition-colors duration-300"
                    >
                      <span>{item.title}</span>
                      {hasChildren && (
                        <ChevronDown
                          size={14}
                          className="ml-2 transition-transform duration-300 group-hover:rotate-180 text-neutral-400 shrink-0"
                        />
                      )}
                    </a>

                    {/* Dropdown Desktop đã được thu nhỏ khung lại */}
                    {hasChildren && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 hidden w-[320px] group-hover:block transition-all">
                        <div className="relative rounded-xl bg-neutral-100 dark:bg-[#121215] border border-neutral-300 dark:border-white/10 p-2.5 shadow-xl backdrop-blur-2xl">
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-neutral-100 dark:bg-[#121215] border-t border-l border-neutral-300 dark:border-white/10" />

                          <div className="grid grid-cols-2 gap-1.5 relative z-10">
                            {item.children?.map((child) => (
                              <a
                                key={child.id}
                                href={child.url}
                                className="group/item flex flex-col px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/80 dark:hover:bg-white/5 transition-all duration-200"
                              >
                                <span className="text-xs font-semibold text-neutral-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                  {child.title}
                                </span>
                                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                                  {child.desc || "Khám phá chi tiết"}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Quick buttons */}
            <div className="hidden items-center gap-3 md:flex border-l border-neutral-300 dark:border-white/10 pl-6">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-900 dark:text-gray-200 bg-neutral-300 dark:bg-white/5 border border-neutral-400 dark:border-white/10 rounded-full hover:bg-neutral-400/60 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-xs"
              >
                <Globe
                  size={14}
                  className="text-[#b37d00] dark:text-[#ffb400]"
                />
                <span>{language}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-900 dark:text-gray-200 bg-neutral-300 dark:bg-white/5 border border-neutral-400 dark:border-white/10 rounded-full hover:bg-neutral-400/60 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-xs"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Moon size={15} className="text-blue-400" />
                ) : (
                  <Sun size={15} className="text-[#ffb400]" />
                )}
              </button>
            </div>

            {/* Open Sidebar Menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="group p-2.5 bg-neutral-300 dark:bg-white/5 border border-neutral-400 dark:border-white/10 rounded-xl hover:bg-neutral-400/60 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center shadow-xs"
              aria-label="Open sidebar menu"
            >
              <SlidersHorizontal
                size={18}
                className="text-neutral-900 dark:text-gray-300 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Sidebar Menu (Menu phụ) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm bg-neutral-100 dark:bg-[#141414] border-l border-neutral-300 dark:border-white/10 h-full p-8 flex flex-col shadow-2xl relative text-neutral-900 dark:text-white overflow-y-auto">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-6 right-6 p-2 text-neutral-700 dark:text-gray-400 hover:text-neutral-950 dark:hover:text-white bg-neutral-200 dark:bg-white/5 rounded-full transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-bold tracking-wide mb-1">
                {t.settingsTitle}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-gray-400">
                {t.settingsDesc}
              </p>
            </div>

            {/* Danh sách menu chính và phụ */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold tracking-wider text-neutral-500 dark:text-gray-500 uppercase">
                {t.categories}
              </span>
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = openMobileMenus[item.id];

                return (
                  <div key={item.id} className="flex flex-col gap-1.5">
                    {hasChildren ? (
                      <button
                        onClick={() => toggleMobileSubmenu(item.id)}
                        className="inline-flex items-center text-sm font-semibold text-neutral-900 dark:text-white hover:text-blue-500 transition-colors w-fit text-left py-1 cursor-pointer"
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          size={14}
                          className={`ml-2 transition-transform duration-300 text-neutral-400 shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <a
                        href={item.url}
                        onClick={() => setSidebarOpen(false)}
                        className="text-sm font-semibold text-neutral-900 dark:text-white hover:text-blue-500 transition-colors py-1 w-fit"
                      >
                        {item.title}
                      </a>
                    )}

                    {/* Menu con trượt mở ra khi ấn */}
                    {hasChildren && isOpen && (
                      <div className="grid grid-cols-1 gap-1.5 pl-3 border-l border-neutral-300 dark:border-white/10 my-1">
                        {item.children?.map((child) => (
                          <a
                            key={child.id}
                            href={child.url}
                            onClick={() => setSidebarOpen(false)}
                            className="flex flex-col p-2 rounded-lg bg-neutral-200/50 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                          >
                            <span className="text-xs font-semibold text-neutral-800 dark:text-gray-200">
                              {child.title}
                            </span>
                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                              {child.desc || "Khám phá chi tiết"}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Phần tùy chọn Ngôn ngữ và Giao diện đặt ngay dưới phần danh mục cuối */}
              <div className="mt-4 pt-6 border-t border-neutral-300 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 dark:text-gray-400 uppercase">
                  {t.options}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-900 dark:text-gray-200 bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-full hover:bg-neutral-300 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Globe
                      size={14}
                      className="text-[#b37d00] dark:text-[#ffb400]"
                    />
                    <span>{language}</span>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className="p-2 text-neutral-900 dark:text-gray-200 bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-full hover:bg-neutral-300 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? (
                      <Moon size={15} className="text-blue-400" />
                    ) : (
                      <Sun size={15} className="text-[#ffb400]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
