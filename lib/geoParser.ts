
// lib/geoParser.ts

import { OpenCageGeocodeResult } from './types';

const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '';

export async function parseLocationsFromText(text: string): Promise<string[]> {
  if (!OPENCAGE_API_KEY) {
    console.warn('OpenCage API key not set');
    return [];
  }

  const words = text.split(/\s|,|\.|\n/).filter(Boolean);

  const locations = new Set<string>();

  for (const word of words) {
    try {
      const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(word)}&key=${OPENCAGE_API_KEY}&limit=1`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const components = data.results[0].components;
        const place = components.city || components.town || components.village || components.state || components.country;
        if (place) {
          locations.add(place);
        }
      }
    } catch (err) {
      console.error('Error parsing location:', err);
    }
  }

  return Array.from(locations);
}
