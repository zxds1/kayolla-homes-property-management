import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, Phone, Mail, User, Send, CheckCircle2, Loader2, Wallet } from "lucide-react";
import { Property } from "../data/listings";
import { useAppData } from "../hooks/useAppData";

interface ViewingSchedulerProps {
  property: Property;
  onClose: () => void;
}

export default function ViewingScheduler({ property, onClose }: ViewingSchedulerProps) {
  const { data } = useAppData();
  const viewingFee = data?.config?.viewingFee || 300;
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
    website: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/viewings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          fee: viewingFee,
          website: formData.website,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule viewing");
      }

      setStep("success");
    } catch (error) {
      console.error("Scheduling failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-kayolla-black/60 p-3 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheduler-title"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] bg-white shadow-2xl sm:rounded-[3rem]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-kayolla-gray p-2 transition-all hover:bg-kayolla-red hover:text-white sm:right-6 sm:top-6"
          aria-label="Close scheduler"
        >
          <X size={20} />
        </button>

        <div className="grid h-full md:grid-cols-5">
          {/* Left Sidebar - Property Info */}
          <div className="flex flex-col justify-between bg-kayolla-gray p-6 md:col-span-2 md:p-8">
            <div>
              <p className="text-xs font-bold text-kayolla-red uppercase tracking-[0.2em] mb-4">Schedule Viewing</p>
              <h3 id="scheduler-title" className="text-2xl font-serif font-bold text-kayolla-black mb-4 leading-tight">
                {property.title}
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-kayolla-black/60 text-sm">
                  <Calendar size={16} className="text-kayolla-red" />
                  <span>Choose your preferred date</span>
                </div>
                <div className="flex items-center gap-3 text-kayolla-black/60 text-sm">
                  <Clock size={16} className="text-kayolla-red" />
                  <span>Select a convenient time</span>
                </div>
              </div>

              <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-kayolla-black/5 mb-8">
                <div className="flex items-center gap-3 text-kayolla-black mb-1">
                  <Wallet size={16} className="text-kayolla-red" />
                  <span className="text-xs font-bold uppercase tracking-widest">Viewing Fee</span>
                </div>
                <p className="text-lg font-serif font-bold text-kayolla-black">KSh {viewingFee.toLocaleString()}</p>
                <p className="text-[10px] text-kayolla-black/40 font-medium">Payable at the time of viewing</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg hidden md:block">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-32 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:col-span-3 p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === "form" ? (
            <motion.form
              key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="view-date" className="text-[10px] font-bold text-kayolla-black/60 uppercase tracking-widest ml-1">Date</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-kayolla-black/30" />
                        <input
                          id="view-date"
                          required
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-kayolla-gray/50 border border-transparent rounded-xl focus:bg-white focus:border-kayolla-red focus:ring-2 focus:ring-kayolla-red/10 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="view-time" className="text-[10px] font-bold text-kayolla-black/60 uppercase tracking-widest ml-1">Time</label>
                      <div className="relative">
                        <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-kayolla-black/30" />
                        <input
                          id="view-time"
                          required
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-kayolla-gray/50 border border-transparent rounded-xl focus:bg-white focus:border-kayolla-red focus:ring-2 focus:ring-kayolla-red/10 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="view-name" className="text-[10px] font-bold text-kayolla-black/60 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-kayolla-black/30" />
                      <input
                        id="view-name"
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-kayolla-gray/50 border border-transparent rounded-xl focus:bg-white focus:border-kayolla-red focus:ring-2 focus:ring-kayolla-red/10 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="view-email" className="text-[10px] font-bold text-kayolla-black/60 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-kayolla-black/30" />
                        <input
                          id="view-email"
                          required
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-kayolla-gray/50 border border-transparent rounded-xl focus:bg-white focus:border-kayolla-red focus:ring-2 focus:ring-kayolla-red/10 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="view-phone" className="text-[10px] font-bold text-kayolla-black/60 uppercase tracking-widest ml-1">Phone</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-kayolla-black/30" />
                        <input
                          id="view-phone"
                          required
                          type="tel"
                          placeholder="0712 345 678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-kayolla-gray/50 border border-transparent rounded-xl focus:bg-white focus:border-kayolla-red focus:ring-2 focus:ring-kayolla-red/10 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="view-notes" className="text-[10px] font-bold text-kayolla-black/60 uppercase tracking-widest ml-1">Additional Notes</label>
                    <textarea
                      id="view-notes"
                      rows={2}
                      placeholder="Any specific requests?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-kayolla-gray/50 border border-transparent rounded-xl focus:bg-white focus:border-kayolla-red focus:ring-2 focus:ring-kayolla-red/10 transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-kayolla-red text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-kayolla-red/90 transition-all shadow-xl shadow-kayolla-red/20 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Scheduling...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Schedule</span>
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-kayolla-black mb-2">Viewing Scheduled!</h4>
                  <p className="text-kayolla-black/60 mb-8">
                    We've received your request. A confirmation email has been sent to {formData.email}. 
                    Our team will contact you shortly at {formData.phone} to finalize the details.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-kayolla-black text-white rounded-xl font-bold hover:bg-kayolla-red transition-all"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
