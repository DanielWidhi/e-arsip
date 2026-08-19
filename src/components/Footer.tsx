// src/components/Footer.tsx
import Link from "next/link";

// Custom SVG for Facebook
const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// Custom SVG for Instagram
const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Custom SVG for Youtube
const YoutubeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

// Custom SVG for X (Twitter)
const XIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// Custom SVG for TikTok
const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const socialLinks = [
  {
    name: "Facebook",
    icon: <FacebookIcon size={22} />,
    href: "#",
    text: "Pemerintah\nKabupaten\nBadung",
    hoverBg: "group-hover:bg-[#ffd1d7]",
    hoverText: "group-hover:text-[#4b3869]",
    iconColor: "text-slate-600",
  },
  {
    name: "X (Twitter)",
    icon: <XIcon size={20} />,
    href: "#",
    text: "Pemerintah\nKabupaten\nBadung",
    hoverBg: "group-hover:bg-slate-200",
    hoverText: "group-hover:text-black",
    iconColor: "text-slate-600",
  },
  {
    name: "Instagram",
    icon: <InstagramIcon size={22} />,
    href: "#",
    text: "Pemerintah\nKabupaten\nBadung",
    hoverBg: "group-hover:bg-[#ffe5ec]",
    hoverText: "group-hover:text-[#e1306c]",
    iconColor: "text-slate-600",
  },
  {
    name: "Youtube",
    icon: <YoutubeIcon size={22} />,
    href: "#",
    text: "Pemerintah\nKabupaten\nBadung",
    hoverBg: "group-hover:bg-[#ffdfdf]",
    hoverText: "group-hover:text-[#ff0000]",
    iconColor: "text-slate-600",
  },
  {
    name: "TikTok",
    icon: <TikTokIcon size={20} />,
    href: "#",
    text: "Pemerintah\nKabupaten\nBadung",
    hoverBg: "group-hover:bg-slate-200",
    hoverText: "group-hover:text-black",
    iconColor: "text-slate-600",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 py-8 px-6 md:px-12 w-full mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-center gap-8">

        <div className="flex flex-col gap-2 items-center xl:items-start text-sm text-center xl:text-left">
          <div>© 2026 SATE - Kantor Camat Kuta Selatan. All rights reserved.</div>
          <div className="flex flex-wrap justify-center xl:justify-start gap-4 mt-2">
            <Link href="#" className="hover:text-blue-700 transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-blue-700 transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-blue-700 transition-colors">Kontak Kami</Link>
          </div>
        </div>

        {/* Social Media Expanding Icons */}
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              className={`group flex items-center bg-white border border-slate-200 rounded-[20px] p-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-transparent shadow-sm hover:shadow-md ${social.iconColor} ${social.hoverBg} ${social.hoverText}`}
              title={social.name}
            >
              <div className="flex items-center justify-center w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-110">
                {social.icon}
              </div>
              <div className="w-0 overflow-hidden opacity-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-[84px] group-hover:opacity-100">
                <div className="text-[11px] leading-[1.15] font-semibold whitespace-normal pl-1 pr-2">
                  {social.text.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </footer>
  );
}
