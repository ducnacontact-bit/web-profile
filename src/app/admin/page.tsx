"use client";

import { useState } from "react";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import AdminHeader from "@/app/admin/components/AdminHeader";

// Import các Tabs
import OverviewTab from "@/app/admin/components/tabs/OverviewTab";
import HeroTab from "@/app/admin/components/tabs/HeroTab";
import AboutTab from "@/app/admin/components/tabs/AboutTab";
import ResumeTab from "@/app/admin/components/tabs/ResumeTab";
import ServicesTab from "@/app/admin/components/tabs/ServicesTab";
import TestimonialsTab from "@/app/admin/components/tabs/TestimonialsTab";
import BlogsTab from "@/app/admin/components/tabs/BlogsTab";
import CategoriesTab from "@/app/admin/components/tabs/CategoriesTab";
import ProjectsTab from "@/app/admin/components/tabs/ProjectsTab";
import ContactTab from "@/app/admin/components/tabs/ContactTab";
import NavbarTab from "@/app/admin/components/tabs/NavbarTab";
import MessagesTab from "@/app/admin/components/tabs/MessagesTab";
import LogoTab from "@/app/admin/components/tabs/LogoTab";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock States dữ liệu (Bạn có thể thay thế bằng fetch API từ Backend / Database thực tế)
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Xây dựng ứng dụng Web với Next.js và Tailwind CSS",
      slug: "nextjs-tailwind-css",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
      excerpt:
        "Hướng dẫn chi tiết cách khởi tạo dự án chuẩn với Shadcn UI và Next.js.",
      content: "Nội dung bài viết chi tiết...",
      createdAt: "2026-06-01",
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Dashboard",
      description: "Hệ thống quản lý bán hàng đa kênh hiện đại.",
      category: "Fullstack",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Product Manager",
      company: "TechCorp",
      content: "Làm việc rất chuyên nghiệp và hoàn thành sản phẩm đúng hạn!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    },
  ]);

  const [resumes, setResumes] = useState([
    {
      id: 1,
      type: "experience",
      time: "2023 - Present",
      title: "Senior Frontend Developer",
      desc: "Phát triển giao diện web quy mô lớn sử dụng Next.js & TypeScript.",
    },
  ]);

  const [services, setServices] = useState([
    {
      id: 1,
      title: "Web Development",
      description: "Xây dựng website chuẩn SEO, tốc độ cao và responsive.",
    },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: "Frontend" },
    { id: 2, name: "Fullstack" },
    { id: 3, name: "UI/UX Design" },
  ]);

  const [navItems, setNavItems] = useState([
    { id: 1, label: "Home", href: "#home" },
    { id: 2, label: "About", href: "#about" },
    { id: 3, label: "Projects", href: "#projects" },
    { id: 4, label: "Contact", href: "#contact" },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      message: "Tôi muốn trao đổi về dự án phát triển phần mềm sắp tới.",
      createdAt: "2026-06-06 10:20",
    },
  ]);

  const [heroData, setHeroData] = useState({
    badge: "Available for Freelance Work",
    title: "Hi, I'm a Professional Developer",
    subtitle: "Building digital products and web experiences.",
    description:
      "Chuyên gia phát triển ứng dụng web với kinh nghiệm thực tế phong phú.",
  });

  const [aboutData, setAboutData] = useState({
    bio: "Tôi là một lập trình viên đam mê công nghệ và xây dựng các sản phẩm tối ưu trải nghiệm người dùng.",
    experienceYears: "5+",
    completedProjects: "40+",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
  });

  const [contactData, setContactData] = useState({
    email: "contact@portfolio.com",
    phone: "+84 123 456 789",
    address: "Hà Nội, Việt Nam",
    mapEmbedUrl: "https://google.com/maps/embed?...",
  });

  const [logoData, setLogoData] = useState({
    logoText: "Shadcn Portfolio",
    logoImageUrl: "",
  });

  // Hàm xóa dữ liệu mẫu
  const handleDeleteBlog = (id: number) =>
    setBlogs(blogs.filter((b) => b.id !== id));
  const handleDeleteProject = (id: number) =>
    setProjects(projects.filter((p) => p.id !== id));
  const handleDeleteTestimonial = (id: number) =>
    setTestimonials(testimonials.filter((t) => t.id !== id));
  const handleDeleteResume = (id: number) =>
    setResumes(resumes.filter((r) => r.id !== id));
  const handleDeleteService = (id: number) =>
    setServices(services.filter((s) => s.id !== id));
  const handleDeleteCategory = (id: number) =>
    setCategories(categories.filter((c) => c.id !== id));
  const handleDeleteNav = (id: number) =>
    setNavItems(navItems.filter((n) => n.id !== id));
  const handleDeleteMessage = (id: number) =>
    setMessages(messages.filter((m) => m.id !== id));

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex">
      {/* Sidebar điều hướng */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messageCount={messages.length}
      />

      {/* Khu vực nội dung chính bên phải */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === "overview" && (
            <OverviewTab
              projectsCount={projects.length}
              blogsCount={blogs.length}
              messagesCount={messages.length}
            />
          )}

          {activeTab === "hero" && (
            <HeroTab
              initialData={heroData}
              onSave={(data) => setHeroData(data)}
            />
          )}

          {activeTab === "about" && (
            <AboutTab
              initialData={aboutData}
              onSave={(data) => setAboutData(data)}
            />
          )}

          {activeTab === "resume" && (
            <ResumeTab
              resumes={resumes}
              onOpenModal={() => alert("Mở Modal Thêm Resume")}
              onDelete={handleDeleteResume}
            />
          )}

          {activeTab === "services" && (
            <ServicesTab
              services={services}
              onOpenModal={() => alert("Mở Modal Thêm Dịch Vụ")}
              onDelete={handleDeleteService}
            />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsTab
              testimonials={testimonials}
              onOpenModal={() => alert("Mở Modal Thêm Testimonial")}
              onDelete={handleDeleteTestimonial}
            />
          )}

          {activeTab === "blogs" && (
            <BlogsTab
              blogs={blogs}
              onOpenModal={() => alert("Mở Modal Thêm Bài Viết")}
              onDelete={handleDeleteBlog}
            />
          )}

          {activeTab === "categories" && (
            <CategoriesTab
              categories={categories}
              onOpenAddModal={() => alert("Mở Modal Thêm Danh Mục")}
              onOpenEditModal={(cat) => alert(`Sửa danh mục: ${cat.name}`)}
              onDelete={handleDeleteCategory}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsTab
              projects={projects}
              onOpenModal={() => alert("Mở Modal Thêm Dự Án")}
              onDelete={handleDeleteProject}
            />
          )}

          {activeTab === "contact" && (
            <ContactTab
              initialData={contactData}
              onSave={(data) => setContactData(data)}
            />
          )}

          {activeTab === "navbar" && (
            <NavbarTab
              navItems={navItems}
              onOpenModal={() => alert("Mở Modal Thêm Menu Navbar")}
              onDelete={handleDeleteNav}
            />
          )}

          {activeTab === "messages" && (
            <MessagesTab messages={messages} onDelete={handleDeleteMessage} />
          )}

          {activeTab === "logo" && (
            <LogoTab
              initialData={logoData}
              onSave={(data) => setLogoData(data)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
