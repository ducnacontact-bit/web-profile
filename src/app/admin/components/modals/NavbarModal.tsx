"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface NavbarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    url: string;
    parentId: number | null;
  }) => void;
  parentOptions: { id: number; title: string }[];
  initialData?: {
    id: number;
    title: string;
    url: string;
    parentId?: number | null;
  } | null;
}

export default function NavbarModal({
  isOpen,
  onClose,
  onSave,
  parentOptions,
  initialData,
}: NavbarModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setParentId(initialData.parentId ?? null);
    } else {
      setTitle("");
      setUrl("");
      setParentId(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, url, parentId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="font-bold text-sm text-white">
            {initialData ? "Chỉnh sửa mục Menu" : "Thêm mục Menu mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Tên hiển thị (Title)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              placeholder="Ví dụ: Projects, Blog..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Đường dẫn (URL / Anchor)
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              placeholder="Ví dụ: #projects hoặc /blog"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Thuộc menu cha (Parent Menu)
            </label>
            <select
              value={parentId ?? ""}
              onChange={(e) =>
                setParentId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            >
              <option value="">-- Là menu gốc (Cấp cao nhất) --</option>
              {parentOptions
                .filter((item) => !initialData || item.id !== initialData.id) // Tránh chọn chính nó làm cha
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
            </select>
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
              <Save size={14} /> Lưu menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
