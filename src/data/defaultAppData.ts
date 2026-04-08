import { listings, type Property } from "./listings";

export interface SiteConfig {
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
  servicesSection?: {
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
  trustBar?: {
    backgroundImage?: string;
  };
  cta?: {
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
  viewingFee?: number;
}

export interface AppData {
  listings: Property[];
  config: SiteConfig;
}

export const defaultAppData: AppData = {
  listings,
  config: {
    agencyName: "Kayolla Properties",
    supportEmail: "support@kayolla.com",
    supportPhone: "+254 700 000 000",
    location: "Mombasa, Kenya",
    hero: {
      title: "Elevating Your [Property] Experience",
      subtitle: "Kayolla Homes is your premier partner for comprehensive property management, real estate investment, and construction services in Kenya.",
      backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      statsBackgroundImage: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1920&q=80",
    },
    about: {
      title: "Building Trust Through Professional Excellence",
      description: "Kayolla Homes Property Management is a leading real estate agency dedicated to providing seamless property solutions. We pride ourselves on our integrity, transparency, and commitment to our clients' success.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      backgroundImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1920&q=80",
    },
    servicesSection: {
      backgroundImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=80",
    },
    services: [
      { title: "Property Management", description: "Comprehensive solutions for your rental properties.", icon: "Building2" },
      { title: "Real Estate Investment", description: "Expert guidance for property investment.", icon: "TrendingUp" },
      { title: "Construction Services", description: "From concept to completion, we manage your build.", icon: "HardHat" },
      { title: "Land Sales", description: "Find the perfect plot for your next project.", icon: "MapPin" },
    ],
    listings: {
      backgroundImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=80",
    },
    trustBar: {
      backgroundImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1920&q=80",
    },
    cta: {
      backgroundImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=80",
    },
    testimonials: {
      backgroundImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
    },
    officeMap: {
      backgroundImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80",
    },
    contact: {
      title: "Let's Discuss Your Property Needs",
      description: "Whether you're looking to manage your property, buy land, or start a construction project, our team is ready to assist you. Reach out to us today.",
      backgroundImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80",
    },
    footer: {
      description: "Professional home management, real estate investment, and construction solutions tailored to Kenya's dynamic property market.",
      backgroundImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80",
      linksBackgroundImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80",
    },
    socialLinks: {
      facebook: "https://facebook.com/kayolla",
      instagram: "https://instagram.com/kayolla",
      twitter: "https://twitter.com/kayolla",
    },
    locationPriceGuides: [
      {
        location: "Nyali",
        ranges: {
          "Single Room": { min: 5000, max: 8000 },
          Bedsitter: { min: 10000, max: 15000 },
          "One B": { min: 18000, max: 25000 },
          "2B": { min: 25000, max: 35000 },
          Apartment: { min: 35000, max: 60000 },
          House: { min: 60000, max: 150000 },
          Hostel: { min: 8000, max: 12000 },
          Commercial: { min: 50000, max: 200000 },
          Land: { min: 5000000, max: 50000000 },
        },
      },
      {
        location: "Bamburi",
        ranges: {
          "Single Room": { min: 3500, max: 5500 },
          Bedsitter: { min: 7000, max: 10000 },
          "One B": { min: 12000, max: 18000 },
          "2B": { min: 18000, max: 25000 },
          Apartment: { min: 25000, max: 45000 },
          House: { min: 45000, max: 100000 },
          Hostel: { min: 5000, max: 9000 },
          Commercial: { min: 30000, max: 100000 },
          Land: { min: 2000000, max: 15000000 },
        },
      },
      {
        location: "Mtwapa",
        ranges: {
          "Single Room": { min: 3000, max: 5000 },
          Bedsitter: { min: 6000, max: 9000 },
          "One B": { min: 10000, max: 15000 },
          "2B": { min: 15000, max: 22000 },
          Apartment: { min: 20000, max: 35000 },
          House: { min: 35000, max: 80000 },
          Hostel: { min: 4000, max: 7500 },
          Commercial: { min: 20000, max: 80000 },
          Land: { min: 1000000, max: 10000000 },
        },
      },
    ],
    viewingFee: 300,
  },
};
