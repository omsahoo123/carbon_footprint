/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle, 
  Plus, 
  Sparkles,
  Info,
  Car,
  Utensils,
  Cpu,
  Plane,
  ShoppingBag,
  Zap,
  Target
} from 'lucide-react';
import { ActivityLog, Challenge, ActivityCategory } from '../types';
import { CATEGORY_INFO, CO2_GOALS } from '../data';

interface InsightsProps {
  logs: ActivityLog[];
  challenges: Challenge[];
  onToggleChallenge: (id: string, field: 'accepted' | 'completed') => void;
  weeklyTotal: number;
}

export default function Insights({ logs, challenges, onToggleChallenge, weeklyTotal }: InsightsProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Group emissions by category
  const categoryTotals = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + log.co2;
    return acc;
  }, {} as Record<ActivityCategory, number>);

  const totalEmissions = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1; // avoid divide by zero

  // Order categories by emissions values
  const sortedCategories = Object.keys(CATEGORY_INFO).map(catKey => {
    const key = catKey as ActivityCategory;
    const value = categoryTotals[key] || 0;
    const percentage = Math.round((value / totalEmissions) * 100);
    return {
      id: key,
      label: CATEGORY_INFO[key].name,
      icon: CATEGORY_INFO[key].icon,
      color: CATEGORY_INFO[key].text,
      bg: CATEGORY_INFO[key].bg,
      lightBg: CATEGORY_INFO[key].lightBg,
      value: Number(value.toFixed(1)),
      percentage
    };
  }).sort((a, b) => b.value - a.value);

  const highestContributor = sortedCategories[0];

  // Dynamic feedback generator
  const getDynamicFeedback = () => {
    if (totalEmissions <= 1) {
      return {
        title: "Emissions are highly minimal",
        description: "You haven't logged enough footprint yet to detect a primary contributor. Add your lifestyle activities inside the 'Log Activity' tab to unlock tailored insights!",
        action: "Create logs for food meals or transport."
      };
    }

    if (highestContributor.id === 'transport') {
      return {
        title: "Transport is your major CO₂ contributor",
        description: `Your transport activities contribute ${highestContributor.percentage}% to your emissions. Driving standard combustion engines burns fossil fuels quickly. Swapping car drives for buses, trains, or walking can reduce your total by up to 10kg CO₂ per week!`,
        action: "Try carpooling, active biking, or scheduling work-from-home days."
      };
    } else if (highestContributor.id === 'food') {
      return {
        title: "Dietary footprint is leading your impact",
        description: `Your eating choices make up ${highestContributor.percentage}% of your carbon footprints. Beef and lamb have an incredibly high carbon intensity because of major water, land, and methane outputs. Transitioning some of those meals to chicken or vegetarian options yields massive immediate drop-offs.`,
        action: "Incorporate 'Meatless Mondays' and double down on vegan grain bowl meals."
      };
    } else if (highestContributor.id === 'energy') {
      return {
        title: "Home utilities are drawing heavy load",
        description: `Natural gas heaters and electricity grids account for ${highestContributor.percentage}% of your totals. Idle power drawers and hot water heaters burn substantial energy silently behind the scenes.`,
        action: "Consider lowering water boilers by 5°C and turning off home standby grids."
      };
    } else if (highestContributor.id === 'travel') {
      return {
        title: "Air travels are driving a massive peak",
        description: `Jet kerosene accounts for ${highestContributor.percentage}% of your footprints. Flying releases combustion emissions directly into the high atmosphere, causing an accelerated warming coefficient.`,
        action: "Where possible, substitute short domestic flights with high-speed passenger trains."
      };
    } else {
      return {
        title: "Shopping items are composing your primary source",
        description: `Goods manufactured and shipped account for ${highestContributor.percentage}% of your emissions. Complex electronics and fast fashion require massive industrial energy and supply chain loops.`,
        action: "Repair or buy high-quality pre-owned items rather than new commercial goods."
      };
    }
  };

  const feedback = getDynamicFeedback();

  // Draw Circular Donut Slices Math
  let cumPercent = 0;
  const donuts = sortedCategories.map(cat => {
    const startAngle = (cumPercent / 100) * 360;
    const sizeAngle = (cat.percentage / 100) * 360;
    cumPercent += cat.percentage;
    return {
      ...cat,
      startAngle,
      sizeAngle
    };
  });

  // Calculate coordinates for SVG sector paths
  const getSectorPath = (cx: number, cy: number, rOut: number, rIn: number, startDeg: number, endDeg: number) => {
    const d2r = Math.PI / 180;
    // Cap slice to just under 360 to prevent overlap issues
    let sweep = endDeg - startDeg;
    if (sweep >= 360) sweep = 359.9;
    
    const startRad = (startDeg - 90) * d2r;
    const endRad = ((startDeg + sweep) - 90) * d2r;

    const x1o = cx + rOut * Math.cos(startRad);
    const y1o = cy + rOut * Math.sin(startRad);
    const x2o = cx + rOut * Math.cos(endRad);
    const y2o = cy + rOut * Math.sin(endRad);

    const x1i = cx + rIn * Math.cos(endRad);
    const y1i = cy + rIn * Math.sin(endRad);
    const x2i = cx + rIn * Math.cos(startRad);
    const y2i = cy + rIn * Math.sin(startRad);

    const largeArc = sweep > 180 ? 1 : 0;

    return `
      M ${x1o} ${y1o}
      A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2o} ${y2o}
      L ${x1i} ${y1i}
      A ${rIn} ${rIn} 0 ${largeArc} 0 ${x2i} ${y2i}
      Z
    `;
  };

  // Determine progress bar of weekly goal (56kg target)
  const budgetRatio = Math.min(100, (weeklyTotal / CO2_GOALS.weeklyTarget) * 100);
  const budgetPercentage = Math.round(budgetRatio);
  const isBudgetExceeded = weeklyTotal > CO2_GOALS.weeklyTarget;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 1. Category Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* SVG Donut Chart Section */}
        <div id="category-donut-card" className="md:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col items-center justify-center">
          <div className="w-full text-left mb-6">
            <h3 className="font-sans font-bold text-[#1B4332] text-base">Carbon Footprint Split</h3>
            <p className="text-xs text-[#5E7E71] mt-0.5">Distribution across lifestyle sectors</p>
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center mb-6">
            {totalEmissions > 1 ? (
              <svg className="w-full h-full">
                {donuts.map((d, index) => {
                  if (d.percentage === 0) return null;
                  return (
                    <path
                      key={d.id}
                      d={getSectorPath(88, 88, 80, 54, d.startAngle, d.startAngle + d.sizeAngle)}
                      className={`${d.bg} stroke-white hover:opacity-90 cursor-pointer transition-opacity`}
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredCategory(d.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>
            ) : (
              // Empty/Neutral Center Ring Case
              <svg className="w-full h-full">
                <circle cx="88" cy="88" r="67" className="stroke-[#E2E8F0] fill-transparent" strokeWidth="26" />
              </svg>
            )}

            {/* Core Label Display inside Donut hole */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[9px] text-[#5E7E71] uppercase font-bold tracking-wider">Total</span>
              <span className="text-xl font-black text-[#1B4332] tracking-tight my-0.5">
                {weeklyTotal.toFixed(1)}
              </span>
              <span className="text-[9px] text-[#5E7E71] font-bold">kg CO₂/wk</span>
            </div>
          </div>

          {/* Quick Hover Detail Indicator */}
          <div className="min-h-5 text-center">
            {hoveredCategory ? (
              <span className="text-xs font-bold text-[#1B4332] capitalize flex items-center gap-1.5 justify-center">
                <span className="text-xs">{CATEGORY_INFO[hoveredCategory as ActivityCategory].icon}</span>
                {CATEGORY_INFO[hoveredCategory as ActivityCategory].name}: {categoryTotals[hoveredCategory as ActivityCategory]?.toFixed(1) || 0} kg
              </span>
            ) : (
              <span className="text-xs text-[#5E7E71] font-medium">Hover sectors for details</span>
            )}
          </div>
        </div>

        {/* Detailed Percentage list bars */}
        <div id="category-bars-card" className="md:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-[#1B4332] text-base mb-4">Emissions Breakdown</h3>
            <div className="space-y-4">
              {sortedCategories.map(cat => (
                <div key={cat.id} className="space-y-11">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1B4332] flex items-center gap-1.5">
                      <span className="text-xs">{cat.icon}</span> {cat.label}
                    </span>
                    <span className="font-extrabold text-[#1B4332]">
                      {cat.value} kg <span className="font-semibold text-[#5E7E71]">({cat.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${cat.bg}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 text-xs text-[#5E7E71] flex items-start gap-1.5 p-3.5 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFB]">
            <Info className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
            <span className="font-semibold">
              Values display direct emissions logging. For maximum ecological sustainability, keep your diet footprints below <strong>10 kg/wk</strong> and active transport above <strong>80%</strong> of commuter metrics.
            </span>
          </div>
        </div>

      </div>

      {/* 2. Personalized Smart Reduction Tips & Weekly Goal Progress */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Dynamic AI Tip block based on contributors */}
        <div id="dynamic-tips-card" className="md:col-span-6 bg-emerald-50/40 border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="p-1 px-2.5 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#2D6A4F]/25 shrink-0">
                🌱 Smart Insight
              </span>
              <p className="text-[11px] font-extrabold text-[#2D6A4F] uppercase tracking-wider">Personalized reduction path</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-sans font-bold text-[#1B4332] text-md">{feedback.title}</h4>
              <p className="text-[#5E7E71] text-xs leading-relaxed font-semibold">
                {feedback.description}
              </p>
            </div>
          </div>

          <div id="smart-action-item" className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-col gap-2">
            <span className="text-[10px] text-[#5E7E71] font-bold uppercase tracking-wider block">Recommended Next Action</span>
            <span className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" /> {feedback.action}
            </span>
          </div>
        </div>

        {/* Weekly Goal Progress budget details */}
        <div id="budget-progress-card" className="md:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-[#1B4332] text-base">Weekly Budget Meter</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${isBudgetExceeded ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/20'}`}>
                {isBudgetExceeded ? 'Budget Overdraw' : 'Budget Secure'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs">
                <span className="text-[#5E7E71] font-bold">Total used this week</span>
                <span className="font-black text-[#1B4332]">
                  {weeklyTotal.toFixed(1)} / {CO2_GOALS.weeklyTarget} kg
                </span>
              </div>
              
              {/* Giant clean target progress meter bar */}
              <div className="h-5 w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-full p-0.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetRatio}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full transition-all ${
                    isBudgetExceeded ? 'bg-gradient-to-r from-rose-500 to-red-600' :
                    budgetRatio > 75 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                    'bg-gradient-to-r from-[#2D6A4F] to-[#52B788]'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[9px] font-extrabold text-[#5E7E71] uppercase tracking-wider select-none">
                <span>0 kg (Ideal)</span>
                <span>{budgetPercentage}% consumed</span>
                <span>{CO2_GOALS.weeklyTarget} kg (Target Limit)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2D6A4F] flex items-center justify-center shrink-0 border border-emerald-100">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#5E7E71] leading-relaxed font-semibold">
              {isBudgetExceeded 
                ? "You have overdrawn your 56.0 kg weekly carbon limit. Try completing more eco-challenges to virtually compensate."
                : `You have ${Math.max(0, Number((CO2_GOALS.weeklyTarget - weeklyTotal).toFixed(1)))} kg of carbon budget remaining. Excellent sustainability hygiene!`
              }
            </p>
          </div>
        </div>

      </div>

      {/* 3. Actionable Challenges list */}
      <div id="challenges-card" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-sans font-bold text-[#1B4332] text-base">Carbon Reduction Challenges</h3>
            <p className="text-xs text-[#5E7E71] mt-0.5">Accept and complete daily active eco-tasks</p>
          </div>
          <div className="flex items-center gap-1.5 text-[#2D6A4F] text-[10px] font-bold uppercase tracking-wider bg-[#2D6A4F]/10 px-2.5 py-1 rounded-full border border-[#2D6A4F]/20">
            <Award className="w-4 h-4" /> {challenges.filter(c => c.completed).length} Achieved
          </div>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map(ch => (
            <div 
              key={ch.id} 
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                ch.completed 
                ? 'bg-[#F8FAFB] border-[#E2E8F0] opacity-75' 
                : ch.accepted 
                ? 'bg-amber-50/20 border-amber-200 ring-2 ring-amber-500/5' 
                : 'bg-white border-[#E2E8F0] hover:border-[#2D6A4F] hover:shadow-3xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                    CATEGORY_INFO[ch.category].bg
                  } text-white`}>
                    {ch.category}
                  </span>
                  <span className="text-[10px] font-bold text-[#2D6A4F] bg-emerald-50 border border-emerald-100 rounded-sm px-2 py-0.5">
                    -{ch.saving} kg CO₂
                  </span>
                </div>

                <h4 className={`text-sm font-bold text-[#1B4332] ${ch.completed ? 'line-through text-[#5E7E71]/80' : ''}`}>
                  {ch.title}
                </h4>
                
                <p className="text-xs text-[#5E7E71] leading-relaxed font-semibold">
                  {ch.description}
                </p>
              </div>

              {/* Challenge Button Controls */}
              <div className="mt-5 pt-3 border-t border-dashed border-[#E2E8F0] flex items-center justify-between">
                
                {!ch.accepted && !ch.completed ? (
                  <button
                    onClick={() => onToggleChallenge(ch.id, 'accepted')}
                    className="w-full py-1.5 bg-[#F8FAFB] hover:bg-[#E2E8F0] border border-[#E2E8F0] text-[#1B4332] rounded-lg text-xs font-bold outline-none transition-all cursor-pointer"
                  >
                    Accept Challenge
                  </button>
                ) : ch.accepted && !ch.completed ? (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => onToggleChallenge(ch.id, 'completed')}
                      className="flex-1 py-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-lg text-xs font-bold outline-none flex items-center justify-center gap-1 hover:shadow-xs cursor-pointer transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                    <button
                      onClick={() => onToggleChallenge(ch.id, 'accepted')}
                      className="p-1 px-2 border border-[#E2E8F0] text-[#5E7E71] hover:text-red-500 rounded-lg text-xs outline-none cursor-pointer hover:bg-red-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="w-full py-1.5 bg-[#F8FAFB] border border-[#E2E8F0] text-[#2D6A4F] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Challenge Succeeded
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
