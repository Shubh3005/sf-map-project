# SF Map Project

An interactive web application for visualizing and analyzing urban data through an intelligent mapping interface with AI-powered insights and report generation.

## Overview

SF Map Project is a React-based frontend that provides an intuitive interface for exploring city data, generating reports, and managing civic goals. It integrates with Theages Backend API to deliver real-time data visualization, interactive maps, and AI-generated insights for urban planning and community engagement.

## Architecture

```
sf-map-project/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── SimpleMap.tsx    # Main mapping component
│   │   ├── CityPopup.tsx    # Location details overlay
│   │   ├── ReportBuilder.tsx # Report creation interface
│   │   ├── SearchBar.tsx    # Location search
│   │   └── ...              # Additional UI components
│   ├── routes/              # Page components
│   │   ├── WestgateDemo.tsx # Main application view
│   │   └── GoalsManagement.tsx # Goal tracking interface
│   ├── services/            # API integration
│   │   └── api.ts          # Backend API client
│   ├── data/               # Mock data and types
│   │   └── mockCities.ts   # Sample city data
│   ├── utils/              # Helper functions
│   │   └── pdfGenerator.ts # PDF report generation
│   └── App.tsx             # Main application component
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Key Features

### 🗺️ Interactive Mapping
- **Deck.gl Integration**: High-performance data visualization
- **Multi-layer Support**: Crime data, SF311 requests, neighborhood insights
- **Real-time Updates**: Live data from backend APIs
- **Geographic Filtering**: Neighborhood and district-level analysis

### 📊 Data Visualization
- **Heat Maps**: Crime density and service request patterns
- **Scatter Plots**: Individual incident mapping
- **Hexagon Layers**: Aggregated data visualization
- **Interactive Popups**: Detailed information on demand

### 📈 Report Generation
- **AI-Powered Insights**: Automated analysis and recommendations
- **PDF Export**: Professional report generation
- **Customizable Templates**: Flexible report formatting
- **Real-time Data**: Live integration with backend services

### 🎯 Goal Management
- **Civic Goal Tracking**: Monitor community initiatives
- **Progress Analytics**: Visual progress indicators
- **Integration**: Seamless connection with report generation

### 🔍 Search & Discovery
- **Location Search**: Find specific areas of interest
- **Filter Options**: Customize data views
- **Neighborhood Insights**: AI-generated local analysis

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Mapping**: Deck.gl, MapLibre GL, React Map GL
- **Styling**: Tailwind CSS with Radix UI components
- **Build Tool**: Vite
- **PDF Generation**: jsPDF
- **State Management**: React Hooks and Context

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Main App: http://localhost:5173
   - Goals Management: http://localhost:5173/goals

4. **Build for production**:
   ```bash
   npm run build
   ```

## Key Components

### SimpleMap
The core mapping component featuring:
- Multi-layer data visualization
- Interactive popups and tooltips
- Smooth animations and transitions
- Responsive design for all devices

### WestgateDemo
Main application interface with:
- Integrated map and data panels
- Real-time SF311 data display
- Neighborhood insights and analysis
- Report generation capabilities

### GoalsManagement
Dedicated interface for:
- Creating and tracking civic goals
- Progress monitoring and analytics
- Integration with report generation

## Data Integration

The frontend seamlessly integrates with Theages Backend API to provide:
- **Real-time SF311 Data**: Live service request information
- **Crime Statistics**: Historical and current crime data
- **Neighborhood Analytics**: Demographics and quality metrics
- **AI-Generated Insights**: Automated analysis and recommendations

## Features in Action

- **Explore**: Navigate the map to discover data patterns
- **Analyze**: Use AI-powered insights to understand local issues
- **Report**: Generate professional reports with actionable recommendations
- **Track**: Monitor progress on civic goals and initiatives
- **Share**: Export findings for community engagement

The application transforms complex urban data into accessible, actionable insights for better city planning and community involvement.