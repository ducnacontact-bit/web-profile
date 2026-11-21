"use client";

import React, { useState, useEffect } from "react";
import { Share2, Globe, MessageCircle, ExternalLink } from "lucide-react";
import { useLanguage, type Lang } from "@/components/LanguageProvider";

interface BlogPostItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
}

const uiText = {
  VI: {
    sectionTitle: "Bài Viết Blog",
    emptyPosts: "Đang cập nhật bài viết blog...",
    noSubPosts: "Chưa có thêm bài viết phụ nào.",
    readMore: "Đọc thêm",
    share: "Chia sẻ",
    website: "Website",
    comment: "Bình luận",
    fetchError: "Lỗi tải danh sách blog:",
  },
  EN: {
    sectionTitle: "Blog Post",
    emptyPosts: "Updating blog posts...",
    noSubPosts: "No additional sub-posts yet.",
    readMore: "Read More",
    share: "Share",
    website: "Website",
    comment: "Comment",
    fetchError: "Failed to load blog posts:",
  },
};

const blogTranslationCache = new Map<string, string>();

async function translateBlogText(
  text: string,
  targetLang: Lang,
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || "";

  const cacheKey = `${targetLang}:${trimmed}`;
  if (blogTranslationCache.has(cacheKey)) {
    return blogTranslationCache.get(cacheKey)!;
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
        blogTranslationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }
    }
  } catch {
    // Giữ nguyên text gốc nếu không có endpoint dịch
  }

  return text;
}

export default function Blog() {
  const { lang } = useLanguage();
  const t = uiText[lang];

  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [translatedPosts, setTranslatedPosts] = useState<BlogPostItem[]>([]);

  useEffect(() => {
    fetch("/api/blog", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch((err) => console.error(t.fetchError, err));
  }, [t.fetchError]);

  useEffect(() => {
    let active = true;

    async function syncPostsLanguage() {
      if (posts.length === 0) {
        if (active) setTranslatedPosts([]);
        return;
      }

      const nextPosts = await Promise.all(
        posts.map(async (post) => ({
          ...post,
          title: await translateBlogText(post.title, lang),
          excerpt: await translateBlogText(post.excerpt, lang),
        })),
      );

      if (active) {
        setTranslatedPosts(nextPosts);
      }
    }

    syncPostsLanguage();

    return () => {
      active = false;
    };
  }, [posts, lang]);

  if (translatedPosts.length === 0) {
    return (
      <section
        id="blog"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-[#111] dark:text-white px-6 py-24 lg:px-24 transition-colors duration-300"
      >
        <div className="mx-auto w-full max-w-6xl text-center">
          <div className="flex justify-center mb-16">
            <div className="relative inline-block text-center">
              <div
                className="absolute -left-6 -top-3 h-14 w-40 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                  backgroundSize: "6px 6px",
                }}
              />
              <h2 className="relative z-10 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl bg-neutral-200 dark:bg-[#1a1a1a] px-8 py-2 border border-neutral-300 dark:border-white/5 shadow-md transition-colors duration-300">
                {t.sectionTitle}
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">{t.emptyPosts}</p>
        </div>
      </section>
    );
  }

  const mainPost = translatedPosts[0];
  const subPosts = translatedPosts.slice(1);

  return (
    <section
      id="blog"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-[#111] dark:text-white px-6 py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-center mb-16">
          <div className="relative inline-block text-center">
            <div
              className="absolute -left-6 -top-3 h-14 w-40 z-0 text-neutral-900 dark:text-white opacity-20 dark:opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "6px 6px",
              }}
            />
            <h2 className="relative z-10 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl bg-neutral-200 dark:bg-[#1a1a1a] px-8 py-2 border border-neutral-300 dark:border-white/5 shadow-md transition-colors duration-300">
              {t.sectionTitle}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 cursor-pointer shadow-sm">
            <div>
              <div className="w-full h-64 overflow-hidden relative">
                <img
                  src={mainPost.image}
                  alt={mainPost.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 leading-snug">
                  {mainPost.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400 leading-relaxed">
                  {mainPost.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="flex items-center justify-between pt-4 border-t border-neutral-300 dark:border-white/5">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  {t.readMore} <ExternalLink className="w-3 h-3" />
                </span>
                <div className="flex items-center gap-3 text-neutral-500 dark:text-gray-400">
                  <span
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title={t.share}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </span>
                  <span
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title={t.website}
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                  <span
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title={t.comment}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {subPosts.length === 0 ? (
              <div className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-6 flex items-center justify-center text-xs text-neutral-500">
                {t.noSubPosts}
              </div>
            ) : (
              subPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 flex flex-col sm:flex-row group hover:border-neutral-400 dark:hover:border-white/20 transition-colors duration-300 overflow-hidden cursor-pointer flex-1 shadow-sm"
                >
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden relative flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-300 dark:border-white/5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                        {t.readMore} <ExternalLink className="w-3 h-3" />
                      </span>
                      <div className="flex items-center gap-2.5 text-neutral-500 dark:text-gray-400">
                        <span
                          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                          title={t.share}
                        >
                          <Share2 className="w-3 h-3" />
                        </span>
                        <span
                          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                          title={t.website}
                        >
                          <Globe className="w-3 h-3" />
                        </span>
                        <span
                          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                          title={t.comment}
                        >
                          <MessageCircle className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
