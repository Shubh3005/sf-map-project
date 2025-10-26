import { useState, useEffect } from 'react';

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

interface GraphMetrics {
  nodes: {
    total: number;
    reddit: number;
    sf311: number;
    distribution: Record<string, number>;
  };
  edges: {
    total: number;
    geographic: number;
    temporal: number;
    similar: number;
    distribution: Record<string, number>;
    average_strength: number;
  };
  clusters: {
    total: number;
    largest: {
      name: string | null;
      size: number;
    };
  };
}

export const useKnowledgeGraph = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [clusters, setClusters] = useState<GraphCluster[]>([]);
  const [metrics, setMetrics] = useState<GraphMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  const fetchNodes = async (filters?: {
    severity?: string;
    source?: string;
    neighborhood?: string;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.source) params.append('source', filters.source);
      if (filters?.neighborhood) params.append('neighborhood', filters.neighborhood);
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE}/knowledge-graph/nodes?${params}`);
      if (!response.ok) throw new Error('Failed to fetch nodes');
      
      const data = await response.json();
      setNodes(data.nodes);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nodes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEdges = async (filters?: {
    min_strength?: number;
    relationship_type?: string;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.min_strength) params.append('min_strength', filters.min_strength.toString());
      if (filters?.relationship_type) params.append('relationship_type', filters.relationship_type);
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE}/knowledge-graph/edges?${params}`);
      if (!response.ok) throw new Error('Failed to fetch edges');
      
      const data = await response.json();
      setEdges(data.edges);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch edges');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchClusters = async (filters?: {
    min_issues?: number;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.min_issues) params.append('min_issues', filters.min_issues.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE}/knowledge-graph/clusters?${params}`);
      if (!response.ok) throw new Error('Failed to fetch clusters');
      
      const data = await response.json();
      setClusters(data.clusters);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clusters');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/knowledge-graph/metrics`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      
      const data = await response.json();
      setMetrics(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const queryGraph = async (queryType: string, queryParams: Record<string, any>) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('query_type', queryType);
      
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(`query_params.${key}`, value.toString());
        }
      });

      const response = await fetch(`${API_BASE}/knowledge-graph/query?${params}`);
      if (!response.ok) throw new Error('Failed to query graph');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to query graph');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Spatial queries
  const querySpatial = async (neighborhood?: string, coordinates?: [number, number], radius?: number) => {
    return queryGraph('spatial', { neighborhood, coordinates, radius });
  };

  // Temporal queries
  const queryTemporal = async (timeframe?: string, startDate?: string, endDate?: string) => {
    return queryGraph('temporal', { timeframe, start_date: startDate, end_date: endDate });
  };

  // Similarity queries
  const querySimilarity = async (issueId: string, minSimilarity?: number) => {
    return queryGraph('similarity', { issue_id: issueId, min_similarity: minSimilarity });
  };

  // Cluster queries
  const queryCluster = async (clusterId?: string, clusterName?: string) => {
    return queryGraph('cluster', { cluster_id: clusterId, cluster_name: clusterName });
  };

  // Load all graph data
  const loadGraphData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchNodes(),
        fetchEdges(),
        fetchClusters(),
        fetchMetrics()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load graph data');
    } finally {
      setLoading(false);
    }
  };

  // Load graph data on mount
  useEffect(() => {
    loadGraphData();
  }, []);

  return {
    // Data
    nodes,
    edges,
    clusters,
    metrics,
    
    // State
    loading,
    error,
    
    // Actions
    fetchNodes,
    fetchEdges,
    fetchClusters,
    fetchMetrics,
    queryGraph,
    querySpatial,
    queryTemporal,
    querySimilarity,
    queryCluster,
    loadGraphData,
    
    // Utilities
    clearError: () => setError(null)
  };
};
