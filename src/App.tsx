/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  BarChart3, 
  PlusCircle, 
  LineChart, 
  Trophy, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';

import { ActivityLog, Challenge } from './types';
import { 
  getInitialLogs, 
  CO2_GOALS, 
  getRelativeDateString, 
  INITIAL_CHALLENGES 
} from './data';

import Dashboard from './components/Dashboard';
import LogActivity from './components/LogActivity';
import Insights from './components/Insights';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'insights' | 'leaderboard'>('dashboard');

  // Load from localStorage or use initial seeding data
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('eco_tracker_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved logs, resetting...', e);
      }
    }
    return getInitialLogs();
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('eco_tracker_challenges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing challenges, resetting...', e);
      }
    }
    return INITIAL_CHALLENGES;
  });

  const [tipIndex, setTipIndex] = useState<number>(0);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('eco_tracker_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('eco_tracker_challenges', JSON.stringify(challenges));
  }, [challenges]);

  // Recalculate metrics based on logs
  const getTodayTotal = () => {
    const todayStr = getRelativeDateString(0);
    return logs
      .filter(l => l.date === todayStr)
      .reduce((sum, l) => sum + l.co2, 0);
  };

  const getWeeklyTotal = () => {
    // Last 7 days including today
    const activeDates = Array.from({ length: 7 }, (_, i) => getRelativeDateString(i));
    return logs
      .filter(l => activeDates.includes(l.date))
      .reduce((sum, l) => sum + l.co2, 0);
  };

  const getMonthlyTotal = () => {
    // Sum all logs in state, using weekly as a predictor if small
    const totalExisting = logs.reduce((sum, l) => sum + l.co2, 0);
    const weekly = getWeeklyTotal();
    // Return either the full log sum or extrapolate the current trend over 4 weeks
    return Math.max(totalExisting, weekly * 4.3);
  };

  const todayTotal = getTodayTotal();
  const weeklyTotal = getWeeklyTotal();
  const monthlyTotal = getMonthlyTotal();

  // Eco-Score: 0 to 100. Lower daily emissions = Higher Eco-score.
  // 0kg = 100 score, 15+kg = 0 score
  const calculateEcoScore = () => {
    return Math.max(0, Math.min(100, Math.round(100 - (todayTotal / 15) * 100)));
  };

  const ecoScore = calculateEcoScore();

  // Planet health badge thresholds and colors
  const getHealthStatus = (): {
    label: 'Excellent' | 'Good' | 'Fair' | 'Critical';
    color: { text: string; bg: string; border: string; desc: string };
  } => {
    if (ecoScore >= 80) {
      return {
        label: 'Excellent',
        color: {
          text: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          desc: 'Your emissions are perfectly optimized! Your daily habits run exceptionally close to nature.'
        }
      };
    } else if (ecoScore >= 55) {
      return {
        label: 'Good',
        color: {
          text: 'text-teal-700',
          bg: 'bg-teal-50',
          border: 'border-teal-200',
          desc: 'Great habits keeping emissions in a moderate green zone. Squeeze a tiny bit more to top ranks.'
        }
      };
    } else if (ecoScore >= 30) {
      return {
        label: 'Fair',
        color: {
          text: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          desc: 'Moderate carbon impact. Some luxury travel or red meats might be driving your averages up.'
        }
      };
    } else {
      return {
        label: 'Critical',
        color: {
          text: 'text-rose-700',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          desc: 'High environment footprint checked today. Use active commuting and plant meals to de-escalate.'
        }
      };
    }
  };

  const healthStatus = getHealthStatus();

  // Handlers
  const handleAddLog = (newLog: Omit<ActivityLog, 'id'>) => {
    const logItem: ActivityLog = {
      ...newLog,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setLogs(prev => [logItem, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const handleToggleChallenge = (challengeId: string, field: 'accepted' | 'completed') => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          [field]: !ch[field]
        };
      }
      return ch;
    }));
  };

  const handleNextTip = () => {
    setTipIndex(prev => (prev + 1) % 8); // Cycles through 8 custom tips in constants
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const confirmResetData = () => {
    setLogs(getInitialLogs());
    setChallenges(INITIAL_CHALLENGES);
    setTipIndex(0);
    setShowResetConfirm(false);
  };

  const handleResetData = () => {
    setShowResetConfirm(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col md:flex-row font-sans antialiased text-[#1B4332]">
      
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E8F0] shrink-0 justify-between h-screen sticky top-0">
        <div className="flex flex-col pt-6 px-5 space-y-7">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-md shadow-[#2D6A4F]/20 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 id="app-title-head" className="font-sans font-extrabold text-[#1B4332] tracking-tight text-base leading-none">
                EcoCarbon
              </h1>
              <span className="text-[10px] text-[#52B788] font-bold uppercase tracking-widest mt-1 block">
                FOOTPRINT PLATFORM
              </span>
            </div>
          </div>

          {/* Quick Metrics Badge card */}
          <div className="bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center text-[10px] text-[#5E7E71] font-semibold uppercase tracking-wider">
              <span>Your Health</span>
              <span className={`text-[10px] font-extrabold rounded-full px-1.5 py-0.5 ${
                ecoScore >= 80 ? 'bg-emerald-50 text-emerald-700' :
                ecoScore >= 55 ? 'bg-teal-50 text-teal-700' :
                ecoScore >= 30 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
              }`}>{healthStatus.label}</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-[#1B4332] tracking-tight">{ecoScore}</span>
              <span className="text-[10px] text-[#5E7E71] font-bold uppercase">Eco-Score</span>
            </div>
            <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500" 
                style={{ width: `${ecoScore}%` }}
              />
            </div>
          </div>

          {/* Sidebar Nav links */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all outline-none cursor-pointer text-left ${
                activeTab === 'dashboard' 
                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-l-4 border-[#2D6A4F] font-extrabold' 
                  : 'text-[#5E7E71] hover:bg-[#F8FAFB] hover:text-[#1B4332]'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Dashboard Home</span>
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all outline-none cursor-pointer text-left ${
                activeTab === 'log' 
                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-l-4 border-[#2D6A4F] font-extrabold' 
                  : 'text-[#5E7E71] hover:bg-[#F8FAFB] hover:text-[#1B4332]'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Log Daily Activity</span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all outline-none cursor-pointer text-left ${
                activeTab === 'insights' 
                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-l-4 border-[#2D6A4F] font-extrabold' 
                  : 'text-[#5E7E71] hover:bg-[#F8FAFB] hover:text-[#1B4332]'
              }`}
            >
              <LineChart className="w-4 h-4 shrink-0" />
              <span>Reduction Insights</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all outline-none cursor-pointer text-left ${
                activeTab === 'leaderboard' 
                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-l-4 border-[#2D6A4F] font-extrabold' 
                  : 'text-[#5E7E71] hover:bg-[#F8FAFB] hover:text-[#1B4332]'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>Streaks & Leaderboard</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer block */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-3 bg-[#F8FAFB]">
          <button
            type="button"
            onClick={handleResetData}
            className="w-full py-2.5 border border-[#E2E8F0] hover:border-red-200 text-[#5E7E71] hover:text-red-600 bg-white hover:bg-neutral-50 rounded-xl transition-all outline-none cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Tracker Data
          </button>
          <div className="text-[10px] text-[#5E7E71] text-center font-medium leading-normal">
            Paris Accord Target<br/>
            <strong>8.0 kg CO₂ / day</strong>
          </div>
        </div>
      </aside>

      {/* 2. Responsive Mobile Header */}
      <div className="md:hidden flex flex-col bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white shrink-0">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-[#1B4332] text-sm tracking-tight">EcoCarbon</h1>
              <span className="text-[8px] text-[#52B788] font-bold uppercase tracking-wider block">Carbon Footprint Tracker</span>
            </div>
          </div>
          <button
            onClick={handleResetData}
            className="p-1.5 px-2.5 border border-[#E2E8F0] rounded-lg text-xs font-bold text-[#5E7E71] hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
        
        {/* Mobile Horizontal Selector Tabs */}
        <nav className="flex items-center justify-around bg-[#F8FAFB] border-t border-[#E2E8F0] p-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-[10px] font-bold flex flex-col items-center gap-0.5 relative transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'text-[#2D6A4F] font-black' : 'text-[#5E7E71]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 py-1.5 text-[10px] font-bold flex flex-col items-center gap-0.5 relative transition-all cursor-pointer ${
              activeTab === 'log' ? 'text-[#2D6A4F] font-black' : 'text-[#5E7E71]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-1.5 text-[10px] font-bold flex flex-col items-center gap-0.5 relative transition-all cursor-pointer ${
              activeTab === 'insights' ? 'text-[#2D6A4F] font-black' : 'text-[#5E7E71]'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-1.5 text-[10px] font-bold flex flex-col items-center gap-0.5 relative transition-all cursor-pointer ${
              activeTab === 'leaderboard' ? 'text-[#2D6A4F] font-black' : 'text-[#5E7E71]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Streaks</span>
          </button>
        </nav>
      </div>

      {/* 3. Primary Content Stage Frame */}
      <div className="flex-1 flex flex-col justify-between min-w-0 min-h-screen">
        <main className="px-4 sm:px-6 lg:px-8 py-5 md:py-7 flex-1 w-full max-w-5xl mx-auto space-y-6">
          
          {/* Header row with Date and status */}
          <div className="hidden md:flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
            <div>
              <p className="text-xs text-[#5E7E71] font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h2 className="text-lg font-bold text-[#1B4332] tracking-tight capitalize">{activeTab} Monitor</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-[#5E7E71] font-bold uppercase tracking-wider">Today's CO₂ limit buffer</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${todayTotal <= 8 ? 'bg-[#52B788]' : 'bg-rose-500 animate-pulse'}`} />
                  <span className="text-xs font-bold text-[#1B4332]">
                    {todayTotal <= 8 ? 'Secure' : 'Emissions Overdraft'} ({todayTotal.toFixed(1)} / 8.0 kg)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <Dashboard 
                logs={logs}
                todayTotal={todayTotal}
                weeklyTotal={weeklyTotal}
                monthlyTotal={monthlyTotal}
                ecoScore={ecoScore}
                healthLabel={healthStatus.label}
                healthColor={healthStatus.color}
                tipIndex={tipIndex}
                onNextTip={handleNextTip}
              />
            )}

            {activeTab === 'log' && (
              <LogActivity
                onAddLog={handleAddLog}
                onDeleteLog={handleDeleteLog}
                recentLogs={logs}
              />
            )}

            {activeTab === 'insights' && (
              <Insights
                logs={logs}
                challenges={challenges}
                onToggleChallenge={handleToggleChallenge}
                weeklyTotal={weeklyTotal}
              />
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard
                logs={logs}
                weeklyTotal={weeklyTotal}
                ecoScore={ecoScore}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Beautiful footer aligned to bottom */}
        <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-[11px] text-[#5E7E71] w-full shrink-0">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-semibold text-slate-400">
              © 2026 EcoCarbon Tracker • Built with Professional Polish guidelines.
            </p>
            <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>🌿 Ideal Daily limit: 8.0 kg</span>
              <span>•</span>
              <span>🌎 Global Avg: 12.5 kg</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 4. Beautiful Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-100 space-y-4"
            >
              <h3 id="reset-modal-title" className="text-base font-bold text-[#1B4332] flex items-center gap-2">
                <Leaf className="w-5 h-5 text-rose-500 shrink-0" /> Reset Tracker Data?
              </h3>
              <p className="text-xs text-[#5E7E71] leading-relaxed font-semibold">
                This will revert all customized entries back to the defaults. This operation is permanent and cannot be undone.
              </p>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#5E7E71] hover:bg-[#F8FAFB] outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmResetData}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm outline-none cursor-pointer"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
