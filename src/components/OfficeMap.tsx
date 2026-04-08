import { motion } from "motion/react";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAppData } from "../hooks/useAppData";

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function OfficeMap() {
  const { data } = useAppData();
  const config = data?.config;
  // Mombasa coordinates for the office
  const officeCoords: [number, number] = [-4.0435, 39.6682];

  return (
    <section id="locations" className="relative py-24 overflow-hidden bg-transparent">
      {config?.officeMap?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={config.officeMap.backgroundImage}
            className="w-full h-full object-cover opacity-25"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-kayolla-black/20 via-transparent to-kayolla-black/15" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 bg-white/28 backdrop-blur-sm p-12 rounded-[3rem] shadow-xl border border-white/20 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-bold text-kayolla-red uppercase tracking-[0.3em] mb-4">Our Presence</p>
              <h2 className="text-4xl font-serif font-bold text-kayolla-black mb-8 leading-tight">
                Visit Our <br />
                <span className="italic text-kayolla-red">Mombasa Office</span>
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-kayolla-red/10 rounded-xl flex items-center justify-center text-kayolla-red flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-kayolla-black/50 uppercase tracking-widest mb-1">Address</p>
                    <p className="text-sm font-bold text-kayolla-black">Main Street, Mombasa CBD, Kenya</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-kayolla-black/5 rounded-xl flex items-center justify-center text-kayolla-black flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-kayolla-black/50 uppercase tracking-widest mb-1">Working Hours</p>
                    <p className="text-sm font-bold text-kayolla-black">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-kayolla-black/5 rounded-xl flex items-center justify-center text-kayolla-black flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-kayolla-black/50 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-sm font-bold text-kayolla-black">0737 510 006</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-12 w-full flex items-center justify-center gap-3 px-8 py-5 bg-kayolla-black text-white rounded-2xl text-base font-bold hover:bg-kayolla-red transition-all duration-300 shadow-xl shadow-kayolla-red/20 group">
              <span>Get Directions</span>
              <Navigation size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/20 min-h-[500px] z-0"
          >
            <MapContainer 
              center={officeCoords} 
              zoom={15} 
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={officeCoords}>
                <Popup>
                  <div className="font-serif font-bold">Kayolla Homes Office</div>
                  <div className="text-xs">Mombasa, Kenya</div>
                </Popup>
              </Marker>
            </MapContainer>
            
            {/* Map Overlay for branding */}
            <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 rounded-[3rem] z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
