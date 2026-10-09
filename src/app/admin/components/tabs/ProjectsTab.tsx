"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, Upload } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  span: string;
  desc: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State chứa danh mục từ DB
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    span: "col-span-1 row-span-1",
    desc: "",
  });

  const spanOptions = [
    { label: "1 ô vuông tiêu chuẩn (1x1)", value: "col-span-1 row-span-1" },
    { label: "Cao (1 rộng x 2 cao)", value: "col-span-1 row-span-2" },
    { label: "Rộng (2 rộng x 1 cao)", value: "col-span-2 row-span-1" },
  ];

  // 1. Gọi API lấy cả Dự án và Danh mục từ Database
  const fetchData = async () => {
    try {
      const [projRes, catRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/categories"), // Gọi API lấy danh mục từ DB của bạn
      ]);

      const projData = await projRes.json();
      const catData = await catRes.json();

      if (Array.isArray(projData)) {
        setProjects(projData);
      }

      if (Array.isArray(catData)) {
        setCategories(catData);
        // Nếu form chưa có category và lấy được danh mục từ DB, gán mặc định phần tử đầu tiên
        if (catData.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: catData[0].name }));
        }
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu từ server:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý upload ảnh dự án qua Base64
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/projects/${isEditing}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(
          isEditing ? "Cập nhật dự án thành công!" : "Thêm dự án thành công!",
        );
        setFormData({
          title: "",
          category: categories[0]?.name || "",
          image: "",
          span: "col-span-1 row-span-1",
          desc: "",
        });
        setIsEditing(null);
        fetchData();
      } else {
        alert("Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu dự án:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setIsEditing(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      image: project.image,
      span: project.span,
      desc: project.desc,
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      title: "",
      category: categories[0]?.name || "",
      image: "",
      span: "col-span-1 row-span-1",
      desc: "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Đã xóa dự án thành công!");
        fetchData();
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
        <h2 className="text-lg font-bold text-white">
          Quản lý Dự án (Projects)
        </h2>
        <p className="text-xs text-neutral-400">
          Thêm, chỉnh sửa hoặc xóa các dự án trong danh mục Portfolio.
        </p>
      </div>

      {/* Form Thêm / Sửa Dự Án */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          {isEditing ? `Chỉnh sửa dự án (ID: ${isEditing})` : "Thêm dự án mới"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Tên dự án (Title)
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ví dụ: Black Pineapple Art"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          {/* PHẦN CHỌN DANH MỤC LẤY TỪ DATABASE */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Danh mục (Category)
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white uppercase focus:outline-none focus:border-neutral-600"
            >
              {categories.length === 0 ? (
                <option value="">
                  Chưa có danh mục nào (Hãy thêm ở tab Quản lý danh mục)
                </option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Kích thước lưới hiển thị (Span)
            </label>
            <select
              value={formData.span}
              onChange={(e) =>
                setFormData({ ...formData, span: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            >
              {spanOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Đường dẫn Hình ảnh (Image URL hoặc Tải lên)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="Dán link hoặc chọn file..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
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
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Mô tả dự án (Description)
          </label>
          <textarea
            rows={3}
            required
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Nhập chi tiết mô tả dự án..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <X size={14} /> Hủy bỏ
            </button>
          )}
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-xl font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEditing ? <Save size={14} /> : <Plus size={14} />}
            {loading
              ? "Đang xử lý..."
              : isEditing
                ? "Lưu thay đổi"
                : "Thêm dự án"}
          </button>
        </div>
      </form>

      {/* Danh sách dự án hiện tại */}
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Danh sách dự án ({projects.length})
        </h3>

        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-4">
              Chưa có dự án nào được tạo.
            </p>
          ) : (
            projects.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] rounded font-mono uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-white tracking-wide truncate">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 size={15} />
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
