"use client";

import { useState, useEffect } from "react";

interface AboutData {
  image: string;
  paragraph1: string;
  paragraph2: string;
  hireMeUrl: string;
  cvUrl: string;
}

interface SkillData {
  id: number;
  name: string;
  percentage: number;
  category: string;
}

export default function AboutTab() {
  const [about, setAbout] = useState<AboutData>({
    image: "",
    paragraph1: "",
    paragraph2: "",
    hireMeUrl: "",
    cvUrl: "",
  });

  const [skills, setSkills] = useState<SkillData[]>([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    percentage: "",
    category: "frontend",
  });

  const [loading, setLoading] = useState(false);

  // 1. Tải dữ liệu About và Skills khi vào trang Admin
  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setAbout(data);
        }
      })
      .catch((err) => console.error("Lỗi tải thông tin About:", err));

    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSkills(data);
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách Skills:", err));
  }, []);

  // Hàm hỗ trợ chuyển đổi file tải lên thành Base64
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "cvUrl",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAbout((prev) => ({
        ...prev,
        [field]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // 2. Xử lý lưu thông tin About Section
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });

      if (res.ok) {
        alert("Cập nhật phần About thành công!");
      } else {
        alert("Có lỗi xảy ra khi cập nhật About.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý thêm Skill mới
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name || !newSkill.percentage) return;

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });

      if (res.ok) {
        const createdSkill = await res.json();
        setSkills([...skills, createdSkill]);
        setNewSkill({ name: "", percentage: "", category: "frontend" });
        alert("Thêm kỹ năng thành công!");
      } else {
        alert("Không thể thêm kỹ năng.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm kỹ năng:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  // 4. Xử lý xóa Skill
  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa kỹ năng này không?")) return;

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSkills(skills.filter((skill) => skill.id !== id));
        alert("Đã xóa kỹ năng thành công!");
      } else {
        alert("Không thể xóa kỹ năng.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa kỹ năng:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      {/* Header tiêu đề */}
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight">
          Quản lý Phần About & Skills
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Tùy chỉnh ảnh đại diện, tệp CV, đoạn văn giới thiệu và danh sách các
          kỹ năng chuyên môn.
        </p>
      </div>

      {/* Khung chứa form (Card style) */}
      <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 shadow-sm space-y-8">
        {/* Form chỉnh sửa thông tin About */}
        <form onSubmit={handleSaveAbout} className="space-y-6">
          <h2 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase border-b border-neutral-800 pb-3">
            Nội dung giới thiệu (About Section)
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Phần tải lên Ảnh đại diện */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Ảnh đại diện (Image)
              </label>
              <div className="flex items-center gap-4 bg-[#18181b] border border-neutral-800 rounded-lg p-4">
                {about.image ? (
                  <img
                    src={about.image}
                    alt="Preview"
                    className="w-16 h-20 object-cover rounded border border-neutral-700"
                  />
                ) : (
                  <div className="w-16 h-20 bg-neutral-800 rounded flex items-center justify-center text-[10px] text-neutral-500">
                    No Image
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={about.image || ""}
                    onChange={(e) =>
                      setAbout({ ...about, image: e.target.value })
                    }
                    placeholder="Dán link ảnh hoặc tải lên bên dưới"
                    className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                  <div>
                    <label className="inline-flex items-center px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded cursor-pointer transition-colors text-white">
                      <span>↑ Tải ảnh lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "image")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Đoạn văn thứ nhất (Paragraph 1)
              </label>
              <textarea
                rows={3}
                value={about.paragraph1 || ""}
                onChange={(e) =>
                  setAbout({ ...about, paragraph1: e.target.value })
                }
                className="w-full bg-[#18181b] border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600 transition-colors resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Đoạn văn thứ hai (Paragraph 2)
              </label>
              <textarea
                rows={3}
                value={about.paragraph2 || ""}
                onChange={(e) =>
                  setAbout({ ...about, paragraph2: e.target.value })
                }
                className="w-full bg-[#18181b] border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600 transition-colors resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Link nút Hire Me
                </label>
                <input
                  type="text"
                  value={about.hireMeUrl || ""}
                  onChange={(e) =>
                    setAbout({ ...about, hireMeUrl: e.target.value })
                  }
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600 transition-colors"
                />
              </div>

              {/* Phần tải lên CV */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Tệp CV hoặc Link tải CV (CV URL)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={about.cvUrl || ""}
                    onChange={(e) =>
                      setAbout({ ...about, cvUrl: e.target.value })
                    }
                    placeholder="/cv.pdf hoặc tải file lên"
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                  <div>
                    <label className="inline-flex items-center px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded cursor-pointer transition-colors text-white">
                      <span>↑ Tải file CV lên</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, "cvUrl")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-xs hover:bg-neutral-200 transition-all disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi About"}
            </button>
          </div>
        </form>

        {/* Phần Quản lý Skills */}
        <div className="pt-6 border-t border-neutral-800 space-y-6">
          <h2 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">
            Quản lý kỹ năng (My Skills)
          </h2>

          {/* Form thêm kỹ năng */}
          <form
            onSubmit={handleAddSkill}
            className="flex flex-wrap gap-4 items-end bg-[#18181b] p-4 rounded-xl border border-neutral-800"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Tên kỹ năng
              </label>
              <input
                type="text"
                placeholder="VD: ReactJS"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                className="w-full bg-[#121212] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Phần trăm (%)
              </label>
              <input
                type="number"
                placeholder="90"
                value={newSkill.percentage}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, percentage: e.target.value })
                }
                className="w-full bg-[#121212] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              />
            </div>

            {/* Ô nhập Category bổ sung bắt buộc khớp với database */}
            <div className="w-40">
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Phân loại (Category)
              </label>
              <input
                type="text"
                placeholder="VD: frontend"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
                className="w-full bg-[#121212] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-neutral-200 text-black font-semibold px-4 py-2 rounded-lg text-xs hover:bg-white transition-all h-[34px]"
              >
                + Thêm kỹ năng
              </button>
            </div>
          </form>

          {/* Danh sách các kỹ năng */}
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3.5 bg-[#18181b] border border-neutral-800 rounded-lg text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-neutral-400 font-mono">
                    ({skill.percentage}%) - [{skill.category}]
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-red-400 hover:text-red-300 font-medium transition-colors px-2 py-1"
                >
                  Xóa
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-neutral-500 italic">
                Chưa có kỹ năng nào được thêm.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
