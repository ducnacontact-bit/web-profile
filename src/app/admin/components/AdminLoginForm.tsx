"use client";

import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, LogIn } from "lucide-react";

interface AdminLoginFormProps {
  onSuccess: (email: string) => void;
}

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Đăng nhập thất bại.");
        return;
      }
      onSuccess(data?.user?.email || email);
    } catch {
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#121215] border border-neutral-800 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
            <Lock size={20} />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Đăng nhập Admin Workspace
          </h1>
          <p className="text-xs text-neutral-400">
            Nhập thông tin quản trị viên để truy cập bảng điều khiển.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-neutral-300 block">
              Email quản trị
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ducngx.online"
                className="w-full min-w-0 bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-neutral-300 block">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-w-0 bg-neutral-900 border border-neutral-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                aria-label="Hiện/ẩn mật khẩu"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl cursor-pointer disabled:opacity-50"
          >
            <LogIn size={16} />
            {submitting ? "Đang xác thực..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
