import { motion, AnimatePresence } from "motion/react";
import { MapPin, X, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Property } from "../data/listings";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  properties: Property[];
  onSelect: (property: Property) => void;
}

function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.coordinates.lat, p.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [properties, map]);
  
  return null;
}

export default function PropertyMap({ properties, onSelect }: PropertyMapProps) {
  // Mombasa center as fallback
  const center: [number, number] = [-4.0435, 39.6682];

  return (
    <div className="relative w-full h-[600px] bg-kayolla-gray rounded-[3rem] overflow-hidden border border-kayolla-black/5 shadow-inner z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={properties} />
        {properties.map((property) => (
          <Marker 
            key={property.id} 
            position={[property.coordinates.lat, property.coordinates.lng]}
          >
            <Popup className="property-popup">
              <div className="p-1 min-w-[220px]">
                <div className="relative h-32 mb-3 overflow-hidden rounded-xl">
                  <img 
                    src={property.image} 
                    className="w-full h-full object-cover" 
                    alt={property.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-bold text-kayolla-red shadow-sm">
                      {property.type}
                    </span>
                  </div>
                </div>
                <h4 className="font-serif font-bold text-kayolla-black text-sm mb-1 leading-tight">{property.title}</h4>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-kayolla-red">{property.price}</p>
                  <div className="flex items-center gap-2 text-[10px] text-kayolla-black/40 font-bold">
                    <MapPin size={10} />
                    <span>{property.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelect(property)}
                  className="w-full py-2.5 bg-kayolla-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-kayolla-red transition-all shadow-lg shadow-kayolla-black/10"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-kayolla-black/5 shadow-lg z-[1000] pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-[10px] font-bold text-kayolla-black uppercase tracking-widest">Available Property</span>
        </div>
        <p className="text-[10px] text-kayolla-black/40 font-medium">Click markers to view details</p>
      </div>
    </div>
  );
}
