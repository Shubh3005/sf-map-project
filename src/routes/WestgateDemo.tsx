import React, { useState, useCallback } from 'react';
import { FlyToInterpolator } from '@deck.gl/core';
import SimpleMap from '../components/SimpleMap';
import CityPopup from '../components/CityPopup';
import SolutionModal from '../components/SolutionModal';
import CityDetailsPanel from '../components/CityDetailsPanel';
import SearchBar from '../components/SearchBar';
import type { CityData } from '../data/mockCities';
import { mockCities } from '../data/mockCities';

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface ReportItem {
  problemId: string;
  solutionIds: string[];
  cityName: string;
}

const WestgateDemo: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: -121.4944,
    latitude: 38.5816,
    zoom: 6,
    pitch: 45,
    bearing: 0,
  });

  const [selectedCity, setSelectedCity] = useState<CityData | null>(mockCities[0]);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  // Handle location search
  const handleLocationSelect = useCallback((longitude: number, latitude: number) => {
    setViewState(prev => ({
      ...prev,
      longitude,
      latitude,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  }, []);

  // Handle view state changes
  const handleViewStateChange = useCallback((params: { viewState: ViewState }) => {
    setViewState(params.viewState);
  }, []);

  // Handle "See Solution" click
  const handleSeeSolution = useCallback((problemId: string) => {
    setSelectedProblemId(problemId);
  }, []);

  // Handle adding to report
  const handleAddToReport = useCallback((problemId: string, solutionIds: string[]) => {
    if (selectedCity) {
      setReportItems(prev => [
        ...prev,
        {
          problemId,
          solutionIds,
          cityName: selectedCity.name,
        },
      ]);
    }
  }, [selectedCity]);

  // Handle scrolling between cities
  const handleNextCity = useCallback(() => {
    const nextIndex = (currentCityIndex + 1) % mockCities.length;
    setCurrentCityIndex(nextIndex);
    setSelectedCity(mockCities[nextIndex]);
    setShowPopup(false);
  }, [currentCityIndex]);

  const handlePrevCity = useCallback(() => {
    const prevIndex = currentCityIndex === 0 ? mockCities.length - 1 : currentCityIndex - 1;
    setCurrentCityIndex(prevIndex);
    setSelectedCity(mockCities[prevIndex]);
    setShowPopup(false);
  }, [currentCityIndex]);

  // Get current problem and solutions for modal
  const currentProblem = selectedCity?.problems.find(p => p.id === selectedProblemId);
  const currentSolutions = selectedCity?.solutions.filter(s =>
    currentProblem && s.id.startsWith(currentProblem.id.split('-')[0])
  ) || [];

  return (
    <div className={`relative h-screen w-screen overflow-hidden ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-800 to-black'
        : 'bg-gradient-to-b from-gray-100 to-gray-300'
    }`}>
      {/* Top Header Bar */}
      <div className={`absolute top-0 left-0 right-0 z-20 backdrop-blur-md border-b ${
        isDarkMode ? 'bg-black/70 border-gray-700' : 'bg-white/70 border-gray-300'
      }`}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Westgate
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Civic Intelligence Platform
              </p>
            </div>
          </div>

          <div className="w-1/3">
            <SearchBar onLocationSelect={handleLocationSelect} />
          </div>

          <div className="flex items-center gap-4">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <div className="text-right">
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Items in Report
              </div>
              <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {reportItems.length}
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
              Generate Report
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
        />
      </div>

      {/* City Details Panel - Left Side with Scroll */}
      {selectedCity && (
        <div className="absolute left-4 top-24 bottom-24 z-10 w-96">
          <div className={`h-full backdrop-blur-md rounded-lg border overflow-hidden flex flex-col ${
            isDarkMode ? 'bg-black/50 border-gray-700' : 'bg-white/50 border-gray-300'
          }`}>
            {/* Navigation Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-gray-700' : 'border-gray-300'
            }`}>
              <button
                onClick={handlePrevCity}
                className={`p-2 rounded hover:bg-opacity-50 transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  City {currentCityIndex + 1} of {mockCities.length}
                </div>
              </div>
              <button
                onClick={handleNextCity}
                className={`p-2 rounded hover:bg-opacity-50 transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <CityDetailsPanel
                city={selectedCity}
                onViewAllProblems={() => setShowPopup(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* City Popup - Right Side */}
      {showPopup && selectedCity && (
        <div className="absolute right-4 top-24 z-10 w-[420px]">
          <CityPopup
            cityName={selectedCity.name}
            problems={selectedCity.problems}
            riskLevel={selectedCity.riskLevel}
            onSeeSolution={handleSeeSolution}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}

      {/* Solution Modal */}
      {selectedProblemId && currentProblem && selectedCity && (
        <SolutionModal
          problem={currentProblem}
          solutions={currentSolutions}
          cityName={selectedCity.name}
          onClose={() => setSelectedProblemId(null)}
          onAddToReport={handleAddToReport}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/70 backdrop-blur-md rounded-lg border border-gray-700 p-4">
        <h4 className="text-white font-semibold text-sm mb-2">Risk Level</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300 text-xs">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-300 text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-300 text-xs">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/70 backdrop-blur-md rounded-lg border border-gray-700 p-4">
        <div className="flex gap-6">
          <div>
            <div className="text-gray-400 text-xs">Total Cities</div>
            <div className="text-white font-bold text-xl">{mockCities.length}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">High Risk</div>
            <div className="text-red-400 font-bold text-xl">
              {mockCities.filter(c => c.riskLevel === 'high').length}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">Total Issues</div>
            <div className="text-white font-bold text-xl">
              {mockCities.reduce((sum, city) => sum + city.problems.length, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WestgateDemo;
