import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Home, Building2 } from "lucide-react";
import { useAppData } from "../hooks/useAppData";

function renderHeroTitle(title: string) {
  const parts = title.split(/(\[.*?\])/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[(.*)\]$/);
    if (match) {
      return (
        <span key={`${part}-${index}`} className="text-kayolla-red italic">
          {match[1]}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function Hero() {
  const { data } = useAppData();
  const config = data?.config;

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden pt-20 bg-transparent">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={config?.hero?.backgroundImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
          alt="Modern Real Estate"
          className="w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kayolla-gray/85 via-kayolla-gray/55 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kayolla-red/10 text-kayolla-red rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <ShieldCheck size={14} />
              <span>Trusted Since 2010</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-kayolla-black leading-[1.1] mb-6">
              {config?.hero?.title ? (
                <>{renderHeroTitle(config.hero.title)}</>
              ) : (
                <>Elevating Your <br /><span className="text-kayolla-red italic">Property Experience</span></>
              )}
            </h1>
            
            <p className="text-lg text-kayolla-black/70 max-w-lg mb-10 leading-relaxed">
              {config?.hero?.subtitle || "Kayolla Homes is your premier partner for comprehensive property management, real estate investment, and construction services in Kenya."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-kayolla-red text-white rounded-full text-base font-bold hover:bg-kayolla-red/90 transition-all duration-300 shadow-xl shadow-kayolla-red/20 group"
                aria-label="Get started with Kayolla Homes"
              >
                <span>Get Started</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-kayolla-black border border-kayolla-black/10 rounded-full text-base font-bold hover:bg-kayolla-gray transition-all duration-300"
                aria-label="View our services"
              >
                <span>Our Services</span>
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-kayolla-black/5 pt-8 relative">
              {config?.hero?.statsBackgroundImage && (
                <div className="absolute inset-0 -z-10 rounded-[2rem] overflow-hidden">
                  <img
                    src={config.hero.statsBackgroundImage}
                    alt=""
                    className="w-full h-full object-cover opacity-12"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-kayolla-gray/70" />
                </div>
              )}
              <div>
                <p className="text-3xl font-serif font-bold text-kayolla-red">500+</p>
                <p className="text-xs text-kayolla-black/50 font-bold uppercase tracking-wider">Properties Managed</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-kayolla-red">15+</p>
                <p className="text-xs text-kayolla-black/50 font-bold uppercase tracking-wider">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-kayolla-red">98%</p>
                <p className="text-xs text-kayolla-black/50 font-bold uppercase tracking-wider">Client Satisfaction</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Home"
                className="w-full h-[600px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-2xl border border-kayolla-black/5 max-w-[240px]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-kayolla-red/10 rounded-full flex items-center justify-center text-kayolla-red">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-kayolla-black">Expert Management</p>
                  <p className="text-xs text-kayolla-black/50">Full-service care</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-kayolla-black/5 rounded-full flex items-center justify-center text-kayolla-black">
                  <Home size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-kayolla-black">Land & Sales</p>
                  <p className="text-xs text-kayolla-black/50">Prime opportunities</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
