import { motion } from "motion/react";
import Logo from "./Logo";

export default function StartupScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-kayolla-gray px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-kayolla-black/5 bg-white p-6 text-center shadow-2xl sm:rounded-[3rem] sm:p-8 md:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-kayolla-red via-kayolla-black to-kayolla-red" />
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-kayolla-red mb-3">
          Kayolla Homes
        </p>
        <h1 className="font-serif font-bold text-3xl text-kayolla-black leading-tight mb-3">
          Loading your property experience
        </h1>
        <p className="text-sm text-kayolla-black/60 leading-relaxed mb-8">
          Preparing listings, admin controls, and the latest site content.
        </p>

        <div className="w-full h-2 bg-kayolla-black/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-30%" }}
            animate={{ x: "130%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-full rounded-full bg-gradient-to-r from-kayolla-red via-kayolla-black to-kayolla-red"
          />
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-kayolla-black/35">
          <span className="w-1.5 h-1.5 rounded-full bg-kayolla-red animate-pulse" />
          <span>Starting up</span>
        </div>
      </div>
    </div>
  );
}
