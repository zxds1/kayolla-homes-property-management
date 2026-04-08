import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Home, Building2, TrendingUp, Landmark, Filter, SearchX, ExternalLink, School, Hospital, ShoppingBag, Plus, Check, LayoutGrid, Map as MapIcon, Grid, ChevronDown, SlidersHorizontal, Bed, Bath, DollarSign, Star } from "lucide-react";
import { Property } from "../data/listings";
import PropertySearch from "./PropertySearch";
import PropertyComparison from "./PropertyComparison";
import ViewingScheduler from "./ViewingScheduler";
import PropertyMap from "./PropertyMap";
import PropertyDetails from "./PropertyDetails";
import { useAppData } from "../hooks/useAppData";

export default function Listings() {
  const { data, loading } = useAppData();
  const config = data?.config;
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedForComparison, setSelectedForComparison] = useState<Property[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [schedulingProperty, setSchedulingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedPriceLocation, setSelectedPriceLocation] = useState<string>("");

  useEffect(() => {
    if (config?.locationPriceGuides?.length) {
      setSelectedPriceLocation(config.locationPriceGuides[0].location);
    }
  }, [config]);

  // Granular Filters
  const [filters, setFilters] = useState({
    bedrooms: 0,
    bathrooms: 0,
    minPrice: 0,
    maxPrice: 50000000,
  });

  const propertyTypes = useMemo(() => {
    const configured = config?.propertyTypeFilters?.filter((item) => item && item.trim().toLowerCase() !== "all") ?? [
      "Apartment",
      "House",
      "Land",
      "Commercial",
      "Bedsitter",
      "Single Room",
      "One B",
      "2B",
      "Hostel",
    ];
    return ["All", ...Array.from(new Set(configured))];
  }, [config]);

  const [searchResults, setSearchResults] = useState<Property[] | null>(null);

  const togglePropertyFilter = (type: string) => {
    setActiveFilters((current) => {
      if (type === "All") return ["All"];
      const withoutAll = current.filter((item) => item !== "All");
      if (withoutAll.includes(type)) {
        const next = withoutAll.filter((item) => item !== type);
        return next.length > 0 ? next : ["All"];
      }
      return [...withoutAll, type];
    });
  };

  const filteredListings = useMemo(() => {
    if (!data) return [];
    const source = searchResults || data.listings;
    let results = source.filter(p => {
      const matchesType = activeFilters.includes("All") || activeFilters.includes(p.type);
      const matchesBedrooms = filters.bedrooms === 0 || (p.bedrooms && p.bedrooms >= filters.bedrooms);
      const matchesBathrooms = filters.bathrooms === 0 || (p.bathrooms && p.bathrooms >= filters.bathrooms);
      const matchesPrice = p.priceValue >= filters.minPrice && p.priceValue <= filters.maxPrice;
      return matchesType && matchesBedrooms && matchesBathrooms && matchesPrice;
    });

    // Sorting
    results = [...results].sort((a, b) => {
      if (sortBy === "price-asc") return a.priceValue - b.priceValue;
      if (sortBy === "price-desc") return b.priceValue - a.priceValue;
      if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
      if (sortBy === "newest") return parseInt(b.id) - parseInt(a.id); // Assuming higher ID is newer
      return 0;
    });

    return results;
  }, [activeFilters, filters, sortBy, data]);

  if (loading) return (
    <div className="py-24 bg-kayolla-gray flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kayolla-red"></div>
    </div>
  );

  const handleSearchResults = (results: Property[]) => {
    setSearchResults(results);
  };

  const toggleComparison = (property: Property) => {
    if (selectedForComparison.find(p => p.id === property.id)) {
      setSelectedForComparison(selectedForComparison.filter(p => p.id !== property.id));
    } else {
      if (selectedForComparison.length < 4) {
        setSelectedForComparison([...selectedForComparison, property]);
      } else {
        alert("You can compare up to 4 properties at a time.");
      }
    }
  };

  return (
    <section id="listings" className="relative overflow-hidden bg-transparent py-16 sm:py-24">
      {config?.listings?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={config.listings.backgroundImage} 
            className="w-full h-full object-cover opacity-30"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-kayolla-black/20 via-transparent to-kayolla-black/15" />
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
            Property Listings
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-10 text-3xl font-serif font-bold text-kayolla-black sm:text-4xl md:text-5xl"
          >
            Find Your <span className="italic">Dream Property</span> in Mombasa
          </motion.h2>

          {/* Price Ranges Animated View */}
          {config?.locationPriceGuides && config.locationPriceGuides.length > 0 && (
            <div className="mb-16 space-y-8">
              <div className="flex flex-col items-center gap-4">
                <p className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Select Location for Price Guide</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {config.locationPriceGuides.map((guide) => (
                    <button
                      key={guide.location}
                      onClick={() => setSelectedPriceLocation(guide.location)}
                      className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                        selectedPriceLocation === guide.location 
                        ? "bg-kayolla-red text-white shadow-lg" 
                          : "bg-white/20 text-kayolla-black/70 border border-white/20 hover:border-kayolla-red/20"
                      }`}
                    >
                      {guide.location}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div 
                key={selectedPriceLocation}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
              >
                {Object.entries(config.locationPriceGuides.find(g => g.location === selectedPriceLocation)?.ranges || {}).map(([type, range]: [string, any], idx) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group cursor-default rounded-[2rem] border border-white/20 bg-white/28 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-xl sm:p-6"
                  >
                    <p className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest mb-2 group-hover:text-kayolla-red transition-colors">{type}</p>
                    <div className="flex flex-col">
                      <span className="text-lg font-serif font-bold text-kayolla-black">
                        {range.min >= 1000000 ? `${(range.min / 1000000).toFixed(1)}M` : range.min >= 1000 ? `${(range.min / 1000).toFixed(0)}k` : range.min}
                        <span className="mx-1 text-kayolla-black/20 font-sans font-normal">-</span>
                        {range.max >= 1000000 ? `${(range.max / 1000000).toFixed(1)}M` : range.max >= 1000 ? `${(range.max / 1000).toFixed(0)}k` : range.max}
                      </span>
                      <span className="text-[10px] font-bold text-kayolla-red/60 uppercase tracking-tighter mt-1">Price Range</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <PropertySearch 
              listings={data?.listings || []} 
              onResults={handleSearchResults} 
            />
            {searchResults && (
              <button 
                onClick={() => setSearchResults(null)}
                className="mt-4 text-xs font-bold text-kayolla-red hover:underline uppercase tracking-widest"
              >
                Clear Search Results
              </button>
            )}
          </motion.div>

          {/* View Toggle and Basic Filters */}
          <div className="mb-12 flex flex-col items-stretch justify-between gap-6 md:flex-row md:items-center">
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex flex-nowrap gap-3 min-w-max md:min-w-0" role="tablist" aria-label="Property type filters">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => togglePropertyFilter(type)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                      activeFilters.includes(type)
                        ? "bg-kayolla-red text-white border-kayolla-red shadow-lg shadow-kayolla-red/20"
                        : "bg-white/20 text-kayolla-black border-white/20 hover:border-kayolla-red/20"
                    }`}
                    role="tab"
                    aria-selected={activeFilters.includes(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border flex items-center justify-center gap-2 ${
                  showAdvancedFilters 
                    ? "bg-kayolla-black text-white border-kayolla-black" 
                    : "bg-white/20 text-kayolla-black border-white/20 hover:border-kayolla-red/20"
                }`}
                aria-expanded={showAdvancedFilters}
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                <ChevronDown size={14} className={`transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`} />
              </button>

                <div className="flex bg-white/20 p-1 rounded-2xl border border-white/20 shadow-md backdrop-blur-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "grid" ? "bg-kayolla-red text-white shadow-lg" : "text-kayolla-black/40 hover:text-kayolla-black"
                  }`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "map" ? "bg-kayolla-red text-white shadow-lg" : "text-kayolla-black/40 hover:text-kayolla-black"
                  }`}
                  title="Map View"
                >
                  <MapIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm">
              <Filter size={14} className="text-kayolla-black/40" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                id="advanced-filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-12"
              >
                <div className="grid gap-6 rounded-[2.5rem] border border-white/20 bg-white/20 p-6 shadow-xl backdrop-blur-sm md:grid-cols-4 sm:p-8">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-kayolla-black/50 uppercase tracking-widest ml-1">
                      <Bed size={14} />
                      <span>Min Bedrooms</span>
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => setFilters({ ...filters, bedrooms: num })}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                            filters.bedrooms === num 
                              ? "bg-kayolla-red text-white shadow-md" 
                              : "bg-white/20 text-kayolla-black/70 hover:bg-white/35"
                          }`}
                        >
                          {num === 0 ? "Any" : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-kayolla-black/50 uppercase tracking-widest ml-1">
                      <Bath size={14} />
                      <span>Min Bathrooms</span>
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={num}
                          onClick={() => setFilters({ ...filters, bathrooms: num })}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                            filters.bathrooms === num 
                              ? "bg-kayolla-red text-white shadow-md" 
                              : "bg-white/20 text-kayolla-black/70 hover:bg-white/35"
                          }`}
                        >
                          {num === 0 ? "Any" : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-kayolla-black/50 uppercase tracking-widest ml-1">
                      <DollarSign size={14} />
                      <span>Price Range (KSh)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-kayolla-black/30">MIN</span>
                        <input 
                          type="number"
                          placeholder="0"
                          value={filters.minPrice || ""}
                          onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                          className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/20 rounded-xl focus:bg-white/35 focus:border-kayolla-red transition-all text-sm font-bold"
                        />
                      </div>
                      <span className="text-kayolla-black/20">—</span>
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-kayolla-black/30">MAX</span>
                        <input 
                          type="number"
                          placeholder="Any"
                          value={filters.maxPrice === 50000000 ? "" : filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : 50000000 })}
                          className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/20 rounded-xl focus:bg-white/35 focus:border-kayolla-red transition-all text-sm font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"
            >
              {filteredListings.length > 0 ? (
                filteredListings.map((property, index) => {
                  const isSelected = selectedForComparison.find(p => p.id === property.id);
                  return (
                      <motion.div
                        key={property.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => setViewingProperty(property)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setViewingProperty(property);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View details for ${property.title}`}
                        className="bg-white/24 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-xl border border-white/20 group hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-kayolla-red/40"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={property.image}
                            alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <div className="flex gap-2">
                            <span className="px-4 py-2 bg-white/35 backdrop-blur-sm rounded-full text-xs font-bold text-kayolla-red shadow-lg">
                              {property.type}
                            </span>
                            {property.isFeatured && (
                              <span className="px-4 py-2 bg-kayolla-red text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
                                <Star size={12} fill="currentColor" />
                                <span>Featured</span>
                              </span>
                            )}
                          </div>
                          {property.virtualTourUrl && (
                            <a 
                              href={property.virtualTourUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2 bg-kayolla-black/70 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-2 hover:bg-kayolla-red transition-colors"
                            >
                              <ExternalLink size={12} />
                              <span>Virtual Tour</span>
                            </a>
                          )}
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <span className="px-4 py-2 bg-kayolla-red text-white rounded-full text-sm font-bold shadow-lg">
                            {property.price}
                          </span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComparison(property);
                          }}
                          type="button"
                          className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 ${
                            isSelected 
                              ? "bg-kayolla-red text-white" 
                              : "bg-white/35 backdrop-blur-sm text-kayolla-black hover:bg-kayolla-red hover:text-white"
                          }`}
                        >
                          {isSelected ? <Check size={18} /> : <Plus size={18} />}
                        </button>
                      </div>
                      
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center gap-2 text-kayolla-black/50 text-xs font-bold uppercase tracking-widest mb-3">
                          <MapPin size={14} className="text-kayolla-red" />
                          <span>{property.location}</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-kayolla-black mb-4 group-hover:text-kayolla-red transition-colors">
                          {property.title}
                        </h3>
                        <p className="text-kayolla-black/60 text-sm leading-relaxed mb-6 line-clamp-2">
                          {property.description}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t border-kayolla-black/5">
                          <div className="flex flex-col items-center gap-1">
                            <School size={16} className="text-kayolla-red/40" />
                            <span className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-tighter">
                              {property.amenities.schools.length} Schools
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Hospital size={16} className="text-kayolla-red/40" />
                            <span className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-tighter">
                              {property.amenities.hospitals.length} Hospitals
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <ShoppingBag size={16} className="text-kayolla-red/40" />
                            <span className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-tighter">
                              {property.amenities.shopping.length} Shopping
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                          {property.features.map((feature, i) => (
                            <span key={i} className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold text-kayolla-black/70 uppercase tracking-wider">
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <div className="mt-auto grid grid-cols-2 gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchedulingProperty(property);
                            }}
                            type="button"
                            className="py-4 bg-kayolla-black text-white rounded-xl text-xs font-bold hover:bg-kayolla-red transition-all duration-300"
                          >
                            Schedule Viewing
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingProperty(property);
                            }}
                            type="button"
                            className="py-4 bg-white/25 text-kayolla-black rounded-xl text-xs font-bold hover:bg-kayolla-black hover:text-white transition-all duration-300"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-kayolla-black/40">
                  <SearchX size={64} className="mb-4 opacity-20" />
                  <p className="text-xl font-serif font-bold">No properties found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PropertyMap 
                properties={filteredListings} 
                onSelect={(property) => setViewingProperty(property)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comparison Bar Trigger */}
      <AnimatePresence>
        {selectedForComparison.length > 0 && !isComparing && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={() => setIsComparing(true)}
              className="px-8 py-4 bg-kayolla-black text-white rounded-full shadow-2xl flex items-center gap-4 hover:bg-kayolla-red transition-all group"
            >
              <div className="flex -space-x-3">
                {selectedForComparison.map((p) => (
                  <img
                    key={p.id}
                    src={p.image}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    alt=""
                  />
                ))}
              </div>
              <span className="font-bold text-sm">Compare {selectedForComparison.length} Properties</span>
              <LayoutGrid size={18} className="group-hover:rotate-12 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison View */}
      <AnimatePresence>
        {isComparing && (
          <PropertyComparison
            selectedProperties={selectedForComparison}
            onRemove={(id) => setSelectedForComparison(selectedForComparison.filter(p => p.id !== id))}
            onClose={() => setIsComparing(false)}
            onScheduleViewing={(property) => {
              setSchedulingProperty(property);
              setIsComparing(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Viewing Scheduler Modal */}
      <AnimatePresence>
        {schedulingProperty && (
          <ViewingScheduler
            property={schedulingProperty}
            onClose={() => setSchedulingProperty(null)}
          />
        )}
      </AnimatePresence>

      {/* Property Details Modal */}
      <AnimatePresence>
        {viewingProperty && (
          <PropertyDetails
            property={viewingProperty}
            onClose={() => setViewingProperty(null)}
            onScheduleViewing={() => {
              setSchedulingProperty(viewingProperty);
              setViewingProperty(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
