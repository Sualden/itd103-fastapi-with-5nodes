import React, { useState } from 'react';
import { Link as LinkIcon, ArrowRight } from 'lucide-react';

export default function ConnectGraph({ API_BASE, showStatus }) {
  const [relType, setRelType] = useState('/graph/student-enrolls-course');
  const [sourceName, setSourceName] = useState('');
  const [targetName, setTargetName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRel = async (e) => {
    e.preventDefault();
    if (!sourceName || !targetName) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}${relType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_name: sourceName, target_name: targetName })
      });
      const data = await res.json();
      if (res.ok && !data.error) showStatus('success', data.message);
      else showStatus('error', data.error || 'Failed to create connection');
      
      setSourceName('');
      setTargetName('');
    } catch (err) {
      showStatus('error', 'Cannot connect to API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Link Graph Nodes</h2>
        <p className="text-slate-500 mt-1">Define relationships between entities to build out your knowledge graph.</p>
      </div>

      <form onSubmit={handleCreateRel} className="flex flex-col gap-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Relationship Type</label>
           <select 
             value={relType} 
             onChange={(e) => setRelType(e.target.value)}
             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
           >
              <optgroup label="Student Relationships">
                  <option value="/graph/student-enrolls-course">Student ➜ ENROLLED_IN ➜ Course</option>
                  <option value="/graph/student-interested-in-topic">Student ➜ INTERESTED_IN ➜ Topic</option>
                  <option value="/graph/student-has-topic">Student ➜ HAS_TOPIC ➜ Topic</option>
                  <option value="/graph/student-has-skill">Student ➜ HAS_SKILL ➜ Skill</option>
                  <option value="/graph/student-acquired-skill">Student ➜ ACQUIRED_SKILL ➜ Skill</option>
                  <option value="/graph/student-pursues-career">Student ➜ PURSUES ➜ Career</option>
                  <option value="/graph/student-interested-in-career">Student ➜ INTERESTED_IN ➜ Career</option>
                  <option value="/graph/student-aligns-with-career">Student ➜ ALIGNS_WITH ➜ Career</option>
                  <option value="/graph/student-career-goal">Student ➜ HAS_CAREER_GOAL ➜ Career</option>
              </optgroup>

              <optgroup label="Course Relationships">
                  <option value="/graph/course-covers-topic">Course ➜ COVERS ➜ Topic</option>
                  <option value="/graph/course-requires-topic">Course ➜ REQUIRES_PRIOR ➜ Topic</option>
                  <option value="/graph/course-teaches-skill">Course ➜ TEACHES ➜ Skill</option>
                  <option value="/graph/course-recommends-career">Course ➜ RECOMMENDS ➜ Career</option>
              </optgroup>

              <optgroup label="Core Domain Relationships">
                  <option value="/graph/career-requires-skill">Career ➜ REQUIRES ➜ Skill</option>
                  <option value="/graph/topic-develops-skill">Topic ➜ DEVELOPS ➜ Skill</option>
                  <option value="/graph/skill-applies-to-topic">Skill ➜ APPLIES_TO ➜ Topic</option>
              </optgroup>
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
            <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 z-10 shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Source Node Name</label>
            <input 
              type="text" 
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. rasman"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Target Node Name</label>
            <input 
              type="text" 
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g. Python"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-4 group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <LinkIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Establish Connection</span>
        </button>
      </form>
    </div>
  );
}