"use client";

import React from "react";
import { Globe, Share2, MessageCircle, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0d0d0d] border-t border-white/10 px-6 py-12 lg:px-20 text-white">
      <div className="mx-auto w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Bản quyền thương hiệu */}
        <div className="text-center md:text-left">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-semibold">Nguyenanhduc</span>. All
            Rights Reserved.
          </p>
        </div>

        {/* Các liên kết mạng xã hội / website */}
        <div className="flex items-center gap-4 text-gray-400">
          <a
            href="#facebook"
            className="w-9 h-9 rounded-full bg-[#161616] border border-white/5 flex items-center justify-center hover:text-white hover:border-white/20 transition-colors"
            title="Website / Social"
          >
            <Globe className="w-4 h-4" />
          </a>
          <a
            href="#share"
            className="w-9 h-9 rounded-full bg-[#161616] border border-white/5 flex items-center justify-center hover:text-white hover:border-white/20 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </a>
          <a
            href="#chat"
            className="w-9 h-9 rounded-full bg-[#161616] border border-white/5 flex items-center justify-center hover:text-white hover:border-white/20 transition-colors"
            title="Message"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        {/* Nút cuộn lên đầu trang */}
        <div>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#161616] border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer shadow-md"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
