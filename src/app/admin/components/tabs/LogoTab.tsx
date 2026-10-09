"use client";

import { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";

export default function LogoTab() {
  const [darkUrl, setDarkUrl] = useState("/logo.png");
  const [lightUrl, setLightUrl] = useState("/logodark.png");
  const [height, setHeight] = useState("40");
  const [width, setWidth] = useState("auto"); // Cho phép nhập số (ví dụ: 120) hoặc chữ "auto"
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          if (data.logo_dark) setDarkUrl(data.logo_dark);
          if (data.logo_light) setLightUrl(data.logo_light);
          if (data.logo_height) setHeight(data.logo_height);
          if (data.logo_width) setWidth(data.logo_width);
        }
      })
      .catch((err) => console.error("Lỗi tải cấu hình logo:", err));
  }, []);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "dark" | "light",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === "dark") setDarkUrl(result);
        else setLightUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo_dark: darkUrl,
          logo_light: lightUrl,
          logo_height: height,
          logo_width: width,
        }),
      });

      if (res.ok) {
        setSuccessMsg("Đã lưu cấu hình logo thành công!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert("Lưu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-white">
          Quản lý Logo & Kích thước
        </h2>
        <p className="text-xs text-neutral-400">
          Tùy chỉnh logo cho chế độ Sáng/Tối và nhập kích thước pixel trực tiếp.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
          {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl"
      >
        {/* Logo Dark Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">
            Logo chế độ Tối (Dark Mode)
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-12 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center p-2 overflow-hidden">
              <img
                src={darkUrl}
                alt="Dark Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={darkUrl}
                onChange={(e) => setDarkUrl(e.target.value)}
                placeholder="Dán link ảnh hoặc tải lên từ máy..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                <Upload size={13} /> Tải ảnh từ máy
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "dark")}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Logo Light Mode */}
        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <label className="text-xs font-semibold text-neutral-300">
            Logo chế độ Sáng (Light Mode)
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-12 bg-neutral-200 border border-neutral-300 rounded-lg flex items-center justify-center p-2 overflow-hidden">
              <img
                src={lightUrl}
                alt="Light Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={lightUrl}
                onChange={(e) => setLightUrl(e.target.value)}
                placeholder="Dán link ảnh hoặc tải lên từ máy..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                <Upload size={13} /> Tải ảnh từ máy
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "light")}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Nhập tay Chiều cao & Chiều rộng */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Chiều cao (Height)
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ví dụ: 40"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 pr-10"
              />
              <span className="absolute right-3 text-xs text-neutral-500">
                px
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              Chiều rộng (Width)
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="auto hoặc số (vd: 120)"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 pr-10"
              />
              <span className="absolute right-3 text-xs text-neutral-500">
                px
              </span>
            </div>
          </div>
        </div>

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
