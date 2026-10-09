import { Mail, Trash2, CheckCircle2 } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

interface MessagesTabProps {
  messages: Message[];
  onDelete: (id: number) => void;
}

export default function MessagesTab({ messages, onDelete }: MessagesTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          Hòm thư Liên hệ (Messages)
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Danh sách tin nhắn được gửi từ biểu mẫu liên hệ của khách hàng ghé
          thăm website.
        </p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-8 bg-[#121215] border border-neutral-800 rounded-xl">
            Chưa có tin nhắn nào được gửi đến.
          </p>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="bg-[#121215] border border-neutral-800/80 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 mt-0.5">
                  <Mail size={18} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-white">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      ({item.email})
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/50">
                    {item.message}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {item.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onDelete(item.id)}
                  className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
