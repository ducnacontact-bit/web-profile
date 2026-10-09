interface OverviewTabProps {
  projectsCount: number;
  blogsCount: number;
  messagesCount: number;
}

export default function OverviewTab({
  projectsCount,
  blogsCount,
  messagesCount,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Chào mừng bạn trở lại bảng điều khiển quản trị portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121215] border border-neutral-800/80 p-5 rounded-xl">
          <p className="text-xs font-medium text-neutral-400">Tổng số Dự án</p>
          <h3 className="text-2xl font-bold mt-2 text-white">
            {projectsCount}
          </h3>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
            +12.5% từ tháng trước
          </span>
        </div>
        <div className="bg-[#121215] border border-neutral-800/80 p-5 rounded-xl">
          <p className="text-xs font-medium text-neutral-400">Bài viết Blog</p>
          <h3 className="text-2xl font-bold mt-2 text-white">{blogsCount}</h3>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
            Bài viết đã đăng
          </span>
        </div>
        <div className="bg-[#121215] border border-neutral-800/80 p-5 rounded-xl">
          <p className="text-xs font-medium text-neutral-400">
            Tin nhắn liên hệ
          </p>
          <h3 className="text-2xl font-bold mt-2 text-white">
            {messagesCount}
          </h3>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
            Đang hoạt động tốt
          </span>
        </div>
        <div className="bg-[#121215] border border-neutral-800/80 p-5 rounded-xl">
          <p className="text-xs font-medium text-neutral-400">
            Trạng thái hệ thống
          </p>
          <h3 className="text-2xl font-bold mt-2 text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
            Online
          </h3>
          <span className="text-[11px] text-neutral-400 font-medium mt-1 inline-block">
            Phiên bản v2.5 Stable
          </span>
        </div>
      </div>
    </div>
  );
}
