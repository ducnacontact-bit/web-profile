"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, ChevronRight } from "lucide-react";
import NavbarModal from "../modals/NavbarModal";

interface NavbarChild {
  id: number;
  title: string;
  url: string;
}

interface NavbarItem {
  id: number;
  title: string;
  url: string;
  parentId?: number | null;
  children?: NavbarChild[];
}

export default function NavbarTab() {
  const [navItems, setNavItems] = useState<NavbarItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);

  const fetchNavbars = async () => {
    try {
      const res = await fetch("/api/navbar");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNavItems(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách menu:", error);
    }
  };

  useEffect(() => {
    fetchNavbars();
  }, []);

  const handleSave = async (formData: {
    title: string;
    url: string;
    parentId: number | null;
  }) => {
    if (editingItem) {
      // Sửa
      const res = await fetch(`/api/navbar/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) fetchNavbars();
    } else {
      // Thêm mới
      const res = await fetch("/api/navbar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) fetchNavbars();
    }
    setEditingItem(null);
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa mục menu này? (Các menu con nếu có cũng sẽ bị ảnh hưởng)",
      )
    )
      return;

    const res = await fetch(`/api/navbar/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchNavbars();
    } else {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Quản lý Navbar Menu</h2>
          <p className="text-xs text-neutral-400">
            Tùy chỉnh các liên kết điều hướng trên thanh Header của trang web.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Thêm mục Menu
        </button>
      </div>

      <div className="bg-[#121215] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-neutral-800">
          {navItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              Chưa có mục menu nào được tạo.
            </div>
          ) : (
            navItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col gap-2 hover:bg-neutral-900/40 transition-colors"
              >
                {/* Menu gốc */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                      {item.url}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800/60 rounded-lg transition-colors cursor-pointer"
                      title="Sửa"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Các menu con trực thuộc (nếu có) */}
                {item.children && item.children.length > 0 && (
                  <div className="pl-6 mt-2 space-y-1.5 border-l-2 border-neutral-800">
                    {item.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between bg-neutral-900/60 px-3 py-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <ChevronRight
                            size={13}
                            className="text-neutral-500"
                          />
                          <span className="font-semibold text-neutral-200">
                            {child.title}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            ({child.url})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItem({
                                id: child.id,
                                title: child.title,
                                url: child.url,
                                parentId: item.id,
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="p-1 text-red-400 hover:text-white cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <NavbarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        parentOptions={navItems.map((i) => ({ id: i.id, title: i.title }))}
        initialData={editingItem}
      />
    </div>
  );
}
