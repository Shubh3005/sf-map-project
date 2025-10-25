// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:8000/api';

export interface Problem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  metrics: Record<string, any>;
  solution: {
    title: string;
    description: string;
    estimated_cost: string;
    expected_impact: string;
  };
}

export interface CityReport {
  county: string;
  generated_at: string;
  cached: boolean;
  summary: {
    data_sources: string[];
    last_data_update: string;
    geographic_level: string;
    relevant_datasets: string[];
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
}

export const apiService = new ApiService();
export default apiService;
