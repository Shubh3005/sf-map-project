import React, { useState, useEffect, useRef } from 'react';

// Type definitions
export interface AutocompleteSuggestion {
  placeId: string;
  name: string;
  city?: string;
  state?: string;
  country: string;
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const api_key = import.meta.env.VITE_GEOCODE_API_KEY || '';

interface SearchBarProps {
  onLocationSelect?: (longitude: number, latitude: number, cityName?: string) => void;
  className?: string;
}

// Function to fetch autocomplete suggestions from Pelias
async function fetchPeliasSuggestions(query: string): Promise<AutocompleteSuggestion[]> {
  if (query.length < 3) {
    return [];
  }

  // You may need to replace this with your Pelias endpoint
  const endpoint = `https://api.geocode.earth/v1/autocomplete?api_key=${api_key}&text=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();

    // Define the type for Pelias feature
    type PeliasFeature = {
      properties: {
        id: string;
        name: string;
        locality?: string;
        region?: string;
        country: string;
      };
      geometry: {
        coordinates: [number, number];
      };
    };

    // Map the Pelias response to our suggestion format
    return data.features.map((feature: PeliasFeature) => ({
      placeId: feature.properties.id,
      name: feature.properties.name,
      city: feature.properties.locality,
      state: feature.properties.region,
      country: feature.properties.country,
      geometry: feature.geometry
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    
    // For demo purposes, return mock data if the API fails
    
    return [];
  }
}

// Function to parse coordinate inputs
function parseCoordinates(input: string): { longitude: number; latitude: number } | null {
  // Remove extra spaces and trim
  const cleaned = input.trim().replace(/\s+/g, ' ');

  // Try to match various coordinate formats:
  // 1. "lat, lon" or "latitude, longitude"
  // 2. "lon, lat" or "longitude, latitude"
  // 3. Just two numbers separated by comma or space
  const coordRegex = /^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/;
  const match = cleaned.match(coordRegex);

  if (match) {
    const num1 = parseFloat(match[1]);
    const num2 = parseFloat(match[2]);

    // Validate that numbers are in valid range
    // If first number is within latitude range (-90 to 90), assume lat,lon format
    if (Math.abs(num1) <= 90 && Math.abs(num2) <= 180) {
      return { latitude: num1, longitude: num2 };
    }
    // If first number is within longitude range, assume lon,lat format
    else if (Math.abs(num1) <= 180 && Math.abs(num2) <= 90) {
      return { latitude: num2, longitude: num1 };
    }
  }

  return null;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, className }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinateMatch, setCoordinateMatch] = useState<{ longitude: number; latitude: number } | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        setCoordinateMatch(null);
        return;
      }

      // First check if the input is a coordinate
      const coords = parseCoordinates(query);
      if (coords) {
        setCoordinateMatch(coords);
        setSuggestions([]);
        setIsLoading(false);
        return;
      } else {
        setCoordinateMatch(null);
      }

      setIsLoading(true);
      const results = await fetchPeliasSuggestions(query);
      setSuggestions(results);
      setIsLoading(false);
    };

    // Debounce the API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);

    // Extract coordinates and call the callback
    const [longitude, latitude] = suggestion.geometry.coordinates;

    if (onLocationSelect) {
      onLocationSelect(longitude, latitude, suggestion.name);
    }

    console.log(`Selected location: ${suggestion.name} at [${longitude}, ${latitude}]`);
  };

  const handleCoordinateSelect = () => {
    if (coordinateMatch && onLocationSelect) {
      onLocationSelect(
        coordinateMatch.longitude,
        coordinateMatch.latitude,
        `${coordinateMatch.latitude.toFixed(4)}, ${coordinateMatch.longitude.toFixed(4)}`
      );
      setShowSuggestions(false);
      console.log(`Navigating to coordinates: [${coordinateMatch.longitude}, ${coordinateMatch.latitude}]`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (coordinateMatch) {
        handleCoordinateSelect();
      } else if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      }
    }
  };

  return (
    <div 
      ref={searchRef} 
      className={`relative ${className || ''}`}
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search location or coordinates (lat, lon)"
          className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 text-white placeholder:text-slate-400 p-3.5 pl-11 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-lg"
        />
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        {isLoading && (
          <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-blue-400">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {showSuggestions && (coordinateMatch || suggestions.length > 0) && (
        <ul className="absolute z-50 mt-2 w-full bg-slate-900/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl max-h-72 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {coordinateMatch && (
            <li
              onClick={handleCoordinateSelect}
              className="px-4 py-3.5 hover:bg-slate-800/70 cursor-pointer text-white transition-all duration-150 flex items-center gap-3 border-b border-slate-700/50 group"
            >
              <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-blue-300">Go to Coordinates</span>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  Lat: {coordinateMatch.latitude.toFixed(4)}, Lon: {coordinateMatch.longitude.toFixed(4)}
                </div>
              </div>
            </li>
          )}
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.placeId}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-3.5 hover:bg-slate-800/70 cursor-pointer text-white transition-all duration-150 flex flex-col group"
            >
              <span className="font-semibold group-hover:text-blue-300 transition-colors">{suggestion.name}</span>
              <span className="text-xs text-slate-400 mt-1">
                {[suggestion.city, suggestion.state, suggestion.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;