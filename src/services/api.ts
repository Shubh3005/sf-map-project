// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:8000/api';

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

export interface SF311Response {
  success: boolean;
  status: string;
  issues: SF311Issue[];
  raw_requests: SF311Request[];
  summary: {
    total_requests: number;
    filtered_requests: number;
    issues_identified: number;
    geographic_patterns: Record<string, any>;
    insights: string[];
  };
  execution_time: number;
}

export interface NeighborhoodInsight {
  neighborhood: string;
  total_requests: number;
  top_issue_types: Record<string, number>;
  severity_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  sample_requests: Array<{
    offense_type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    address: string;
  }>;
  llm_insights: string[];
}

export interface NeighborhoodInsightsResponse {
  success: boolean;
  neighborhood_insights: NeighborhoodInsight[];
  summary: {
    total_neighborhoods: number;
    total_requests: number;
    most_active_neighborhood: string | null;
  };
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category?: string;
  metric?: string;
  value?: number;
  threshold?: number;
  metrics: Record<string, any>;
  solution: {
    title: string;
    description: string;
    estimated_cost: string;
    expected_impact: string;
    timeline?: string;
    impact?: string;
    steps?: string[];
    costBreakdown?: Array<{item: string; amount: string}>;
    implementationPhases?: Array<{
      phase: string;
      duration: string;
      milestones: string[];
    }>;
    successMetrics?: string[];
    similarCities?: Array<{city: string; outcome: string}>;
    requiredDepartments?: string[];
    stakeholders?: string[];
    fundingSources?: string[];
    risks?: string[];
  };
}

export interface CityReport {
  county: string;
  generated_at: string;
  cached: boolean;
  summary: {
    population?: number;
    medianIncome?: number;
    riskLevel?: string;
    data_sources: string[];
    last_data_update: string;
    geographic_level: string;
    relevant_datasets: string[];
    metrics?: {
      population?: number;
      medianIncome?: number;
      crimeRate?: number;
      foreclosureRate?: number;
      vacancyRate?: number;
      unemploymentRate?: number;
      homeValue?: number;
      rentBurden?: number;
      educationLevel?: number;
      povertyRate?: number;
      airQuality?: number;
      treeCanopy?: number;
      transitAccess?: number;
      walkability?: number;
      bikeability?: number;
    };
    demographics?: Record<string, any>;
    economicIndicators?: Record<string, any>;
    infrastructureMetrics?: Record<string, any>;
    socialIndicators?: Record<string, any>;
  };
  problems: Problem[];
}

export interface ReportRequest {
  location: string;
  level: 'county' | 'city' | 'neighborhood';
}

export interface ReportResponse {
  success: boolean;
  report?: CityReport;
  error?: string;
}


class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async generateReport(request: ReportRequest): Promise<ReportResponse> {
    try {
      const params = new URLSearchParams({
        location: request.location,
        level: request.level
      });

      console.log(`🚀 Generating report for ${request.location} at ${request.level} level`);
      console.log(`📡 API URL: ${this.baseUrl}/reports/generate-report?${params}`);

      const response = await fetch(`${this.baseUrl}/reports/generate-report?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const report = await response.json();
      console.log('✅ Report generated successfully:', report);
      
      return {
        success: true,
        report
      };
    } catch (error) {
      console.error('❌ Error generating report:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getSolutionDetails(problemId: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        problem_id: problemId
      });

      const response = await fetch(`${this.baseUrl}/reports/solution-details?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting solution details:', error);
      throw error;
    }
  }

  async downloadReport(reportData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/reports/download-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  async getNeighborhoodInsights(pages: number = 10, minSeverity: string = 'low'): Promise<NeighborhoodInsightsResponse> {
    try {
      console.log('🏘️ Getting neighborhood insights...');
      console.log(`📡 API URL: ${this.baseUrl}/agents/sf311/neighborhood-insights`);
      
      const params = new URLSearchParams({
        pages: pages.toString(),
        min_severity: minSeverity
      });

      const response = await fetch(`${this.baseUrl}/agents/sf311/neighborhood-insights?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Neighborhood Insights Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Neighborhood insights generated successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error getting neighborhood insights:', error);
      throw error;
    }
  }

  async testConnection(): Promise<{success: boolean, data?: any, error?: string}> {
    try {
      console.log('🔍 Testing backend connection...');
      console.log(`📡 Testing URL: ${this.baseUrl}/test-cors`);
      
      const response = await fetch(`${this.baseUrl}/test-cors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Backend connection successful:', data);
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async launchSF311Agent(pages: number = 1, filterTypes?: string[], minSeverity: string = 'low', clearCache: boolean = false): Promise<SF311Response> {
    try {
      console.log('🚀 Launching SF311 agent...');
      console.log(`📡 API URL: ${this.baseUrl}/agents/sf311/launch`);
      
      const params = new URLSearchParams({
        pages: pages.toString(),
        min_severity: minSeverity,
        clear_cache: clearCache.toString()
      });
      
      if (filterTypes && filterTypes.length > 0) {
        filterTypes.forEach(type => params.append('filter_types', type));
      }

      const response = await fetch(`${this.baseUrl}/agents/sf311/launch?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ SF311 Agent Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ SF311 Agent launched successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error launching SF311 agent:', error);
      throw error;
    }
  }

  async getSF311Data(): Promise<SF311Response> {
    try {
      console.log('📊 Fetching SF311 data...');
      
      const response = await fetch(`${this.baseUrl}/agents/sf311/data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching SF311 data:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
