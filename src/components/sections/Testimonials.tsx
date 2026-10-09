"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Heart, Briefcase, Award, Quote } from "lucide-react";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Tải dữ liệu từ API /api/testimonials khi trang được tải
  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch((err) => console.error("Lỗi tải testimonials:", err));
  }, []);

  // Dữ liệu thống kê (Counters)
  const stats = [
    {
      id: 1,
      icon: <Trophy className="w-5 h-5 text-neutral-900 dark:text-white" />,
      label: "Cup of Tea",
      value: "1200",
    },
    {
      id: 2,
      icon: <Heart className="w-5 h-5 text-neutral-900 dark:text-white" />,
      label: "Happy Client",
      value: "1080",
    },
    {
      id: 3,
      icon: <Briefcase className="w-5 h-5 text-neutral-900 dark:text-white" />,
      label: "Project Complete",
      value: "1170",
    },
    {
      id: 4,
      icon: <Award className="w-5 h-5 text-neutral-900 dark:text-white" />,
      label: "Awards Win",
      value: "750",
    },
  ];

  // Hàm xử lý kéo trượt slide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (e: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (
      info.offset.x < -threshold &&
      testimonials.length > 0 &&
      currentIndex < testimonials.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <section
      id="testimonials"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white text-neutral-900 dark:bg-[#111] dark:text-white px-6 py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Tiêu đề "Testimonials" */}
        <div className="flex justify-center mb-16">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-4 -top-3 h-14 w-40 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl bg-neutral-200 dark:bg-[#1a1a1a] px-8 py-2 border border-neutral-300 dark:border-white/5 shadow-md transition-colors duration-300 rounded-xl">
              Testimonials
            </h2>
          </div>
        </div>

        {/* Khung Slider Testimonials */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 text-sm">
            Đang cập nhật đánh giá từ khách hàng...
          </div>
        ) : (
          <>
            <div className="overflow-hidden cursor-grab active:cursor-grabbing mb-10 pt-8">
              <motion.div
                className="flex gap-6"
                drag="x"
                dragConstraints={{ left: -300, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={{
                  x: `-${currentIndex * (window.innerWidth < 1024 ? 100 : 50)}%`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className="w-full lg:w-[calc(50%-12px)] flex-shrink-0 relative bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-6 sm:p-8 pt-16 hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl"
                  >
                    {/* Avatar tròn phía trên card */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                      <div className="relative w-16 h-16">
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

                    {/* Thông tin khách hàng */}
                    <div className="text-center mb-4 mt-2">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {item.name}
                      </h3>
                      <span className="text-xs text-neutral-500 dark:text-gray-400 font-medium">
                        {item.role}
                      </span>
                    </div>

                    {/* Nội dung đánh giá */}
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 text-center leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center items-center gap-2 mb-16">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    currentIndex === idx
                      ? "bg-neutral-900 dark:bg-white w-5"
                      : "bg-neutral-400/50 dark:bg-white/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Phần Thống kê (Counters / Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-300 dark:border-white/10 transition-colors duration-300">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="mb-3 p-2.5 bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 group-hover:border-neutral-400 dark:group-hover:border-white/20 transition-colors duration-300 shadow-sm rounded-xl">
                {stat.icon}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-gray-400 tracking-wide mb-1">
                {stat.label}
              </h4>
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
