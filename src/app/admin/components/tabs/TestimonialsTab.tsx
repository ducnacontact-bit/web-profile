"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, Upload } from "lucide-react";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
}

export default function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    content: "",
  });

  // Tải danh sách Testimonials từ API
  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách Testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
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

  // Thêm mới hoặc Cập nhật Testimonial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/testimonials/${isEditing}`
        : "/api/testimonials";
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
            ? "Cập nhật đánh giá thành công!"
            : "Thêm đánh giá thành công!",
        );
        setFormData({
          name: "",
          role: "",
          image: "",
          content: "",
        });
        setIsEditing(null);
        fetchTestimonials();
      } else {
        alert(data.error || "Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu Testimonial:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // Đưa dữ liệu lên form để chỉnh sửa
  const handleEdit = (item: TestimonialItem) => {
    setIsEditing(item.id);
    setFormData({
      name: item.name,
      role: item.role,
      image: item.image,
      content: item.content,
    });
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      name: "",
      role: "",
      image: "",
      content: "",
    });
  };

  // Xóa Testimonial
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Đã xóa thành công!");
        fetchTestimonials();
      } else {
        const data = await res.json();
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
        <h2 className="text-lg font-bold text-white">
          Quản lý Đánh giá Khách hàng (Testimonials)
        </h2>
        <p className="text-xs text-neutral-400">
          Thêm, chỉnh sửa hoặc xóa các nhận xét, đánh giá từ khách hàng hiển thị
          trên portfolio.
        </p>
      </div>

      {/* Form Thêm / Sửa */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          {isEditing
            ? `Đang chỉnh sửa đánh giá (ID: ${isEditing})`
            : "Thêm đánh giá mới"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Tên khách hàng (Name)
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ví dụ: Jeremy Mathiue"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Chức vụ / Công ty (Role)
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              placeholder="Ví dụ: CEO marveltheme"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Ảnh đại diện (Image URL hoặc Tải lên)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Dán link hoặc tải ảnh lên..."
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
            Nội dung đánh giá (Content)
          </label>
          <textarea
            rows={3}
            required
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Nhập nội dung nhận xét..."
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
                : "Thêm đánh giá"}
          </button>
        </div>
      </form>

      {/* Danh sách hiện tại */}
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Danh sách đánh giá ({testimonials.length})
        </h3>

        <div className="space-y-3">
          {testimonials.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-4">
              Chưa có đánh giá nào được tạo.
            </p>
          ) : (
            testimonials.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white tracking-wide truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400">
                        ({item.role})
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
