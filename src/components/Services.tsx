import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { useAppData } from "../hooks/useAppData";

const defaultServices = [
  {
    title: "Rent Collection",
    description: "Efficient and timely rent collection systems ensuring consistent cash flow for property owners.",
    icon: "Wallet",
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Estate Commission Agents",
    description: "Professional representation for buying, selling, and leasing residential and commercial properties.",
    icon: "Users",
    color: "bg-red-50 text-kayolla-red"
  },
  {
    title: "Construction Services",
    description: "High-quality construction and renovation projects delivered on time and within budget.",
    icon: "Construction",
    color: "bg-amber-50 text-amber-600"
  },
  {
    title: "Financing Solutions",
    description: "Expert guidance on property financing and investment opportunities to grow your portfolio.",
    icon: "Landmark",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "Buying & Selling Land",
    description: "Prime land opportunities for development or investment with verified documentation.",
    icon: "TrendingUp",
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Property Management",
    description: "Full-service management including maintenance, tenant screening, and legal compliance.",
    icon: "Key",
    color: "bg-indigo-50 text-indigo-600"
  }
];

export default function Services() {
  const { data } = useAppData();
  const services = data?.config?.services?.length ? data.config.services : defaultServices;
  const config = data?.config;

  return (
    <section id="services" className="relative py-24 bg-white overflow-hidden">
      {/* Background Image Accent */}
      <div className="absolute inset-0 z-0">
        <img 
          src={config?.servicesSection?.backgroundImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
          className="w-full h-full object-cover opacity-5"
          alt=""
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-kayolla-red uppercase tracking-[0.3em] mb-4"
          >
            Our Expertise
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-kayolla-black mb-6"
          >
            Comprehensive <span className="italic">Real Estate Solutions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-kayolla-black/60"
          >
            From managing your daily operations to building your future investments, 
            we provide the expertise you need to succeed in the Kenyan property market.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Home;
            return (
              <motion.div
                key={service.title + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-8 bg-kayolla-gray rounded-3xl border border-transparent hover:border-kayolla-red/20 hover:bg-white hover:shadow-2xl hover:shadow-kayolla-red/5 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-kayolla-red/10 text-kayolla-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold text-kayolla-black mb-4 group-hover:text-kayolla-red transition-colors">
                  {service.title}
                </h3>
                <p className="text-kayolla-black/60 leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
