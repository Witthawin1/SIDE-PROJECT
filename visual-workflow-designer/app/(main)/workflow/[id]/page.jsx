"use client"
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, Save, Edit3, Trash2, X } from "lucide-react";

export default function WorkFlow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [drawingEdge, setDrawingEdge] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [editingNote, setEditingNote] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const containerRef = useRef(null);

  // Helper function to check if a point is already connected
  const isPointConnected = (nodeId, point) => {
    return edges.some(edge => 
      (edge.startNodeId === nodeId && edge.startPoint === point) || 
      (edge.endNodeId === nodeId && edge.endPoint === point)
    );
  };

  const findEdgeByPoint = (nodeId, point) => {
    return edges.find(edge => 
      (edge.startNodeId === nodeId && edge.startPoint === point) || 
      (edge.endNodeId === nodeId && edge.endPoint === point)
    );
  };

  // Function to create a new node
  const addNode = () => {
    const newNodeId = Math.max(0, ...nodes.map(n => n.id)) + 1;
    const newNode = {
      id: newNodeId,
      label: `Node ${newNodeId}`,
      note: '',
      position: { x: 100 + (newNodeId * 50), y: 100 + (newNodeId * 50) },
    };
    setNodes(prevNodes => [...prevNodes, newNode]);
  };
  
  // Function to delete a node
  const deleteNode = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setEdges(prevEdges => prevEdges.filter(edge => edge.startNodeId !== nodeId && edge.endNodeId !== nodeId));
    setSelectedNodeId(null);
    setShowNotePanel(false);
  };

  // Function to update node data
  const updateNode = (nodeId, updates) => {
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  // Function to handle node selection and show note panel
  const handleNodeSelect = (nodeId) => {
    setSelectedNodeId(nodeId);
    const selectedNode = nodes.find(n => n.id === nodeId);
    if (selectedNode) {
      setEditingNote(selectedNode.note || '');
      setEditingTitle(selectedNode.label || '');
      setShowNotePanel(true);
    }
  };

  // Function to save note changes
  const saveNodeChanges = () => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, { 
        note: editingNote,
        label: editingTitle 
      });
    }
  };

  const [dragStartTime, setDragStartTime] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);

  // Event handler for mouse down on a node to start dragging
  const handleNodeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nodeId = parseInt(e.currentTarget.dataset.nodeId);
    setDraggingNodeId(nodeId);
    setDragStartTime(Date.now());
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  // Event handler for node mouse up
  const handleNodeMouseUp = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragTime = Date.now() - dragStartTime;
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.x, 2) + 
      Math.pow(e.clientY - dragStartPos.y, 2)
    );
    
    // If it was a quick click (not a drag), open the panel
    if (dragTime < 200 && dragDistance < 10) {
      handleNodeSelect(nodeId);
    }
  };

  // Event handler for mouse down on a connection point
  const handleConnectMouseDown = (e, nodeId, point) => {
    e.preventDefault();
    e.stopPropagation();
    
    const existingEdge = findEdgeByPoint(nodeId, point);
    
    if (existingEdge) {
      const otherNodeId = existingEdge.startNodeId === nodeId ? existingEdge.endNodeId : existingEdge.startNodeId;
      const otherPoint = existingEdge.startNodeId === nodeId ? existingEdge.endPoint : existingEdge.startPoint;
      const otherNode = nodes.find(n => n.id === otherNodeId);
      const startPos = getPointPosition(otherNode, otherPoint);

      setEdges(prevEdges => prevEdges.filter(edge => edge.id !== existingEdge.id));
      setDrawingEdge({ 
        startNodeId: otherNodeId, 
        startPoint: otherPoint, 
        startPos: startPos, 
        endPos: startPos 
      });
    } else {
      const node = nodes.find(n => n.id === nodeId);
      const startPos = getPointPosition(node, point);
      setDrawingEdge({ 
        startNodeId: nodeId, 
        startPoint: point, 
        startPos: startPos, 
        endPos: startPos 
      });
    }
  };

  // Event handler for mouse move on the container
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const containerBounds = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const mouseX = clientX - containerBounds.left;
    const mouseY = clientY - containerBounds.top;

    if (drawingEdge) {
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        setDrawingEdge(prev => ({
          ...prev,
          endPos: { x: mouseX, y: mouseY }
        }));
      });
      return;
    }

    if (draggingNodeId && dragStartPos) {
      const dragDistance = Math.sqrt(
        Math.pow(clientX - dragStartPos.x, 2) + 
        Math.pow(clientY - dragStartPos.y, 2)
      );
      
      // Only start dragging if moved more than 5 pixels
      if (dragDistance > 5) {
        setIsDragging(true);
      }
    }

    if (!isDragging || !draggingNodeId) return;

    // Use requestAnimationFrame for smooth node dragging too
    requestAnimationFrame(() => {
      const newX = mouseX - 80;
      const newY = mouseY - 40;

      setNodes(prevNodes => prevNodes.map(node => 
        node.id === draggingNodeId
          ? { ...node, position: { x: newX, y: newY } }
          : node
      ));
    });
  };

  // Event handler for mouse up on the container
  const handleMouseUp = (e) => {
    const containerBounds = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (drawingEdge) {
      const targetElement = document.elementFromPoint(clientX, clientY);
      const targetPoint = targetElement?.dataset?.pointId;
      const targetNodeElement = targetElement?.closest('[data-node-id]');
      const targetNodeId = parseInt(targetNodeElement?.dataset?.nodeId);
      
      if (
        targetPoint && 
        targetNodeId && 
        targetNodeId !== drawingEdge.startNodeId &&
        !isPointConnected(targetNodeId, targetPoint)
      ) {
        const newEdge = {
          id: `${drawingEdge.startNodeId}-${drawingEdge.startPoint}-${targetNodeId}-${targetPoint}`,
          startNodeId: drawingEdge.startNodeId,
          endNodeId: targetNodeId,
          startPoint: drawingEdge.startPoint,
          endPoint: targetPoint,
        };
        setEdges(prevEdges => [...prevEdges, newEdge]);
      }
      setDrawingEdge(null);
    }
    
    setIsDragging(false);
    setDraggingNodeId(null);
  };
  
  // Event handler to remove an edge
  const handleEdgeClick = (edgeId) => {
    setEdges(prevEdges => prevEdges.filter(edge => edge.id !== edgeId));
  };
  
  // Event listener for keyboard events (Delete key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId !== null && !showNotePanel) {
        e.preventDefault();
        deleteNode(selectedNodeId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId, showNotePanel]);

  // Attach mouse event listeners to the container with passive listeners for better performance
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleMove = (e) => handleMouseMove(e);
      const handleUp = (e) => handleMouseUp(e);
      
      container.addEventListener('mousemove', handleMove, { passive: false });
      container.addEventListener('mouseup', handleUp);
      
      return () => {
        container.removeEventListener('mousemove', handleMove);
        container.removeEventListener('mouseup', handleUp);
      };
    }
  }, [isDragging, draggingNodeId, drawingEdge]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Workflow Editor</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={addNode} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={16} />
                Add Node
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={containerRef}
          className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
          onClick={(e) => {
            // Only close panel if clicking directly on the canvas background
            if (e.target === e.currentTarget) {
              setSelectedNodeId(null);
              setShowNotePanel(false);
            }
          }}
          style={{
            backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          {/* Render nodes */}
          {nodes.map(node => (
            <Node
              key={node.id}
              id={node.id}
              label={node.label}
              position={node.position}
              onNodeMouseDown={handleNodeMouseDown}
              onNodeMouseUp={handleNodeMouseUp}
              onConnectMouseDown={handleConnectMouseDown}
              isPointConnected={isPointConnected}
              isSelected={node.id === selectedNodeId}
              hasNote={!!node.note}
            />
          ))}

          {/* Render edges */}
          {edges.map(edge => {
            const startNode = nodes.find(node => node.id === edge.startNodeId);
            const endNode = nodes.find(node => node.id === edge.endNodeId);
            if (!startNode || !endNode) return null;
            return (
              <Edge 
                key={edge.id} 
                id={edge.id}
                startNode={startNode} 
                endNode={endNode}
                startPoint={edge.startPoint}
                endPoint={edge.endPoint}
                onEdgeClick={handleEdgeClick}
              />
            );
          })}
          
          {/* Render the temporary drawing edge */}
          <DrawingEdge 
            startPos={drawingEdge?.startPos} 
            endPos={drawingEdge?.endPos}
          />
        </div>
      </div>

      {/* Note Panel */}
      {showNotePanel && selectedNodeId && (
        <div className="w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Edit3 size={18} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Edit Node</h3>
            </div>
            <button 
              onClick={() => setShowNotePanel(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Node Title
              </label>
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter node title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Add your notes here..."
              />
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={saveNodeChanges}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              onClick={() => deleteNode(selectedNodeId)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Delete Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const Node = ({ id, label, position, onNodeMouseDown, onNodeMouseUp, onConnectMouseDown, isPointConnected, isSelected, hasNote }) => {
  return (
    <div
      id={`node-${id}`}
      className={`absolute w-40 h-20 bg-white border-2 rounded-xl shadow-lg cursor-grab flex items-center justify-center p-3 text-sm text-gray-800 select-none transition-transform duration-200 hover:shadow-xl hover:scale-105
      ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 shadow-blue-200' : 'border-gray-300'}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={onNodeMouseDown}
      onMouseUp={(e) => onNodeMouseUp(e, id)}
      data-node-id={id}
    >
      <div className="text-center">
        <div className="font-semibold">{label}</div>
        {hasNote && (
          <div className="flex items-center justify-center mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        )}
      </div>
      
      {/* Connection Points */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full cursor-crosshair hover:scale-125 transition-all border-2 border-white shadow-md
          ${isPointConnected(id, 'top') ? 'bg-emerald-500' : 'bg-blue-500'}`}
        onMouseDown={(e) => onConnectMouseDown(e, id, 'top')}
        data-point-id="top"
      ></div>
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full cursor-crosshair hover:scale-125 transition-all border-2 border-white shadow-md
          ${isPointConnected(id, 'bottom') ? 'bg-emerald-500' : 'bg-blue-500'}`}
        onMouseDown={(e) => onConnectMouseDown(e, id, 'bottom')}
        data-point-id="bottom"
      ></div>
      <div
        className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full cursor-crosshair hover:scale-125 transition-all border-2 border-white shadow-md
          ${isPointConnected(id, 'left') ? 'bg-emerald-500' : 'bg-blue-500'}`}
        onMouseDown={(e) => onConnectMouseDown(e, id, 'left')}
        data-point-id="left"
      ></div>
      <div
        className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full cursor-crosshair hover:scale-125 transition-all border-2 border-white shadow-md
          ${isPointConnected(id, 'right') ? 'bg-emerald-500' : 'bg-blue-500'}`}
        onMouseDown={(e) => onConnectMouseDown(e, id, 'right')}
        data-point-id="right"
      ></div>
    </div>
  );
};

const getPointPosition = (node, point) => {
  const { x, y } = node.position;
  const width = 160; 
  const height = 80; 
  switch (point) {
    case 'top':
      return { x: x + width / 2, y: y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x: x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
};

const Edge = ({ id, startNode, endNode, startPoint, endPoint, onEdgeClick }) => {
  const startPos = getPointPosition(startNode, startPoint);
  const endPos = getPointPosition(endNode, endPoint);

  const path = `M ${startPos.x} ${startPos.y} 
                C ${startPos.x + 50} ${startPos.y}, 
                  ${endPos.x - 50} ${endPos.y}, 
                  ${endPos.x} ${endPos.y}`;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <path
        d={path}
        fill="none"
        className="stroke-gray-400 stroke-[3px] drop-shadow-sm"
      />
      <path
        d={path}
        fill="none"
        className="stroke-transparent stroke-[16px] cursor-pointer hover:stroke-red-200"
        onClick={() => onEdgeClick(id)}
        style={{ pointerEvents: 'auto' }}
      />
    </svg>
  );
};

const DrawingEdge = ({ startPos, endPos }) => {
  if (!startPos || !endPos) return null;
  
  const path = `M ${startPos.x} ${startPos.y} 
                C ${startPos.x + 50} ${startPos.y}, 
                  ${endPos.x - 50} ${endPos.y}, 
                  ${endPos.x} ${endPos.y}`;
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" 
      style={{ willChange: 'transform' }}
    >
      <path
        d={path}
        fill="none"
        className="stroke-blue-500 stroke-[3px] stroke-dashed"
        style={{ 
          strokeDasharray: '8 4',
          animation: 'dash 1s linear infinite'
        }}
      />
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }
      `}</style>
    </svg>
  );
};