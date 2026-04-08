import { motion } from "motion/react";
import { X, MapPin, Bed, Bath, Square, School, Hospital, ShoppingBag, ExternalLink, Calendar, Phone, Mail, Wallet } from "lucide-react";
import { Property } from "../data/listings";
import { Helmet } from "react-helmet-async";
import { useAppData } from "../hooks/useAppData";

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
  onScheduleViewing: () => void;
}

export default function PropertyDetails({ property, onClose, onScheduleViewing }: PropertyDetailsProps) {
  const { data } = useAppData();
  const viewingFee = data?.config?.viewingFee || 300;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-kayolla-black/60 p-3 backdrop-blur-md md:p-8">
      <Helmet>
        <title>{property.title} | Kayolla Homes</title>
        <meta name="description" content={property.description} />
        <meta property="og:title" content={`${property.title} in ${property.location}`} />
        <meta property="og:description" content={property.description} />
        <meta property="og:image" content={property.image} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={property.title} />
        <meta name="twitter:description" content={property.description} />
        <meta name="twitter:image" content={property.image} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative flex w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl md:flex-row md:rounded-[3rem]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-details-title"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-3 text-kayolla-black shadow-lg backdrop-blur-md transition-all hover:bg-kayolla-red hover:text-white md:right-6 md:top-6"
          aria-label="Close details"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-[400px] md:h-auto relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-kayolla-red shadow-lg">
              {property.type}
            </span>
            {property.isFeatured && (
              <span className="px-4 py-2 bg-kayolla-red text-white rounded-full text-xs font-bold shadow-lg">
                Featured
              </span>
            )}
          </div>
          <div className="absolute bottom-6 left-6">
            <span className="px-6 py-3 bg-kayolla-red text-white rounded-full text-2xl font-serif font-bold shadow-2xl">
              {property.price}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full max-h-[90vh] overflow-y-auto p-6 md:w-1/2 md:max-h-[800px] md:p-12">
          <div className="flex items-center gap-2 text-kayolla-red text-xs font-bold uppercase tracking-widest mb-4">
            <MapPin size={14} />
            <span>{property.location}</span>
          </div>
          <h2 id="property-details-title" className="mb-5 text-2xl font-serif font-bold leading-tight text-kayolla-black sm:text-3xl md:text-4xl">
            {property.title}
          </h2>
          
          <div className="mb-8 grid grid-cols-3 gap-4 border-y border-kayolla-black/5 py-6 sm:gap-6">
            {property.bedrooms && (
              <div className="flex flex-col items-center gap-2">
                <Bed size={20} className="text-kayolla-red" />
                <span className="text-sm font-bold text-kayolla-black">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex flex-col items-center gap-2">
                <Bath size={20} className="text-kayolla-red" />
                <span className="text-sm font-bold text-kayolla-black">{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              <Square size={20} className="text-kayolla-red" />
              <span className="text-sm font-bold text-kayolla-black">Premium</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-serif font-bold text-kayolla-black mb-4">Description</h3>
              <p className="text-kayolla-black/60 leading-relaxed">
                {property.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-kayolla-black mb-4">Key Features</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((feature, i) => (
                  <span key={i} className="px-4 py-2 bg-kayolla-gray rounded-xl text-xs font-bold text-kayolla-black/60 uppercase tracking-wider">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-kayolla-black mb-4">Nearby Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-kayolla-red">
                    <School size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Schools</span>
                  </div>
                  <ul className="text-xs text-kayolla-black/60 space-y-1">
                    {property.amenities.schools.map((s, i) => <li key={i}>{s}</li>)}
                    {property.amenities.schools.length === 0 && <li>None listed</li>}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-kayolla-red">
                    <Hospital size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Hospitals</span>
                  </div>
                  <ul className="text-xs text-kayolla-black/60 space-y-1">
                    {property.amenities.hospitals.map((h, i) => <li key={i}>{h}</li>)}
                    {property.amenities.hospitals.length === 0 && <li>None listed</li>}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-kayolla-red">
                    <ShoppingBag size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Shopping</span>
                  </div>
                  <ul className="text-xs text-kayolla-black/60 space-y-1">
                    {property.amenities.shopping.map((s, i) => <li key={i}>{s}</li>)}
                    {property.amenities.shopping.length === 0 && <li>None listed</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-kayolla-black/5">
              <div className="flex items-center gap-2 mb-4 text-kayolla-black/40">
                <Wallet size={14} className="text-kayolla-red" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Viewing Fee: KSh {viewingFee.toLocaleString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onScheduleViewing}
                  className="flex-1 py-5 bg-kayolla-red text-white rounded-2xl font-bold hover:bg-kayolla-black transition-all shadow-xl shadow-kayolla-red/20 flex items-center justify-center gap-3"
                  aria-label={`Schedule a viewing for ${property.title}`}
                >
                  <Calendar size={20} />
                  Schedule Viewing
                </button>
                {property.virtualTourUrl && (
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-5 bg-kayolla-black text-white rounded-2xl font-bold hover:bg-kayolla-red transition-all flex items-center justify-center gap-3"
                    aria-label={`View virtual tour for ${property.title}`}
                  >
                    <ExternalLink size={20} />
                    Virtual Tour
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
