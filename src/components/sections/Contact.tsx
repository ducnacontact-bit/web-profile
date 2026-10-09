"use client";

import React, { useState, useEffect } from "react";
import { Headphones, MapPin, Mail, Send, Edit3 } from "lucide-react";

interface ContactConfig {
  phone: string;
  address: string;
  email: string;
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactConfig>({
    phone: "",
    address: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Lấy thông tin cấu hình liên hệ từ API
  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        // Hỗ trợ cấu trúc trả về dạng { data: ... } hoặc trực tiếp object
        const info = data.data || data;
        if (info) {
          setContactInfo({
            phone: info.phone || "+0044 545 989 626\n+8801 909 130 830",
            address:
              info.address ||
              "28 Green Tower, Street Name,\nNew York City, USA",
            email: info.email || "www.marveltheme.com\nwww.yourmail@gmail.com",
          });
        }
      })
      .catch((err) => console.error("Lỗi tải thông tin contact:", err));
  }, []);

  // Xử lý gửi tin nhắn liên hệ (lưu vào bảng Message)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất.");
        setFormData({ name: "", email: "", budget: "", message: "" });
      } else {
        alert("Gửi tin nhắn thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi message:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white text-neutral-900 dark:bg-[#111] dark:text-white px-6 py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-5xl text-center">
        {/* Phần Tiêu đề đầu section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
            Wanna Start Work with me?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400">
            Tell me about your project story and project brief
          </p>
          <div className="mt-6 inline-block">
            <a
              href="#start-project"
              className="inline-block bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-widest uppercase px-6 py-3 hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors shadow-md rounded-xl"
            >
              START PROJECT
            </a>
          </div>
        </div>

        {/* Khung chứa thông tin liên hệ và form */}
        <div className="bg-neutral-200/60 dark:bg-[#151515] border border-neutral-300 dark:border-white/5 p-8 sm:p-12 shadow-xl text-left transition-colors duration-300 rounded-2xl">
          {/* Hàng 3 icon thông tin liên hệ (Phone, Address, Email) lấy từ DB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-neutral-300 dark:border-white/10 text-center">
            {/* Phone */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-neutral-400 dark:border-white/20 flex items-center justify-center mb-4 text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-transparent shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line">
                {contactInfo.phone}
              </p>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-neutral-400 dark:border-white/20 flex items-center justify-center mb-4 text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-transparent shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line">
                {contactInfo.address}
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-neutral-400 dark:border-white/20 flex items-center justify-center mb-4 text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-transparent shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line">
                {contactInfo.email}
              </p>
            </div>
          </div>

          {/* Form nhập liệu */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Cột trái: 3 ô input nhỏ */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white dark:bg-[#111] border border-neutral-300 dark:border-white/10 px-4 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors rounded-xl"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white dark:bg-[#111] border border-neutral-300 dark:border-white/10 px-4 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors rounded-xl"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your Budget"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="w-full bg-white dark:bg-[#111] border border-neutral-300 dark:border-white/10 px-4 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors rounded-xl"
                />
              </div>
            </div>

            {/* Cột phải: Ô textarea lớn và nút gửi */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              <div className="relative flex-grow">
                <textarea
                  placeholder="Project Description"
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full h-full bg-white dark:bg-[#111] border border-neutral-300 dark:border-white/10 p-4 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors resize-none rounded-xl"
                  required
                />
                <Edit3 className="absolute bottom-3 right-3 w-4 h-4 text-neutral-400 dark:text-gray-500 pointer-events-none" />
              </div>

              {/* Nút Send Message */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-widest uppercase px-8 py-3 hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors shadow-md cursor-pointer flex items-center gap-2 rounded-xl disabled:opacity-50"
                >
                  {loading ? "Đang gửi..." : "SEND MESSAGE"}{" "}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
