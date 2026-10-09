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
  LucideIcon,
} from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  iconName: string;
  shortDesc: string;
  fullDetail: string;
}

// Hàm ánh xạ tên icon string từ CSDL sang component Icon của Lucide
const getServiceIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Monitor: <Monitor className="w-8 h-8 text-neutral-900 dark:text-white" />,
    PenTool: <PenTool className="w-8 h-8 text-neutral-900 dark:text-white" />,
    Paintbrush: (
      <Paintbrush className="w-8 h-8 text-neutral-900 dark:text-white" />
    ),
    Camera: <Camera className="w-8 h-8 text-neutral-900 dark:text-white" />,
    Code: <Code className="w-8 h-8 text-neutral-900 dark:text-white" />,
    Smartphone: (
      <Smartphone className="w-8 h-8 text-neutral-900 dark:text-white" />
    ),
    Globe: <Globe className="w-8 h-8 text-neutral-900 dark:text-white" />,
    Layers: <Layers className="w-8 h-8 text-neutral-900 dark:text-white" />,
  };

  return (
    iconMap[iconName] || (
      <Monitor className="w-8 h-8 text-neutral-900 dark:text-white" />
    )
  );
};

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Trạng thái phục vụ tính năng click và giữ chuột kéo (drag-to-scroll) mượt mà
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Tải dữ liệu dịch vụ từ API
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((err) => console.error("Lỗi tải dịch vụ:", err));
  }, []);

  // Gom nhóm mỗi 4 dịch vụ thành 1 slide trang
  const chunks = [];
  for (let i = 0; i < services.length; i += 4) {
    chunks.push(services.slice(i, i + 4));
  }

  // Các hàm xử lý kéo chuột (Drag-to-scroll)
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
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
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
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-[#161616] dark:text-white px-6 py-20 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Tiêu đề "My Services" với chấm lưới đồng bộ màu chữ */}
        <div className="flex justify-center mb-16">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-3 -top-2.5 h-12 w-32 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              My&nbsp;Services
            </h2>
          </div>
        </div>

        {/* Khung nền lớn chứa slider dịch vụ */}
        <div className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 shadow-2xl py-2 overflow-hidden transition-colors duration-300">
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
              <div className="w-full text-center py-16 text-neutral-500 text-sm">
                Đang cập nhật dịch vụ...
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
                          setSelectedService(service);
                        }
                      }}
                      className="flex flex-col items-center text-center p-8 sm:p-10 cursor-pointer transition-colors duration-300 hover:bg-neutral-300/50 dark:hover:bg-[#1e1e1e] group"
                    >
                      {/* Icon dịch vụ */}
                      <div className="mb-6 flex h-16 w-16 items-center justify-center transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                        {getServiceIcon(service.iconName)}
                      </div>

                      {/* Tiêu đề dịch vụ */}
                      <h3 className="mb-4 text-sm font-bold tracking-widest text-neutral-900 dark:text-white transition-colors pointer-events-none">
                        {service.title}
                      </h3>

                      {/* Mô tả ngắn */}
                      <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-gray-400 mb-6 transition-colors pointer-events-none">
                        {service.shortDesc}
                      </p>

                      {/* Gợi ý click xem chi tiết */}
                      <span className="mt-auto text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white underline underline-offset-4 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Xem chi tiết
                      </span>
                    </motion.div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dấu chấm phân trang (Slider Dots) chỉ hiển thị khi có nhiều hơn 1 trang slide */}
        {chunks.length > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-3">
            {chunks.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === index
                    ? "bg-neutral-900 dark:bg-white w-6"
                    : "bg-neutral-400 dark:bg-neutral-600 w-2.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup hiển thị chi tiết khi bấm vào khối dịch vụ */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-300 dark:border-white/10 p-8 shadow-2xl text-left transition-colors duration-300 rounded-2xl"
            >
              {/* Nút đóng */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Tiêu đề popup kèm icon */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 rounded-xl">
                  {getServiceIcon(selectedService.iconName)}
                </div>
                <h3 className="text-xl font-bold tracking-wide text-neutral-900 dark:text-white">
                  {selectedService.title}
                </h3>
              </div>

              {/* Nội dung chi tiết đầy đủ */}
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-gray-300 mb-8">
                {selectedService.fullDetail}
              </p>

              {/* Nút đóng popup */}
              <button
                onClick={() => setSelectedService(null)}
                className="w-full bg-neutral-900 text-white dark:bg-white dark:text-black py-3.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer rounded-xl"
              >
                ĐÓNG
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
