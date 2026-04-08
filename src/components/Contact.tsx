import React, { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useAppData } from "../hooks/useAppData";

export default function Contact() {
  const { data } = useAppData();
  const config = data?.config;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Rent Collection",
    message: "",
    website: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    // Basic phone validation (Kenya format or general)
    if (formData.phone && !/^\+?[\d\s-]{9,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        message: formData.message.trim(),
        website: formData.website.trim(),
      }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      setIsSuccess(true);
      setFormData({ name: "", phone: "", service: "Rent Collection", message: "", website: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden bg-transparent" aria-labelledby="contact-heading">
      {config?.contact?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={config.contact.backgroundImage} 
            className="w-full h-full object-cover opacity-25"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-kayolla-black/15 via-transparent to-kayolla-black/10" />
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold text-kayolla-red uppercase tracking-[0.3em] mb-4">Contact Us</p>
            <h2 id="contact-heading" className="text-4xl md:text-5xl font-serif font-bold text-kayolla-black mb-8 leading-tight">
              {config?.contact?.title || "Let's Discuss Your Property Needs"}
            </h2>
            
            <p className="text-lg text-kayolla-black/60 mb-12 leading-relaxed">
              {config?.contact?.description || "Whether you're looking to manage your property, buy land, or start a construction project, our team is ready to assist you. Reach out to us today."}
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-kayolla-red/10 rounded-2xl flex items-center justify-center text-kayolla-red group-hover:bg-kayolla-red group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-kayolla-black/60 uppercase tracking-widest mb-1">Call Us</p>
                  <p className="text-xl font-serif font-bold text-kayolla-black">{config?.supportPhone || "0737 510 006"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-kayolla-black/5 rounded-2xl flex items-center justify-center text-kayolla-black group-hover:bg-kayolla-black group-hover:text-white transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-kayolla-black/60 uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-xl font-serif font-bold text-kayolla-black">{config?.supportEmail || "support@kayolla.com"}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-kayolla-black/5 rounded-2xl flex items-center justify-center text-kayolla-black group-hover:bg-kayolla-black group-hover:text-white transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-kayolla-black/60 uppercase tracking-widest mb-1">Our Office</p>
                  <p className="text-xl font-serif font-bold text-kayolla-black">{config?.location || "Mombasa, Kenya"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/28 backdrop-blur-sm p-10 rounded-[3rem] shadow-xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-kayolla-black/80 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-6 py-4 bg-white/35 backdrop-blur-sm border ${errors.name ? "border-kayolla-red" : "border-white/25"} rounded-2xl focus:outline-none focus:ring-2 focus:ring-kayolla-red/20 focus:border-kayolla-red transition-all`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-[10px] font-bold text-kayolla-red uppercase tracking-wider ml-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold text-kayolla-black/80 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0712 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-6 py-4 bg-white/35 backdrop-blur-sm border ${errors.phone ? "border-kayolla-red" : "border-white/25"} rounded-2xl focus:outline-none focus:ring-2 focus:ring-kayolla-red/20 focus:border-kayolla-red transition-all`}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="text-[10px] font-bold text-kayolla-red uppercase tracking-wider ml-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="service" className="text-xs font-bold text-kayolla-black/80 uppercase tracking-widest ml-1">Service Interested In</label>
                <div className="relative">
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-6 py-4 bg-white/35 backdrop-blur-sm border border-white/25 rounded-2xl focus:outline-none focus:ring-2 focus:ring-kayolla-red/20 focus:border-kayolla-red transition-all appearance-none"
                  >
                    <option>Rent Collection</option>
                    <option>Property Management</option>
                    <option>Construction</option>
                    <option>Buying & Selling Land</option>
                    <option>Estate Commission Agents</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-kayolla-black/30">
                    <Send size={14} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-kayolla-black/80 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-6 py-4 bg-white/35 backdrop-blur-sm border ${errors.message ? "border-kayolla-red" : "border-white/25"} rounded-2xl focus:outline-none focus:ring-2 focus:ring-kayolla-red/20 focus:border-kayolla-red transition-all`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && <p id="message-error" className="text-[10px] font-bold text-kayolla-red uppercase tracking-wider ml-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 px-8 py-5 ${isSuccess ? "bg-emerald-600" : "bg-kayolla-red"} text-white rounded-2xl text-base font-bold hover:opacity-90 transition-all duration-300 shadow-xl shadow-kayolla-red/20 group disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : isSuccess ? (
                  <span>Message Sent!</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
