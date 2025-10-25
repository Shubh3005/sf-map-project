# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application that visualizes geospatial tweet data on an interactive map using deck.gl and MapLibre. The application displays topic-based tweet aggregations using a 3D hexagon heat map overlay with real-time data fetching.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler, then Vite build)
npm run build

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Application Structure

The app follows a single-page layout structure with two main routes:

- **Entry**: `src/main.tsx` → `src/App.tsx` → `src/routes/WestgateDemo.tsx` (default route)
- **Explorer** (`src/routes/Explorer.tsx`): Main data visualization route that orchestrates:
  - Data fetching from backend API (`http://localhost:3000/api/flattened`)
  - Topic filtering and auto-refresh (5-second intervals)
  - View state management for map navigation
  - Hover interactions and coordinate transformations

### Key Components

**SimpleMap** (`src/components/SimpleMap.tsx`)
- Integrates deck.gl with MapLibre for base map rendering
- Uses `HexagonLayer` (not ScreenGridLayer) for aggregated 3D hexagon visualization
- Handles multiple data formats: API objects with `{lon, lat, text, author, topic}` or tuple arrays `[lon, lat, weight]`
- Uses dark Carto basemap style (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`)
- Key prop: `refreshKey` forces layer recreation when data changes (increment to refresh)
- DeckGLOverlay integration: Custom component using `useControl` hook from react-map-gl to bridge deck.gl and MapLibre

**Sidebar** (`src/components/Sidebar.tsx`)
- Topic selection UI with collapsible sidebar functionality
- Fetches trending topics from `/api/trends` endpoint on mount
- Communicates selections to Explorer via `onTopicSelect` callback
- Supports topic deselection (clicking same topic twice shows full dataset)

**SearchBar** (`src/components/SearchBar.tsx`)
- Location search functionality with geocoding via Pelias API
- Uses `VITE_GEOCODE_API_KEY` environment variable
- Triggers map navigation via `onLocationSelect` callback with smooth fly-to transitions
- Includes debouncing (100ms) for autocomplete API calls

**HoverInfoPanel** (`src/components/HoverInfoPanel.tsx`)
- Displays tweet details when hovering over hexagon cells
- Shows up to 8 tweets from aggregated grid cells
- Handles both single points and aggregated point arrays
- Dynamic height calculation based on number of tweets

**GeminiExplanation** (`src/components/GeminiExplanation.tsx`)
- Fetches AI-generated topic summaries from `/api/summary/{topic}`
- Character-by-character text reveal animation (25ms per character)
- Reset state when topic changes
- Note: Backend uses Claude API (not Gemini despite component name)

### Data Flow

1. Explorer fetches data from backend based on selected topic (or all topics if null)
2. Data is validated for valid coordinates (lat: ±90, lon: ±180, non-zero)
3. Data passed to SimpleMap which converts to deck.gl HexagonLayer
4. Auto-refresh every 5 seconds maintains fresh data
5. Hover interactions bubble up through onHover callbacks to display HoverInfoPanel
6. Layer refreshes are triggered by incrementing `layerRefreshKey` state

### Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling with fast HMR
- **deck.gl** (v9.2.2) for WebGL-powered data visualization
  - Uses HexagonLayer from `@deck.gl/aggregation-layers`
  - MapboxOverlay from `@deck.gl/mapbox` for integration
- **MapLibre GL** (v5.9.0, NOT Mapbox) for base map rendering
- **react-map-gl** (v8.1.0) with `/maplibre` exports for map controls
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin for styling
- **Radix UI** for accessible component primitives (dialog, separator, slot, tooltip)
- **react-router-dom** (v7) for routing

### Environment Variables

Required in `.env`:
- `VITE_GEOCODE_API_KEY`: Pelias geocoding API key for SearchBar location lookup (geocode.earth)
- `CLAUDE_API_KEY`: Claude API key (used by backend for GeminiExplanation summaries)

### TypeScript Configuration

- Strict mode enabled with additional linting rules (`noUnusedLocals`, `noUnusedParameters`, etc.)
- `moduleResolution: "bundler"` for Vite compatibility
- `noEmit: true` (Vite handles transpilation)
- Separate configs for app code (`tsconfig.app.json`) and Vite config (`tsconfig.node.json`)
- Project references setup in root `tsconfig.json`

### Backend API Expectations

The application expects a backend server running on `http://localhost:3000` with endpoints:
- `GET /api/flattened` - All tweet data
- `GET /api/flattened/{topic}` - Filtered by topic
- `GET /api/trends` - List of trending topics
- `GET /api/summary/{topic}` - AI-generated topic summary

Data must include: `{topic: string, lon: number, lat: number, text: string, author: string}`

### Styling Approach

- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Component library: Custom UI components in `src/components/ui/` built with Radix UI primitives
- Utility-first approach with `clsx` and `tailwind-merge` via `src/lib/utils.ts`
- Dark theme with glassmorphism effects (`backdrop-blur-md`, transparency)
- Custom utility: `cn()` function in `src/lib/utils.ts` for className merging

## Important Implementation Notes

### Map Visualization
- When modifying HexagonLayer, ensure `getPosition` handles both array and object data formats
- The `refreshKey` pattern is critical: incrementing it forces deck.gl to recreate the layer
- Weight functions (`getElevationWeight`, `getColorWeight`) use author name hash for consistency
- Hexagon radius is in meters (not pixels): `cellSize * 100`

### State Management
- No external state management library used (React useState/useCallback only)
- View state is managed in Explorer and passed down to SimpleMap
- Data fetching uses native fetch API with async/await

### React Map GL Integration
- Import from `react-map-gl/maplibre` (not `react-map-gl`)
- Use `maplibregl` import for mapLib prop on Map component
- DeckGLOverlay uses `useControl` hook pattern for integration
