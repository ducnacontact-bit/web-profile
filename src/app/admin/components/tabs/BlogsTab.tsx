"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, Upload } from "lucide-react";

interface BlogPostItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  content?: string | null;
}

export default function BlogTab() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    image: "",
    content: "",
  });

  // Tải danh sách bài viết từ API
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách blog:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Xử lý upload ảnh qua Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Thêm mới hoặc Cập nhật bài viết
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/blog/${isEditing}` : "/api/blog";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          isEditing
            ? "Cập nhật bài viết thành công!"
            : "Thêm bài viết thành công!",
        );
        setFormData({ title: "", excerpt: "", image: "", content: "" });
        setIsEditing(null);
        fetchPosts();
      } else {
        alert(data.error || "Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // Đưa dữ liệu lên form để chỉnh sửa
  const handleEdit = (post: BlogPostItem) => {
    setIsEditing(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      content: post.content || "",
    });
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ title: "", excerpt: "", image: "", content: "" });
  };

  // Xóa bài viết
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Đã xóa bài viết thành công!");
        fetchPosts();
      } else {
        alert("Xóa thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-lg font-bold text-white">Quản lý Bài viết Blog</h2>
        <p className="text-xs text-neutral-400">
          Thêm, chỉnh sửa hoặc xóa các bài viết hiển thị trên portfolio.
        </p>
      </div>

      {/* Form Thêm / Sửa */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          {isEditing
            ? `Đang chỉnh sửa bài viết (ID: ${isEditing})`
            : "Thêm bài viết mới"}
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Tiêu đề bài viết (Title)
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ví dụ: Design is not just what it looks like"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Hình ảnh (Image URL hoặc Tải lên)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Dán link ảnh hoặc chọn file..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
            <label className="inline-flex items-center gap-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
              <Upload size={13} /> Tải lên
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Đoạn trích ngắn (Excerpt)
          </label>
          <textarea
            rows={2}
            required
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            placeholder="Nhập đoạn mô tả ngắn hiển thị bên ngoài..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <X size={14} /> Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEditing ? <Save size={15} /> : <Plus size={15} />}
            {loading
              ? "Đang xử lý..."
              : isEditing
                ? "Lưu thay đổi"
                : "Thêm bài viết"}
          </button>
        </div>
      </form>

      {/* Danh sách bài viết */}
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Danh sách bài viết ({posts.length})
        </h3>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-4">
              Chưa có bài viết nào được tạo.
            </p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-white tracking-wide truncate">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
