import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import DarkVeil from '../components/DarkVeil';
import '../components/DarkVeil.css';

interface CityGoal {
  id: number;
  city_name: string;
  goal_title: string;
  goal_description: string;
  target_metric: string;
  target_value?: number;
  target_unit?: string;
  priority_level: 'high' | 'medium' | 'low';
  deadline?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

interface PolicyDocument {
  source: string;
  title: string;
  content: string;
  document_type: string;
  geographic_scope: string;
  topic_tags: string[];
}

interface GoalsStats {
  city_name: string;
  goals: {
    active: number;
    completed: number;
    total: number;
  };
  vector_index: {
    total_vectors: number;
    goals_in_index: number;
    policies_in_index: number;
  };
  training_status: 'trained' | 'not_trained';
}

const GoalsManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState<string>('Oakland');
  const [goals, setGoals] = useState<CityGoal[]>([]);
  const [stats, setStats] = useState<GoalsStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Navigation handler - toggles between two routes
  const handleLogoClick = useCallback(() => {
    // Toggle between Westgate Demo (/) and Goals Management (/goals)
    navigate(location.pathname === '/' ? '/goals' : '/');
  }, [location.pathname, navigate]);

  // Get next route name for tooltip
  const getNextRouteName = useCallback(() => {
    return location.pathname === '/' ? 'Goals Management' : 'Westgate Demo';
  }, [location.pathname]);
  const [newGoal, setNewGoal] = useState({
    goal_title: '',
    goal_description: '',
    target_metric: '',
    target_value: '',
    target_unit: '',
    priority_level: 'medium' as 'high' | 'medium' | 'low',
    deadline: '',
    budget_min: '',
    budget_max: '',
    related_legislation: '',
    category: 'housing' as 'housing' | 'economic' | 'safety' | 'environment' | 'infrastructure' | 'social',
    timeline_preference: 'medium' as 'immediate' | 'short' | 'medium' | 'long',
    success_criteria: ''
  });
  const [newPolicy, setNewPolicy] = useState<PolicyDocument>({
    source: '',
    title: '',
    content: '',
    document_type: 'best_practice',
    geographic_scope: 'local',
    topic_tags: []
  });
  const [showAddPolicy, setShowAddPolicy] = useState(false);

  const cities = ['Oakland', 'San Francisco', 'Berkeley', 'Fremont', 'Hayward'];

  useEffect(() => {
    loadCityGoals();
    loadCityStats();
  }, [selectedCity]);

