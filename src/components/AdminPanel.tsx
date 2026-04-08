import { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter,
  ChevronRight,
  LayoutDashboard,
  Building2,
  Globe, 
  DollarSign
} from "lucide-react";
import { Property } from "../data/listings";
import { auth, googleProvider, allowedAdminEmails, isFirebaseConfigured } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";

interface SiteConfig {
  agencyName: string;
  supportEmail: string;
  supportPhone: string;
  location: string;
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    statsBackgroundImage?: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
    backgroundImage?: string;
  };
  servicesSection: {
    backgroundImage?: string;
  };
  services: {
    title: string;
    description: string;
    icon: string;
  }[];
  listings: {
    backgroundImage?: string;
  };
  testimonials?: {
    backgroundImage?: string;
  };
  officeMap?: {
    backgroundImage?: string;
  };
  contact: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  footer: {
    description: string;
    backgroundImage: string;
    linksBackgroundImage?: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  fonts?: {
    sans: string;
    serif: string;
  };
  locationPriceGuides?: {
    location: string;
    ranges: {
      [propertyType: string]: {
        min: number;
        max: number;
      };
    };
  }[];
}

function ImageUploadField({ 
  label, 
  value, 
  onChange,
  getAuthToken,
}: { 
  label: string; 
  value: string; 
  onChange: (url: string) => void;
  getAuthToken: () => Promise<string | null>;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = await getAuthToken();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const json = await res.json();
      if (json.url) {
        onChange(json.url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">{label}</label>
        {value && (
          <button 
            onClick={() => onChange("")}
            className="text-[10px] font-bold text-kayolla-red uppercase tracking-widest hover:underline"
          >
            Clear Image
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <input 
            type="text" 
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-xs"
          />
          <ImageIcon className="absolute right-4 top-4 text-kayolla-black/20" size={18} />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex-1 flex items-center justify-center gap-2 p-4 bg-kayolla-gray border-2 border-dashed border-kayolla-black/10 rounded-2xl cursor-pointer hover:bg-kayolla-black/5 transition-all">
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-kayolla-red"></div>
            ) : (
              <Plus size={16} className="text-kayolla-black/40" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-kayolla-black/40">
              {isUploading ? "Uploading..." : "Upload File"}
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>
        {value && (
          <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-kayolla-black/5 shadow-sm group">
            <img src={value} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-[10px] font-bold uppercase tracking-widest">Preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AppData {
  listings: Property[];
  config: SiteConfig;
}

const LOCAL_APP_DATA_KEY = "kayolla.appData";

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<AppData | null>(null);
  const [activeTab, setActiveTab] = useState<"listings" | "config">("listings");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(!isFirebaseConfigured);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);

      if (!user) {
        setIsAuthReady(true);
        return;
      }

      const email = user.email?.toLowerCase() || '';
      if (allowedAdminEmails.length > 0 && !allowedAdminEmails.includes(email)) {
        setAuthError('This account is not allowed to access the admin panel.');
        await signOut(auth);
        setAuthUser(null);
        setIsAuthReady(true);
        return;
      }

      setAuthError(null);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch data", error);
      try {
        const local = JSON.parse(localStorage.getItem(LOCAL_APP_DATA_KEY) || "null");
        if (local) {
          setData(local);
        }
      } catch {
        // Ignore local parsing errors and keep the current in-memory state.
      }
    }
  };

  const saveData = async (newData: AppData) => {
    setIsSaving(true);
    try {
      const token = await authUser?.getIdToken?.();
      await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newData),
      });
      setData(newData);
      localStorage.setItem(LOCAL_APP_DATA_KEY, JSON.stringify(newData));
      setEditingProperty(null);
    } catch (error) {
      console.error("Failed to save data", error);
      try {
        localStorage.setItem(LOCAL_APP_DATA_KEY, JSON.stringify(newData));
        setData(newData);
        setEditingProperty(null);
      } catch {
        // Ignore localStorage failures and fall through.
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteListing = (id: string) => {
    if (!data) return;
    if (confirm("Are you sure you want to delete this listing?")) {
      const newListings = data.listings.filter(l => l.id !== id);
      saveData({ ...data, listings: newListings });
    }
  };

  const handleSaveListing = (property: Property) => {
    if (!data) return;
    const newListings = [...data.listings];
    const index = newListings.findIndex(l => l.id === property.id);
    if (index > -1) {
      newListings[index] = property;
    } else {
      newListings.push(property);
    }
    saveData({ ...data, listings: newListings });
  };

  const handleSaveConfig = (config: SiteConfig) => {
    if (!data) return;
    saveData({ ...data, config });
  };

  const handleSignIn = async () => {
    if (!auth) {
      setAuthError('Firebase Auth is not configured for this environment.');
      return;
    }

    setIsSigningIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Admin sign-in failed', error);
      setAuthError('Unable to sign in. Make sure Google Auth is enabled in Firebase.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const getAuthToken = async () => {
    if (!auth?.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  if (!isAuthReady || !data) {
    return (
      <div className="fixed inset-0 z-[100] bg-kayolla-gray flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kayolla-red"></div>
      </div>
    );
  }

  if (auth && !authUser) {
    return (
      <div className="fixed inset-0 z-[100] bg-kayolla-gray overflow-hidden flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-kayolla-black/5 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-kayolla-red rounded-2xl flex items-center justify-center">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl text-kayolla-black">Admin Access</h1>
              <p className="text-kayolla-black/50">Sign in to manage every part of the site.</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-kayolla-black/60 leading-relaxed">
              This panel connects to Firebase Auth and only allows approved accounts to edit listings, upload images, and update site configuration.
            </p>
            {authError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                {authError}
              </div>
            )}
            {!isFirebaseConfigured && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm font-medium">
                Firebase is not configured in this environment yet. Add the `VITE_FIREBASE_*` values to enable admin login.
              </div>
            )}
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn || !isFirebaseConfigured}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-kayolla-black text-white font-bold hover:bg-kayolla-red transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-kayolla-gray overflow-hidden flex flex-col md:flex-row" role="dialog" aria-modal="true" aria-labelledby="admin-panel-title">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-kayolla-black text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-kayolla-red rounded-xl flex items-center justify-center">
            <Settings className="text-white" size={20} />
          </div>
          <div>
            <h1 id="admin-panel-title" className="font-serif font-bold text-lg leading-tight">Admin</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Control Panel</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Admin Sidebar">
          <button 
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === "listings" ? "bg-kayolla-red text-white" : "hover:bg-white/5 text-white/60"}`}
            aria-current={activeTab === "listings" ? "page" : undefined}
          >
            <Building2 size={18} />
            <span className="text-sm font-bold">Listings</span>
          </button>
          <button 
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === "config" ? "bg-kayolla-red text-white" : "hover:bg-white/5 text-white/60"}`}
            aria-current={activeTab === "config" ? "page" : undefined}
          >
            <Globe size={18} />
            <span className="text-sm font-bold">Site Config</span>
          </button>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={onClose}
            className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            <X size={16} />
            Exit Admin
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          {activeTab === "listings" ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-kayolla-black">Property <span className="italic">Listings</span></h2>
                  <p className="text-kayolla-black/40 font-medium">Manage your real estate portfolio</p>
                </div>
                <button 
                  onClick={() => setEditingProperty({
                    id: Date.now().toString(),
                    title: "",
                    type: "Apartment",
                    price: "KSh 0",
                    priceValue: 0,
                    location: "",
                    description: "",
                    image: "",
                    isFeatured: false,
                    features: [],
                    coordinates: { lat: -4.035, lng: 39.712 },
                    amenities: { schools: [], hospitals: [], shopping: [] }
                  })}
                  className="flex items-center gap-2 bg-kayolla-red text-white px-6 py-3 rounded-2xl font-bold hover:bg-kayolla-black transition-all shadow-lg shadow-kayolla-red/20"
                  aria-label="Add new property listing"
                >
                  <Plus size={18} />
                  Add Listing
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {data.listings.map((listing) => (
                  <div key={listing.id} className="bg-white p-4 rounded-[2rem] border border-kayolla-black/5 flex items-center gap-6 group hover:shadow-xl transition-all">
                    <img src={listing.image} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-kayolla-red uppercase tracking-widest mb-1">{listing.type}</p>
                      <h3 className="font-serif font-bold text-kayolla-black text-lg">{listing.title}</h3>
                      <p className="text-sm text-kayolla-black/40">{listing.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditingProperty(listing)}
                        className="p-3 bg-kayolla-gray rounded-xl hover:bg-kayolla-black hover:text-white transition-all"
                        aria-label={`Edit ${listing.title}`}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteListing(listing.id)}
                        className="p-3 bg-kayolla-gray rounded-xl hover:bg-kayolla-red hover:text-white transition-all"
                        aria-label={`Delete ${listing.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-kayolla-black">Site <span className="italic">Configuration</span></h2>
                <p className="text-kayolla-black/40 font-medium">Global settings and contact information</p>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-kayolla-black/5 space-y-12">
                {/* Hero Section Config */}
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <ImageIcon className="text-kayolla-red" size={20} />
                    Hero Section
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Hero Title</label>
                      <input 
                        type="text" 
                        value={data.config.hero?.title || ""}
                        onChange={(e) => handleSaveConfig({ ...data.config, hero: { ...data.config.hero, title: e.target.value } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Hero Subtitle</label>
                      <textarea 
                        value={data.config.hero?.subtitle || ""}
                        onChange={(e) => handleSaveConfig({ ...data.config, hero: { ...data.config.hero, subtitle: e.target.value } })}
                        rows={2}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <ImageUploadField 
                      label="Hero Background Image"
                      value={data.config.hero?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, hero: { ...data.config.hero, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                    <ImageUploadField 
                      label="Hero Stats Background Image"
                      value={data.config.hero?.statsBackgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, hero: { ...data.config.hero, statsBackgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* About Section Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <Building2 className="text-kayolla-red" size={20} />
                    About Section
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">About Title</label>
                      <input 
                        type="text" 
                        value={data.config.about?.title || ""}
                        onChange={(e) => handleSaveConfig({ ...data.config, about: { ...data.config.about, title: e.target.value } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">About Description</label>
                      <textarea 
                        value={data.config.about?.description || ""}
                        onChange={(e) => handleSaveConfig({ ...data.config, about: { ...data.config.about, description: e.target.value } })}
                        rows={4}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUploadField 
                        label="About Content Image"
                        value={data.config.about?.image || ""}
                        onChange={(url) => handleSaveConfig({ ...data.config, about: { ...data.config.about, image: url } })}
                        getAuthToken={getAuthToken}
                      />
                      <ImageUploadField 
                        label="About Background Image"
                        value={data.config.about?.backgroundImage || ""}
                        onChange={(url) => handleSaveConfig({ ...data.config, about: { ...data.config.about, backgroundImage: url } })}
                        getAuthToken={getAuthToken}
                      />
                    </div>
                  </div>
                </div>

                {/* Services Section Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <ImageIcon className="text-kayolla-red" size={20} />
                    Services Section
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <ImageUploadField 
                      label="Services Section Background Image"
                      value={data.config.servicesSection?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, servicesSection: { ...data.config.servicesSection, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* Listings Section Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <Building2 className="text-kayolla-red" size={20} />
                    Listings Section
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <ImageUploadField 
                      label="Listings Section Background Image"
                      value={data.config.listings?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, listings: { ...data.config.listings, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* Trust Bar Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <ImageIcon className="text-kayolla-red" size={20} />
                    Trust Bar
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <ImageUploadField 
                      label="Trust Bar Background Image"
                      value={data.config.trustBar?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, trustBar: { ...data.config.trustBar, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* CTA Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <ImageIcon className="text-kayolla-red" size={20} />
                    Call To Action
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <ImageUploadField 
                      label="CTA Background Image"
                      value={data.config.cta?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, cta: { ...data.config.cta, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* Testimonials Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <ImageIcon className="text-kayolla-red" size={20} />
                    Testimonials
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <ImageUploadField 
                      label="Testimonials Background Image"
                      value={data.config.testimonials?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, testimonials: { ...data.config.testimonials, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* Office Map Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <ImageIcon className="text-kayolla-red" size={20} />
                    Office Map
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <ImageUploadField 
                      label="Office Map Background Image"
                      value={data.config.officeMap?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, officeMap: { ...data.config.officeMap, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* Contact Section Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <Mail className="text-kayolla-red" size={20} />
                    Contact Section
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Contact Title</label>
                      <input 
                        type="text" 
                        value={data.config.contact?.title || ""}
                        onChange={(e) => handleSaveConfig({ ...data.config, contact: { ...data.config.contact, title: e.target.value } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Contact Description</label>
                      <textarea 
                        value={data.config.contact?.description || ""}
                        onChange={(e) => handleSaveConfig({ ...data.config, contact: { ...data.config.contact, description: e.target.value } })}
                        rows={2}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <ImageUploadField 
                      label="Contact Background Image"
                      value={data.config.contact?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, contact: { ...data.config.contact, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* Footer Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <Globe className="text-kayolla-red" size={20} />
                    Footer
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Footer Description</label>
                      <textarea 
                        value={data.config.footer?.description || ""}
                        onChange={(e) => handleSaveConfig({ ...data.config, footer: { ...data.config.footer, description: e.target.value } })}
                        rows={3}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <ImageUploadField 
                      label="Footer Background Image"
                      value={data.config.footer?.backgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, footer: { ...data.config.footer, backgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                    <ImageUploadField 
                      label="Footer Links Background Image"
                      value={data.config.footer?.linksBackgroundImage || ""}
                      onChange={(url) => handleSaveConfig({ ...data.config, footer: { ...data.config.footer, linksBackgroundImage: url } })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                </div>

                {/* General Info */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <LayoutDashboard className="text-kayolla-red" size={20} />
                    General Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Agency Name</label>
                      <input 
                        type="text" 
                        value={data.config.agencyName}
                        onChange={(e) => handleSaveConfig({ ...data.config, agencyName: e.target.value })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Location</label>
                      <input 
                        type="text" 
                        value={data.config.location}
                        onChange={(e) => handleSaveConfig({ ...data.config, location: e.target.value })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Support Email</label>
                      <input 
                        type="email" 
                        value={data.config.supportEmail}
                        onChange={(e) => handleSaveConfig({ ...data.config, supportEmail: e.target.value })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Support Phone</label>
                      <input 
                        type="text" 
                        value={data.config.supportPhone}
                        onChange={(e) => handleSaveConfig({ ...data.config, supportPhone: e.target.value })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Config */}
                <div className="pt-12 border-t border-kayolla-black/5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                    <Building2 className="text-kayolla-red" size={20} />
                    Services
                  </h3>
                  <div className="space-y-6">
                    {(data.config.services || []).map((service, idx) => (
                      <div key={idx} className="p-6 bg-kayolla-gray rounded-[2rem] space-y-4 relative group">
                        <button 
                          onClick={() => {
                            const newServices = [...data.config.services];
                            newServices.splice(idx, 1);
                            handleSaveConfig({ ...data.config, services: newServices });
                          }}
                          className="absolute top-4 right-4 p-2 bg-white text-kayolla-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-kayolla-black/40">Service Title</label>
                            <input 
                              type="text" 
                              value={service.title}
                              onChange={(e) => {
                                const newServices = [...data.config.services];
                                newServices[idx].title = e.target.value;
                                handleSaveConfig({ ...data.config, services: newServices });
                              }}
                              className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-kayolla-black/40">Icon (Lucide Name)</label>
                            <input 
                              type="text" 
                              value={service.icon}
                              onChange={(e) => {
                                const newServices = [...data.config.services];
                                newServices[idx].icon = e.target.value;
                                handleSaveConfig({ ...data.config, services: newServices });
                              }}
                              className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-kayolla-black/40">Description</label>
                          <textarea 
                            value={service.description}
                            onChange={(e) => {
                              const newServices = [...data.config.services];
                              newServices[idx].description = e.target.value;
                              handleSaveConfig({ ...data.config, services: newServices });
                            }}
                            rows={2}
                            className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newServices = [...(data.config.services || [])];
                        newServices.push({ title: "New Service", description: "", icon: "Home" });
                        handleSaveConfig({ ...data.config, services: newServices });
                      }}
                      className="w-full py-4 border-2 border-dashed border-kayolla-black/10 rounded-[2rem] text-kayolla-black/40 font-bold uppercase tracking-widest hover:bg-kayolla-black/5 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Service
                    </button>
                  </div>
                </div>

                <div className="pt-12 border-t border-kayolla-black/5">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black mb-6 flex items-center gap-3">
                    <Globe className="text-kayolla-red" size={20} />
                    Social Media Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-kayolla-black/40">
                        <Facebook size={14} />
                        <label className="text-[10px] font-bold uppercase tracking-widest">Facebook</label>
                      </div>
                      <input 
                        type="text" 
                        value={data.config.socialLinks.facebook}
                        onChange={(e) => handleSaveConfig({ ...data.config, socialLinks: { ...data.config.socialLinks, facebook: e.target.value } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-kayolla-black/40">
                        <Instagram size={14} />
                        <label className="text-[10px] font-bold uppercase tracking-widest">Instagram</label>
                      </div>
                      <input 
                        type="text" 
                        value={data.config.socialLinks.instagram}
                        onChange={(e) => handleSaveConfig({ ...data.config, socialLinks: { ...data.config.socialLinks, instagram: e.target.value } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-kayolla-black/40">
                        <Twitter size={14} />
                        <label className="text-[10px] font-bold uppercase tracking-widest">Twitter</label>
                      </div>
                      <input 
                        type="text" 
                        value={data.config.socialLinks.twitter}
                        onChange={(e) => handleSaveConfig({ ...data.config, socialLinks: { ...data.config.socialLinks, twitter: e.target.value } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Config */}
                <div className="pt-12 border-t border-kayolla-black/5">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black mb-6 flex items-center gap-3">
                    <Edit3 className="text-kayolla-red" size={20} />
                    Typography
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Sans-Serif Font (UI & Body)</label>
                      <select 
                        value={data.config.fonts?.sans || "Inter"}
                        onChange={(e) => handleSaveConfig({ ...data.config, fonts: { ...data.config.fonts, sans: e.target.value, serif: data.config.fonts?.serif || "Playfair Display" } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      >
                        <option value="Inter">Inter (Default)</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Space Grotesk">Space Grotesk</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Serif Font (Headings)</label>
                      <select 
                        value={data.config.fonts?.serif || "Playfair Display"}
                        onChange={(e) => handleSaveConfig({ ...data.config, fonts: { ...data.config.fonts, serif: e.target.value, sans: data.config.fonts?.sans || "Inter" } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      >
                        <option value="Playfair Display">Playfair Display (Default)</option>
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Fraunces">Fraunces</option>
                        <option value="Libre Baskerville">Libre Baskerville</option>
                        <option value="Lora">Lora</option>
                      </select>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-kayolla-black/40 italic">Fonts are loaded from Google Fonts. Changes apply instantly across the site.</p>
                </div>

                {/* Viewing Fee Config */}
                <div className="pt-12 border-t border-kayolla-black/5">
                  <h3 className="text-xl font-serif font-bold text-kayolla-black mb-6 flex items-center gap-3">
                    <DollarSign className="text-kayolla-red" size={20} />
                    Viewing Fee
                  </h3>
                  <div className="max-w-xs space-y-2">
                    <label className="text-xs font-bold text-kayolla-black/40 uppercase tracking-widest">Standard Viewing Fee (KSh)</label>
                    <input 
                      type="number" 
                      value={data.config.viewingFee || 0}
                      onChange={(e) => handleSaveConfig({ ...data.config, viewingFee: parseInt(e.target.value) })}
                      className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Price Ranges Config */}
                <div className="pt-12 border-t border-kayolla-black/5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif font-bold text-kayolla-black flex items-center gap-3">
                      <DollarSign className="text-kayolla-red" size={20} />
                      Location Price Guides
                    </h3>
                    <button 
                      onClick={() => {
                        const newGuides = [...(data.config.locationPriceGuides || [])];
                        newGuides.push({ 
                          location: "New Location", 
                          ranges: {
                            "Single Room": { min: 3000, max: 6000 },
                            "Bedsitter": { min: 6000, max: 11000 }
                          } 
                        });
                        handleSaveConfig({ ...data.config, locationPriceGuides: newGuides });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-kayolla-black text-white rounded-xl text-xs font-bold hover:bg-kayolla-red transition-all"
                    >
                      <Plus size={14} />
                      Add Location Guide
                    </button>
                  </div>
                  
                  <div className="space-y-12">
                    {(data.config.locationPriceGuides || []).map((guide, gIdx) => (
                      <div key={gIdx} className="p-8 bg-kayolla-gray rounded-[3rem] space-y-8 relative group">
                        <button 
                          onClick={() => {
                            const newGuides = [...data.config.locationPriceGuides!];
                            newGuides.splice(gIdx, 1);
                            handleSaveConfig({ ...data.config, locationPriceGuides: newGuides });
                          }}
                          className="absolute top-6 right-6 p-3 bg-white text-kayolla-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="max-w-md">
                          <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest mb-2 block">Location Name</label>
                          <input 
                            type="text" 
                            value={guide.location}
                            onChange={(e) => {
                              const newGuides = [...data.config.locationPriceGuides!];
                              newGuides[gIdx].location = e.target.value;
                              handleSaveConfig({ ...data.config, locationPriceGuides: newGuides });
                            }}
                            className="w-full p-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold text-lg"
                            placeholder="e.g. Nyali"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {["Single Room", "Bedsitter", "One B", "2B", "Apartment", "House", "Hostel", "Commercial", "Land"].map((type) => (
                            <div key={type} className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
                              <label className="text-[10px] font-bold text-kayolla-black uppercase tracking-widest">{type}</label>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-kayolla-black/30 uppercase tracking-widest">Min</label>
                                  <input 
                                    type="number" 
                                    value={guide.ranges[type]?.min || 0}
                                    onChange={(e) => {
                                      const newGuides = [...data.config.locationPriceGuides!];
                                      newGuides[gIdx].ranges[type] = { 
                                        min: parseInt(e.target.value), 
                                        max: newGuides[gIdx].ranges[type]?.max || 0 
                                      };
                                      handleSaveConfig({ ...data.config, locationPriceGuides: newGuides });
                                    }}
                                    className="w-full p-2 bg-kayolla-gray/50 rounded-lg border-none focus:ring-1 focus:ring-kayolla-red transition-all text-xs font-bold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-kayolla-black/30 uppercase tracking-widest">Max</label>
                                  <input 
                                    type="number" 
                                    value={guide.ranges[type]?.max || 0}
                                    onChange={(e) => {
                                      const newGuides = [...data.config.locationPriceGuides!];
                                      newGuides[gIdx].ranges[type] = { 
                                        min: newGuides[gIdx].ranges[type]?.min || 0, 
                                        max: parseInt(e.target.value) 
                                      };
                                      handleSaveConfig({ ...data.config, locationPriceGuides: newGuides });
                                    }}
                                    className="w-full p-2 bg-kayolla-gray/50 rounded-lg border-none focus:ring-1 focus:ring-kayolla-red transition-all text-xs font-bold"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Listing Modal */}
      <AnimatePresence>
        {editingProperty && (
          <div className="fixed inset-0 z-[110] bg-kayolla-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-8 md:p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 id="edit-modal-title" className="text-3xl font-serif font-bold text-kayolla-black">
                  {editingProperty.id ? "Edit" : "New"} <span className="italic">Listing</span>
                </h2>
                <button onClick={() => setEditingProperty(null)} className="p-3 bg-kayolla-gray rounded-full hover:bg-kayolla-red hover:text-white transition-all" aria-label="Close modal">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Property Title</label>
                    <input 
                      type="text" 
                      value={editingProperty.title}
                      onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                      className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Type</label>
                      <select 
                        value={editingProperty.type}
                        onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as any })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Land">Land</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Bedsitter">Bedsitter</option>
                        <option value="Single Room">Single Room</option>
                        <option value="One B">One B</option>
                        <option value="2B">2B</option>
                        <option value="Hostel">Hostel</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Price (Display)</label>
                      <input 
                        type="text" 
                        value={editingProperty.price}
                        onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Location</label>
                    <input 
                      type="text" 
                      value={editingProperty.location}
                      onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                      className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Description</label>
                    <textarea 
                      value={editingProperty.description}
                      onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                      rows={4}
                      className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-kayolla-gray rounded-2xl border border-transparent hover:border-kayolla-red/20 transition-all cursor-pointer" onClick={() => setEditingProperty({ ...editingProperty, isFeatured: !editingProperty.isFeatured })}>
                    <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${editingProperty.isFeatured ? "bg-kayolla-red" : "bg-kayolla-black/10"}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${editingProperty.isFeatured ? "translate-x-4" : ""}`} />
                    </div>
                    <span className="text-xs font-bold text-kayolla-black uppercase tracking-widest">Mark as Featured Property</span>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-kayolla-black/5">
                    <h3 className="text-sm font-serif font-bold text-kayolla-black">Amenities</h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Schools (Comma separated)</label>
                      <input 
                        type="text" 
                        value={editingProperty.amenities.schools.join(", ")}
                        onChange={(e) => setEditingProperty({ 
                          ...editingProperty, 
                          amenities: { ...editingProperty.amenities, schools: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } 
                        })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Hospitals (Comma separated)</label>
                      <input 
                        type="text" 
                        value={editingProperty.amenities.hospitals.join(", ")}
                        onChange={(e) => setEditingProperty({ 
                          ...editingProperty, 
                          amenities: { ...editingProperty.amenities, hospitals: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } 
                        })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Shopping (Comma separated)</label>
                      <input 
                        type="text" 
                        value={editingProperty.amenities.shopping.join(", ")}
                        onChange={(e) => setEditingProperty({ 
                          ...editingProperty, 
                          amenities: { ...editingProperty.amenities, shopping: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } 
                        })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Property Image</label>
                    <ImageUploadField 
                      label="Property Image"
                      value={editingProperty.image}
                      onChange={(url) => setEditingProperty({ ...editingProperty, image: url })}
                      getAuthToken={getAuthToken}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Latitude</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={editingProperty.coordinates.lat}
                        onChange={(e) => setEditingProperty({ ...editingProperty, coordinates: { ...editingProperty.coordinates, lat: parseFloat(e.target.value) } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Longitude</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={editingProperty.coordinates.lng}
                        onChange={(e) => setEditingProperty({ ...editingProperty, coordinates: { ...editingProperty.coordinates, lng: parseFloat(e.target.value) } })}
                        className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-kayolla-black/40 uppercase tracking-widest">Features (Comma separated)</label>
                    <input 
                      type="text" 
                      value={editingProperty.features.join(", ")}
                      onChange={(e) => setEditingProperty({ ...editingProperty, features: e.target.value.split(",").map(s => s.trim()) })}
                      className="w-full p-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => handleSaveListing(editingProperty)}
                  disabled={isSaving}
                  className="flex-1 py-5 bg-kayolla-black text-white rounded-[2rem] font-bold hover:bg-kayolla-red transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Property
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setEditingProperty(null)}
                  className="px-10 py-5 bg-kayolla-gray text-kayolla-black rounded-[2rem] font-bold hover:bg-kayolla-black hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
