export default function SurveyCTA() {
  return (
    <section data-aos="fade-up" data-aos-delay="200" className="w-full mt-16 md:mt-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden text-white rounded-[20px] p-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.15)] bg-gradient-to-br from-[#0f4c81] to-[#1976d2]">
          <div className="absolute right-[-70px] top-[-70px] w-[220px] h-[220px] bg-[hsla(0,0%,100%,.08)] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between relative z-10 w-full gap-8">
            <div className="w-full lg:w-2/3 flex justify-center lg:justify-start">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-6 text-center md:text-left">
                {/* PERBAIKAN: Wadah Lingkaran Putih Transparan (Sempurna di Tengah) */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Survei Icon" className="max-w-[40px] md:max-w-[50px] h-auto object-contain drop-shadow-sm" src="/images/assets/feedback.png" />
                </div>

                <div>
                  <h3 className="text-2xl md:text-[28px] font-bold tracking-wide mb-2">Bagaimana Pengalaman Anda?</h3>
                  <p className="text-white/95 text-sm md:text-[16px] leading-relaxed max-w-2xl">
                    Pendapat Anda sangat berarti bagi kami. Mari berpartisipasi dalam <strong className="font-bold">Survei Kepuasan Layanan Website Pemerintah</strong> untuk membantu meningkatkan kualitas pelayanan Pemerintah Kabupaten
                    Badung.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex justify-center lg:justify-end shrink-0">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0f4c81] hover:bg-[#ffce3a] hover:text-[#0b4a8f] font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95 text-sm md:text-[15px]"
                href="https://kabbadu.ng/survei-web-diskominfo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                </svg>{" "}
                Isi Survei
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
