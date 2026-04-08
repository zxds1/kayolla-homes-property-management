import { motion } from "motion/react";
import { CheckCircle2, Award, Users2 } from "lucide-react";
import { useAppData } from "../hooks/useAppData";

export default function About() {
  const { data } = useAppData();
  const config = data?.config;

  return (
    <section id="about" className="relative py-24 bg-kayolla-gray overflow-hidden">
      {config?.about?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={config.about.backgroundImage} 
            className="w-full h-full object-cover opacity-10"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-kayolla-gray via-transparent to-kayolla-gray" />
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src={config?.about?.image || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                alt="Our Office"
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Experience Card */}
            <div className="absolute -bottom-10 -right-10 z-20 bg-kayolla-red p-10 rounded-[2rem] shadow-2xl text-white max-w-[280px]">
              <p className="text-5xl font-serif font-bold mb-2">15+</p>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Years of Excellence in Real Estate</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold text-kayolla-red uppercase tracking-[0.3em] mb-4">About Kayolla Homes</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-kayolla-black mb-8 leading-tight">
              {config?.about?.title || "Building Trust Through Professional Excellence"}
            </h2>
            
            <p className="text-lg text-kayolla-black/60 mb-8 leading-relaxed">
              {config?.about?.description || "Kayolla Homes Property Management is a leading real estate agency dedicated to providing seamless property solutions. We pride ourselves on our integrity, transparency, and commitment to our clients' success."}
            </p>

            <div className="space-y-6 mb-10">
              {[
                "Associated with Neema Co-operative Sacco (Chama Cha Wenye Nyumba)",
                "Expert team of certified estate commission agents",
                "Proven track record in construction and land development",
                "Transparent and reliable rent collection systems"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 bg-kayolla-red/10 rounded-full flex items-center justify-center text-kayolla-red flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-kayolla-black/80 font-medium">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-kayolla-black/5">
                <Award className="text-kayolla-red mb-4" size={32} />
                <h4 className="font-serif font-bold text-lg mb-1">Certified</h4>
                <p className="text-xs text-kayolla-black/50">Licensed real estate agency</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-kayolla-black/5">
                <Users2 className="text-kayolla-red mb-4" size={32} />
                <h4 className="font-serif font-bold text-lg mb-1">Community</h4>
                <p className="text-xs text-kayolla-black/50">Strong local partnerships</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
