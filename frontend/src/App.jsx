import React, { useState } from 'react';
import { 
  UserPlus, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Network,
  LayoutDashboard 
} from 'lucide-react';

import AddEntity from './components/addEntry';
import ConnectGraph from './components/connectGraph';
import Recommendations from './components/recommendation';
import Dashboard from './components/dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const API_BASE = "http://127.0.0.1:8080";

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 text-slate-900 font-sans p-4 sm:p-8 flex justify-center items-start">
      <div className="max-w-5xl w-full mt-8">
        
        <header className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-sm border border-slate-100 mb-2">
            <Network className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
            Knowledge Graph
          </h1>
          <p className="text-slate-500 font-medium text-lg">Manage entities and visualize Neo4j connections.</p>
        </header>

        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {status.message && (
            <div className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl transform transition-all animate-in slide-in-from-top-5 fade-in duration-300 border ${
              status.type === 'error' ? 'bg-white border-red-100 text-red-700' : 'bg-white border-emerald-100 text-emerald-700'
            }`}>
              {status.type === 'error' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              <span className="font-semibold">{status.message}</span>
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white p-2 md:p-4">
          <nav className="flex flex-col sm:flex-row p-2 bg-slate-100/50 rounded-3xl sm:rounded-full mb-6">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
              { id: 'add', icon: UserPlus, label: 'Add Entities' },
              { id: 'connect', icon: LinkIcon, label: 'Connect Graph' },
              { id: 'recommend', icon: Sparkles, label: 'Recommendations' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold transition-all ${
                  activeTab === tab.id ? 'bg-white text-indigo-700 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-5 h-5" /> 
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 md:p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
            {activeTab === 'dashboard' && <Dashboard API_BASE={API_BASE} showStatus={showStatus} />}
            {activeTab === 'add' && <AddEntity API_BASE={API_BASE} showStatus={showStatus} />}
            {activeTab === 'connect' && <ConnectGraph API_BASE={API_BASE} showStatus={showStatus} />}
            {activeTab === 'recommend' && <Recommendations API_BASE={API_BASE} showStatus={showStatus} />}
          </div>
        </div>
      </div>
    </div>
  );
}