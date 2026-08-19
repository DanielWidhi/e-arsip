"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Antrian Digital Online Kuta Selatan",
    url: "https://e-antreankutsel.badungkab.go.id/",
    img: "/images/services/adi oke fix.webp",
  },
  {
    title: "Facebook Kuta Selatan",
    url: "https://www.facebook.com/kutaselatan.kutaselatan",
    img: "/images/services/png-clipart-computer-icons-facebook-logo-square-rectangle-logo-thumbnail.webp",
  },
  {
    title: "Instagram Kuta Selatan",
    url: "https://www.instagram.com/kutaselatan.id/",
    img: "/images/services/instagram.webp",
  },
  {
    title: "Karang Taruna Kuta Selatan",
    url: "https://www.instagram.com/karangtarunakutaselatan/",
    img: "/images/services/LOGO KARANG TARUNA.webp",
  },
  {
    title: "PKK Kuta Selatan",
    url: "https://www.facebook.com/profile.php?id=100060823200456",
    img: "/images/services/LOGO-PKK-PNG.webp",
  },
  {
    title: "Youtube Kecamatan Kuta Selatan",
    url: "https://www.youtube.com/channel/UC8ICG6d25X9MIu0A5RGbZQA",
    img: "/images/services/New-YouTube-logo.webp",
  },
  {
    title: "SiKecak Kecamatan Kuta Selatan",
    url: "https://sikecak.badungkab.go.id/login",
    img: "/images/services/WhatsApp Image 2024-07-31 at 21.25.14.webp",
  },
  {
    title: "Kontak Bupati",
    url: "https://kontak-bupati.badungkab.go.id/tabs/home",
    img: "/images/services/images-20260622151239-3m786.webp",
  },
];

export default function ServicesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-slate-100 border-y border-slate-200 py-16 md:py-24 mt-16 px-6 md:px-12">
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-12 items-center xl:items-start">
        {/* Left Column */}
        <div data-aos="fade-right" className="xl:w-1/3 flex flex-col gap-4 text-center xl:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Layanan kami</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            Untuk menjaga kualitas pelayanan, kami Pemerintah Kabupaten Badung berkomitmen untuk selalu memberikan layanan terbaik
          </p>
          <div className="hidden xl:flex gap-3 mt-4">
            <button onClick={scrollLeft} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-white shadow-sm" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button onClick={scrollRight} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-white shadow-sm" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Column / Carousel */}
        <div data-aos="fade-left" data-aos-delay="100" className="xl:w-2/3 w-full relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-4 px-2"
          >
            {services.map((service, index) => (
              <a
                key={index}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-44 md:w-56 bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 snap-start group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300 p-2"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-slate-800 leading-tight">
                  {service.title}
                </h3>
              </a>
            ))}
          </div>

          {/* Mobile Arrows */}
          <div className="flex xl:hidden justify-center gap-4 mt-6">
            <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-white shadow-sm" aria-label="Previous">
              <ChevronLeft size={24} />
            </button>
            <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-white shadow-sm" aria-label="Next">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
