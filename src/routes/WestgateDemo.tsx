import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FlyToInterpolator } from '@deck.gl/core';
import SimpleMap from '../components/SimpleMap';
import CityPopup from '../components/CityPopup';
import SolutionDetailPanel from '../components/SolutionDetailPanel';
import ReportBuilder from '../components/ReportBuilder';
import CityDetailsPanel from '../components/CityDetailsPanel';
import SearchBar from '../components/SearchBar';
import type { CityData, Problem, Solution } from '../data/mockCities';
import { mockCities } from '../data/mockCities';
import { generateCityReport } from '../utils/pdfGenerator';

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface ReportItem {
  problem: Problem;
  solution: Solution;
}

const WestgateDemo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [viewState, setViewState] = useState<ViewState>({
    longitude: -121.4944,
    latitude: 38.5816,
    zoom: 6,
    pitch: 45,
    bearing: 0,
  });

  // Navigation handler - toggles between two routes
  const handleLogoClick = useCallback(() => {
    // Toggle between Westgate Demo (/) and Goals Management (/goals)
    navigate(location.pathname === '/' ? '/goals' : '/');
  }, [location.pathname, navigate]);

  // Get next route name for tooltip
  const getNextRouteName = useCallback(() => {
    return location.pathname === '/' ? 'Goals Management' : 'Westgate Demo';
  }, [location.pathname]);

  const [selectedCity, setSelectedCity] = useState<CityData | null>(mockCities[0]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [searchMarker, setSearchMarker] = useState<{ longitude: number; latitude: number; label?: string } | null>(null);

  // Handle location search
  const handleLocationSelect = useCallback((longitude: number, latitude: number, cityName?: string) => {
    // Update map view
    setViewState(prev => ({
      ...prev,
      longitude,
      latitude,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    }));

    // Set search marker
    setSearchMarker({
      longitude,
      latitude,
      label: cityName || 'Searched Location'
    });

    // Create a new city object for the searched location
    const searchedCity: CityData = {
      id: `searched-${Date.now()}`, // Generate unique ID
      name: cityName || 'Searched Location',
      county: 'Unknown',
      latitude: latitude,
      longitude: longitude,
      riskLevel: 'low' as const,
      metrics: {
        population: 0,
        medianIncome: 0,
        crimeRate: 0,
        vacancyRate: 0,
        foreclosureRate: 0,
        taxDelinquency: 0,
        unemploymentRate: 0,
        povertyRate: 0,
      },
      problems: [], // Add empty problems array
      solutions: [] // Add empty solutions array
    };

    // Set the searched city as selected
    setSelectedCity(searchedCity);

    console.log(`Selected searched location: ${cityName || 'Unknown'} at [${longitude}, ${latitude}]`);
  }, []);

  // Handle view state changes
  const handleViewStateChange = useCallback((params: { viewState: ViewState }) => {
    setViewState(params.viewState);
  }, []);

  // Handle "See Solution" click
  const handleSeeSolution = useCallback((problemId: string) => {
    // Find the first solution for this problem
    if (selectedCity) {
      const problem = selectedCity.problems.find(p => p.id === problemId);
      if (problem) {
        // Find solutions that match this problem's city prefix
        const cityPrefix = problemId.split('-')[0];
        const solutions = selectedCity.solutions.filter(s => s.id.startsWith(cityPrefix));
        if (solutions.length > 0) {
          setSelectedSolution(solutions[0]);
        }
      }
    }
  }, [selectedCity]);

  // Handle adding solution to report
  const handleAddToReport = useCallback((solution: Solution) => {
    if (!selectedCity) return;

    // Find the problem this solution addresses
    const cityPrefix = solution.id.split('-sol-')[0];
    const problem = selectedCity.problems.find(p => p.id.startsWith(cityPrefix));

    if (problem) {
      // Check if this solution is already in the report
      const alreadyInReport = reportItems.some(item => item.solution.id === solution.id);

      if (!alreadyInReport) {
        setReportItems(prev => [...prev, { problem, solution }]);
      }
    }
  }, [selectedCity, reportItems]);

  // Remove item from report
  const handleRemoveFromReport = useCallback((solutionId: string) => {
    setReportItems(prev => prev.filter(item => item.solution.id !== solutionId));
  }, []);

  // Generate PDF report
  const handleGeneratePDF = useCallback(() => {
    if (!selectedCity || reportItems.length === 0) return;
    generateCityReport(selectedCity, reportItems);
  }, [selectedCity, reportItems]);

  // Handle scrolling between cities
  const handleNextCity = useCallback(() => {
    const nextIndex = (currentCityIndex + 1) % mockCities.length;
    const nextCity = mockCities[nextIndex];
    setCurrentCityIndex(nextIndex);
    setSelectedCity(nextCity);
    setShowPopup(false);

    // Automatically fly to the next city
    setViewState(prev => ({
      ...prev,
      longitude: nextCity.longitude,
      latitude: nextCity.latitude,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  }, [currentCityIndex]);

  const handlePrevCity = useCallback(() => {
    const prevIndex = currentCityIndex === 0 ? mockCities.length - 1 : currentCityIndex - 1;
    const prevCity = mockCities[prevIndex];
    setCurrentCityIndex(prevIndex);
    setSelectedCity(prevCity);
    setShowPopup(false);

    // Automatically fly to the previous city
    setViewState(prev => ({
      ...prev,
      longitude: prevCity.longitude,
      latitude: prevCity.latitude,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  }, [currentCityIndex]);

  // Check if a solution is in the report
  const isSolutionInReport = useCallback((solutionId: string) => {
    return reportItems.some(item => item.solution.id === solutionId);
  }, [reportItems]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Header Bar - Enhanced */}
      <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-b border-slate-700/50 shadow-2xl">
        <div className="px-8 py-4 flex items-center justify-between">
          {/* Logo Section - Enhanced with Navigation */}
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
                Westgate
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Civic Intelligence Platform
              </p>
            </div>

            {/* Tooltip */}
            <div className="absolute -bottom-12 left-0 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border border-slate-700">
              Switch to {getNextRouteName()}
              <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 border-l border-t border-slate-700 transform rotate-45"></div>
            </div>
          </button>

          {/* Search Section - Enhanced */}
          <div className="w-2/5 max-w-2xl">
            <SearchBar onLocationSelect={handleLocationSelect} />
            {selectedCity && selectedCity.name !== mockCities[0].name && (
              <div className="mt-2 text-xs text-blue-400 flex items-center gap-1.5 font-medium animate-in fade-in duration-300">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">Selected: {selectedCity.name}</span>
              </div>
            )}
          </div>

          {/* Action Section - Enhanced */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReportBuilder(!showReportBuilder)}
              className={`text-right rounded-lg px-4 py-2 border transition-all ${
                showReportBuilder
                  ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="text-xs text-slate-400 font-medium">
                Report Items
              </div>
              <div className="font-bold text-xl text-white">
                {reportItems.length}
              </div>
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={reportItems.length === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/30 disabled:shadow-none flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <SimpleMap
          data={mockCities.map(city => ({
            topic: city.name,
            lon: city.longitude,
            lat: city.latitude,
            text: `${city.problems.length} issues detected`,
            author: city.county,
          }))}
          opacity={0.8}
          cellSize={15}
          colorDomain={[0, 20]}
          aggregation="SUM"
          pickable={true}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          onHover={() => {
            // Hover functionality can be added here
          }}
          refreshKey={0}
          searchMarker={searchMarker}
        />
      </div>

      {/* City Popup - Left Side */}
      {showPopup && selectedCity && (
        <div className="absolute left-4 top-24 z-10 w-[420px]">
          <CityPopup
            cityName={selectedCity.name}
            problems={selectedCity.problems}
            riskLevel={selectedCity.riskLevel}
            onSeeSolution={handleSeeSolution}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}

      {/* City Details Panel - Right Side - Enhanced */}
      {selectedCity && (
        <div className="absolute right-6 top-28 bottom-28 z-10 w-[420px]">
          <div className="h-full backdrop-blur-xl rounded-2xl border overflow-hidden flex flex-col bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 shadow-2xl">
            {/* Navigation Header - Enhanced */}
            <div className="px-5 py-4 border-b flex items-center justify-between border-slate-700/50 bg-slate-800/30">
              <button
                onClick={handlePrevCity}
                className="p-2.5 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
                title="Previous city"
              >
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-300">
                  {currentCityIndex + 1} <span className="text-slate-500">/</span> {mockCities.length}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Cities</div>
              </div>
              <button
                onClick={handleNextCity}
                className="p-2.5 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
                title="Next city"
              >
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content - Enhanced */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <CityDetailsPanel
                city={selectedCity}
                onViewAllProblems={() => setShowPopup(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Solution Detail Panel */}
      {selectedSolution && (
        <SolutionDetailPanel
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
          onAddToReport={handleAddToReport}
          isInReport={isSolutionInReport(selectedSolution.id)}
        />
      )}

      {/* Report Builder Sidebar */}
      <ReportBuilder
        city={selectedCity}
        reportItems={reportItems}
        onRemoveItem={handleRemoveFromReport}
        onGeneratePDF={handleGeneratePDF}
        onClose={() => setShowReportBuilder(false)}
        isOpen={showReportBuilder}
      />

      {/* Legend - Enhanced */}
      <div className="absolute bottom-6 left-6 z-10 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 p-5 shadow-2xl">
        <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Risk Level
        </h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
            <span className="text-slate-300 text-sm font-medium">High Risk</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
            <span className="text-slate-300 text-sm font-medium">Medium Risk</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
            <span className="text-slate-300 text-sm font-medium">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Stats Bar - Enhanced */}
      <div className="absolute bottom-6 right-6 z-10 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 p-5 shadow-2xl">
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-slate-400 text-xs font-medium mb-1.5">Total Cities</div>
            <div className="text-white font-bold text-2xl">{mockCities.length}</div>
          </div>
          <div className="border-l border-slate-700"></div>
          <div className="text-center">
            <div className="text-slate-400 text-xs font-medium mb-1.5">High Risk</div>
            <div className="text-red-400 font-bold text-2xl">
              {mockCities.filter(c => c.riskLevel === 'high').length}
            </div>
          </div>
          <div className="border-l border-slate-700"></div>
          <div className="text-center">
            <div className="text-slate-400 text-xs font-medium mb-1.5">Total Issues</div>
            <div className="text-blue-400 font-bold text-2xl">
              {mockCities.reduce((sum, city) => sum + city.problems.length, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WestgateDemo;
