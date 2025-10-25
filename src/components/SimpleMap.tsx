import React, { useMemo } from 'react';
import { Map, useControl } from 'react-map-gl/maplibre';
import { MapboxOverlay } from '@deck.gl/mapbox';
import type { PickingInfo } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { IconLayer } from '@deck.gl/layers';
import { Layer } from '@deck.gl/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Define types
type Color = [number, number, number, number];
export type DataPoint = [longitude: number, latitude: number, count: number];

// Define API data structure
export interface APIDataPoint {
  topic: string;
  lon: number;
  lat: number;
  text: string;
  author: string;
}

// Type definition for the DeckGLOverlay props
interface DeckGLOverlayProps {
  layers: Layer[];
  interleaved?: boolean;
  onHover?: (info: PickingInfo) => void;
}

// The DeckGLOverlay component that integrates deck.gl with MapLibre
function DeckGLOverlay(props: DeckGLOverlayProps) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

// Default color range for the grid - Yellow to Red to Green
const DEFAULT_COLOR_RANGE: Color[] = [
  [34, 197, 94, 180],   // Green (low risk)
  [132, 204, 22, 200],  // Lime green
  [234, 179, 8, 220],   // Yellow (medium risk)
  [251, 146, 60, 235],  // Orange
  [239, 68, 68, 250],   // Red (high risk)
  [220, 38, 38, 255]    // Dark red
];

export interface SimpleMapProps {
  // Basic styling
  className?: string;
  style?: React.CSSProperties;

  // View state
  viewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };

  // Data visualization
  data?: DataPoint[] | APIDataPoint[] | string;
  colorRange?: Color[];
  opacity?: number;
  cellSize?: number;
  aggregation?: 'SUM' | 'MEAN' | 'MIN' | 'MAX';
  colorDomain?: [number, number];

  // Interactivity
  pickable?: boolean;
  onHover?: (info: PickingInfo) => void;
  onClick?: (info: PickingInfo) => void;
  onViewStateChange?: (params: any) => void;

  // Force refresh
  refreshKey?: number;

  // Search marker
  searchMarker?: {
    longitude: number;
    latitude: number;
    label?: string;
  } | null;
}

