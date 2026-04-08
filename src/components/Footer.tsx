import { motion } from "motion/react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo";
import { useAppData } from "../hooks/useAppData";

export default function Footer() {
  const { data } = useAppData();
  const config = data?.config;

  return (
    <footer className="relative overflow-hidden bg-kayolla-black pt-16 pb-12 text-white sm:pt-24">
      {config?.footer?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={config.footer.backgroundImage} 
            className="w-full h-full object-cover opacity-20"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kayolla-black via-kayolla-black/70 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid gap-10 lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-2">
            <Logo className="mb-8 invert brightness-0" />
            <p className="text-white/60 text-lg max-w-md mb-8 leading-relaxed">
              {config?.footer?.description || "Your premier partner for comprehensive property management, real estate investment, and construction services in Kenya. We turn houses into homes and investments into wealth."}
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { Icon: Facebook, href: config?.socialLinks.facebook || "https://facebook.com/kayollahomes", label: "Facebook" },
                { Icon: Twitter, href: config?.socialLinks.twitter || "https://twitter.com/kayollahomes", label: "Twitter" },
                { Icon: Instagram, href: config?.socialLinks.instagram || "https://instagram.com/kayollahomes", label: "Instagram" },
                { Icon: Linkedin, href: "https://linkedin.com/company/kayollahomes", label: "LinkedIn" }
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-kayolla-red hover:text-white transition-all duration-300 border border-white/10"
                  aria-label={`Follow us on ${label}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative">
            {config?.footer?.linksBackgroundImage && (
            <div className="absolute inset-0 -z-10 rounded-[2rem] overflow-hidden">
                <img
                  src={config.footer.linksBackgroundImage}
                  alt=""
                  className="w-full h-full object-cover opacity-22"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-kayolla-black/65" />
              </div>
            )}
            <h4 className="text-lg font-serif font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "Services", "About", "Contact", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-white/60 hover:text-kayolla-red transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-kayolla-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-8">Newsletter</h4>
            <p className="text-white/60 text-sm mb-6">
              Subscribe to get the latest property news and investment opportunities.
            </p>
            <form className="relative" aria-label="Newsletter subscription">
              <input
                type="email"
                placeholder="Your email address"
              className="w-full px-6 py-4 bg-white/12 backdrop-blur-sm border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-kayolla-red/20 focus:border-kayolla-red transition-all"
                aria-label="Email address for newsletter"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 bg-kayolla-red text-white rounded-xl text-sm font-bold hover:bg-kayolla-red/90 transition-all"
                aria-label="Subscribe to newsletter"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-12 md:flex-row">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Kayolla Homes Property Management. All rights reserved.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center group">
            <span className="text-white/40">Developed by</span>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all border border-slate-200">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#000" strokeWidth="2" />
                  <circle cx="50" cy="30" r="8" fill="#000" />
                  <circle cx="30" cy="65" r="8" fill="#000" />
                  <circle cx="70" cy="65" r="8" fill="#000" />
                  <path d="M50 30 L30 65 M50 30 L70 65 M30 65 L70 65" stroke="#000" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-slate-900 font-black tracking-tighter text-xs">TRACE</span>
                <span className="text-[6px] text-slate-700 uppercase tracking-[0.2em]">Technologies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
