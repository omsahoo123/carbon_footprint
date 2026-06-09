/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Flame, 
  Zap,
  Check,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { ActivityLog, LeaderboardEntry } from '../types';
import { getRelativeDateString, formatDayLabel, getInitialLeaderboard, CO2_GOALS } from '../data';

interface LeaderboardProps {
  logs: ActivityLog[];
  weeklyTotal: number;
  ecoScore: number;
}

export default function Leaderboard({ logs, weeklyTotal, ecoScore }: LeaderboardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // 1. Calculate 7-day logs calendar streak logic
  const daysStreak = Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const dateStr = getRelativeDateString(daysAgo);
    const dayLabel = formatDayLabel(dateStr);
    
    // Check if there is at least 1 log on that date
    const isLogged = logs.some(log => log.date === dateStr);
    
    return {
      date: dateStr,
      label: dayLabel,
      logged: isLogged,
      isToday: daysAgo === 0
    };
  });

  // Calculate consecutive streak count
  const calculateCurrentStreak = () => {
    let streak = 0;
    // Iterate from today backwards
    for (let i = 0; i < 7; i++) {
      const daysAgo = i;
      const dateStr = getRelativeDateString(daysAgo);
      const isLogged = logs.some(log => log.date === dateStr);
      if (isLogged) {
        streak++;
      } else if (daysAgo === 0) {
        // If today isn't logged yet, let the streak continue if yesterday was logged
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const streakCount = calculateCurrentStreak();

  // 2. Dynamic leaderboards with reactive user scores
  const mockCompetitors = getInitialLeaderboard().filter(entry => !entry.isCurrentUser);
  const userEntry: LeaderboardEntry = {
    rank: 0, // calculated below post-sort
    name: 'You (Current User)',
    co2: Number(weeklyTotal.toFixed(1)),
    isCurrentUser: true,
    avatar: '🌱'
  };

  // Combine and sort (ascending = lower CO2 is a better eco score rank!)
  const combinedLeaderboard = [...mockCompetitors, userEntry]
    .sort((a, b) => a.co2 - b.co2)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1 // Assign new ranks after sorting
    }));

  const userRankObj = combinedLeaderboard.find(e => e.isCurrentUser);
  const userRank = userRankObj ? userRankObj.rank : 3;

  // 3. Score description copy sharing
  const handleShare = () => {
    const textToCopy = `🌍 My Carbon Footprint Eco-Score today is ${ecoScore}/100!\n📉 Weekly total: ${weeklyTotal.toFixed(1)} kg CO₂ (${weeklyTotal <= CO2_GOALS.weeklyTarget ? 'Below Target!' : 'Needs reduction'})\n🔥 Streak: ${streakCount}-day streak tracking my lifestyle carbon impact.\n\nMonitor, log, and reduce your daily emission totals with the Carbon Footprint Tracker! 🌱`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error('Could not copy scorecard', err);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Calendar 7 Days Streak Block */}
      <div id="streak-card" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="p-1 px-2.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-orange-100">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> STREAK TRACKER
              </span>
            </div>
            <h3 className="font-sans font-bold text-[#1B4332] text-lg mt-1">7-Day Log Continuity</h3>
            <p className="text-xs text-[#5E7E71] font-semibold">Keep logging your habits daily to cement carbon reduction awareness</p>
          </div>

          {/* Large Streak Counter Display */}
          <div className="flex items-center gap-3 bg-orange-50/30 border border-orange-100/50 p-3 py-4 px-5 rounded-2xl shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center animate-pulse">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#1B4332] tracking-tight leading-none">
                {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
              </span>
              <p className="text-[10px] text-[#5E7E71] mt-0.5 uppercase font-bold tracking-wider">Active streak count</p>
            </div>
          </div>
        </div>

        {/* Dots Horizontal Timeline */}
        <div id="streak-dots-row" className="grid grid-cols-7 gap-2 md:gap-4 mt-8 pb-2">
          {daysStreak.map((day) => (
            <div 
              key={day.date} 
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between min-h-[90px] relative transition-all ${
                day.logged 
                ? 'bg-emerald-50/30 border-[#52B788]/20' 
                : 'bg-[#F8FAFB] border-[#E2E8F0]'
              } ${day.isToday ? 'ring-2 ring-[#2D6A4F]/10' : ''}`}
            >
              <span className="text-[9px] md:text-[10px] font-extrabold text-[#5E7E71] uppercase tracking-wider">
                {day.label}
              </span>

              {/* Graphical Status Circle indicator */}
              <div className="my-2.5">
                {day.logged ? (
                  <motion.div 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }} 
                    className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-3xs"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </motion.div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-[#E2E8F0] bg-white flex items-center justify-center shadow-3xs animate-none" />
                )}
              </div>

              <span className="text-[9px] font-bold tracking-tight uppercase">
                {day.isToday ? (
                  <span className="text-[#2D6A4F] bg-emerald-50 px-1.5 py-0.5 rounded-sm font-black border border-[#2D6A4F]/20">Today</span>
                ) : day.logged ? (
                  <span className="text-[#2D6A4F] font-bold">Logged</span>
                ) : (
                  <span className="text-[#5E7E71]/40">Missed</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Competitors & Score Share row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Dynamic Leaderboard Rankings */}
        <div id="leaderboard-table-card" className="md:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-sans font-bold text-[#1B4332] text-base">Carbon Savers Leaderboard</h3>
              <p className="text-xs text-[#5E7E71] mt-0.5 font-semibold">Community scores based on weekly emissions (Lower is better!)</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
              <Trophy className="w-4 h-4 fill-amber-400" />
            </div>
          </div>

          {/* List of ranks rows */}
          <div className="space-y-2.5">
            {combinedLeaderboard.map((entry) => {
              const medalClasses = [
                'text-amber-600 bg-amber-50 border-amber-200', // Gold
                'text-slate-500 bg-slate-50 border-slate-200', // Silver
                'text-amber-800 bg-amber-100/40 border-amber-200/40' // Bronze
              ];
              const isMedalist = entry.rank <= 3;

              return (
                <div 
                  key={entry.name}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    entry.isCurrentUser 
                    ? 'bg-emerald-50/15 hover:bg-emerald-50/20 border-[#2D6A4F]/50 ring-2 ring-[#2D6A4F]/5' 
                    : 'bg-white border-[#E2E8F0] hover:border-[#1B4332]/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank tag */}
                    <span className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 ${
                      isMedalist ? medalClasses[entry.rank - 1] : 'text-[#5E7E71] bg-[#F8FAFB] border-[#E2E8F0]'
                    }`}>
                      {entry.rank}
                    </span>

                    {/* Avatar Initials / Emoji */}
                    <span className="text-base shrink-0 p-1 px-1.5 bg-[#F8FAFB] border border-[#E2E8F0] rounded-lg shadow-3xs">{entry.avatar}</span>
                    
                    <span className={`text-xs truncate ${entry.isCurrentUser ? 'font-black text-[#2D6A4F]' : 'text-[#1B4332] font-semibold'}`}>
                      {entry.name} {entry.isCurrentUser && ' (You)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-lg ${
                      entry.isCurrentUser 
                      ? 'text-[#2D6A4F] bg-emerald-50 border border-emerald-100' 
                      : 'text-[#1B4332] bg-[#F8FAFB] border border-[#E2E8F0]'
                    }`}>
                      {entry.co2.toFixed(1)} <span className="font-semibold text-[#5E7E71] text-[10px]">kg CO₂</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share Score Card panel */}
        <div id="share-card" className="md:col-span-4 bg-emerald-50/30 border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
          
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center shrink-0 border border-[#2D6A4F]/20">
              <Share2 className="w-5 h-5" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-[#1B4332] text-base">Spread Accountability</h3>
              <p className="text-[#5E7E71] text-xs leading-relaxed font-semibold">
                Visualizing scores inspires others. Click below to copy a beautiful green text summary card containing your daily <strong>Eco-Score ({ecoScore}/100)</strong> and streak stats to copy across socials!
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleShare}
              className="w-full py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-[#2D6A4F]/10 active:scale-98 transition-all outline-none cursor-pointer"
            >
              <Share2 className="w-4 h-4" /> Share My Eco Score
            </button>

            {/* Clipboard success confirmation toast */}
            <AnimatePresence>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[11px] text-[#2D6A4F] font-bold text-center flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" /> Copied scorecard text to clipboard!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
