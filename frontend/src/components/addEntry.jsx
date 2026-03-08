import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function AddEntity({ API_BASE, showStatus }) {
  const [nodeType, setNodeType] = useState('students');
  const [nodeName, setNodeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateNode = async (e) => {
    e.preventDefault();
    if (!nodeName) return;
    setIsSubmitting(true);

    let endpoint = '';
    let payload = {};

    // Aligned with FastAPI backend routes and Pydantic schemas
    if (nodeType === 'students') { 
      endpoint = '/students/'; 
      payload = { name: nodeName }; 
    }
    else if (nodeType === 'courses') { 
      endpoint = '/courses/'; 
      payload = { title: nodeName }; 
    }
    else if (nodeType === 'topics') { 
      endpoint = '/entities/topics'; 
      payload = { name: nodeName }; 
    }
    else if (nodeType === 'skills') { 
      endpoint = '/entities/skills'; 
      payload = { name: nodeName }; 
    }
    else if (nodeType === 'careers') { 
      endpoint = '/entities/careers'; 
      payload = { title: nodeName }; 
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) showStatus('success', data.message || `Created successfully`);
      else showStatus('error', data.error || 'Failed to create');
      setNodeName('');
    } catch (err) {
      showStatus('error', 'Cannot connect to API. Is your FastAPI server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Create a New Entity</h2>
        <p className="text-slate-500 mt-1">Add a new student, course, topic, skill, or career to the database.</p>
      </div>
      
      <form onSubmit={handleCreateNode} className="flex flex-col gap-6 max-w-xl">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Entity Type</label>
          <select 
            value={nodeType} 
            onChange={(e) => setNodeType(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="students">🎓 Student</option>
            <option value="courses">📚 Course</option>
            <option value="topics">🧠 Topic</option>
            <option value="skills">⚡ Skill</option>
            <option value="careers">💼 Career</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Name / Title</label>
          <input 
            type="text" 
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="e.g. John Doe, BSIT, Python"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-4 group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span>Create {nodeType.slice(0, -1)}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}