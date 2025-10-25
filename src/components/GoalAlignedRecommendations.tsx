import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface GoalRecommendation {
  city_goal: {
    vector_id: number;
    similarity_score: number;
    text: string;
    metadata: {
      type: string;
      city_name: string;
      goal_id: number;
      priority_level: string;
      original_text: string;
    };
  };
  policy_document: {
    vector_id: number;
    similarity_score: number;
    text: string;
    metadata: {
      type: string;
      source: string;
      document_type: string;
      geographic_scope: string;
      topic_tags: string[];
      policy_id: number;
      original_text: string;
    };
  };
  combined_score: number;
  recommendation_type: string;
  recommendation_text: string;
  implementation_steps: string;
  estimated_impact: string;
}

interface GoalAlignedRecommendationsProps {
  cityName: string;
  problemDescription: string;
  currentData: Record<string, any>;
  onRecommendationSelect?: (recommendation: GoalRecommendation) => void;
}

const GoalAlignedRecommendations: React.FC<GoalAlignedRecommendationsProps> = ({
  cityName,
  problemDescription,
  currentData,
  onRecommendationSelect
}) => {
  const [recommendations, setRecommendations] = useState<GoalRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cityName && problemDescription) {
      loadRecommendations();
    }
  }, [cityName, problemDescription]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        problem_description: problemDescription,
        current_data: JSON.stringify(currentData),
        max_recommendations: '5'
      });

      const response = await fetch(`http://localhost:8000/api/goals/${cityName}/recommendations?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        throw new Error(`Failed to load recommendations: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    return 'Partial Match';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Goal-Aligned Recommendations</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-2 text-gray-400">Finding goal-aligned solutions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Goal-Aligned Recommendations</h3>
        </div>
        
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <Button
            onClick={loadRecommendations}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Goal-Aligned Recommendations</h3>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-400 mb-2">No goal-aligned recommendations found</p>
          <p className="text-gray-500 text-sm">This city may not have trained goals yet, or no relevant policies were found.</p>
          <Button
            onClick={() => window.open('/goals', '_blank')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Manage City Goals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Goal-Aligned Recommendations</h3>
          <p className="text-sm text-gray-400">Solutions aligned with {cityName}'s priorities</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-gray-900/50 rounded-lg p-5 border border-gray-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-white">
                    {rec.city_goal.metadata.original_text.split(':')[0] || 'Goal-Aligned Solution'}
                  </h4>
                  <div className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(rec.city_goal.metadata.priority_level)}`}>
                    {rec.city_goal.metadata.priority_level.toUpperCase()}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">
                  {rec.recommendation_text || 'Goal-aligned recommendation based on city priorities and policy research.'}
                </p>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-semibold ${getScoreColor(rec.combined_score)}`}>
                  {Math.round(rec.combined_score * 100)}% Match
                </div>
                <div className="text-xs text-gray-400">
                  {getScoreLabel(rec.combined_score)}
                </div>
              </div>
            </div>

            {/* Implementation Steps */}
            {rec.implementation_steps && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-3">
                <h5 className="text-blue-400 font-semibold mb-2">Implementation Steps</h5>
                <p className="text-gray-300 text-sm">{rec.implementation_steps}</p>
              </div>
            )}

            {/* Expected Impact */}
            {rec.estimated_impact && (
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-3">
                <h5 className="text-green-400 font-semibold mb-2">Expected Impact</h5>
                <p className="text-gray-300 text-sm">{rec.estimated_impact}</p>
              </div>
            )}

            {/* Policy Source */}
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-400">
                Policy Source: <span className="text-white">{rec.policy_document.metadata.source}</span>
              </div>
              <Button
                onClick={() => onRecommendationSelect?.(rec)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          onClick={() => window.open('/goals', '_blank')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Manage City Goals
        </Button>
      </div>
    </div>
  );
};

export default GoalAlignedRecommendations;

