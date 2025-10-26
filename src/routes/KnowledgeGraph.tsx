import React, { useState, useEffect } from 'react';
import KnowledgeGraph from '../components/KnowledgeGraph';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface GraphNode {
  id: string;
  title: string;
  source: 'reddit' | '311';
  location: string;
  severity: 'high' | 'medium' | 'low';
  keywords: string[];
  coordinates?: [number, number];
  metadata: Record<string, any>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'geographic' | 'temporal' | 'similar';
  strength: number;
  reason: string;
}

interface GraphCluster {
  id: string;
  name: string;
  nodes: string[];
  themes: string[];
  geographic: string[];
  severity_distribution: Record<string, number>;
}

const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [clusters, setClusters] = useState<GraphCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockNodes: GraphNode[] = [
    {
      id: 'reddit_001',
      title: 'BART delays causing major commute issues',
      source: 'reddit',
      location: 'SOMA, San Francisco',
      severity: 'high',
      keywords: ['transportation', 'BART', 'delays'],
      coordinates: [37.7749, -122.4194],
      metadata: { subreddit: 'sftransportation', score: 25 }
    },
    {
      id: 'sf311_001',
      title: 'Graffiti',
      source: '311',
      location: 'Mission District, San Francisco',
      severity: 'medium',
      keywords: ['graffiti', 'vandalism', 'commercial'],
      coordinates: [37.7651, -122.4190],
      metadata: { offense_type: 'Graffiti', coordinates: '(37.7651, -122.4190)' }
    },
    {
      id: 'reddit_002',
      title: 'Homeless encampment growing in Mission District',
      source: 'reddit',
      location: 'Mission District, San Francisco',
      severity: 'high',
      keywords: ['homeless', 'encampment', 'tent'],
      coordinates: [37.7651, -122.4190],
      metadata: { subreddit: 'sanfrancisco', score: 18 }
    },
    {
      id: 'sf311_002',
      title: 'Street or sidewalk cleaning',
      source: '311',
      location: 'Richmond, San Francisco',
      severity: 'low',
      keywords: ['litter', 'cleaning', 'sidewalk'],
      coordinates: [37.7811, -122.4645],
      metadata: { offense_type: 'Street or sidewalk cleaning' }
    }
  ];

  const mockEdges: GraphEdge[] = [
    {
      id: 'edge_001',
      source: 'reddit_001',
      target: 'sf311_002',
      type: 'geographic',
      strength: 0.73,
      reason: 'Both issues in SOMA area'
    },
    {
      id: 'edge_002',
      source: 'reddit_002',
      target: 'sf311_001',
      type: 'temporal',
      strength: 0.65,
      reason: 'Issues reported around same time'
    },
    {
      id: 'edge_003',
      source: 'sf311_001',
      target: 'sf311_002',
      type: 'similar',
      strength: 0.89,
      reason: 'Both are maintenance issues'
    }
  ];

  const mockClusters: GraphCluster[] = [
    {
      id: 'cluster_001',
      name: 'Transportation Cluster',
      nodes: ['reddit_001', 'sf311_002'],
      themes: ['BART', 'delays', 'commute', 'parking'],
      geographic: ['SOMA', 'Mission District'],
      severity_distribution: { high: 1, medium: 1, low: 0 }
    },
    {
      id: 'cluster_002',
      name: 'Graffiti Cluster',
      nodes: ['sf311_001'],
      themes: ['graffiti', 'vandalism', 'commercial'],
      geographic: ['Mission District'],
      severity_distribution: { high: 0, medium: 1, low: 0 }
    },
    {
      id: 'cluster_003',
      name: 'Homelessness Cluster',
      nodes: ['reddit_002'],
      themes: ['homeless', 'encampment', 'tent', 'shelter'],
      geographic: ['Mission District'],
      severity_distribution: { high: 1, medium: 0, low: 0 }
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, use mock data
        // In production, this would fetch from the backend API
        setNodes(mockNodes);
        setEdges(mockEdges);
        setClusters(mockClusters);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load knowledge graph data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNodeClick = (node: GraphNode) => {
    console.log('Node clicked:', node);
    // You can add more detailed node information display here
  };

  const handleClusterClick = (cluster: GraphCluster) => {
    console.log('Cluster clicked:', cluster);
    // You can add cluster analysis or filtering here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Knowledge Graph Explorer
        </h1>
        <p className="text-gray-600">
          Explore the relationships between community issues from Reddit and SF311 data
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{edges.length}</div>
            <div className="text-sm text-gray-600">Relationships</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{clusters.length}</div>
            <div className="text-sm text-gray-600">Clusters</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {nodes.filter(n => n.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Severity</div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Graph Component */}
      <KnowledgeGraph
        nodes={nodes}
        edges={edges}
        clusters={clusters}
        onNodeClick={handleNodeClick}
        onClusterClick={handleClusterClick}
      />

      {/* Data Source Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Reddit Data</h3>
              <p className="text-sm text-gray-600 mb-2">
                Community discussions from SF-related subreddits
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">sftransportation</Badge>
                <Badge variant="outline">sanfrancisco</Badge>
                <Badge variant="outline">bayarea</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">SF311 Data</h3>
              <p className="text-sm text-gray-600 mb-2">
                Official service requests from San Francisco 311
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Graffiti</Badge>
                <Badge variant="outline">Street cleaning</Badge>
                <Badge variant="outline">Parking</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeGraphPage;