const SimpleMap: React.FC<SimpleMapProps> = (props) => {
  const {
    className,
    style,
    viewState = {
      longitude: -95,
      latitude: 40,
      zoom: 4,
      pitch: 0,
      bearing: 0
    },
    data = [],
    colorRange = DEFAULT_COLOR_RANGE,
    opacity = 0.8,
    cellSize = 12,
    aggregation = 'SUM',
    colorDomain = [0, 20],
    pickable = false,
    onHover,
    onClick,
    onViewStateChange,
    refreshKey = 0,
    searchMarker = null
  } = props;

  //Helper function to handle different data input types
  const getDataSource = (inputData: string | DataPoint[] | APIDataPoint[] | undefined): string | DataPoint[] | APIDataPoint[] => {
    if (!inputData || (Array.isArray(inputData) && inputData.length === 0)) {
      console.log("SimpleMap: No data provided, returning empty array");
      return [];
    }
    
    if (Array.isArray(inputData)) {
      console.log("SimpleMap: Data source provided: Data array with", inputData.length, "items");
      // Log sample data for debugging
      if (inputData.length > 0) {
        console.log("SimpleMap: Sample data point:", inputData[0]);
        // Count valid coordinates
        const validCount = inputData.filter(item => {
          if (Array.isArray(item)) {
            return typeof item[0] === 'number' && typeof item[1] === 'number';
          } else {
            return typeof item.lat === 'number' && typeof item.lon === 'number';
          }
        }).length;
        console.log(`SimpleMap: ${validCount}/${inputData.length} items have valid coordinates`);
      }
    } else {
      console.log("SimpleMap: Data source provided: URL string");
    }
    
    return inputData;
  };

  //Create HexagonLayer to visualize data in 3D
  const layers = useMemo(() => {
    const dataSource = getDataSource(data);
    const allLayers: Layer[] = [];

    if (Array.isArray(dataSource) && dataSource.length === 0) {
      console.log("SimpleMap: Empty data array, not creating layer");
    } else {
      //Debug statements
      console.log("SimpleMap: Creating HexagonLayer with data source",
                  typeof dataSource === 'string' ? dataSource : `Array with ${dataSource.length} items`);
      console.log(`SimpleMap: Layer dependencies changed, recreating HexagonLayer with refreshKey: ${refreshKey}`);

      allLayers.push(
        new HexagonLayer({
        id: `hexagon-${refreshKey}`, //Include refresh key to force layer recreation
        data: dataSource,
        opacity,
        getPosition: d => {
          // Handle different data structures
          if (Array.isArray(d)) {
            // If it's our original array format [lon, lat, intensity]
            return [d[0], d[1]];
          } else if (d && typeof d.lon === 'number' && typeof d.lat === 'number') {
            // If it's from the API with lon/lat properties
            return [d.lon, d.lat];
          }
          console.warn('SimpleMap: Invalid data point for position:', d);
          return [0, 0]; // Fallback
        },
        getElevationWeight: d => {
          // Generate a random but consistent weight between 1-3 based on a property of the data
          if (Array.isArray(d)) {
            return d[2] || Math.floor(Math.random() * 3) + 1;
          } else if (d.author) {
            // Use the last character of the author's name to generate a consistent random number
            const lastChar = d.author.charCodeAt(d.author.length - 1) || 1;
            return (lastChar % 3) + 1; // Will return 1, 2, or 3
          }
          return Math.floor(Math.random() * 3) + 1; // Default random weight
        },
        getColorWeight: d => {
          // Same weight for color consistency
          if (Array.isArray(d)) {
            return d[2] || Math.floor(Math.random() * 3) + 1;
          } else if (d.author) {
            const lastChar = d.author.charCodeAt(d.author.length - 1) || 1;
            return (lastChar % 3) + 1;
          }
          return Math.floor(Math.random() * 3) + 1;
        },
        radius: cellSize * 100, // Convert to meters (cellSize was in pixels, now in meters)
        elevationScale: 20, // Much lower height multiplier for subtle 3D effect (was 100)
        extruded: true, // Enable 3D extrusion
        colorRange,
        elevationRange: [0, 500], // Much lower height range in meters (was 3000) - appears 2D when zoomed out, 3D when zoomed in
        coverage: 0.9, // How much of the hexagon to fill
        pickable,
        material: {
          ambient: 0.64,
          diffuse: 0.6,
          shininess: 32,
          specularColor: [51, 51, 51]
        },
        onHover: (info) => {
          if (onHover) {
            onHover(info);
          }
          return false;
        },
        onClick: (info) => {
          if (onClick) {
            onClick(info);
          }
          return false;
        }
      })
      );
    }

    // Add search marker if provided
    if (searchMarker) {
      // Create an SVG pin icon data URL
      const pinIcon = `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EF4444" stroke="#991B1B" stroke-width="1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `)}`;

      allLayers.push(
        new IconLayer({
          id: 'search-marker',
          data: [searchMarker],
          getIcon: () => ({
            url: pinIcon,
            width: 48,
            height: 48,
            anchorY: 48,
          }),
          getPosition: (d) => [d.longitude, d.latitude],
          getSize: 48,
          sizeScale: 1,
          pickable: true,
        })
      );
    }

    return allLayers;
  }, [data, opacity, cellSize, colorRange, colorDomain, aggregation, pickable, onHover, onClick, refreshKey, searchMarker]);

  return (
    <div 
      className={className}
      style={{ 
        width: "100%", 
        height: "100%", 
        position: "relative",
        ...style 
      }}
    >
      <Map
        mapLib={maplibregl}
        {...viewState}
        onMove={(evt) => {
          // Handle view state changes
          if (onViewStateChange) {
            onViewStateChange({ viewState: evt.viewState });
          }
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <DeckGLOverlay layers={layers} />
      </Map>
    </div>
  );
};

export default SimpleMap;
