import React, { useMemo } from 'react';
import { Map, useControl } from 'react-map-gl/maplibre';
import { MapboxOverlay } from '@deck.gl/mapbox';
import type { PickingInfo } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import { Layer } from '@deck.gl/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Define SF311 types locally to avoid import issues
export interface SF311Issue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  source: string;
  coordinates?: [number, number]; // [longitude, latitude]
  neighborhood?: string;
  metadata: Record<string, any>;
}

export interface SF311Request {
  id: string;
  offense_type: string;
  description: string;
  address: string;
  coordinates?: [number, number]; // [longitude, latitude]
  neighborhood?: string;
  severity: 'high' | 'medium' | 'low';
  offense_id: string;
}

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

  // SF311 Data
  sf311Issues?: SF311Issue[];
  sf311Requests?: SF311Request[];

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
    sf311Issues = [],
    sf311Requests = [],
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

    // Add SF311 Issues as red dots
    if (sf311Issues.length > 0) {
      console.log(`🗺️ SimpleMap: Processing ${sf311Issues.length} SF311 issues`);
      
      const validIssues = sf311Issues.filter(issue => {
        const isValid = issue.coordinates && 
          issue.coordinates.length === 2 && 
          !isNaN(issue.coordinates[0]) && 
          !isNaN(issue.coordinates[1]);
        
        if (!isValid) {
          console.log(`❌ Invalid coordinates for issue ${issue.id}:`, issue.coordinates);
        } else {
          console.log(`✅ Valid coordinates for issue ${issue.id}:`, issue.coordinates, `(${issue.coordinates[1]}, ${issue.coordinates[0]})`);
        }
        
        return isValid;
      });

      console.log(`🗺️ SimpleMap: ${validIssues.length} valid SF311 issues will be displayed`);

      if (validIssues.length > 0) {
        const issuesLayer = new ScatterplotLayer({
          id: `sf311-issues-${refreshKey}`,
          data: validIssues,
          getPosition: (d: SF311Issue) => d.coordinates!,
          getRadius: (d: SF311Issue) => {
            // Make dots much larger for testing
            switch (d.severity) {
              case 'high': return 50;
              case 'medium': return 30;
              case 'low': return 20;
              default: return 15;
            }
          },
          getFillColor: (d: SF311Issue) => {
            // Color based on severity - make more opaque for testing
            switch (d.severity) {
              case 'high': return [239, 68, 68, 255]; // Red - fully opaque
              case 'medium': return [251, 146, 60, 255]; // Orange - fully opaque
              case 'low': return [34, 197, 94, 255]; // Green - fully opaque
              default: return [156, 163, 175, 255]; // Gray - fully opaque
            }
          },
          getLineColor: (d: SF311Issue) => {
            // Border color based on severity
            switch (d.severity) {
              case 'high': return [185, 28, 28, 255]; // Dark red
              case 'medium': return [194, 65, 12, 255]; // Dark orange
              case 'low': return [21, 128, 61, 255]; // Dark green
              default: return [107, 114, 128, 255]; // Dark gray
            }
          },
          lineWidthMinPixels: 1,
          pickable,
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
        });
        
        console.log(`🗺️ SimpleMap: Created SF311 issues layer with ${validIssues.length} points`);
        console.log(`🗺️ SimpleMap: Sample issue data:`, validIssues[0]);
        allLayers.push(issuesLayer);
      }
    }

    // Add SF311 Raw Requests as smaller blue dots
    if (sf311Requests.length > 0) {
      console.log(`🗺️ SimpleMap: Processing ${sf311Requests.length} SF311 raw requests`);
      
      const validRequests = sf311Requests.filter(request => {
        const isValid = request.coordinates && 
          request.coordinates.length === 2 && 
          !isNaN(request.coordinates[0]) && 
          !isNaN(request.coordinates[1]);
        
        if (!isValid) {
          console.log(`❌ Invalid coordinates for request ${request.id}:`, request.coordinates);
        } else {
          console.log(`✅ Valid coordinates for request ${request.id}:`, request.coordinates, `(${request.coordinates[1]}, ${request.coordinates[0]})`);
        }
        
        return isValid;
      });

      console.log(`🗺️ SimpleMap: ${validRequests.length} valid SF311 raw requests will be displayed`);

      if (validRequests.length > 0) {
        const requestsLayer = new ScatterplotLayer({
          id: `sf311-requests-${refreshKey}`,
          data: validRequests,
          getPosition: (d: SF311Request) => d.coordinates!,
          getRadius: 15, // Make raw request dots larger for testing
          getFillColor: [59, 130, 246, 255], // Blue - fully opaque for testing
          getLineColor: [29, 78, 216, 255], // Dark blue border
          lineWidthMinPixels: 0.5,
          pickable,
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
        });
        
        console.log(`🗺️ SimpleMap: Created SF311 requests layer with ${validRequests.length} points`);
        console.log(`🗺️ SimpleMap: Sample request data:`, validRequests[0]);
        allLayers.push(requestsLayer);
      }
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

    console.log(`🗺️ SimpleMap: Total layers created: ${allLayers.length}`);
    allLayers.forEach((layer, index) => {
      console.log(`🗺️ SimpleMap: Layer ${index + 1}: ${layer.id}`);
    });

    return allLayers;
  }, [data, opacity, cellSize, colorRange, colorDomain, aggregation, sf311Issues, sf311Requests, pickable, onHover, onClick, refreshKey, searchMarker]);

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
