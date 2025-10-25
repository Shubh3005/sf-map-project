import React, { useState, useCallback } from 'react';
import { FlyToInterpolator } from '@deck.gl/core';
import SimpleMap from '../components/SimpleMap';
import CityPopup from '../components/CityPopup';
import SolutionModal from '../components/SolutionModal';
import CityDetailsPanel from '../components/CityDetailsPanel';
import SearchBar from '../components/SearchBar';
import GoalAlignedRecommendations from '../components/GoalAlignedRecommendations';
import type { CityData } from '../data/mockCities';
import { mockCities } from '../data/mockCities';
import { apiService, type CityReport, type ReportRequest } from '../services/api';

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

interface GeneratedReport {
  report: CityReport | null;
  loading: boolean;
  error: string | null;
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
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport>({
    report: null,
    loading: false,
    error: null
  });

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

    // Create a new city object for the searched location
    const searchedCity: CityData = {
      id: `searched-${Date.now()}`, // Generate unique ID
      name: cityName || 'Searched Location',
      county: 'Unknown',
      latitude: latitude,
      longitude: longitude,
      riskLevel: 'unknown' as 'low' | 'medium' | 'high' | 'unknown',
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

  // Test backend connection
  const testBackendConnection = useCallback(async () => {
    console.log('🧪 Testing backend connection...');
    const result = await apiService.testConnection();
    if (result.success) {
      console.log('✅ Backend is accessible:', result.data);
    } else {
      console.error('❌ Backend connection failed:', result.error);
    }
    return result;
  }, []);

  // Handle report generation
  const handleGenerateReport = useCallback(async () => {
    if (!selectedCity) return;

    setGeneratedReport(prev => ({ ...prev, loading: true, error: null }));

    try {
      // First test the connection
      console.log('🔍 Testing backend connection before generating report...');
      const connectionTest = await testBackendConnection();
      if (!connectionTest.success) {
        throw new Error(`Backend connection failed: ${connectionTest.error}`);
      }

      const request: ReportRequest = {
        location: selectedCity.name,
        level: 'city' // Default to city level for now
      };

      const response = await apiService.generateReport(request);
      
      if (response.success && response.report) {
        setGeneratedReport({
          report: response.report,
          loading: false,
          error: null
        });
        
        // Show success message or modal
        console.log('Report generated successfully:', response.report);
      } else {
        setGeneratedReport({
          report: null,
          loading: false,
          error: response.error || 'Failed to generate report'
        });
      }
    } catch (error) {
      setGeneratedReport({
        report: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, [selectedCity, testBackendConnection]);

  // Get current problem and solutions for modal
  const currentProblem = selectedCity?.problems.find(p => p.id === selectedProblemId);
  const currentSolutions = selectedCity?.solutions.filter(s =>
    currentProblem && s.id.startsWith(currentProblem.id.split('-')[0])
  ) || [];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-gray-800 to-black">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-md border-b bg-black/70 border-gray-700">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">
                Westgate
              </h1>
              <p className="text-xs text-gray-400">
                Civic Intelligence Platform
              </p>
            </div>
          </div>

          <div className="w-1/3">
            <SearchBar onLocationSelect={handleLocationSelect} />
            {selectedCity && selectedCity.name !== mockCities[0].name && (
              <div className="mt-2 text-xs text-blue-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Selected: {selectedCity.name}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">
                Items in Report
              </div>
              <div className="font-bold text-lg text-white">
                {reportItems.length}
              </div>
            </div>
            <button 
              onClick={handleGenerateReport}
              disabled={generatedReport.loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {generatedReport.loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <SimpleMap
          data={[
            ...mockCities.map(city => ({
              topic: city.name,
              lon: city.longitude,
              lat: city.latitude,
              text: `${city.problems.length} issues detected`,
              author: city.county,
            })),
            // Add searched city if it's different from mock cities
            ...(selectedCity && !mockCities.some(city => city.name === selectedCity.name) ? [{
              topic: selectedCity.name,
              lon: selectedCity.longitude,
              lat: selectedCity.latitude,
              text: 'Searched Location',
              author: 'Search Result',
            }] : [])
          ]}
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

      {/* City Details Panel - Right Side with Scroll */}
      {selectedCity && (
        <div className="absolute right-4 top-24 bottom-24 z-10 w-96">
          <div className="h-full backdrop-blur-md rounded-lg border overflow-hidden flex flex-col bg-black/50 border-gray-700">
            {/* Navigation Header */}
            <div className="p-4 border-b flex items-center justify-between border-gray-700">
              <button
                onClick={handlePrevCity}
                className="p-2 rounded hover:bg-opacity-50 transition-colors hover:bg-gray-700"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <div className="text-sm text-gray-400">
                  City {currentCityIndex + 1} of {mockCities.length}
                </div>
              </div>
              <button
                onClick={handleNextCity}
                className="p-2 rounded hover:bg-opacity-50 transition-colors hover:bg-gray-700"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Generated Report Modal */}
      {generatedReport.report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white font-bold text-xl mb-2">
                    AI-Generated Report: {generatedReport.report.county}
                  </h2>
                  <div className="text-gray-400 text-sm">
                    Generated: {new Date(generatedReport.report.generated_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setGeneratedReport(prev => ({ ...prev, report: null }))}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Report Summary */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-3">Report Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Data Sources:</span>
                    <div className="text-white">{generatedReport.report.summary.data_sources.join(', ')}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Geographic Level:</span>
                    <div className="text-white capitalize">{generatedReport.report.summary.geographic_level}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Update:</span>
                    <div className="text-white">{generatedReport.report.summary.last_data_update}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Cached:</span>
                    <div className="text-white">{generatedReport.report.cached ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {/* Goal-Aligned Recommendations */}
              {selectedCity && (
                <div className="mb-8">
                  <GoalAlignedRecommendations
                    cityName={selectedCity.name}
                    problemDescription={generatedReport.report.problems.map(p => p.title).join(', ')}
                    currentData={generatedReport.report.summary}
                    onRecommendationSelect={(rec) => {
                      console.log('Selected recommendation:', rec);
                      // Show detailed recommendation in a modal or expand the recommendation
                      alert(`Recommendation Details:\n\nGoal: ${rec.city_goal.metadata.original_text}\n\nPolicy: ${rec.policy_document.metadata.original_text}\n\nImplementation: ${rec.implementation_steps}\n\nImpact: ${rec.estimated_impact}`);
                    }}
                  />
                </div>
              )}

              {/* Problems */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold mb-3">Identified Problems & Solutions</h3>
                {generatedReport.report.problems.map((problem, index) => (
                  <div key={problem.id} className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        problem.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500' :
                        problem.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500' :
                        'bg-green-500/20 text-green-400 border border-green-500'
                      }`}>
                        {problem.severity.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-2">{problem.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">{problem.description}</p>
                      </div>
                    </div>

                    {/* Solution */}
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                      <h5 className="text-blue-400 font-semibold mb-2">{problem.solution.title}</h5>
                      <p className="text-gray-300 text-sm mb-3">{problem.solution.description}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-gray-400 text-xs">Estimated Cost:</span>
                          <div className="text-white font-semibold text-sm">{problem.solution.estimated_cost}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs">Expected Impact:</span>
                          <div className="text-green-400 font-semibold text-sm">{problem.solution.expected_impact}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                {generatedReport.report.problems.length} problem{generatedReport.report.problems.length !== 1 ? 's' : ''} identified
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setGeneratedReport(prev => ({ ...prev, report: null }))}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement download functionality
                    console.log('Download report:', generatedReport.report);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {generatedReport.error && (
        <div className="fixed top-20 right-4 z-50 bg-red-900/90 border border-red-700 rounded-lg p-4 max-w-md">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-red-400 font-semibold">Report Generation Failed</h4>
              <p className="text-red-300 text-sm mt-1">{generatedReport.error}</p>
            </div>
            <button
              onClick={() => setGeneratedReport(prev => ({ ...prev, error: null }))}
              className="text-red-400 hover:text-red-300 ml-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
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
