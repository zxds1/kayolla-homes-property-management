import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { useAppData } from "../hooks/useAppData";

const testimonials = [
  {
    name: "Sarah J. Mwangi",
    role: "Property Owner",
    quote: "Kayolla Homes has been managing my apartments in Nyali for 5 years. Their rent collection is flawless and their maintenance team is top-notch.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "David Omondi",
    role: "Real Estate Investor",
    quote: "I bought my first two plots through Kayolla. The documentation was handled professionally, and they even helped me with the initial construction phase.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Fatima Ali",
    role: "Home Buyer",
    quote: "Finding a home in Mombasa can be stressful, but the team at Kayolla made it easy. They understood exactly what I needed and found the perfect villa for my family.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  }
];

export default function Testimonials() {
  const { data } = useAppData();
  const config = data?.config;

  return (
    <section id="testimonials" className="relative overflow-hidden bg-transparent py-16 sm:py-24">
      {config?.testimonials?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={config.testimonials.backgroundImage}
            className="w-full h-full object-cover opacity-25"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-kayolla-black/15 via-transparent to-kayolla-black/10" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-kayolla-red uppercase tracking-[0.3em] mb-4"
          >
            Client Feedback
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-5 text-3xl font-serif font-bold text-kayolla-black sm:text-4xl md:text-5xl"
          >
            What Our <span className="italic">Clients Say</span>
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative rounded-[2rem] border border-white/20 bg-white/28 p-6 backdrop-blur-sm transition-all duration-300 hover:border-kayolla-red/20 hover:bg-white/38 hover:shadow-2xl sm:rounded-[3rem] sm:p-10"
            >
              <div className="absolute top-8 right-8 text-kayolla-red/10">
                <Quote size={64} />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-kayolla-red text-kayolla-red" />
                ))}
              </div>

              <p className="text-kayolla-black/70 italic leading-relaxed mb-8 relative z-10">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/60 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif font-bold text-kayolla-black">{testimonial.name}</h4>
                  <p className="text-xs text-kayolla-black/50 font-bold uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
