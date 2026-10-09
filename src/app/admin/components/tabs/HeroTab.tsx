"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Plus, Trash2 } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

export default function HeroTab() {
  const [greeting, setGreeting] = useState("Hello,");
  const [roles, setRoles] = useState("Electrical Engineer,Developer,Creator");
  const [description, setDescription] = useState("");
  const [darkBgUrl, setDarkBgUrl] = useState("");
  const [lightBgUrl, setLightBgUrl] = useState("");
  const [socials, setSocials] = useState<SocialLink[]>([]);

  const [loading, setLoading] = useState(false);

  // Tải dữ liệu Hero từ API khi vào trang Admin
  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setGreeting(data.greeting || "Hello,");
          setRoles(data.roles || "");
          setDescription(data.description || "");
          setDarkBgUrl(data.darkBgUrl || "");
          setLightBgUrl(data.lightBgUrl || "");

          try {
            const parsedSocials =
              typeof data.socials === "string"
                ? JSON.parse(data.socials)
                : data.socials || [];
            setSocials(parsedSocials);
          } catch (e) {
            setSocials([]);
          }
        }
      })
      .catch((err) => console.error("Lỗi tải cấu hình Hero:", err));
  }, []);

  // Xử lý upload ảnh nền từ máy tính (chuyển sang Base64)
  const handleBgUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "dark" | "light",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === "dark") setDarkBgUrl(result);
        else setLightBgUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Thêm mạng xã hội mới
  const addSocial = () => {
    setSocials([...socials, { platform: "GitHub", url: "" }]);
  };

  // Cập nhật mạng xã hội
  const updateSocial = (
    index: number,
    field: keyof SocialLink,
    value: string,
  ) => {
    const updated = [...socials];
    updated[index][field] = value;
    setSocials(updated);
  };

  // Xóa mạng xã hội
  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  // Lưu cấu hình
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          greeting,
          roles,
          description,
          darkBgUrl,
          lightBgUrl,
          socials: JSON.stringify(socials), // Gửi lên dưới dạng chuỗi JSON
        }),
      });

      if (res.ok) {
        alert("Đã lưu cấu hình Hero thành công!");
      } else {
        alert("Lưu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-lg font-bold text-white">
          Quản lý Phần Hero (Trang chủ)
        </h2>
        <p className="text-xs text-neutral-400">
          Tùy chỉnh lời chào, hiệu ứng chữ chạy, mô tả, ảnh nền và các liên kết
          mạng xã hội.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl w-full"
      >
        {/* Lời chào & Vai trò */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Lời chào (Greeting)
            </label>
            <input
              type="text"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Ví dụ: Hello,"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Các vai trò (Ngăn cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              placeholder="Ví dụ: Electrical Engineer,Developer,Creator"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Mô tả ngắn (Description)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập giới thiệu ngắn gọn..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
          />
        </div>

        {/* Ảnh nền Dark/Light Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
          {/* Dark Background */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Ảnh nền chế độ Tối
            </label>
            <div className="h-24 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center p-2 overflow-hidden mb-2">
              {darkBgUrl ? (
                <img
                  src={darkBgUrl}
                  alt="Dark BG"
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <span className="text-[10px] text-neutral-500">
                  Chưa có ảnh nền
                </span>
              )}
            </div>
            <input
              type="text"
              value={darkBgUrl}
              onChange={(e) => setDarkBgUrl(e.target.value)}
              placeholder="Dán link ảnh hoặc tải lên..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white mb-2"
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
              <Upload size={13} /> Tải ảnh lên
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBgUpload(e, "dark")}
                className="hidden"
              />
            </label>
          </div>

          {/* Light Background */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Ảnh nền chế độ Sáng
            </label>
            <div className="h-24 bg-neutral-200 border border-neutral-300 rounded-lg flex items-center justify-center p-2 overflow-hidden mb-2">
              {lightBgUrl ? (
                <img
                  src={lightBgUrl}
                  alt="Light BG"
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <span className="text-[10px] text-neutral-500">
                  Chưa có ảnh nền
                </span>
              )}
            </div>
            <input
              type="text"
              value={lightBgUrl}
              onChange={(e) => setLightBgUrl(e.target.value)}
              placeholder="Dán link ảnh hoặc tải lên..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white mb-2"
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
              <Upload size={13} /> Tải ảnh lên
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBgUpload(e, "light")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Quản lý Mạng xã hội (Socials) */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300">
              Liên kết Mạng xã hội
            </label>
            <button
              type="button"
              onClick={addSocial}
              className="flex items-center gap-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={13} /> Thêm mạng xã hội
            </button>
          </div>

          {socials.map((social, index) => (
            <div key={index} className="flex items-center gap-3">
              <select
                value={social.platform}
                onChange={(e) =>
                  updateSocial(index, "platform", e.target.value)
                }
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="GitHub">GitHub</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">Twitter / X</option>
              </select>

              <input
                type="text"
                value={social.url}
                onChange={(e) => updateSocial(index, "url", e.target.value)}
                placeholder="Nhập đường dẫn URL..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              />

              <button
                type="button"
                onClick={() => removeSocial(index)}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Nút lưu */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save size={15} /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
