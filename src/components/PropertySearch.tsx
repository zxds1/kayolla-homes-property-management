import React, { useState } from "react";
import { Search, Sparkles, Loader2, Bed, Bath, Home as HomeIcon, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { searchProperties } from "../services/geminiService";
import { Property } from "../data/listings";

interface PropertySearchProps {
  listings: Property[];
  onResults: (results: Property[]) => void;
}

export default function PropertySearch({ listings, onResults }: PropertySearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [criteria, setCriteria] = useState({
    bedrooms: 0,
    bathrooms: 0,
    type: "All"
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const results = await searchProperties(query, listings, criteria);
      onResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative">
        <div className="bg-white rounded-full shadow-2xl border border-kayolla-black/5 p-1.5 flex items-center gap-2">
          <div className="flex-1 relative group flex items-center">
            <div className="pl-6 text-kayolla-black/30 group-focus-within:text-kayolla-red transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by location or style..."
              className="w-full pl-4 pr-4 py-4 bg-transparent border-none focus:outline-none text-base md:text-lg placeholder:text-kayolla-black/30 font-medium"
              aria-label="Describe your ideal home"
            />
          </div>

          <div className="flex items-center gap-1.5 pr-1.5">
            <button
              type="button"
              onClick={() => setShowCriteria(!showCriteria)}
              className={`p-4 rounded-full transition-all flex items-center gap-2 ${
                showCriteria 
                  ? "bg-kayolla-black text-white" 
                  : "bg-kayolla-gray text-kayolla-black/60 hover:bg-kayolla-black/5"
              }`}
              title="Filters"
            >
              <SlidersHorizontal size={20} />
              <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Filters</span>
            </button>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="p-4 bg-kayolla-red text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-kayolla-red/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-kayolla-red/20"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Search size={20} />
                  <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showCriteria && (
            <>
              {/* Backdrop for mobile */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCriteria(false)}
                className="fixed inset-0 bg-kayolla-black/20 backdrop-blur-sm z-40 md:hidden"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2.5rem] shadow-2xl border border-kayolla-black/5 p-8 z-50 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6 md:hidden">
                  <h3 className="text-lg font-serif font-bold">Search Filters</h3>
                  <button onClick={() => setShowCriteria(false)} className="p-2 bg-kayolla-gray rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">
                      <Bed size={14} className="text-kayolla-red" />
                      <span>Bedrooms</span>
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCriteria({ ...criteria, bedrooms: num })}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                            criteria.bedrooms === num ? "bg-kayolla-red text-white shadow-lg shadow-kayolla-red/20" : "bg-kayolla-gray hover:bg-kayolla-black/5"
                          }`}
                        >
                          {num === 0 ? "Any" : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">
                      <Bath size={14} className="text-kayolla-red" />
                      <span>Bathrooms</span>
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCriteria({ ...criteria, bathrooms: num })}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                            criteria.bathrooms === num ? "bg-kayolla-red text-white shadow-lg shadow-kayolla-red/20" : "bg-kayolla-gray hover:bg-kayolla-black/5"
                          }`}
                        >
                          {num === 0 ? "Any" : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">
                      <HomeIcon size={14} className="text-kayolla-red" />
                      <span>Property Type</span>
                    </label>
                    <div className="relative">
                      <select
                        value={criteria.type}
                        onChange={(e) => setCriteria({ ...criteria, type: e.target.value })}
                        className="w-full p-4 bg-kayolla-gray rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-kayolla-red appearance-none cursor-pointer"
                      >
                        {["All", "Apartment", "House", "Land", "Commercial", "Bedsitter", "Single Room", "One B", "2B", "Hostel"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-kayolla-black/30">
                        <SlidersHorizontal size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-kayolla-black/5 flex justify-end">
                  <button
                    onClick={() => setShowCriteria(false)}
                    className="px-8 py-3 bg-kayolla-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-kayolla-red transition-all"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-6 text-center text-[10px] text-kayolla-black/30 font-bold uppercase tracking-[0.3em]">
        AI-Powered Search & Filter System
      </p>
    </div>
  );
}
