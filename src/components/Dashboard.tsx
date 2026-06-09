/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Calendar,
  Zap,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { ActivityLog } from '../types';
import { CATEGORY_INFO, CO2_GOALS, getRelativeDateString, formatDayLabel, ECO_TIPS } from '../data';

interface DashboardProps {
  logs: ActivityLog[];
  todayTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  ecoScore: number;
  healthLabel: 'Excellent' | 'Good' | 'Fair' | 'Critical';
  healthColor: { text: string; bg: string; border: string; desc: string };
  tipIndex: number;
  onNextTip: () => void;
}

export default function Dashboard({
  logs,
  todayTotal,
  weeklyTotal,
  monthlyTotal,
  ecoScore,
  healthLabel,
  healthColor,
  tipIndex,
  onNextTip,
}: DashboardProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Calculate 7-day bar chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const dateStr = getRelativeDateString(daysAgo);
    const dayName = formatDayLabel(dateStr);
    
    const dayLogs = logs.filter(l => l.date === dateStr);
    const dayTotal = dayLogs.reduce((acc, l) => acc + l.co2, 0);
    
    return {
      date: dateStr,
      label: dayName,
      total: Number(dayTotal.toFixed(1)),
      count: dayLogs.length
    };
  });

  const maxEmissions = Math.max(...chartData.map(d => d.total), 10);

  // SVG Circular progress configurations
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~439.82
  const strokeDashoffset = circumference - (ecoScore / 100) * circumference;

  // Determine today's comparison vs daily limit (8kg target)
  const isBelowTarget = todayTotal <= CO2_GOALS.dailyTarget;
  const percentOfTarget = Math.round((todayTotal / CO2_GOALS.dailyTarget) * 100);

  // Helper for color categories
  const getCo2ColorClass = (val: number) => {
    if (val < 5) return 'text-emerald-600 bg-emerald-50';
    if (val <= 15) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Hero Welcome Banner */}
      <div id="dashboard-hero" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] text-white p-6 md:p-7 shadow-md shadow-[#2D6A4F]/10">
        <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none w-1/3 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#74C69D]">
            <path fill="currentColor" d="M50 15 C30 15 15 35 15 55 C15 75 35 85 50 85 C65 85 85 75 85 55 C85 35 70 15 50 15 Z M50 25 C55 35 65 40 75 45 C65 55 55 60 50 75 C45 60 35 55 25 45 C35 40 45 35 50 25 Z" />
          </svg>
        </div>
        
        <div className="max-w-xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#74C69D]/20 text-[#74C69D] text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs border border-[#74C69D]/30">
            <Sparkles className="w-3.5 h-3.5" id="hero-sparkles-icon" /> Eco-Aware Platform
          </div>
          <h2 id="hero-heading" className="text-xl md:text-2xl font-black font-sans tracking-tight leading-tight">
            Nurture Your Green Footprint
          </h2>
          <p id="hero-description" className="text-neutral-100/90 text-xs md:text-sm leading-relaxed font-medium">
            Every daily choice shapes our future. Log your daily transit, food choice, and energy grids to evaluate your immediate ecological savings and hit your Paris Pact carbon target of <strong className="text-[#74C69D] font-extrabold">8.0 kg CO₂ / day</strong>.
          </p>
        </div>
      </div>

      {/* Circle Ring & Summary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planet Health Ring Card */}
        <div id="planet-health-card" className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="font-sans font-bold text-[#1B4332] text-sm">Planet Health</h3>
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${healthColor.bg} ${healthColor.text} ${healthColor.border}`}>
              {healthLabel}
            </span>
          </div>
          
          <p className="text-xs text-[#5E7E71] mb-5 max-w-[240px] leading-relaxed font-medium">
            {healthColor.desc}
          </p>

          {/* SVG Circular Dial */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-neutral-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress ring colored according to score */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                className={
                  ecoScore >= 80 ? "stroke-[#2D6A4F]" :
                  ecoScore >= 55 ? "stroke-[#52B788]" :
                  ecoScore >= 30 ? "stroke-amber-500" : "stroke-rose-500"
                }
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span id="eco-score-label" className="text-[#5E7E71] text-[10px] uppercase font-bold tracking-wider">Eco-Score</span>
              <span id="eco-score-value" className="text-3xl md:text-4xl font-black text-[#1B4332] tracking-tight my-0.5">
                {ecoScore}
              </span>
              <span className="text-[10px] text-[#5E7E71] font-bold">out of 100</span>
            </div>
          </div>

          <div className="mt-5 w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl p-3 flex items-center justify-between text-xs text-[#1B4332]">
            <span className="flex items-center gap-1.5 font-bold">
              <Leaf className="w-4 h-4 text-[#2D6A4F]" /> Today's CO₂ Impact
            </span>
            <span className="font-extrabold text-[#1B4332]">{todayTotal.toFixed(1)} kg</span>
          </div>
        </div>

        {/* 4 Metric Cards Matrix */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Today's Footprint */}
          <div id="stat-card-today" className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all hover:border-[#2D6A4F] hover:shadow-xs group">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2D6A4F] flex items-center justify-center border border-emerald-100">
                <Leaf className="w-4 h-4" />
              </div>
              <p className="text-[#5E7E71] text-[10px] font-extrabold uppercase tracking-wider">Today's Total</p>
            </div>
            <div className="mt-4">
              <h4 className="text-2xl font-black text-[#1B4332] tracking-tight leading-none">{todayTotal.toFixed(1)} <span className="text-xs font-semibold text-[#5E7E71]">kg</span></h4>
              <p className="text-[10px] text-[#5E7E71] mt-1.5 font-semibold">Goal: &lt;8.0 kg CO₂</p>
            </div>
          </div>

          {/* Weekly Total */}
          <div id="stat-card-week" className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all hover:border-[#52B788] hover:shadow-xs group">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="text-[#5E7E71] text-[10px] font-extrabold uppercase tracking-wider">Weekly Log</p>
            </div>
            <div className="mt-4">
              <h4 className="text-2xl font-black text-[#1B4332] tracking-tight leading-none">{weeklyTotal.toFixed(1)} <span className="text-xs font-semibold text-[#5E7E71]">kg</span></h4>
              <p className="text-[10px] text-[#5E7E71] mt-1.5 font-semibold">Target: &lt;56.0 kg</p>
            </div>
          </div>

          {/* Monthly Estimated Total */}
          <div id="stat-card-month" className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all hover:border-amber-500 hover:shadow-xs group">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-[#5E7E71] text-[10px] font-extrabold uppercase tracking-wider">Monthly Est.</p>
            </div>
            <div className="mt-4">
              <h4 className="text-2xl font-black text-[#1B4332] tracking-tight leading-none">{monthlyTotal.toFixed(1)} <span className="text-xs font-semibold text-[#5E7E71]">kg</span></h4>
              <p className="text-[10px] text-[#5E7E71] mt-1.5 font-semibold">Projected cycle</p>
            </div>
          </div>

          {/* vs Global Average */}
          <div id="stat-card-global" className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all hover:border-cyan-500 hover:shadow-xs group">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-[#5E7E71] text-[10px] font-extrabold uppercase tracking-wider">vs Global Avg</p>
            </div>
            <div className="mt-4">
              {todayTotal <= CO2_GOALS.globalAverageDaily ? (
                <div>
                  <h4 className="text-2xl font-black text-[#2D6A4F] tracking-tight leading-none flex items-center gap-1">
                    -{Math.round((1 - (todayTotal / CO2_GOALS.globalAverageDaily)) * 100)}%
                    <TrendingDown className="w-4 h-4" />
                  </h4>
                  <p className="text-[10px] text-[#5E7E71] mt-1.5 font-semibold">Below standard</p>
                </div>
              ) : (
                <div>
                  <h4 className="text-2xl font-black text-rose-600 tracking-tight leading-none flex items-center gap-1">
                    +{Math.round(((todayTotal / CO2_GOALS.globalAverageDaily) - 1) * 100)}%
                    <ArrowUpRight className="w-4 h-4" />
                  </h4>
                  <p className="text-[10px] text-rose-600 mt-1.5 font-semibold">Over standard</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mini Bar Chart Description & Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 7 Day Mini Bar Chart */}
        <div id="bar-chart-card" className="md:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-sans font-bold text-[#1B4332] text-base">Carbon Footprint Trend</h3>
              <p className="text-xs text-[#5E7E71] mt-0.5">Calculated daily emissions (last 7 days)</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] inline-block"></span> Safe (&lt;5kg)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Moderate</span>
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="h-44 flex items-end gap-3 md:gap-4 relative pt-6 px-1 border-b border-[#E2E8F0] pb-2">
            
            {/* Guide Lines */}
            <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-neutral-100 text-[9px] text-[#5E7E71]/60 font-semibold pointer-events-none flex justify-between pr-2">
              <span>{(maxEmissions * 0.75).toFixed(0)} kg</span>
            </div>
            <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-neutral-100 text-[9px] text-[#5E7E71]/60 font-semibold pointer-events-none flex justify-between pr-2">
              <span>{(maxEmissions * 0.5).toFixed(0)} kg</span>
            </div>
            <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-neutral-100 text-[9px] text-[#5E7E71]/60 font-semibold pointer-events-none flex justify-between pr-2">
              <span>{(maxEmissions * 0.25).toFixed(0)} kg</span>
            </div>

            {/* Custom Interactive Bars */}
            {chartData.map((d, index) => {
              const rectHeightPercent = (d.total / maxEmissions) * 100;
              // Determine color class
              let barColor = 'bg-[#2D6A4F] hover:bg-[#1B4332]';
              if (d.total > 15) {
                barColor = 'bg-rose-500 hover:bg-rose-600';
              } else if (d.total > 5) {
                barColor = 'bg-amber-400 hover:bg-amber-500';
              }

              return (
                <div 
                  key={d.date} 
                  className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip Popup */}
                  <AnimatePresence>
                    {hoveredBar === index && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-2 z-20 bg-slate-800 text-white rounded-lg p-2.5 shadow-md text-xs w-28 text-center pointer-events-none"
                      >
                        <p className="font-bold text-[#74C69D]">{d.total} kg CO₂</p>
                        <p className="text-[10px] text-slate-300">{d.count} log entries</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Visual Bar Column */}
                  <div className="w-full bg-[#F8FAFB] hover:bg-[#F2F5F7] rounded-lg flex items-end h-28 relative transition-all duration-200 border border-neutral-100">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(rectHeightPercent, 5)}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={`w-full rounded-b-md rounded-t-lg ${barColor} transition-all duration-300`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className="text-[10px] font-bold text-[#5E7E71] mt-2 truncate max-w-full">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip of the Day Block */}
        <div id="tip-of-day-card" className="md:col-span-4 bg-emerald-50/40 border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="p-1 px-2.5 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#2D6A4F]/20">
                <Lightbulb className="w-3.5 h-3.5" /> Reduction Idea
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-sans font-bold text-[#1B4332] text-sm">Actionable Impact</h4>
              <p className="text-[#5E7E71] text-xs leading-relaxed italic font-medium">
                "{ECO_TIPS[tipIndex]}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[10px] text-[#5E7E71] font-bold uppercase">Strategy {tipIndex + 1} of {ECO_TIPS.length}</span>
            <button 
              onClick={onNextTip}
              className="text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] flex items-center gap-1 transition-all hover:translate-x-0.5 outline-none cursor-pointer"
            >
              Next Strategy →
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
