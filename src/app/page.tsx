import Header from "../components/layout/Header";
import Hero from "../components/sections/Hero";
import Aboutme from "../components/sections/Aboutme";
import Services from "../components/sections/MyServices";
import LatestProjects from "../components/sections/LatestProjects";
import Resume from "../components/sections/Resume";
import Testimonials from "../components/sections/Testimonials";
import Blog from "../components/sections/Blog";
import Contact from "../components/sections/Contact";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero /> {/* Nền đậm: bg-[#111] */}
        <Aboutme /> {/* Nền nhạt: bg-[#161616] */}
        <Services /> {/* Nền đậm: bg-[#111] */}
        <LatestProjects />
        {/* Nền nhạt: bg-[#161616] */}
        <Resume /> {/* Nền đậm: bg-[#111] */}
        <Testimonials /> {/* Nền nhạt: bg-[#161616] */}
        <Blog /> {/* Nền đậm: bg-[#111] */}
        <Contact /> {/* Nền nhạt: bg-[#161616] */}
      </main>
      <Footer /> {/* Nền đậm sâu: bg-[#0d0d0d] */}
    </>
  );
}
