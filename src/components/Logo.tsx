import { motion } from "motion/react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* The Roof */}
        <motion.div 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Outer Roof */}
            <path 
              d="M10 50 L50 10 L90 50" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="6" 
              className="text-kayolla-red"
            />
            {/* Inner Roof Line */}
            <path 
              d="M20 55 L50 25 L80 55" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="text-kayolla-black"
            />
          </svg>
        </motion.div>
        
        {/* The R */}
        <div className="absolute top-4 flex items-center justify-center w-full h-full">
           <span className="font-serif text-2xl font-bold text-kayolla-black italic transform -translate-y-1">R</span>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-serif text-xl font-bold tracking-tight text-kayolla-red">KAYOLLA</span>
        <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-kayolla-black">HOMES</span>
      </div>
    </div>
  );
}
