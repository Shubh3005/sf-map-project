import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

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
  const [selectedCity, setSelectedCity] = useState<string>('Oakland');
  const [goals, setGoals] = useState<CityGoal[]>([]);
  const [stats, setStats] = useState<GoalsStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_title: '',
    goal_description: '',
    target_metric: '',
    target_value: '',
    target_unit: '',
    priority_level: 'medium' as 'high' | 'medium' | 'low',
    deadline: ''
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
          deadline: ''
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

  const handleAddPolicy = async () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/70 backdrop-blur-md border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">City Goals Management</h1>
              <p className="text-gray-400 mt-2">Train Theages on your city's priorities and development goals</p>
            </div>
            
            {/* City Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
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
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Training Status</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                stats.training_status === 'trained' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
              }`}>
                {stats.training_status === 'trained' ? 'Trained' : 'Not Trained'}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Active Goals</h3>
              <div className="text-3xl font-bold text-blue-400">{stats.goals.active}</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Completed Goals</h3>
              <div className="text-3xl font-bold text-green-400">{stats.goals.completed}</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Vector Index</h3>
              <div className="text-3xl font-bold text-purple-400">{stats.vector_index.total_vectors}</div>
              <div className="text-sm text-gray-400 mt-1">
                {stats.vector_index.goals_in_index} goals, {stats.vector_index.policies_in_index} policies
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setShowAddGoal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add New Goal
          </Button>
          <Button
            onClick={() => setShowAddPolicy(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Upload Policy Document
          </Button>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">City Goals</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-lg">No goals found for {selectedCity}</p>
              <p className="text-gray-500 text-sm mt-2">Add your first goal to start training Theages</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{goal.goal_title}</h3>
                      <p className="text-gray-300 mb-3">{goal.goal_description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Target:</span>
                        <span className="font-medium">{goal.target_metric}</span>
                        {goal.target_value && (
                          <>
                            <span className="text-gray-400">Value:</span>
                            <span className="font-medium">{goal.target_value} {goal.target_unit}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(goal.priority_level)}`}>
                        {goal.priority_level.toUpperCase()}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(goal.status)}`}>
                        {goal.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {goal.deadline && (
                    <div className="text-sm text-gray-400">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Add New Goal</h2>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Title</label>
                    <input
                      type="text"
                      value={newGoal.goal_title}
                      onChange={(e) => setNewGoal({...newGoal, goal_title: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Reduce Homelessness"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newGoal.goal_description}
                      onChange={(e) => setNewGoal({...newGoal, goal_description: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white h-24"
                      placeholder="Detailed description of the goal..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Metric</label>
                      <input
                        type="text"
                        value={newGoal.target_metric}
                        onChange={(e) => setNewGoal({...newGoal, target_metric: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="e.g., Reduce homelessness by 20%"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Priority Level</label>
                      <select
                        value={newGoal.priority_level}
                        onChange={(e) => setNewGoal({...newGoal, priority_level: e.target.value as 'high' | 'medium' | 'low'})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Value</label>
                      <input
                        type="number"
                        value={newGoal.target_value}
                        onChange={(e) => setNewGoal({...newGoal, target_value: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Unit</label>
                      <input
                        type="text"
                        value={newGoal.target_unit}
                        onChange={(e) => setNewGoal({...newGoal, target_unit: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="percentage, count, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleAddGoal}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Goal
                  </Button>
                  <Button
                    onClick={() => setShowAddGoal(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white"
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
  );
};

export default GoalsManagement;

