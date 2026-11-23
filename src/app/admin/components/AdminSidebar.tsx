"use client";

import {
  LayoutDashboard,
  Sparkles,
  User,
  Briefcase,
  Layers,
  MessageSquareQuote,
  BookOpen,
  Tag,
  FolderKanban,
  PhoneCall,
  Menu,
  Mail,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messageCount: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  messageCount,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const navItemsList = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "hero", label: "Quản lý Hero Section", icon: Sparkles },
    { id: "about", label: "Quản lý About & Skills", icon: User },
    { id: "resume", label: "Quản lý Resume", icon: Briefcase },
    { id: "services", label: "Quản lý Services", icon: Layers },
    {
      id: "testimonials",
      label: "Quản lý Testimonials",
      icon: MessageSquareQuote,
    },
    { id: "blogs", label: "Quản lý Blogs", icon: BookOpen },
    { id: "categories", label: "Quản lý Danh mục Dự án", icon: Tag },
    { id: "projects", label: "Quản lý Dự án", icon: FolderKanban },
    { id: "contact", label: "Quản lý Contact", icon: PhoneCall },
    { id: "navbar", label: "Quản lý Navbar & Menu", icon: Menu },
  ];

  const systemItemsList = [
    { id: "messages", label: "Tin nhắn", icon: Mail, badge: messageCount },
    { id: "logo", label: "Cấu hình Logo", icon: ImageIcon },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <aside className="w-72 max-w-[85vw] md:w-64 md:max-w-none shrink-0 border-r border-neutral-800/80 bg-[#09090b] flex flex-col justify-between select-none h-full overflow-y-auto">
      <div>
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-neutral-800/80 gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-500 flex items-center justify-center text-black font-bold text-xs shrink-0">
              S
            </div>
            <span className="font-semibold text-sm tracking-wide text-white truncate">
              Shadcn UI Portfolio
            </span>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Đóng menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-3 sm:px-4 py-5 sm:py-6 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase mb-2">
              Dashboards
            </p>
            <nav className="space-y-1">
              {navItemsList.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all text-left ${
                      isActive
                        ? "bg-neutral-800 text-white font-semibold"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase mb-2">
              Hệ thống
            </p>
            <nav className="space-y-1">
              {systemItemsList.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all text-left ${
                      isActive
                        ? "bg-neutral-800 text-white font-semibold"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-amber-500 text-black font-bold text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-2">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-800/80 shrink-0">
        <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-white shrink-0">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">
              Administrator
            </p>
            <p className="text-[10px] text-neutral-500 truncate">
              admin@portfolio.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex md:shrink-0">{sidebarContent}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
