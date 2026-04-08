import { motion, AnimatePresence } from "motion/react";
import { X, Check, Minus } from "lucide-react";
import { Property } from "../data/listings";

interface PropertyComparisonProps {
  selectedProperties: Property[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onScheduleViewing: (property: Property) => void;
}

export default function PropertyComparison({ selectedProperties, onRemove, onClose, onScheduleViewing }: PropertyComparisonProps) {
  if (selectedProperties.length === 0) return null;

  const comparisonFields = [
    { label: "Price", key: "price" },
    { label: "Location", key: "location" },
    { label: "Type", key: "type" },
    { label: "Bedrooms", key: "bedrooms" },
    { label: "Bathrooms", key: "bathrooms" },
    { label: "Virtual Tour", key: "virtualTourUrl" },
    { label: "Features", key: "features" },
    { label: "Nearby Schools", key: "amenities.schools" },
    { label: "Nearby Hospitals", key: "amenities.hospitals" },
    { label: "Shopping Centers", key: "amenities.shopping" },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const renderValue = (field: any, value: any) => {
    if (field.label === "Virtual Tour") {
      return value ? (
        <div className="flex items-center gap-2 text-kayolla-red font-bold">
          <Check size={16} />
          <span>Available</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-kayolla-black/30">
          <Minus size={16} />
          <span>N/A</span>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <ul className="space-y-1">
          {value.length > 0 ? (
            value.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check size={12} className="text-kayolla-red" />
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="flex items-center gap-2 text-kayolla-black/30">
              <Minus size={12} />
              <span>N/A</span>
            </li>
          )}
        </ul>
      );
    }

    return (
      <span className={field.label === "Price" ? "font-bold text-kayolla-red" : ""}>
        {value || "N/A"}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-x-0 bottom-0 z-[60] bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-kayolla-black/5 p-6 md:p-10 max-h-[80vh] overflow-y-auto rounded-t-[3rem]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 id="comparison-title" className="text-3xl font-serif font-bold text-kayolla-black">
            Compare <span className="italic">Properties</span>
          </h2>
          <button
            onClick={onClose}
            className="p-3 bg-kayolla-gray rounded-full hover:bg-kayolla-red hover:text-white transition-all"
            aria-label="Close comparison"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-kayolla-gray/50 rounded-tl-2xl w-48">Feature</th>
                {selectedProperties.map((property) => (
                  <th key={property.id} className="p-4 min-w-[250px] relative group">
                    <button
                      onClick={() => onRemove(property.id)}
                      className="absolute top-2 right-2 p-1 bg-kayolla-red text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <div className="text-left">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                        referrerPolicy="no-referrer"
                      />
                      <h3 className="font-serif font-bold text-kayolla-black text-sm line-clamp-1 mb-3">
                        {property.title}
                      </h3>
                      <button
                        onClick={() => onScheduleViewing(property)}
                        className="w-full py-2 bg-kayolla-black text-white rounded-lg text-[10px] font-bold hover:bg-kayolla-red transition-all"
                      >
                        Schedule Viewing
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-kayolla-black/5">
              {comparisonFields.map((field) => (
                <tr key={field.label} className="hover:bg-kayolla-gray/30 transition-colors">
                  <td className="p-4 font-bold text-xs uppercase tracking-widest text-kayolla-black/50 bg-kayolla-gray/20">
                    {field.label}
                  </td>
                  {selectedProperties.map((property) => {
                    const value = getNestedValue(property, field.key);
                    return (
                      <td key={property.id} className="p-4 text-sm text-kayolla-black/80">
                        {renderValue(field, value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
