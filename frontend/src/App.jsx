import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ShieldAlert, ShieldCheck, Activity, History, Zap, AlertTriangle, Layers } from 'lucide-react';

const API_BASE = "http://localhost:8000";

function App() {
  const [dataHistory, setDataHistory] = useState([]);
  const [dbHistory, setDbHistory] = useState([]); // For the table
  const [currentResult, setCurrentResult] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // 1. Fetch History from Postgres
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/history`);
      setDbHistory(res.data);
    } catch (err) { console.error("History fetch failed"); }
  };

  // 2. Prediction Logic
  const simulateTransaction = async () => {
    try {
      const mockFeatures = Array.from({ length: 11 }, () => (Math.random() * 4 - 2));
      const response = await axios.post(`${API_BASE}/api/predict`, { features: mockFeatures });
      
      const newDataPoint = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        error: response.data.reconstruction_error,
        is_fraud: response.data.is_fraud
      };

      setCurrentResult(response.data);
      setDataHistory(prev => [...prev.slice(-19), newDataPoint]);
      if (response.data.is_fraud) fetchHistory(); // Refresh table if fraud detected
    } catch (err) { setIsLive(false); }
  };

  useEffect(() => {
    fetchHistory();
    let interval;
    if (isLive) interval = setInterval(simulateTransaction, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-1.5 rounded-lg">
              <ShieldCheck className="text-slate-950" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">FRAUD<span className="text-cyan-500">ENGINE</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              {isLive ? 'SYSTEM LIVE' : 'SYSTEM STANDBY'}
            </div>
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${isLive ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' : 'bg-white text-black hover:bg-cyan-400'}`}
            >
              {isLive ? 'DISCONNECT FEED' : 'ESTABLISH FEED'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        
        {/* Left Column: Metrics & Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Main Chart */}
          <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-cyan-500" /> Neural Reconstruction Error
                </h2>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataHistory}>
                  <CartesianGrid strokeDasharray="0" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #ffffff10', borderRadius: '8px' }} />
                  <ReferenceLine y={0.05} stroke="#ef4444" strokeDasharray="3 3" />
                  <Line type="stepAfter" dataKey="error" stroke="#22d3ee" strokeWidth={2} dot={false} animationDuration={300} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Bar Chart */}
          <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers size={14} className="text-cyan-500" /> Anomaly Attribution (LIME/SHAP Style)
            </h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentResult?.feature_importance || []}>
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {(currentResult?.feature_importance || []).map((entry, index) => (
                      <Cell key={index} fill={entry.value > 0.05 ? '#ef4444' : '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Status & History */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Risk Card */}
          <div className={`rounded-2xl p-8 border transition-all duration-500 ${currentResult?.is_fraud ? 'bg-red-500/5 border-red-500/20' : 'bg-[#0d1117] border-white/5'}`}>
            <div className="text-center">
              {currentResult?.is_fraud ? (
                <AlertTriangle size={64} className="mx-auto text-red-500 mb-4 animate-bounce" />
              ) : (
                <Zap size={64} className="mx-auto text-cyan-500 mb-4" />
              )}
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Risk Assessment</h3>
              <p className={`text-3xl font-black ${currentResult?.is_fraud ? 'text-red-500' : 'text-white'}`}>
                {currentResult?.is_fraud ? 'CRITICAL ANOMALY' : 'NORMAL TRAFFIC'}
              </p>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-5xl font-mono font-bold tracking-tighter text-white">
                  {currentResult ? currentResult.reconstruction_error.toFixed(4) : '0.0000'}
                </p>
                <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Global Reconstruction Loss</p>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-6 overflow-hidden">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History size={14} className="text-cyan-500" /> Incident Log
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {dbHistory.length > 0 ? dbHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">{new Date(item.timestamp).toLocaleTimeString()}</p>
                    <p className="text-[10px] text-slate-500 font-mono italic">Err: {item.reconstruction_error.toFixed(4)}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.is_fraud ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {item.is_fraud ? 'FRAUD' : 'PASS'}
                  </span>
                </div>
              )) : <p className="text-slate-600 text-xs italic">No incidents logged.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
