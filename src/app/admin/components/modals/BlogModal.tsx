"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blogData: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
  }) => void;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
  } | null;
}

export default function BlogModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BlogModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: "", slug: "", excerpt: "", content: "", image: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="font-bold text-sm text-white">
            {initialData ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              placeholder="Nhập tiêu đề..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Slug (Đường dẫn URL)
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              placeholder="vi-du-tieu-de-bai-viet"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Đường dẫn ảnh đại diện (Image URL)
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Mô tả ngắn (Excerpt)
            </label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 resize-none"
              placeholder="Tóm tắt ngắn gọn nội dung..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Nội dung chi tiết (Content)
            </label>
            <textarea
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 resize-none font-mono text-[11px]"
              placeholder="Viết nội dung bài viết..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:bg-neutral-800 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-neutral-200"
            >
              <Save size={14} /> Lưu bài viết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
