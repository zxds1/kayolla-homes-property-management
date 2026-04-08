import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Listings from "./components/Listings";
import Testimonials from "./components/Testimonials";
import OfficeMap from "./components/OfficeMap";
import AdminPanel from "./components/AdminPanel";
import Chatbot from "./components/Chatbot";
import StartupScreen from "./components/StartupScreen";
import LoadingScreen from "./components/LoadingScreen";
import { motion, AnimatePresence } from "motion/react";
import { Settings } from "lucide-react";
import { useAppData } from "./hooks/useAppData";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [bootReady, setBootReady] = useState(false);
  const { data } = useAppData();

  useEffect(() => {
    if (data?.config?.fonts) {
      const { sans, serif } = data.config.fonts;
      
      // Update CSS variables
      document.documentElement.style.setProperty('--font-sans', `"${sans}", ui-sans-serif, system-ui, sans-serif`);
      document.documentElement.style.setProperty('--font-serif', `"${serif}", ui-serif, Georgia, serif`);

      // Load fonts from Google Fonts
      const fontFamilies = [sans, serif].filter(Boolean).map(f => f.replace(/\s+/g, '+'));
      const linkId = 'google-fonts-link';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies.join('&family=')}:wght@300;400;500;600;700&display=swap`;
    }
  }, [data]);

  useEffect(() => {
    const timer = window.setTimeout(() => setBootReady(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!bootReady ? (
        <StartupScreen />
      ) : showAdmin ? (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-kayolla-white selection:bg-kayolla-red selection:text-white"
        >
          <Navbar />
          <main>
            <Hero />
            
            {/* Trust Bar */}
            <div className="relative bg-kayolla-black py-12 overflow-hidden border-y border-white/5">
              {data?.config?.trustBar?.backgroundImage && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={data.config.trustBar.backgroundImage}
                    alt=""
                    className="w-full h-full object-cover opacity-35"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-kayolla-black/75 via-kayolla-black/55 to-kayolla-black/75" />
                </div>
              )}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center gap-2 text-white font-serif text-2xl font-bold italic">
                    <span>Neema Sacco</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-serif text-2xl font-bold">
                    <span>Chama Cha Wenye Nyumba</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-serif text-2xl font-bold italic">
                    <span>Estate Agents</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-serif text-2xl font-bold">
                    <span>Kenya Real Estate</span>
                  </div>
                </div>
              </div>
            </div>

            <Services />
            <Listings />
            
            {/* Call to Action Section */}
            <section className="relative py-20 bg-kayolla-red overflow-hidden">
              {data?.config?.cta?.backgroundImage && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={data.config.cta.backgroundImage}
                    alt=""
                    className="w-full h-full object-cover opacity-38"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-kayolla-red/70 via-kayolla-red/55 to-kayolla-red/75" />
                </div>
              )}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight"
                >
                  Ready to <span className="italic">Transform</span> Your <br />
                  Property Investment?
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row justify-center gap-6"
                >
                  <a
                    href="#contact"
                    className="px-10 py-5 bg-white text-kayolla-red rounded-full text-lg font-bold hover:bg-kayolla-gray transition-all shadow-2xl shadow-black/20"
                  >
                    Contact Our Experts
                  </a>
                  <a
                    href="tel:0737510006"
                    className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full text-lg font-bold hover:bg-white/10 transition-all"
                  >
                    Call 0737 510 006
                  </a>
                </motion.div>
              </div>
            </section>

            <About />
            <Testimonials />
            <OfficeMap />
            <Contact />
          </main>
          <Footer />
          <Chatbot />

          {/* Admin Toggle Button (Hidden/Floating) */}
          <button 
            onClick={() => setShowAdmin(true)}
            className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-kayolla-black text-white shadow-2xl transition-all hover:bg-kayolla-red sm:bottom-8 sm:right-8 group"
          >
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
          {data ? null : <LoadingScreen label="Syncing site data" />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
