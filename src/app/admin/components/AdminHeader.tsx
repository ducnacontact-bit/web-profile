"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-neutral-800/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 bg-[#09090b]/85 backdrop-blur sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-neutral-300 hover:text-white rounded-lg bg-neutral-900/80 border border-neutral-800 hover:bg-neutral-800 cursor-pointer transition-colors shrink-0"
            aria-label="Mở menu điều hướng"
          >
            <Menu size={18} />
          </button>
        )}

        <div className="relative w-full max-w-xs sm:max-w-sm md:w-96">
          <Search
            size={15}
            className="absolute left-3 top-2.5 text-neutral-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-lg pl-9 pr-3 sm:pr-4 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          type="button"
          className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 cursor-pointer transition-colors"
          aria-label="Thông báo"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>
        <div className="hidden sm:block h-4 w-[1px] bg-neutral-800"></div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-neutral-300">
          <span className="hidden sm:inline">Admin Workspace</span>
          <span className="sm:hidden">Admin</span>
          <ChevronDown size={14} className="text-neutral-500" />
        </div>
      </div>
    </header>
  );
}
