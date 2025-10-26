import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FlyToInterpolator } from '@deck.gl/core';
import SimpleMap from '../components/SimpleMap';
import Sidebar from '../components/Sidebar';
import HoverInfoPanel from '../components/HoverInfoPanel';
import SearchBar from '../components/SearchBar';
import { GeminiExplanation } from '../components/GeminiExplanation';

//Types for type safety
interface TweetData {
  topic: string;
  lon: number;
  lat: number;
  text: string;
  author: string;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface HoverInfo {
  object?: any;
  coordinate?: number[];
  pixel?: number[];
  layer?: any;
}

//API URL for server access
const BASE_API_URL = 'http://localhost:3000/api/flattened';


const Explorer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // State for data management
  const [currentData, setCurrentData] = useState<TweetData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //State for hover information
  const [hoverInfo, setHoverInfo] = useState<{
    coordinate: [number, number];
    tweets: Array<{text: string; author: string; topic: string}>;
  } | null>(null);

  //Ref to store the timeout ID for clearing hover info
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  //State to force screen grid layer refresh
  const [layerRefreshKey, setLayerRefreshKey] = useState<number>(0);

  //State for search marker
  const [searchMarker, setSearchMarker] = useState<{ longitude: number; latitude: number; label?: string } | null>(null);

  // Navigation handler - cycles through routes
  const handleLogoClick = useCallback(() => {
    const routes = ['/', '/explorer', '/goals'];
    const currentIndex = routes.indexOf(location.pathname);
    const nextIndex = (currentIndex + 1) % routes.length;
    navigate(routes[nextIndex]);
  }, [location.pathname, navigate]);

  // Get next route name for tooltip
  const getNextRouteName = useCallback(() => {
    const routeNames: Record<string, string> = {
      '/': 'Explorer',
      '/explorer': 'Goals Management',
      '/goals': 'Westgate Demo'
    };
    const routes = ['/', '/explorer', '/goals'];
    const currentIndex = routes.indexOf(location.pathname);
    const nextIndex = (currentIndex + 1) % routes.length;
    return routeNames[routes[nextIndex]];
  }, [location.pathname]);

  //Function to fetch data based on selected topic
  const fetchData = useCallback(async (topic: string | null) => {
    setIsLoading(true);
    try {
      const url = topic ? `${BASE_API_URL}/${topic}` : BASE_API_URL;
      console.log('Fetching data from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Filter out items without valid coordinates on client side as well
      const validData = data.filter((item: any) => {
        const hasValidCoords = typeof item.lat === 'number' && typeof item.lon === 'number' &&
                              !isNaN(item.lat) && !isNaN(item.lon) &&
                              item.lat !== 0 && item.lon !== 0 &&
                              Math.abs(item.lat) <= 90 && Math.abs(item.lon) <= 180;

        if (!hasValidCoords) {
          console.log('Filtering out invalid coordinates:', item);
        }
        return hasValidCoords;
      });
      
      setCurrentData([...validData]);
      console.log(`Loaded ${data.length} total items, ${validData.length} with valid coordinates for topic:`, topic || 'all topics');
      
      //Force layer refresh by updating the key
      setLayerRefreshKey(prev => prev + 1);
      
      //Log some sample data to debug
      if (validData.length > 0) {
        console.log('Sample valid data points:', validData.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCurrentData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //State for controlling the map view
  const [viewState, setViewState] = useState<ViewState>({
  longitude: -122.4194, // SF longitude
  latitude: 37.7749,    // SF latitude
  zoom: 10,             // Closer zoom for city view
  pitch: 45,            // Tilt to see 3D hexagons
  bearing: 0
});

  // Handle location selection from search bar
  const handleLocationSelect = useCallback((longitude: number, latitude: number, cityName?: string) => {
    console.log(`Flying to coordinates: [${longitude}, ${latitude}]`);

    setViewState(prevState => ({
      ...prevState,
      longitude,
      latitude,
      zoom: 6.5, // Zoom in when selecting a location
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t: number) => t * (2 - t), // Smooth ease-out
    }));

    // Set search marker
    setSearchMarker({
      longitude,
      latitude,
      label: cityName || 'Searched Location'
    });
  }, []);

  // Handle view state changes from the map
  const handleViewStateChange = useCallback((params: { viewState: ViewState }) => {
    setViewState(params.viewState);
  }, []);

  // Function to handle hover info with 5-second timeout
  const handleHover = useCallback((info: HoverInfo) => {
    // Clear any existing timeout
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }

    if (info && info.object && info.coordinate) {
      let tweets: Array<{text: string; author: string; topic: string}> = [];
      
      if (info.object.points && Array.isArray(info.object.points)) {
        // Extract up to 8 tweets from the aggregated points
        tweets = info.object.points.slice(0, 8).map((point: any) => ({
          text: point.text || 'No text available',
          author: point.author || 'Unknown',
          topic: point.topic || 'No topic'
        }));
      } else if (info.object.text) {
        // Single point case
        tweets = [{
          text: info.object.text || 'No text available',
          author: info.object.author || 'Unknown',
          topic: info.object.topic || 'No topic'
        }];
      }

      if (tweets.length > 0 && info.coordinate && info.coordinate.length >= 2) {
        setHoverInfo({
          coordinate: [info.coordinate[0], info.coordinate[1]],
          tweets
        });

        // Set timeout to clear hover info after 5 seconds
     
      }
    } else {
      setHoverInfo(null);
    }
  }, []);

const handleTopicSelect = useCallback((topic: string | null) => {
  console.log('Explorer: Topic selection changed to:', topic);
  setSelectedTopic(topic);
  fetchData(topic); // This will handle the API call and data update
}, [fetchData]);

  // Initial data load
  useEffect(() => {
    fetchData(null);
  }, [fetchData]);

  // Add this useEffect after line 149 (after your initial data load useEffect)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing data every 5 seconds for topic:', selectedTopic || 'all topics');
      fetchData(selectedTopic);
    }, 5000);

  return () => {
    clearInterval(intervalId);
  };


}, [selectedTopic, fetchData]);

