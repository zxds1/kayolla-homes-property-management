import { Property } from "../data/listings";

export async function searchProperties(
  query: string,
  listings: Property[],
  criteria?: { bedrooms: number; bathrooms: number; type: string }
): Promise<Property[]> {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, criteria }),
    });

    if (response.ok) {
      const json = await response.json();
      if (Array.isArray(json.listings)) {
        return json.listings as Property[];
      }
    }
  } catch (error) {
    console.error("Search API failed, using local fallback:", error);
  }

  const normalizedQuery = query.trim().toLowerCase();
  return listings.filter((property) => {
    const matchesQuery =
      !normalizedQuery ||
      [property.title, property.description, property.location, property.type, property.price]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));

    const matchesType = !criteria || criteria.type === "All" || property.type === criteria.type;
    const matchesBedrooms = !criteria || criteria.bedrooms === 0 || (property.bedrooms ? property.bedrooms >= criteria.bedrooms : false);
    const matchesBathrooms = !criteria || criteria.bathrooms === 0 || (property.bathrooms ? property.bathrooms >= criteria.bathrooms : false);

    return matchesQuery && matchesType && matchesBedrooms && matchesBathrooms;
  });
}
