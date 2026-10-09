import { Search, Bell, ChevronDown } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="h-16 border-b border-neutral-800/80 px-8 flex items-center justify-between bg-[#09090b]/85 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search
            size={15}
            className="absolute left-3 top-2.5 text-neutral-500"
          />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 cursor-pointer transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>
        <div className="h-4 w-[1px] bg-neutral-800"></div>
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
          <span>Admin Workspace</span>
          <ChevronDown size={14} className="text-neutral-500" />
        </div>
      </div>
    </header>
  );
}
