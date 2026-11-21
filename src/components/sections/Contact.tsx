"use client";

import React, { useState, useEffect } from "react";
import { Headphones, MapPin, Mail, Send, Edit3 } from "lucide-react";
import { useLanguage, type Lang } from "@/components/LanguageProvider";

interface ContactConfig {
  phone: string;
  address: string;
  email: string;
}

const FALLBACK_CONTACT: ContactConfig = {
  phone: "+0044 545 989 626\n+8801 909 130 830",
  address: "28 Green Tower, Street Name,\nNew York City, USA",
  email: "www.marveltheme.com\nwww.yourmail@gmail.com",
};

const uiText = {
  VI: {
    heading: "Bạn Muốn Bắt Đầu Làm Việc Cùng Tôi?",
    subheading: "Hãy kể cho tôi nghe về câu chuyện dự án và yêu cầu của bạn",
    startProject: "BẮT ĐẦU DỰ ÁN",
    namePlaceholder: "Tên của bạn",
    emailPlaceholder: "Email của bạn",
    budgetPlaceholder: "Ngân sách dự kiến",
    messagePlaceholder: "Mô tả dự án",
    sending: "Đang gửi...",
    sendMessage: "GỬI TIN NHẮN",
    successMsg: "Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất.",
    failMsg: "Gửi tin nhắn thất bại. Vui lòng thử lại!",
    networkErrorMsg: "Lỗi kết nối máy chủ.",
    fetchError: "Lỗi tải thông tin contact:",
    submitError: "Lỗi khi gửi message:",
  },
  EN: {
    heading: "Wanna Start Work with me?",
    subheading: "Tell me about your project story and project brief",
    startProject: "START PROJECT",
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    budgetPlaceholder: "Your Budget",
    messagePlaceholder: "Project Description",
    sending: "Sending...",
    sendMessage: "SEND MESSAGE",
    successMsg: "Thank you for your message! We will get back to you soon.",
    failMsg: "Failed to send message. Please try again!",
    networkErrorMsg: "Server connection error.",
    fetchError: "Failed to load contact info:",
    submitError: "Error submitting message:",
  },
};

const contactTranslationCache = new Map<string, string>();

async function translateContactText(
  text: string,
  targetLang: Lang,
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || "";

  const cacheKey = `${targetLang}:${trimmed}`;
  if (contactTranslationCache.has(cacheKey)) {
    return contactTranslationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, targetLang }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.translatedText) {
        contactTranslationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }
    }
  } catch {
    // Giữ nguyên dữ liệu từ DB nếu /api/translate lỗi
  }

  return text;
}

export default function Contact() {
  const { lang } = useLanguage();
  const t = uiText[lang];

  const [contactInfo, setContactInfo] =
    useState<ContactConfig>(FALLBACK_CONTACT);
  const [displayAddress, setDisplayAddress] = useState<string>(
    FALLBACK_CONTACT.address,
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Luôn lấy dữ liệu thật từ DB qua /api/contact cho cả VI và EN
  useEffect(() => {
    let active = true;

    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const info = data?.data || data;
        if (info) {
          setContactInfo({
            phone: info.phone?.trim() ? info.phone : FALLBACK_CONTACT.phone,
            address: info.address?.trim()
              ? info.address
              : FALLBACK_CONTACT.address,
            email: info.email?.trim() ? info.email : FALLBACK_CONTACT.email,
          });
        }
      })
      .catch((err) => console.error(uiText.VI.fetchError, err));

    return () => {
      active = false;
    };
  }, []);

  // Dịch địa chỉ từ DB theo ngôn ngữ hiện tại (VI / EN) mà không đè dữ liệu mẫu cứng
  useEffect(() => {
    let active = true;

    async function syncAddressLanguage() {
      const sourceAddress = contactInfo.address || FALLBACK_CONTACT.address;
      if (active) {
        setDisplayAddress(sourceAddress);
      }

      const nextAddress = await translateContactText(sourceAddress, lang);
      if (active && nextAddress) {
        setDisplayAddress(nextAddress);
      }
    }

    syncAddressLanguage();

    return () => {
      active = false;
    };
  }, [contactInfo.address, lang]);

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
        alert(t.successMsg);
        setFormData({ name: "", email: "", budget: "", message: "" });
      } else {
        alert(t.failMsg);
      }
    } catch (error) {
      console.error(t.submitError, error);
      alert(t.networkErrorMsg);
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
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400">
            {t.subheading}
          </p>
          <div className="mt-6 inline-block">
            <a
              href="#start-project"
              className="inline-block bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-widest uppercase px-6 py-3 hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors shadow-md rounded-xl"
            >
              {t.startProject}
            </a>
          </div>
        </div>

        <div className="bg-neutral-200/60 dark:bg-[#151515] border border-neutral-300 dark:border-white/5 p-8 sm:p-12 shadow-xl text-left transition-colors duration-300 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-neutral-300 dark:border-white/10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-neutral-400 dark:border-white/20 flex items-center justify-center mb-4 text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-transparent shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line">
                {contactInfo.phone}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-neutral-400 dark:border-white/20 flex items-center justify-center mb-4 text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-transparent shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line">
                {displayAddress}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-neutral-400 dark:border-white/20 flex items-center justify-center mb-4 text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-transparent shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line">
                {contactInfo.email}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
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
                  placeholder={t.emailPlaceholder}
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
                  placeholder={t.budgetPlaceholder}
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="w-full bg-white dark:bg-[#111] border border-neutral-300 dark:border-white/10 px-4 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:border-neutral-500 dark:focus:border-white/30 transition-colors rounded-xl"
                />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              <div className="relative flex-grow">
                <textarea
                  placeholder={t.messagePlaceholder}
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-widest uppercase px-8 py-3 hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors shadow-md cursor-pointer flex items-center gap-2 rounded-xl disabled:opacity-50"
                >
                  {loading ? t.sending : t.sendMessage}{" "}
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
