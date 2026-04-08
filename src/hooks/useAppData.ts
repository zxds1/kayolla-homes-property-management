import { useState, useEffect } from "react";
import { Property } from "../data/listings";

interface SiteConfig {
  agencyName: string;
  supportEmail: string;
  supportPhone: string;
  location: string;
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
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
  contact: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  footer: {
    description: string;
    backgroundImage: string;
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

interface AppData {
  listings: Property[];
  config: SiteConfig;
}

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refresh: fetchData };
}
