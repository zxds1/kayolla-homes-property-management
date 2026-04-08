import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import Logo from "./Logo";

export default function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-kayolla-black/70 px-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white p-6 text-center shadow-2xl sm:rounded-[2.5rem] sm:p-8"
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <div className="w-12 h-12 mx-auto rounded-full bg-kayolla-red/10 text-kayolla-red flex items-center justify-center mb-5">
          <Loader2 size={22} className="animate-spin" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-kayolla-black mb-2">{label}</h2>
        <p className="text-sm text-kayolla-black/60">Please wait while we fetch the latest content.</p>
      </motion.div>
    </div>
  );
}
