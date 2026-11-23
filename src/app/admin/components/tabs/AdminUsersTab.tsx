"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserPlus,
  ShieldCheck,
  ShieldOff,
  Trash2,
  KeyRound,
  RefreshCw,
} from "lucide-react";

interface AdminAccountItem {
  id: number;
  email: string;
  name: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export default function AdminUsersTab() {
  const [users, setUsers] = useState<AdminAccountItem[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [creating, setCreating] = useState(false);

  const [resettingId, setResettingId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setUsers(Array.isArray(data.users) ? data.users : []);
        setCurrentEmail(data.currentEmail || "");
      } else {
        setNotice({ type: "error", text: data.error || "Lỗi tải tài khoản." });
      }
    } catch {
      setNotice({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: "error", text: data.error || "Tạo thất bại." });
        return;
      }
      setEmail("");
      setName("");
      setPassword("");
      setIsActive(true);
      setNotice({
        type: "success",
        text: `Đã lưu tài khoản ${data.user.email} vào database.`,
      });
      await loadUsers();
    } catch {
      setNotice({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (user: AdminAccountItem) => {
    setNotice(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: "error", text: data.error || "Cập nhật thất bại." });
        return;
      }
      setNotice({
        type: "success",
        text: `Đã ${data.user.isActive ? "mở khóa" : "khóa"} ${user.email}.`,
      });
      await loadUsers();
    } catch {
      setNotice({ type: "error", text: "Lỗi kết nối máy chủ." });
    }
  };

  const handleResetPass = async (id: number) => {
    setNotice(null);
    if (newPassword.length < 6) {
      setNotice({ type: "error", text: "Mật khẩu mới tối thiểu 6 ký tự." });
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          type: "error",
          text: data.error || "Đổi mật khẩu thất bại.",
        });
        return;
      }
      setResettingId(null);
      setNewPassword("");
      setNotice({
        type: "success",
        text: `Đã đổi mật khẩu cho ${data.user.email}.`,
      });
    } catch {
      setNotice({ type: "error", text: "Lỗi kết nối máy chủ." });
    }
  };

  const handleDelete = async (user: AdminAccountItem) => {
    setNotice(null);
    if (!confirm(`Xóa tài khoản ${user.email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: "error", text: data.error || "Xóa thất bại." });
        return;
      }
      setNotice({ type: "success", text: `Đã xóa ${user.email}.` });
      await loadUsers();
    } catch {
      setNotice({ type: "error", text: "Lỗi kết nối máy chủ." });
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Kiểm soát Tài khoản & Đăng nhập Admin
          </h2>
          <p className="text-xs text-neutral-400">
            Tạo tài khoản lưu trực tiếp vào database và kiểm soát trạng thái
            truy cập.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 cursor-pointer"
        >
          <RefreshCw size={13} /> Tải lại
        </button>
      </div>

      {notice && (
        <div
          className={`rounded-xl px-4 py-3 text-xs border ${
            notice.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {notice.text}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-[#121215] border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl min-w-0"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <UserPlus size={16} className="text-amber-400 shrink-0" />
          <span>Tạo tài khoản Admin mới (Lưu vào DB)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-neutral-300 block">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin2@ducngx.online"
              className="w-full min-w-0 bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-neutral-300 block">
              Tên hiển thị
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Quản trị viên phụ"
              className="w-full min-w-0 bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-neutral-300 block">
              Mật khẩu (tối thiểu 6 ký tự) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full min-w-0 bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <label className="inline-flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-neutral-700 bg-neutral-900"
            />
            Kích hoạt ngay
          </label>

          <button
            type="submit"
            disabled={creating}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
          >
            <UserPlus size={14} />
            {creating ? "Đang lưu..." : "Lưu vào DB"}
          </button>
        </div>
      </form>

      <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-white">
            Danh sách tài khoản trong DB ({users.length})
          </h3>
          {currentEmail && (
            <span className="text-[11px] text-neutral-400 truncate">
              Đang dùng:{" "}
              <strong className="text-neutral-200">{currentEmail}</strong>
            </span>
          )}
        </div>

        {loading ? (
          <p className="text-xs text-neutral-400 py-4">Đang tải...</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-neutral-400 py-4">
            Chưa có tài khoản trong DB. Hãy tạo tài khoản mới ở form trên.
          </p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => {
              const isSelf =
                currentEmail.toLowerCase() === user.email.toLowerCase();
              return (
                <div
                  key={user.id}
                  className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3.5 sm:p-4 space-y-3 min-w-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-semibold text-white break-all">
                          {user.email}
                        </span>
                        {user.name && (
                          <span className="text-[11px] text-neutral-400">
                            ({user.name})
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            user.isActive
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {user.isActive ? "Hoạt động" : "Đã khóa"}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Phiên hiện tại
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Đăng nhập gần nhất:{" "}
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                          : "Chưa đăng nhập"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 cursor-pointer"
                      >
                        {user.isActive ? (
                          <>
                            <ShieldOff size={13} className="text-amber-400" />
                            <span>Khóa</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck
                              size={13}
                              className="text-emerald-400"
                            />
                            <span>Mở khóa</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResettingId(
                            resettingId === user.id ? null : user.id,
                          );
                          setNewPassword("");
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 cursor-pointer"
                      >
                        <KeyRound size={13} className="text-sky-400" />
                        <span>Đổi mật khẩu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={isSelf}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={13} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>

                  {resettingId === user.id && (
                    <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                        className="flex-1 min-w-0 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleResetPass(user.id)}
                        className="px-3.5 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold cursor-pointer shrink-0"
                      >
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
