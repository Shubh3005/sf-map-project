# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application that visualizes geospatial tweet data on an interactive map using deck.gl and MapLibre. The application displays topic-based tweet aggregations using a heat map overlay with real-time data fetching.

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

The app follows a single-page layout structure with the Explorer route as the main view:

- **Entry**: `src/main.tsx` → `src/App.tsx` → `src/routes/Explorer.tsx`
- **Explorer** (`src/routes/Explorer.tsx`): Main orchestrator that manages:
  - Data fetching from backend API (`http://localhost:3000/api/flattened`)
  - Topic filtering and auto-refresh (5-second intervals)
  - View state management for map navigation
  - Hover interactions and coordinate transformations

### Key Components

**SimpleMap** (`src/components/SimpleMap.tsx`)
- Integrates deck.gl with MapLibre for base map rendering
- Uses `ScreenGridLayer` for aggregated heat map visualization
- Handles multiple data formats: API objects with `{lon, lat, text, author, topic}` or tuple arrays `[lon, lat, weight]`
- Uses dark Carto basemap style
- Key prop: `refreshKey` forces layer recreation when data changes

**Sidebar** (`src/components/Sidebar.tsx`)
- Topic selection UI that triggers data filtering via API calls
- Communicates selections to Explorer via `onTopicSelect` callback

**SearchBar** (`src/components/SearchBar.tsx`)
- Location search functionality with geocoding
- Uses `VITE_GEOCODE_API_KEY` environment variable
- Triggers map navigation via `onLocationSelect` callback with smooth fly-to transitions

**HoverInfoPanel** (`src/components/HoverInfoPanel.tsx`)
- Displays tweet details when hovering over heat map cells
- Shows up to 8 tweets from aggregated grid cells
- Handles both single points and aggregated point arrays

**GeminiExplanation** (`src/components/GeminiExplanation.tsx`)
- Fetches AI-generated topic summaries from `/api/summary/{topic}`
- Character-by-character text reveal animation
- Reset state when topic changes

### Data Flow

1. Explorer fetches data from backend based on selected topic (or all topics if null)
2. Data is validated for valid coordinates (lat: ±90, lon: ±180, non-zero)
3. Data passed to SimpleMap which converts to deck.gl ScreenGridLayer
4. Auto-refresh every 5 seconds maintains fresh data
5. Hover interactions bubble up through onHover callbacks to display HoverInfoPanel

### Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling with fast HMR
- **deck.gl** (v9.2.2) for WebGL-powered data visualization
- **MapLibre GL** (not Mapbox) for base map rendering
- **Tailwind CSS v4** with Vite plugin for styling
- **Radix UI** for accessible component primitives
- **react-router-dom** (v7) for routing (currently single route)

### Environment Variables

Required in `.env`:
- `VITE_GEOCODE_API_KEY`: Geocoding API key for SearchBar location lookup
- `CLAUDE_API_KEY`: Claude API key (used by backend for GeminiExplanation)

### TypeScript Configuration

- Strict mode enabled with additional linting rules
- `moduleResolution: "bundler"` for Vite compatibility
- `noEmit: true` (Vite handles transpilation)
- Separate configs for app code (`tsconfig.app.json`) and Vite config (`tsconfig.node.json`)

### Backend API Expectations

The application expects a backend server running on `http://localhost:3000` with endpoints:
- `GET /api/flattened` - All tweet data
- `GET /api/flattened/{topic}` - Filtered by topic
- `GET /api/summary/{topic}` - AI-generated topic summary

Data must include: `{topic: string, lon: number, lat: number, text: string, author: string}`

### Styling Approach

- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Component library: Custom UI components in `src/components/ui/` built with Radix UI primitives
- Utility-first approach with `clsx` and `tailwind-merge` via `src/lib/utils.ts`
- Dark theme with glassmorphism effects (`backdrop-blur-md`, transparency)
