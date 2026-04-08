import { motion } from "motion/react";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";
import Logo from "./Logo";
import { useAppData } from "../hooks/useAppData";

export default function Footer() {
  const { data } = useAppData();
  const config = data?.config;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-kayolla-black pt-24 pb-12 text-white overflow-hidden">
      {config?.footer?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={config.footer.backgroundImage} 
            className="w-full h-full object-cover opacity-10"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kayolla-black via-kayolla-black/80 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2">
            <Logo className="mb-8 invert brightness-0" />
            <p className="text-white/60 text-lg max-w-md mb-8 leading-relaxed">
              {config?.footer?.description || "Your premier partner for comprehensive property management, real estate investment, and construction services in Kenya. We turn houses into homes and investments into wealth."}
            </p>
            <div className="flex gap-4">
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

          <div>
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
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-kayolla-red/20 focus:border-kayolla-red transition-all"
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

        <div className="pt-12 border-t border-white/10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Kayolla Homes Property Management. All rights reserved.
            </p>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold transition-all border border-white/10 group"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 text-center">
            Developed by Trace Technologies
          </p>
        </div>
      </div>
    </footer>
  );
}