  const loadCityGoals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/goals/${selectedCity}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCityStats = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/goals/${selectedCity}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddGoal = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/goals/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city_name: selectedCity,
          goals: [{
            city_name: selectedCity,
            ...newGoal,
            target_value: newGoal.target_value ? parseFloat(newGoal.target_value) : null,
            deadline: newGoal.deadline || null
          }],
          policy_documents: []
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Goal added successfully:', result);
        setNewGoal({
          goal_title: '',
          goal_description: '',
          target_metric: '',
          target_value: '',
          target_unit: '',
          priority_level: 'medium',
          deadline: '',
          budget_min: '',
          budget_max: '',
          related_legislation: '',
          category: 'housing',
          timeline_preference: 'medium',
          success_criteria: ''
        });
        setShowAddGoal(false);
        loadCityGoals();
        loadCityStats();
      } else {
        const errorData = await response.json();
        console.error('Error adding goal:', errorData);
        alert(`Error: ${errorData.detail || 'Failed to add goal'}`);
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      alert(`Error: ${error.message || 'Failed to add goal'}`);
    }
  };

  // @ts-ignore - Function reserved for future policy training feature
  const handleAddPolicy = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/api/goals/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city_name: selectedCity,
          goals: [],
          policy_documents: [newPolicy]
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Policy added successfully:', result);
        setNewPolicy({
          source: '',
          title: '',
          content: '',
          document_type: 'best_practice',
          geographic_scope: 'local',
          topic_tags: []
        });
        setShowAddPolicy(false);
        loadCityStats();
      } else {
        const errorData = await response.json();
        console.error('Error adding policy:', errorData);
        alert(`Error: ${errorData.detail || 'Failed to add policy'}`);
      }
    } catch (error) {
      console.error('Error adding policy:', error);
      alert(`Error: ${error.message || 'Failed to add policy'}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'paused': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <>
      {/* DarkVeil Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <DarkVeil 
          hueShift={28}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
          resolutionScale={1}
        />
      </div>
      
      <div className="min-h-screen text-white" style={{ background: 'transparent', position: 'relative', zIndex: 1 }}>
        {/* Header - Enhanced with Depth */}
      <div className="backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/30" style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
      }}>
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section with Navigation - Enhanced Depth */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-4 group relative cursor-pointer transition-all duration-200 hover:translate-y-[-2px]"
              title={`Switch to ${getNextRouteName()}`}
            >
              <div 
                className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-2.5 transition-all duration-200"
                style={{
                  boxShadow: '0 4px 8px rgba(37, 99, 235, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(37, 99, 235, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
                }}
              >
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-white tracking-tight group-hover:text-blue-300 transition-colors">
                  Goals Management
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  City Priorities & Development Goals
                </p>
              </div>

              {/* Tooltip - Enhanced */}
              <div 
                className="absolute -bottom-12 left-0 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                style={{
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                Switch to {getNextRouteName()}
                <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45"></div>
              </div>
            </button>

            {/* City Selector - Enhanced with Depth */}
            <div 
              className="flex items-center gap-4 bg-slate-800/60 rounded-lg px-4 py-2"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <label className="text-sm font-medium text-slate-300">City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-700/80 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                style={{
                  boxShadow: 'inset 0 2px 3px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview - Enhanced with Depth */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div 
              className="bg-slate-800/60 rounded-xl p-6 transition-all duration-200 hover:translate-y-[-4px]"
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 className="text-sm font-semibold mb-3 text-slate-300 uppercase tracking-wide">Training Status</h3>
              <div className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold ${
                stats.training_status === 'trained' 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}
              style={{
                boxShadow: stats.training_status === 'trained'
                  ? '0 2px 4px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(134, 239, 172, 0.2)'
                  : '0 2px 4px rgba(234, 179, 8, 0.2), inset 0 1px 0 rgba(253, 224, 71, 0.2)'
              }}
              >
                {stats.training_status === 'trained' ? 'Trained' : 'Not Trained'}
              </div>
            </div>
            
            <div 
              className="bg-slate-800/60 rounded-xl p-6 transition-all duration-200 hover:translate-y-[-4px]"
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 className="text-sm font-semibold mb-3 text-slate-300 uppercase tracking-wide">Active Goals</h3>
              <div 
                className="text-4xl font-bold text-blue-400"
                style={{ textShadow: '0 2px 8px rgba(96, 165, 250, 0.3)' }}
              >{stats.goals.active}</div>
            </div>
            
            <div 
              className="bg-slate-800/60 rounded-xl p-6 transition-all duration-200 hover:translate-y-[-4px]"
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 className="text-sm font-semibold mb-3 text-slate-300 uppercase tracking-wide">Completed Goals</h3>
              <div 
                className="text-4xl font-bold text-green-400"
                style={{ textShadow: '0 2px 8px rgba(74, 222, 128, 0.3)' }}
              >{stats.goals.completed}</div>
            </div>
            
            <div 
              className="bg-slate-800/60 rounded-xl p-6 transition-all duration-200 hover:translate-y-[-4px]"
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 className="text-sm font-semibold mb-3 text-slate-300 uppercase tracking-wide">Vector Index</h3>
              <div 
                className="text-4xl font-bold text-purple-400"
                style={{ textShadow: '0 2px 8px rgba(192, 132, 252, 0.3)' }}
              >{stats.vector_index.total_vectors}</div>
              <div className="text-sm text-slate-400 mt-2">
                {stats.vector_index.goals_in_index} goals, {stats.vector_index.policies_in_index} policies
              </div>
            </div>
          </div>
        )}

        {/* Actions - Enhanced Buttons with Depth */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setShowAddGoal(true)}
            className="bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold px-6 py-3 transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(37, 99, 235, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
            }}
          >
            Add New Goal
          </Button>
          <Button
            onClick={() => {/* TODO: Add policy upload modal */}}
            className="bg-gradient-to-b from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white font-semibold px-6 py-3 transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              boxShadow: '0 4px 6px rgba(168, 85, 247, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(168, 85, 247, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(168, 85, 247, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
            }}
          >
            Upload Policy Document
          </Button>
        </div>

        {/* Goals List - Enhanced with Depth */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>City Goals</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div 
              className="text-center py-12 bg-slate-800/40 rounded-xl"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <p className="text-gray-300 text-lg font-medium">No goals found for {selectedCity}</p>
              <p className="text-gray-400 text-sm mt-2">Add your first goal to start training Theages</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className="bg-slate-800/60 rounded-xl p-6 transition-all duration-200 hover:translate-x-1"
                  style={{
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-white">{goal.goal_title}</h3>
                      <p className="text-slate-300 mb-3 leading-relaxed">{goal.goal_description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400 font-medium">Target:</span>
                        <span className="font-semibold text-white">{goal.target_metric}</span>
                        {goal.target_value && (
                          <>
                            <span className="text-slate-400 font-medium">Value:</span>
                            <span className="font-semibold text-white">{goal.target_value} {goal.target_unit}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div 
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getPriorityColor(goal.priority_level)}`}
                        style={{
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        {goal.priority_level}
                      </div>
                      <div 
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getStatusColor(goal.status)}`}
                        style={{
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        {goal.status}
                      </div>
                    </div>
                  </div>
                  
                  {goal.deadline && (
                    <div className="text-sm text-slate-400 font-medium">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Goal Modal - Enhanced with Depth */}
        {showAddGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div 
              className="bg-slate-900/95 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>Add New Goal</h2>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50"
                    style={{
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Goal Title</label>
                    <input
                      type="text"
                      value={newGoal.goal_title}
                      onChange={(e) => setNewGoal({...newGoal, goal_title: e.target.value})}
                      className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="e.g., Reduce Homelessness"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Description</label>
                    <textarea
                      value={newGoal.goal_description}
                      onChange={(e) => setNewGoal({...newGoal, goal_description: e.target.value})}
                      className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="Detailed description of the goal..."
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-300">Target Metric</label>
                      <input
                        type="text"
                        value={newGoal.target_metric}
                        onChange={(e) => setNewGoal({...newGoal, target_metric: e.target.value})}
                        className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="e.g., Reduce homelessness by 20%"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-300">Priority Level</label>
                      <select
                        value={newGoal.priority_level}
                        onChange={(e) => setNewGoal({...newGoal, priority_level: e.target.value as 'high' | 'medium' | 'low'})}
                        className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-300">Target Value</label>
                      <input
                        type="number"
                        value={newGoal.target_value}
                        onChange={(e) => setNewGoal({...newGoal, target_value: e.target.value})}
                        className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="20"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-300">Unit</label>
                      <input
                        type="text"
                        value={newGoal.target_unit}
                        onChange={(e) => setNewGoal({...newGoal, target_unit: e.target.value})}
                        className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="percentage, count, etc."
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Goal Category</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value as typeof newGoal.category})}
                      className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <option value="housing">Housing & Development</option>
                      <option value="economic">Economic Vitality</option>
                      <option value="safety">Public Safety</option>
                      <option value="environment">Environmental Quality</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="social">Social Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Related Legislation / Initiatives (Optional)</label>
                    <textarea
                      value={newGoal.related_legislation}
                      onChange={(e) => setNewGoal({...newGoal, related_legislation: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
                      placeholder="e.g., Prop 1 Housing Bond, SB 50, local ordinances..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range (Min)</label>
                      <input
                        type="number"
                        value={newGoal.budget_min}
                        onChange={(e) => setNewGoal({...newGoal, budget_min: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="$100,000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range (Max)</label>
                      <input
                        type="number"
                        value={newGoal.budget_max}
                        onChange={(e) => setNewGoal({...newGoal, budget_max: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="$500,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Implementation Timeline</label>
                    <select
                      value={newGoal.timeline_preference}
                      onChange={(e) => setNewGoal({...newGoal, timeline_preference: e.target.value as typeof newGoal.timeline_preference})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="immediate">Immediate (0-6 months)</option>
                      <option value="short">Short-term (6-12 months)</option>
                      <option value="medium">Medium-term (1-2 years)</option>
                      <option value="long">Long-term (2+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Success Criteria</label>
                    <textarea
                      value={newGoal.success_criteria}
                      onChange={(e) => setNewGoal({...newGoal, success_criteria: e.target.value})}
                      className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="How will you measure success? e.g., 20% reduction in vacancy rate within 18 months"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Deadline (Optional)</label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="w-full bg-slate-800/60 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={handleAddGoal}
                    className="bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold px-6 py-3 transition-all duration-200 hover:translate-y-[-2px]"
                    style={{
                      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Add Goal
                  </Button>
                  <Button
                    onClick={() => setShowAddGoal(false)}
                    className="bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold px-6 py-3 transition-all duration-200"
                    style={{
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 0 rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Policy Modal */}
        {showAddPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Upload Policy Document</h2>
                  <button
                    onClick={() => setShowAddPolicy(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Source</label>
                    <input
                      type="text"
                      value={newPolicy.source}
                      onChange={(e) => setNewPolicy({...newPolicy, source: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., City of Oakland, HUD Guidelines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={newPolicy.title}
                      onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Affordable Housing Policy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                      value={newPolicy.content}
                      onChange={(e) => setNewPolicy({...newPolicy, content: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white h-32"
                      placeholder="Policy content, guidelines, or best practices..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Document Type</label>
                      <select
                        value={newPolicy.document_type}
                        onChange={(e) => setNewPolicy({...newPolicy, document_type: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="best_practice">Best Practice</option>
                        <option value="policy">Policy</option>
                        <option value="guideline">Guideline</option>
                        <option value="regulation">Regulation</option>
                        <option value="research">Research</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Geographic Scope</label>
                      <select
                        value={newPolicy.geographic_scope}
                        onChange={(e) => setNewPolicy({...newPolicy, geographic_scope: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="local">Local</option>
                        <option value="regional">Regional</option>
                        <option value="state">State</option>
                        <option value="national">National</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Topic Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newPolicy.topic_tags.join(', ')}
                      onChange={(e) => setNewPolicy({...newPolicy, topic_tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., housing, sustainability, transportation"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleAddPolicy}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Upload Policy
                  </Button>
                  <Button
                    onClick={() => setShowAddPolicy(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default GoalsManagement;

