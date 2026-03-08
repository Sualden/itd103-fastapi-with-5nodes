import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

// Added export default and imports!
export default function Recommendations({ API_BASE, showStatus }) {
  const [recStudent, setRecStudent] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    if (!recStudent) return;
    setIsSubmitting(true);
    setHasSearched(true);

    try {
      const res = await fetch(`${API_BASE}/graph/student/${recStudent}/recommend-careers`);
      const data = await res.json();
      
      if (res.ok && !data.error) {
        setRecommendations(data.recommended_careers_based_on_courses || []);
        showStatus('success', `Found ${data.recommended_careers_based_on_courses?.length || 0} recommendations`);
      } else {
        setRecommendations([]);
        showStatus('error', data.error || 'Student not found');
      }
    } catch (err) {
      showStatus('error', 'Cannot connect to API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">AI Career Insights</h2>
        <p className="text-slate-500 mt-1">Discover recommended careers by analyzing a student's enrolled courses and learned skills.</p>
      </div>
      
      <form onSubmit={handleGetRecommendations} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input 
          type="text" 
          value={recStudent}
          onChange={(e) => setRecStudent(e.target.value)}
          placeholder="Enter Student Name (e.g. rasman)"
          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
          required
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl hover:bg-slate-700 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5 text-indigo-300" />
          <span>Analyze</span>
        </button>
      </form>

      {/* Results Section */}
      <div className="relative">
        {recommendations.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Top Matches</h3>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((career, idx) => (
                <div 
                  key={idx} 
                  className="group flex items-center gap-4 p-5 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all hover:-translate-y-0.5 cursor-default"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-600 mb-0.5">Recommended Career</p>
                    <p className="font-bold text-slate-800 text-lg leading-tight">{career}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length === 0 && hasSearched && !isSubmitting && (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No matches found</h3>
            <p className="text-slate-500 max-w-md">
              Try enrolling this student in more courses, or make sure courses teach skills required by careers in the graph.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}