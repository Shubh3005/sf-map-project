import React, { useState } from 'react';
import { useKnowledgeGraph } from '../hooks/useKnowledgeGraph';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const KnowledgeGraphIntegration: React.FC = () => {
  const {
    nodes,
    edges,
    clusters,
    metrics,
    loading,
    error,
    fetchNodes,
    fetchEdges,
    fetchClusters,
    querySpatial,
    queryTemporal,
    querySimilarity,
    queryCluster,
    clearError
  } = useKnowledgeGraph();

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [queryResults, setQueryResults] = useState<any>(null);

  const handleSpatialQuery = async () => {
    try {
      const results = await querySpatial('Mission District');
      setQueryResults(results);
    } catch (err) {
      console.error('Spatial query failed:', err);
    }
  };

  const handleTemporalQuery = async () => {
    try {
      const results = await queryTemporal('week');
      setQueryResults(results);
    } catch (err) {
      console.error('Temporal query failed:', err);
    }
  };

  const handleSimilarityQuery = async () => {
    if (selectedNode) {
      try {
        const results = await querySimilarity(selectedNode, 0.7);
        setQueryResults(results);
      } catch (err) {
        console.error('Similarity query failed:', err);
      }
    }
  };

  const handleClusterQuery = async () => {
    try {
      const results = await queryCluster(undefined, 'Transportation');
      setQueryResults(results);
    } catch (err) {
      console.error('Cluster query failed:', err);
    }
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
          <Button onClick={clearError} className="mt-4">
            Clear Error
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Graph Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Graph Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.nodes.total}</div>
                <div className="text-sm text-gray-600">Total Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.edges.total}</div>
                <div className="text-sm text-gray-600">Relationships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{metrics.clusters.total}</div>
                <div className="text-sm text-gray-600">Clusters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{metrics.edges.average_strength}</div>
                <div className="text-sm text-gray-600">Avg Strength</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Query Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Graph Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={handleSpatialQuery} variant="outline">
              Spatial Query
            </Button>
            <Button onClick={handleTemporalQuery} variant="outline">
              Temporal Query
            </Button>
            <Button 
              onClick={handleSimilarityQuery} 
              variant="outline"
              disabled={!selectedNode}
            >
              Similarity Query
            </Button>
            <Button onClick={handleClusterQuery} variant="outline">
              Cluster Query
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Graph Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes */}
        <Card>
          <CardHeader>
            <CardTitle>Graph Nodes ({nodes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {nodes.slice(0, 10).map((node) => (
                <div
                  key={node.id}
                  className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedNode === node.id ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <div className="font-medium text-sm">{node.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: node.source === 'reddit' ? '#ff6b6b' : '#4ecdc4',
                        color: 'white'
                      }}
                    >
                      {node.source}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: node.severity === 'high' ? '#ef4444' : 
                                       node.severity === 'medium' ? '#f59e0b' : '#10b981',
                        color: 'white'
                      }}
                    >
                      {node.severity}
                    </Badge>
                  </div>
                </div>
              ))}
              {nodes.length > 10 && (
                <div className="text-sm text-gray-500 text-center">
                  ... and {nodes.length - 10} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edges */}
        <Card>
          <CardHeader>
            <CardTitle>Graph Edges ({edges.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {edges.slice(0, 10).map((edge) => (
                <div key={edge.id} className="p-2 border rounded">
                  <div className="text-sm">
                    <span className="font-medium">{edge.source}</span>
                    <span className="mx-2">↔</span>
                    <span className="font-medium">{edge.target}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: edge.type === 'geographic' ? '#3b82f6' : 
                                       edge.type === 'temporal' ? '#8b5cf6' : '#f59e0b',
                        color: 'white'
                      }}
                    >
                      {edge.type}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {Math.round(edge.strength * 100)}%
                    </span>
                  </div>
                </div>
              ))}
              {edges.length > 10 && (
                <div className="text-sm text-gray-500 text-center">
                  ... and {edges.length - 10} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clusters */}
        <Card>
          <CardHeader>
            <CardTitle>Graph Clusters ({clusters.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {clusters.map((cluster) => (
                <div key={cluster.id} className="p-2 border rounded">
                  <div className="font-medium text-sm">{cluster.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {cluster.nodes.length} nodes
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cluster.themes.slice(0, 3).map((theme, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                    {cluster.themes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                      +{cluster.themes.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Results */}
      {queryResults && (
        <Card>
          <CardHeader>
            <CardTitle>Query Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(queryResults, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeGraphIntegration;
