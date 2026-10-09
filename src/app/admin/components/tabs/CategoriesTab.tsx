"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function CategoryTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [name, setName] = useState("");

  // 1. GET: Lấy danh sách danh mục từ database
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Lỗi dữ liệu trả về:", data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. POST (Thêm mới) hoặc PUT (Cập nhật) danh mục
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/categories/${isEditing}`
        : "/api/categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          isEditing
            ? "Cập nhật danh mục thành công!"
            : "Thêm danh mục thành công!",
        );
        setName("");
        setIsEditing(null);
        fetchCategories(); // Tải lại danh sách sau khi thay đổi
      } else {
        alert(data.error || "Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Chuẩn bị chỉnh sửa danh mục
  const handleEdit = (category: Category) => {
    setIsEditing(category.id);
    setName(category.name);
  };

  // 4. Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(null);
    setName("");
  };

  // 5. DELETE: Xóa danh mục theo ID
  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa danh mục này? Việc này có thể ảnh hưởng đến các dự án thuộc danh mục này.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Xóa danh mục thành công!");
        fetchCategories(); // Tải lại danh sách sau khi xóa
      } else {
        alert(data.error || "Xóa thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-lg font-bold text-white">Quản lý Danh mục Dự án</h2>
        <p className="text-xs text-neutral-400">
          Thêm, sửa, xóa các danh mục trong cơ sở dữ liệu để liên kết và phân
          loại cho các dự án portfolio.
        </p>
      </div>

      {/* Form Thêm mới / Cập nhật danh mục */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          {isEditing
            ? `Đang chỉnh sửa danh mục (ID: ${isEditing})`
            : "Thêm danh mục mới"}
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Tên danh mục (Category Name)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên danh mục (Ví dụ: WEB DESIGN, GRAPHIC...)"
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-neutral-600"
            />

            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <X size={14} /> Hủy
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isEditing ? <Save size={14} /> : <Plus size={14} />}
              {loading
                ? "Đang xử lý..."
                : isEditing
                  ? "Lưu thay đổi"
                  : "Thêm danh mục"}
            </button>
          </div>
        </div>
      </form>

      {/* Danh sách danh mục từ Database */}
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Danh sách danh mục hiện tại ({categories.length})
        </h3>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-6">
              Chưa có danh mục nào trong cơ sở dữ liệu. Hãy thêm mới ở form phía
              trên.
            </p>
          ) : (
            categories.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-1 rounded">
                    ID: {item.id}
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Chỉnh sửa danh mục"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Xóa danh mục"
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
