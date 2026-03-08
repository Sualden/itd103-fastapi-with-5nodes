import React, { useState, useEffect, useRef } from 'react';
import { Network, Play, Loader2, Database, Globe, Share2 } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';

export default function Dashboard({ API_BASE, showStatus }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isSearching, setIsSearching] = useState(false);
  
  // Create a reference to the graph to tweak its physics
  const fgRef = useRef();

  const nodeColors = {
    students: '#FFC454', // Orange
    courses: '#D97FD6',  // Purple
    topics: '#4C8EDA',   // Blue
    skills: '#FB7E81',   // Red
    careers: '#6DCE9E',  // Green
    default: '#94a3b8'
  };

  const relationshipTypes = [
    'ENROLLED_IN', 'INTERESTED_IN', 'HAS_TOPIC', 'HAS_SKILL',
    'ACQUIRED_SKILL', 'PURSUES', 'ALIGNS_WITH', 'HAS_CAREER_GOAL',
    'COVERS', 'REQUIRES_PRIOR', 'TEACHES', 'RECOMMENDS',
    'REQUIRES', 'DEVELOPS', 'APPLIES_TO'
  ];

  const fetchFullGraph = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/graph/all`); 
      const data = await res.json();
      
      if (res.ok) {
        setGraphData({
          nodes: data.nodes.map(n => ({ ...n, color: nodeColors[n.type] || nodeColors.default, val: 12 })),
          links: data.links
        });
        showStatus('success', 'Full Graph Loaded');
      }
    } catch (err) {
      showStatus('error', 'Could not fetch full graph. Check backend.');
    } finally {
      setIsSearching(false);
    }
  };

  // Run on initial mount
  useEffect(() => {
    fetchFullGraph();
  }, []);

  // Adjust the physics engine to make lines longer and push nodes apart
  useEffect(() => {
    if (fgRef.current) {
      // Increase link distance (longer lines)
      fgRef.current.d3Force('link').distance(80);
      
      // Increase node repulsion (nodes push away from each other)
      fgRef.current.d3Force('charge').strength(-300);
    }
  }, [graphData]); // Re-run this whenever the graph data changes

  const handleRunQuery = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return fetchFullGraph(); 
    
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/graph/all`);
      const data = await res.json();
      
      if (res.ok) {
        const queryLower = searchQuery.toLowerCase();
        
        const filteredLinks = data.links.filter(
          link => link.source.toLowerCase() === queryLower || link.target.toLowerCase() === queryLower
        );
        
        const connectedNodeIds = new Set();
        filteredLinks.forEach(link => {
          connectedNodeIds.add(link.source);
          connectedNodeIds.add(link.target);
        });

        const exactNode = data.nodes.find(n => n.id.toLowerCase() === queryLower);
        if (exactNode) connectedNodeIds.add(exactNode.id);

        const filteredNodes = data.nodes
          .filter(n => connectedNodeIds.has(n.id))
          .map(n => ({ 
            ...n, 
            color: nodeColors[n.type] || nodeColors.default, 
            val: n.id.toLowerCase() === queryLower ? 24 : 12 
          }));

        if (filteredNodes.length > 0) {
          setGraphData({ nodes: filteredNodes, links: filteredLinks });
          showStatus('success', `Found ${filteredNodes.length} nodes connected to '${searchQuery}'`);
        } else {
           showStatus('error', 'Entity not found in graph');
           setGraphData({ nodes: [], links: [] });
        }
      }
    } catch (err) {
      showStatus('error', 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] animate-in fade-in duration-700">
      <div className="mb-4 bg-[#1c2128] p-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
        <div className="pl-4 pr-2 text-slate-500 font-mono text-sm">neo4j$</div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter graph by entity name (e.g., rasman)"
          className="flex-1 bg-transparent py-2 text-indigo-300 font-mono outline-none text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
        />
        <div className="flex gap-2 mr-1">
            <button onClick={fetchFullGraph} title="View All" className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg">
                <Globe className="w-4 h-4" />
            </button>
            <button onClick={handleRunQuery} className="bg-[#008cc1] hover:bg-[#00a8e8] text-white p-2 px-5 rounded-lg flex items-center gap-2">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>Filter</span>
            </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Sidebar Info */}
        <div className="w-60 bg-[#f4f7f9] border border-slate-200 rounded-[2rem] p-5 hidden md:flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 shrink-0">
            <Database className="w-3 h-3" /> Database Information
          </h3>
          <div className="space-y-4">
            <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase mb-2">Node Labels</p>
                {Object.entries(nodeColors).filter(([k]) => k !== 'default').map(([label, color]) => (
                <div key={label} className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-xs font-bold text-slate-600 capitalize">{label}</span>
                </div>
                ))}
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase mb-2 mt-4">Relationships</p>
                {relationshipTypes.map(rel => (
                    <div key={rel} className="flex items-center gap-2 mb-1 text-slate-500">
                        <Share2 className="w-3 h-3" />
                        <span className="text-[9px] font-mono font-bold">{rel}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* The Graph Canvas */}
        <div className="flex-1 bg-[#22272e] rounded-[2rem] border border-slate-800 relative overflow-hidden">
          {graphData.nodes.length > 0 ? (
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              nodeLabel="name"
              nodeColor={n => n.color}
              nodeVal={n => n.val || 12}
              linkLabel="label"
              linkDirectionalArrowLength={4}
              linkDirectionalArrowRelPos={1}
              
              linkCanvasObjectMode={() => 'after'}
              
              linkCanvasObject={(link, ctx, globalScale) => {
                const MAX_FONT_SIZE = 4;
                
                const start = link.source;
                const end = link.target;

                if (typeof start !== 'object' || typeof end !== 'object') return;

                const textPos = Object.assign(...['x', 'y'].map(c => ({
                  [c]: start[c] + (end[c] - start[c]) / 2
                })));

                const relLink = { x: end.x - start.x, y: end.y - start.y };
                let textAngle = Math.atan2(relLink.y, relLink.x);
                
                if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
                if (textAngle < -Math.PI / 2) textAngle = -(Math.PI + textAngle);

                const label = link.label;

                const fontSize = Math.min(MAX_FONT_SIZE, 10 / globalScale);
                ctx.font = `${fontSize}px Inter, font-mono, sans-serif`;

                ctx.save();
                ctx.translate(textPos.x, textPos.y);
                ctx.rotate(textAngle);

                const padding = 1;
                const textWidth = ctx.measureText(label).width;
                ctx.fillStyle = '#22272e'; 
                ctx.fillRect(-textWidth / 2 - padding, -fontSize / 2 - padding, textWidth + padding * 2, fontSize + padding * 2);

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#8b949e'; 
                ctx.fillText(label, 0, 0);
                ctx.restore();
              }}

              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 14/globalScale;
                ctx.font = `${fontSize}px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.color;
                
                const radius = node.val ? Math.sqrt(node.val) * 2 : 8;
                ctx.beginPath(); 
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false); 
                ctx.fill();
                
                ctx.fillStyle = '#fff';
                ctx.fillText(label, node.x, node.y + radius + 4);
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-700 italic">
               No entities found in the graph network.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}