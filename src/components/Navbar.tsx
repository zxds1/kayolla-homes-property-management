import { motion, AnimatePresence } from "motion/react";
import { Phone, Menu, X, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useAppData } from "../hooks/useAppData";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Navbar() {
  const { data } = useAppData();
  const config = data?.config;
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallNudge, setShowInstallNudge] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const timeout = window.setTimeout(() => setShowInstallNudge(false), 12000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.clearTimeout(timeout);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      window.alert("Install is available from your browser menu if the prompt has already been dismissed.");
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallNudge(false);
  };

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-kayolla-white/80 backdrop-blur-md border-b border-kayolla-black/5" role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 relative">
          {/* Logo - Centered on Mobile, Left on Desktop */}
          <div className="flex-shrink-0 md:static absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0">
            <Logo />
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-kayolla-black/80 hover:text-kayolla-red transition-colors duration-200"
                >
                  {link.name}
                </a>
            ))}
            <button
              type="button"
              onClick={handleInstallClick}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
                showInstallNudge
                  ? "bg-kayolla-black text-white shadow-kayolla-black/20 animate-pulse"
                  : "bg-kayolla-gray text-kayolla-black hover:bg-kayolla-black hover:text-white"
              }`}
              aria-label="Install the app"
            >
              <Download size={16} />
              <span>Download App</span>
            </button>
            <a
              href={`tel:${config?.supportPhone || "0737510006"}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-kayolla-red text-white rounded-full text-sm font-semibold hover:bg-kayolla-red/90 transition-all duration-300 shadow-lg shadow-kayolla-red/20"
              aria-label={`Call us at ${config?.supportPhone || "0737 510 006"}`}
            >
              <Phone size={16} />
              <span>{config?.supportPhone || "0737 510 006"}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-kayolla-black p-2 focus:outline-none focus:ring-2 focus:ring-kayolla-red rounded-lg"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-kayolla-white border-b border-kayolla-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-kayolla-black/80 hover:text-kayolla-red border-b border-kayolla-black/5 last:border-0"
                >
                  {link.name}
                </a>
              ))}
              <button
                type="button"
                onClick={handleInstallClick}
                className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-kayolla-black text-white rounded-xl text-base font-semibold"
              >
                <Download size={18} />
                <span>Download App</span>
              </button>
              <div className="pt-4">
                <a
                  href={`tel:${config?.supportPhone || "0737510006"}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-kayolla-red text-white rounded-xl text-base font-semibold"
                >
                  <Phone size={18} />
                  <span>Call Now: {config?.supportPhone || "0737 510 006"}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
