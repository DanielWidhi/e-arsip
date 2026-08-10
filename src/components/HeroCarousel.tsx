"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    // Pastikan path gambar Anda sudah benar di dalam folder public
    image: "/images/hero/HeroBanner1.jpg",
    title: "Sistem Aset Terintegrasi Efektif Akuntabel Transparan",
    subtitle: "KANTOR CAMAT KUTA SELATAN",
  },
  {
    id: 2,
    // Jika tidak punya gambar kedua, gunakan gambar pertama lagi tidak apa-apa
    image: "/images/hero/HeroBanner2.jpg",
    title: "Transparan, Cepat, dan Akurat",
    subtitle: "PENCATATAN ASET DAERAH KIB B",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    // PERBAIKAN DI SINI: Mengembalikan h-[50vh] dan min-h-[400px] menggunakan kurung siku
    <div className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] bg-slate-900 overflow-hidden group">
      {slides.map((slide, index) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${slide.image}')` }} />
          {/* Overlay Gelap agar teks putih terbaca */}
          <div className="absolute inset-0 bg-slate-900/60" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 mt-[-20px]">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 md:mb-5 drop-shadow-lg leading-tight max-w-4xl">{slide.title}</h1>
            <p className="text-slate-200 text-sm md:text-xl font-semibold tracking-widest uppercase drop-shadow-md">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20 hidden md:block"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20 hidden md:block"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
