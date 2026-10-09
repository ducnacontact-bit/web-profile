"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";

interface Service {
  id: number;
  title: string;
  iconName: string;
  shortDesc: string;
  fullDetail: string;
}

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Trạng thái form thêm mới hoặc chỉnh sửa
  const [isEditing, setIsEditing] = useState<number | null>(null); // null: thêm mới, số: ID đang sửa
  const [formData, setFormData] = useState({
    title: "",
    iconName: "Monitor",
    shortDesc: "",
    fullDetail: "",
  });

  // Danh sách icon hỗ trợ phổ biến từ Lucide
  const iconOptions = [
    "Monitor",
    "PenTool",
    "Paintbrush",
    "Camera",
    "Code",
    "Smartphone",
    "Globe",
    "Layers",
  ];

  // Tải danh sách dịch vụ từ API
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách dịch vụ:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Xử lý submit form (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/services/${isEditing}` : "/api/services";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(
          isEditing
            ? "Cập nhật dịch vụ thành công!"
            : "Thêm dịch vụ thành công!",
        );
        setFormData({
          title: "",
          iconName: "Monitor",
          shortDesc: "",
          fullDetail: "",
        });
        setIsEditing(null);
        fetchServices();
      } else {
        alert("Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // Chọn dịch vụ để sửa
  const handleEdit = (service: Service) => {
    setIsEditing(service.id);
    setFormData({
      title: service.title,
      iconName: service.iconName,
      shortDesc: service.shortDesc,
      fullDetail: service.fullDetail,
    });
  };

  // Hủy sửa
  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      title: "",
      iconName: "Monitor",
      shortDesc: "",
      fullDetail: "",
    });
  };

  // Xóa dịch vụ
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Đã xóa dịch vụ thành công!");
        fetchServices();
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
          Quản lý Dịch vụ (Services)
        </h2>
        <p className="text-xs text-neutral-400">
          Thêm, chỉnh sửa hoặc xóa các dịch vụ hiển thị trên trang chủ
          portfolio.
        </p>
      </div>

      {/* Form Thêm / Sửa Dịch Vụ */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          {isEditing
            ? `Chỉnh sửa dịch vụ (ID: ${isEditing})`
            : "Thêm dịch vụ mới"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Tiêu đề dịch vụ (Title)
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ví dụ: PRODUCT DESIGN"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Tên Icon (Lucide Icon)
            </label>
            <select
              value={formData.iconName}
              onChange={(e) =>
                setFormData({ ...formData, iconName: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Mô tả ngắn (Short Description)
          </label>
          <textarea
            rows={2}
            required
            value={formData.shortDesc}
            onChange={(e) =>
              setFormData({ ...formData, shortDesc: e.target.value })
            }
            placeholder="Nhập mô tả ngắn gọn hiển thị ngoài thẻ..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Chi tiết đầy đủ (Full Detail - hiển thị trong Modal)
          </label>
          <textarea
            rows={3}
            required
            value={formData.fullDetail}
            onChange={(e) =>
              setFormData({ ...formData, fullDetail: e.target.value })
            }
            placeholder="Nhập nội dung chi tiết đầy đủ..."
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
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-xl font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEditing ? <Save size={14} /> : <Plus size={14} />}
            {loading
              ? "Đang xử lý..."
              : isEditing
                ? "Lưu thay đổi"
                : "Thêm dịch vụ"}
          </button>
        </div>
      </form>

      {/* Danh sách dịch vụ hiện có */}
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Danh sách dịch vụ hiện tại ({services.length})
        </h3>

        <div className="space-y-3">
          {services.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-4">
              Chưa có dịch vụ nào được tạo.
            </p>
          ) : (
            services.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] rounded font-mono">
                      {item.iconName}
                    </span>
                    <h4 className="text-xs font-bold text-white tracking-wide truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {item.shortDesc}
                  </p>
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
