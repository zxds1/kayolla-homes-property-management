export interface Property {
  id: string;
  title: string;
  type: 'Apartment' | 'House' | 'Land' | 'Commercial' | 'Bedsitter' | 'Single Room' | 'One B' | '2B' | 'Hostel';
  price: string;
  priceValue: number; // For filtering
  bedrooms?: number;
  bathrooms?: number;
  location: string;
  description: string;
  image: string;
  features: string[];
  coordinates: { lat: number; lng: number };
  virtualTourUrl?: string;
  isFeatured?: boolean;
  amenities: {
    schools: string[];
    hospitals: string[];
    shopping: string[];
  };
}

export const listings: Property[] = [
  {
    id: '1',
    title: 'Luxury Beachfront Apartment',
    type: 'Apartment',
    price: 'KSh 15,000,000',
    priceValue: 15000000,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Nyali, Mombasa',
    description: 'Stunning 3-bedroom apartment with panoramic ocean views and direct beach access.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    features: ['Ocean View', 'Swimming Pool', '24/7 Security'],
    coordinates: { lat: -4.035, lng: 39.712 },
    virtualTourUrl: 'https://example.com/tour/1',
    isFeatured: true,
    amenities: {
      schools: ['Nyali Primary School', 'Light Academy'],
      hospitals: ['The Mombasa Hospital', 'Nyali Healthcare'],
      shopping: ['City Mall Nyali', 'Naivas Supermarket']
    }
  },
  {
    id: '2',
    title: 'Prime Residential Plot',
    type: 'Land',
    price: 'KSh 4,500,000',
    priceValue: 4500000,
    location: 'Mtwapa, Mombasa',
    description: 'Quarter-acre plot in a fast-developing neighborhood, perfect for a family home.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    features: ['Ready Title', 'Water & Electricity', 'Fenced'],
    coordinates: { lat: -3.945, lng: 39.745 },
    amenities: {
      schools: ['Mtwapa Elite Academy'],
      hospitals: ['Mtwapa Health Centre'],
      shopping: ['Mtwapa Mall']
    }
  },
  {
    id: '3',
    title: 'Modern 4-Bedroom Villa',
    type: 'House',
    price: 'KSh 28,000,000',
    priceValue: 28000000,
    bedrooms: 4,
    bathrooms: 4,
    location: 'Bamburi, Mombasa',
    description: 'Spacious contemporary villa with a private garden and high-end finishes.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    features: ['Private Garden', 'Gated Community', 'Modern Kitchen'],
    coordinates: { lat: -4.005, lng: 39.725 },
    virtualTourUrl: 'https://example.com/tour/3',
    isFeatured: true,
    amenities: {
      schools: ['Bamburi Primary', 'Braeburn Mombasa'],
      hospitals: ['Bamburi Medical Centre'],
      shopping: ['Bamburi Shopping Centre']
    }
  },
  {
    id: '4',
    title: 'Commercial Office Space',
    type: 'Commercial',
    price: 'KSh 85,000 / Month',
    priceValue: 85000,
    location: 'Mombasa CBD',
    description: 'Strategic office space in a busy commercial hub with ample parking.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    features: ['High Speed Internet', 'Backup Generator', 'Parking'],
    coordinates: { lat: -4.065, lng: 39.665 },
    amenities: {
      schools: [],
      hospitals: ['Coast General Hospital'],
      shopping: ['Mombasa CBD Markets']
    }
  },
  {
    id: '5',
    title: 'Cozy Studio Apartment',
    type: 'Apartment',
    price: 'KSh 3,200,000',
    priceValue: 3200000,
    bedrooms: 1,
    bathrooms: 1,
    location: 'Shanzu, Mombasa',
    description: 'Affordable studio apartment ideal for short-term rentals or young professionals.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    features: ['Near Beach', 'Elevator', 'Balcony'],
    coordinates: { lat: -3.965, lng: 39.755 },
    virtualTourUrl: 'https://example.com/tour/5',
    amenities: {
      schools: ['Shanzu Teachers College'],
      hospitals: ['Shanzu Dispensary'],
      shopping: ['Shanzu Local Market']
    }
  }
];
