"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";

interface ResumeItem {
  id: number;
  type: string;
  time: string;
  title: string;
  desc: string;
  institution?: string | null;
  role?: string | null;
}

export default function ResumeTab() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    type: "education",
    time: "",
    title: "",
    desc: "",
    institution: "",
    role: "",
  });

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resume");
      const data = await res.json();
      if (Array.isArray(data)) {
        setResumes(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách Resume:", error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Thêm mới hoặc Cập nhật Resume
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/resume/${isEditing}` : "/api/resume";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mục thành công!");
        setFormData({
          type: "education",
          time: "",
          title: "",
          desc: "",
          institution: "",
          role: "",
        });
        setIsEditing(null);
        fetchResumes();
      } else {
        alert(data.error || "Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu Resume:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // Đưa dữ liệu lên form để sửa
  const handleEdit = (item: ResumeItem) => {
    setIsEditing(item.id);
    setFormData({
      type: item.type,
      time: item.time,
      title: item.title,
      desc: item.desc || "",
      institution: item.institution || "",
      role: item.role || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      type: "education",
      time: "",
      title: "",
      desc: "",
      institution: "",
      role: "",
    });
  };

  // Xóa mục Resume
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục này?")) return;

    try {
      const res = await fetch(`/api/resume/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Đã xóa thành công!");
        fetchResumes();
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
          Quản lý Học vấn & Kinh nghiệm (Resume)
        </h2>
        <p className="text-xs text-neutral-400">
          Thêm, chỉnh sửa hoặc xóa các mốc học tập và kinh nghiệm làm việc.
        </p>
      </div>

      {/* Form Thêm / Sửa */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          {isEditing
            ? `Đang chỉnh sửa mục (ID: ${isEditing})`
            : "Thêm mục mới vào Resume"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Phân loại (Type)
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="education">Học vấn (Education)</option>
              <option value="experience">Kinh nghiệm (Experience)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Thời gian (Time / Period)
            </label>
            <input
              type="text"
              required
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              placeholder="Ví dụ: March 2013 - Present"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Tiêu đề (Title / Tên công ty hoặc trường)
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ví dụ: University hoặc Behance"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          {formData.type === "education" ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">
                Tên bằng cấp / Chuyên ngành (Institution)
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="Ví dụ: Diploma in IT"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">
                Chức vụ (Role)
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="Ví dụ: Senior UI UX Designer"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Mô tả chi tiết (Description)
          </label>
          <textarea
            rows={3}
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Nhập mô tả..."
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
                : "Thêm vào Resume"}
          </button>
        </div>
      </form>

      {/* Danh sách hiện tại */}
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Danh sách Resume hiện tại ({resumes.length})
        </h3>

        <div className="space-y-3">
          {resumes.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-4">
              Chưa có mục nào được tạo.
            </p>
          ) : (
            resumes.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] rounded font-mono uppercase">
                      {item.type}
                    </span>
                    <h4 className="text-xs font-bold text-white tracking-wide truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {item.time} | {item.institution || item.role}
                  </p>
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
