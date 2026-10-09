"use client";

import React, { useState, useEffect } from "react";
import { Share2, Globe, MessageCircle, ExternalLink } from "lucide-react";

interface BlogPostItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);

  // Tải danh sách bài viết từ API /api/blog (hoặc /api/blogs tùy theo route của bạn)
  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách blog:", err));
  }, []);

  // Nếu chưa có bài viết nào trong Database thì hiển thị thông báo trống nhưng giữ nguyên layout
  if (posts.length === 0) {
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
                Blog Post
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">
            Đang cập nhật bài viết blog...
          </p>
        </div>
      </section>
    );
  }

  // Lấy bài viết lớn đầu tiên làm cột trái
  const mainPost = posts[0];
  // Các bài viết còn lại làm cột phải
  const subPosts = posts.slice(1);

  return (
    <section
      id="blog"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-[#111] dark:text-white px-6 py-24 lg:px-24 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Tiêu đề "Blog Post" */}
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
              Blog Post
            </h2>
          </div>
        </div>

        {/* Lưới bố cục Blog: Cột trái và Cột phải có chiều cao đồng bộ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* CỘT TRÁI: Bài viết dọc lớn */}
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
                  Read More <ExternalLink className="w-3 h-3" />
                </span>
                <div className="flex items-center gap-3 text-neutral-500 dark:text-gray-400">
                  <span
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </span>
                  <span
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Website"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                  <span
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Comment"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Các bài viết ngang nhỏ được chia đều chiều cao */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {subPosts.length === 0 ? (
              // Nếu chỉ có 1 bài viết, hiển thị thông báo phụ hoặc lặp lại mẫu để giữ lưới nếu muốn, ở đây hiển thị linh hoạt theo số lượng bài viết từ DB
              <div className="bg-neutral-200/60 dark:bg-[#161616] border border-neutral-300 dark:border-white/5 p-6 flex items-center justify-center text-xs text-neutral-500">
                Chưa có thêm bài viết phụ nào.
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
                        Read More <ExternalLink className="w-3 h-3" />
                      </span>
                      <div className="flex items-center gap-2.5 text-neutral-500 dark:text-gray-400">
                        <span
                          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                          title="Share"
                        >
                          <Share2 className="w-3 h-3" />
                        </span>
                        <span
                          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                          title="Website"
                        >
                          <Globe className="w-3 h-3" />
                        </span>
                        <span
                          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                          title="Comment"
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
