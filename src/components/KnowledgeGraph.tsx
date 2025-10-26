import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters: GraphCluster[];
  onNodeClick?: (node: GraphNode) => void;
  onClusterClick?: (cluster: GraphCluster) => void;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  nodes,
  edges,
  clusters,
  onNodeClick,
  onClusterClick
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<GraphCluster | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'clusters' | 'timeline'>('graph');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter nodes based on selected filters
  const filteredNodes = nodes.filter(node => {
    const severityMatch = filterSeverity === 'all' || node.severity === filterSeverity;
    const sourceMatch = filterSource === 'all' || node.source === filterSource;
    return severityMatch && sourceMatch;
  });

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444'; // red
      case 'medium': return '#f59e0b'; // amber
      case 'low': return '#10b981'; // emerald
      default: return '#6b7280'; // gray
    }
  };

  // Get source color
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'reddit': return '#ff6b6b'; // red
      case '311': return '#4ecdc4'; // teal
      default: return '#6b7280'; // gray
    }
  };

  // Get edge color based on type
  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'geographic': return '#3b82f6'; // blue
      case 'temporal': return '#8b5cf6'; // violet
      case 'similar': return '#f59e0b'; // amber
      default: return '#6b7280'; // gray
    }
  };

  // Draw the knowledge graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw nodes
    filteredNodes.forEach((node, index) => {
      const x = 100 + (index % 4) * 150;
      const y = 100 + Math.floor(index / 4) * 120;
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = getSourceColor(node.source);
      ctx.fill();
      ctx.strokeStyle = getSeverityColor(node.severity);
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, x, y + 35);
    }));

    // Draw edges
    edges.forEach(edge => {
      const sourceNode = filteredNodes.find(n => n.id === edge.source);
      const targetNode = filteredNodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceIndex = filteredNodes.indexOf(sourceNode);
        const targetIndex = filteredNodes.indexOf(targetNode);
        
        const sourceX = 100 + (sourceIndex % 4) * 150;
        const sourceY = 100 + Math.floor(sourceIndex / 4) * 120;
        const targetX = 100 + (targetIndex % 4) * 150;
        const targetY = 100 + Math.floor(targetIndex / 4) * 120;

        // Draw edge line
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = getEdgeColor(edge.type);
        ctx.lineWidth = edge.strength * 3;
        ctx.stroke();
      }
    });
  }, [filteredNodes, edges]);

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={viewMode === 'graph' ? 'default' : 'outline'}
          onClick={() => setViewMode('graph')}
          size="sm"
        >
          Graph View
        </Button>
        <Button
          variant={viewMode === 'clusters' ? 'default' : 'outline'}
          onClick={() => setViewMode('clusters')}
          size="sm"
        >
          Clusters
        </Button>
        <Button
          variant={viewMode === 'timeline' ? 'default' : 'outline'}
          onClick={() => setViewMode('timeline')}
          size="sm"
        >
          Timeline
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="all">All Sources</option>
          <option value="reddit">Reddit</option>
          <option value="311">SF311</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graph Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Graph Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border rounded w-full h-96"
                />
                
                {/* Legend */}
                <div className="absolute top-4 right-4 bg-white p-2 rounded shadow">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Reddit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      <span>SF311</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-blue-500"></div>
                      <span>Geographic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-violet-500"></div>
                      <span>Temporal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-amber-500"></div>
                      <span>Similar</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node Details */}
        <div className="space-y-4">
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle>Node Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <strong>ID:</strong> {selectedNode.id}
                  </div>
                  <div>
                    <strong>Title:</strong> {selectedNode.title}
                  </div>
                  <div>
                    <strong>Source:</strong> 
                    <Badge className="ml-2" style={{ backgroundColor: getSourceColor(selectedNode.source) }}>
                      {selectedNode.source}
                    </Badge>
                  </div>
                  <div>
                    <strong>Location:</strong> {selectedNode.location}
                  </div>
                  <div>
                    <strong>Severity:</strong>
                    <Badge className="ml-2" style={{ backgroundColor: getSeverityColor(selectedNode.severity) }}>
                      {selectedNode.severity}
                    </Badge>
                  </div>
                  <div>
                    <strong>Keywords:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clusters */}
          {viewMode === 'clusters' && (
            <Card>
              <CardHeader>
                <CardTitle>Issue Clusters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCluster(cluster)}
                    >
                      <div className="font-medium">{cluster.name}</div>
                      <div className="text-sm text-gray-600">
                        {cluster.nodes.length} nodes
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cluster.themes.map((theme, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Graph Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Graph Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
              <div className="text-sm text-gray-600">Total Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{edges.length}</div>
              <div className="text-sm text-gray-600">Relationships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{clusters.length}</div>
              <div className="text-sm text-gray-600">Clusters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {edges.length > 0 ? (edges.reduce((sum, edge) => sum + edge.strength, 0) / edges.length).toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-gray-600">Avg Strength</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeGraph;