  // Log when currentData changes
  
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-gray-800 to-black">
        {/* Top Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-b border-slate-700/50 shadow-2xl">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Logo Section with Navigation */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-4 group relative cursor-pointer hover:opacity-90 transition-opacity"
              title={`Switch to ${getNextRouteName()}`}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-white tracking-tight group-hover:text-blue-300 transition-colors">
                  Explorer
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Tweet Data Visualization
                </p>
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-12 left-0 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border border-slate-700">
                Switch to {getNextRouteName()}
                <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 border-l border-t border-slate-700 transform rotate-45"></div>
              </div>
            </button>

            {/* Search Bar - Centered */}
            <div className="w-2/5 max-w-2xl">
              <SearchBar onLocationSelect={handleLocationSelect} />
            </div>

            {/* Spacer for balance */}
            <div className="w-64"></div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-black/70 text-white px-4 py-2 rounded-lg">
            Loading {selectedTopic ? `"${selectedTopic}"` : 'all'} data...
          </div>
        )}

      {/* Map background */}
      <div className="absolute inset-0 z-0">
        <SimpleMap
          data={currentData}
          opacity={0.8}
          cellSize={12}
          colorDomain={[0, 20]}
          aggregation="SUM"
          pickable={true}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          onHover={handleHover}
          refreshKey={layerRefreshKey}
          searchMarker={searchMarker}
        />
      </div>
      
      {/* Content layer with sidebar - positioned above the globe */}
      <div className="relative z-10 flex h-full w-full pointer-events-none">
        <div className="pointer-events-auto">
          <Sidebar 
            className="rounded-md h-[80vh] m-4 p-4 bg-opacity-50 backdrop-blur-md border border-gray-700/50"
            onTopicSelect={handleTopicSelect}
          />
        </div>
        
        {/* empty div to maintain flex */}
        <div className="flex-1"></div>
        
        {/* Right panel with hover info */}
        <div className="pointer-events-auto mr-4 mt-4">
          <HoverInfoPanel className="w-64" hoverInfo={hoverInfo} />
          <GeminiExplanation 
            topic={selectedTopic}
            className="mb-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Explorer;