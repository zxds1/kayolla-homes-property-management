import { useState, useEffect } from "react";
import { isFirebaseConfigured } from "../lib/firebase";
import { defaultAppData, type AppData } from "../data/defaultAppData";

const LOCAL_APP_DATA_KEY = "kayolla.appData";

const readLocalAppData = () => {
  try {
    const raw = localStorage.getItem(LOCAL_APP_DATA_KEY);
    return raw ? (JSON.parse(raw) as AppData) : null;
  } catch {
    return null;
  }
};

export function useAppData() {
  const [data, setData] = useState<AppData | null>(() => {
    if (typeof window === "undefined") return null;
    if (!isFirebaseConfigured) {
      return readLocalAppData() ?? defaultAppData;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isFirebaseConfigured) {
      const local = readLocalAppData();
      setData(local ?? defaultAppData);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      const local = readLocalAppData();
      setData(local ?? defaultAppData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refresh: fetchData };
}
