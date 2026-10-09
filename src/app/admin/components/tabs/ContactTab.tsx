"use client";

import { useState, useEffect } from "react";
import { Save, Mail, Trash2, Phone, MapPin } from "lucide-react";

interface ContactConfig {
  address: string;
  email: string;
  phone: string;
  mapUrl?: string;
}

interface MessageItem {
  id: number;
  name: string;
  email: string;
  budget?: string;
  message: string;
  createdAt: string;
}

export default function ContactTab() {
  const [config, setConfig] = useState<ContactConfig>({
    address: "",
    email: "",
    phone: "",
    mapUrl: "",
  });

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // 1. Tải cấu hình Contact hiện tại
  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      const info = data.data || data;
      if (info) {
        setConfig({
          address: info.address || "",
          email: info.email || "",
          phone: info.phone || "",
          mapUrl: info.mapUrl || "",
        });
      }
    } catch (error) {
      console.error("Lỗi tải cấu hình contact:", error);
    }
  };

  // 2. Tải danh sách tin nhắn khách hàng gửi (Messages)
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách tin nhắn:", error);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchMessages();
  }, []);

  // Lưu cấu hình Contact
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingConfig(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Cập nhật thông tin liên hệ thành công!");
      } else {
        alert(data.error || "Lưu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoadingConfig(false);
    }
  };

  // Xóa tin nhắn
  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;

    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Đã xóa tin nhắn thành công!");
        fetchMessages();
      } else {
        alert("Xóa thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa tin nhắn:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-lg font-bold text-white">
          Quản lý Liên hệ & Tin nhắn (Contact)
        </h2>
        <p className="text-xs text-neutral-400">
          Cập nhật thông tin liên hệ hiển thị ngoài portfolio và xem danh sách
          tin nhắn từ khách hàng.
        </p>
      </div>

      {/* Form Cập nhật thông tin liên hệ */}
      <form
        onSubmit={handleSaveConfig}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Cấu hình Thông tin liên hệ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Phone size={13} /> Số điện thoại (Phone)
            </label>
            <input
              type="text"
              required
              value={config.phone}
              onChange={(e) => setConfig({ ...config, phone: e.target.value })}
              placeholder="Nhập số điện thoại..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Mail size={13} /> Email liên hệ
            </label>
            <input
              type="text"
              required
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              placeholder="Nhập email..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <MapPin size={13} /> Địa chỉ (Address)
          </label>
          <textarea
            rows={2}
            required
            value={config.address}
            onChange={(e) => setConfig({ ...config, address: e.target.value })}
            placeholder="Nhập địa chỉ..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loadingConfig}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save size={15} /> {loadingConfig ? "Đang lưu..." : "Lưu cấu hình"}
          </button>
        </div>
      </form>

      {/* Danh sách Tin nhắn khách hàng gửi */}
      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Danh sách tin nhắn từ khách hàng ({messages.length})
        </h3>

        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-6">
              Chưa có tin nhắn nào từ khách hàng.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4"
              >
                <div className="space-y-1.5 overflow-hidden flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {msg.name}
                    </h4>
                    <span className="text-[11px] text-sky-400 font-mono">
                      {msg.email}
                    </span>
                    {msg.budget && (
                      <span className="text-[10px] bg-neutral-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        Ngân sách: {msg.budget}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-800/60">
                    {msg.message}
                  </p>
                  <span className="text-[10px] text-neutral-500 block">
                    Thời gian: {new Date(msg.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  title="Xóa tin nhắn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
