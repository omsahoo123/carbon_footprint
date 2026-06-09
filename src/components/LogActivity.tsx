/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Car, 
  Utensils, 
  Cpu, 
  Plane, 
  ShoppingBag, 
  Sparkles, 
  Leaf, 
  Info,
  ChevronDown
} from 'lucide-react';
import { ActivityCategory, ActivityLog } from '../types';
import { EMISSION_FACTORS, CATEGORY_INFO } from '../data';

interface LogActivityProps {
  onAddLog: (log: Omit<ActivityLog, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  recentLogs: ActivityLog[];
}

export default function LogActivity({ onAddLog, onDeleteLog, recentLogs }: LogActivityProps) {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('transport');
  
  // Input states for each category
  // Transport
  const [transportDistance, setTransportDistance] = useState<string>('15');
  const [vehicleType, setVehicleType] = useState<keyof typeof EMISSION_FACTORS.transport>('car');

  // Food
  const [foodType, setFoodType] = useState<keyof typeof EMISSION_FACTORS.food>('beef');
  const [foodCount, setFoodCount] = useState<number>(1);

  // Home Energy
  const [energyType, setEnergyType] = useState<keyof typeof EMISSION_FACTORS.energy>('electricity');
  const [energyAmount, setEnergyAmount] = useState<string>('10');

  // Travel
  const [travelDistance, setTravelDistance] = useState<string>('200');

  // Shopping
  const [shoppingType, setShoppingType] = useState<keyof typeof EMISSION_FACTORS.shopping>('clothing');
  const [shoppingCount, setShoppingCount] = useState<number>(1);

  // Live CO2 calculations
  const [liveCo2, setLiveCo2] = useState<number>(0);

  // Recalculate live preview
  useEffect(() => {
    let result = 0;
    if (selectedCategory === 'transport') {
      const dist = parseFloat(transportDistance) || 0;
      const factor = EMISSION_FACTORS.transport[vehicleType] || 0;
      result = dist * factor;
    } else if (selectedCategory === 'food') {
      const count = foodCount || 0;
      const factor = EMISSION_FACTORS.food[foodType] || 0;
      result = count * factor;
    } else if (selectedCategory === 'energy') {
      const amt = parseFloat(energyAmount) || 0;
      const factor = EMISSION_FACTORS.energy[energyType] || 0;
      result = amt * factor;
    } else if (selectedCategory === 'travel') {
      const dist = parseFloat(travelDistance) || 0;
      const factor = EMISSION_FACTORS.travel.flight || 0;
      result = dist * factor;
    } else if (selectedCategory === 'shopping') {
      const count = shoppingCount || 0;
      const factor = EMISSION_FACTORS.shopping[shoppingType] || 0;
      result = count * factor;
    }
    setLiveCo2(Number(result.toFixed(2)));
  }, [
    selectedCategory, 
    transportDistance, 
    vehicleType, 
    foodType, 
    foodCount, 
    energyType, 
    energyAmount, 
    travelDistance, 
    shoppingType, 
    shoppingCount
  ]);

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (liveCo2 <= 0) return;

    let typeLabel = '';
    let inputValue = 0;
    let unitLabel = '';

    if (selectedCategory === 'transport') {
      // Map vehicle label
      const labels: Record<string, string> = {
        car: 'Standard Car',
        electric_car: 'Electric Vehicle',
        hybrid_car: 'Hybrid Vehicle',
        bus: 'Bus Transit',
        train: 'Train Journey',
        motorcycle: 'Motorcycle',
      };
      typeLabel = labels[vehicleType];
      inputValue = parseFloat(transportDistance) || 0;
      unitLabel = 'km';
    } else if (selectedCategory === 'food') {
      const labels: Record<string, string> = {
        beef: 'Beef Meal',
        chicken: 'Chicken Meal',
        pork_lamb: 'Pork / Lamb Meal',
        fish: 'Fish Meal',
        vegetarian: 'Vegetarian Dish',
        vegan: 'Vegan Dish',
      };
      typeLabel = labels[foodType];
      inputValue = foodCount;
      unitLabel = foodCount === 1 ? 'meal' : 'meals';
    } else if (selectedCategory === 'energy') {
      const labels: Record<string, string> = {
        electricity: 'Electricity Use',
        gas: 'Gas Heating',
        fuel_oil: 'Fuel Oil heating',
      };
      const units: Record<string, string> = {
        electricity: 'kWh',
        gas: 'm³',
        fuel_oil: 'L',
      };
      typeLabel = labels[energyType];
      inputValue = parseFloat(energyAmount) || 0;
      unitLabel = units[energyType];
    } else if (selectedCategory === 'travel') {
      typeLabel = 'Flight';
      inputValue = parseFloat(travelDistance) || 0;
      unitLabel = 'km';
    } else if (selectedCategory === 'shopping') {
      const labels: Record<string, string> = {
        clothing: 'Clothing Item',
        electronics: 'New Electronic',
        furniture: 'Furniture Piece',
        general: 'General Shopping Item',
      };
      typeLabel = labels[shoppingType];
      inputValue = shoppingCount;
      unitLabel = shoppingCount === 1 ? 'item' : 'items';
    }

    // Call callback to add in state
    onAddLog({
      date: new Date().toISOString().split('T')[0], // log on current day
      category: selectedCategory,
      typeLabel,
      inputValue,
      unitLabel,
      co2: liveCo2,
    });

    // Reset simple values depending on category
    if (selectedCategory === 'food') setFoodCount(1);
    else if (selectedCategory === 'shopping') setShoppingCount(1);
  };

  // Predefined category configs for UI buttons with brand-aligned palettes
  const categories: { id: ActivityCategory; label: string; icon: React.ReactNode; color: string; border: string; bg: string }[] = [
    { id: 'transport', label: 'Transport', icon: <Car className="w-4 h-4" />, color: 'bg-[#2D6A4F]/10 text-[#2D6A4F]', border: 'border-[#2D6A4F]/30', bg: 'bg-[#2D6A4F]' },
    { id: 'food', label: 'Food Intake', icon: <Utensils className="w-4 h-4" />, color: 'bg-amber-50 text-amber-800', border: 'border-amber-200', bg: 'bg-amber-500' },
    { id: 'energy', label: 'Home Energy', icon: <Cpu className="w-4 h-4" />, color: 'bg-teal-50 text-teal-800', border: 'border-[#52B788]/30', bg: 'bg-[#52B788]' },
    { id: 'travel', label: 'Air Travel', icon: <Plane className="w-4 h-4" />, color: 'bg-cyan-50 text-cyan-800', border: 'border-cyan-200', bg: 'bg-cyan-600' },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-800', border: 'border-indigo-200', bg: 'bg-indigo-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* Category Selection & Multi Form Panel */}
      <div id="log-form-box" className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
        
        <div className="space-y-6">
          <div>
            <h3 className="font-sans font-bold text-[#1B4332] text-lg">Log New Activity</h3>
            <p className="text-xs text-[#5E7E71] mt-0.5">Select a category and log your daily carbon footprints</p>
          </div>

          {/* Category Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categories.map(cat => {
              const matches = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    matches 
                    ? `${cat.color} ${cat.border} ring-2 ring-[#2D6A4F]/10 shadow-3xs font-bold` 
                    : 'bg-white hover:bg-[#F8FAFB] border-[#E2E8F0] text-[#5E7E71]'
                  } outline-none cursor-pointer`}
                >
                  <span className="p-1.5 rounded-full bg-white shadow-3xs mb-1.5 text-xs">
                    {cat.icon}
                  </span>
                  <span className="text-[11px] font-bold tracking-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Category Inputs Form */}
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* 1. TRANSPORT INPUTS */}
                {selectedCategory === 'transport' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Vehicle Type</label>
                        <div className="relative">
                          <select
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value as any)}
                            className="w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-[#1B4332] outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 focus:border-[#2D6A4F] focus:bg-white transition-all appearance-none cursor-pointer"
                          >
                            <option value="car">🚙 Standard Car (Gas/Petrol)</option>
                            <option value="electric_car">🔌 Tesla / Electric Vehicle</option>
                            <option value="hybrid_car">🔋 Hybrid Vehicle</option>
                            <option value="bus">🚌 Public Bus ride</option>
                            <option value="train">🚆 Passenger Train transit</option>
                            <option value="motorcycle">🏍️ Motorcycle</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#5E7E71] pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Distance Driven</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            value={transportDistance}
                            onChange={(e) => setTransportDistance(e.target.value)}
                            placeholder="Enter distance..."
                            required
                            className="w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs md:text-sm text-[#1B4332] outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 focus:border-[#2D6A4F] focus:bg-white transition-all font-bold"
                          />
                          <span className="absolute right-3.5 top-3.5 text-[10px] font-extrabold text-[#5E7E71] uppercase">km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. FOOD INPUTS */}
                {selectedCategory === 'food' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Dish Classification</label>
                        <div className="relative">
                          <select
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value as any)}
                            className="w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-[#1B4332] outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 focus:border-[#2D6A4F] focus:bg-white transition-all appearance-none cursor-pointer"
                          >
                            <option value="beef">🥩 Beef / Lamb Burger / Steak</option>
                            <option value="pork_lamb">🥩 Pork / Mutton cutlets</option>
                            <option value="chicken">🍗 Chicken / Poultry Meal</option>
                            <option value="fish">🐟 Salmon / Seafood platter</option>
                            <option value="vegetarian">🥗 Vegetarian (dairy, cheese, eggs)</option>
                            <option value="vegan">🌿 Vegan (plant-only bowls)</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#5E7E71] pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Number of Dishes</label>
                        <div className="flex items-center border border-[#E2E8F0] rounded-xl bg-[#F8FAFB] overflow-hidden divide-x divide-[#E2E8F0]">
                          <button
                            type="button"
                            onClick={() => setFoodCount(Math.max(1, foodCount - 1))}
                            className="flex-1 py-3 text-center text-[#5E7E71] hover:bg-neutral-100 hover:text-[#1B4332] transition-all font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="flex-[2] py-3 text-center text-sm font-black text-[#1B4332] bg-white">
                            {foodCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFoodCount(foodCount + 1)}
                            className="flex-1 py-3 text-center text-[#5E7E71] hover:bg-neutral-100 hover:text-[#1B4332] transition-all font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HOME ENERGY INPUTS */}
                {selectedCategory === 'energy' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Utility Type</label>
                        <div className="relative">
                          <select
                            value={energyType}
                            onChange={(e) => setEnergyType(e.target.value as any)}
                            className="w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-[#1B4332] outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 focus:border-[#2D6A4F] focus:bg-white transition-all appearance-none cursor-pointer"
                          >
                            <option value="electricity">⚡ Electricity Consumption</option>
                            <option value="gas">🔥 Natural Gas Heating</option>
                            <option value="fuel_oil">🛢️ Fuel / Heating Oil</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#5E7E71] pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Amount consumed</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            value={energyAmount}
                            onChange={(e) => setEnergyAmount(e.target.value)}
                            placeholder="Enter exact unit amount used..."
                            required
                            className="w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs md:text-sm text-[#1B4332] outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 focus:border-[#2D6A4F] focus:bg-white transition-all font-bold"
                          />
                          <span className="absolute right-3.5 top-3.5 text-[10px] font-extrabold text-[#5E7E71] uppercase">
                            {energyType === 'electricity' ? 'kWh' : energyType === 'gas' ? 'm³' : 'Litre'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TRAVEL INPUTS */}
                {selectedCategory === 'travel' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Flight Distance</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          value={travelDistance}
                          onChange={(e) => setTravelDistance(e.target.value)}
                          placeholder="Enter distance flown..."
                          required
                          className="w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs md:text-sm text-[#1B4332] outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 focus:border-[#2D6A4F] focus:bg-white transition-all font-bold"
                        />
                        <span className="absolute right-3.5 top-3.5 text-[10px] font-extrabold text-[#5E7E71] uppercase">km</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/20 p-3.5 text-xs text-blue-800 leading-relaxed flex items-start gap-2.5 font-medium">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>
                        Flight calculations represent airline kerosene averages per passenger, assuming a factor of <strong>0.255 kg CO₂</strong> per km traveled.
                      </span>
                    </div>
                  </div>
                )}

                {/* 5. SHOPPING INPUTS */}
                {selectedCategory === 'shopping' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">Item category</label>
                        <div className="relative">
                          <select
                            value={shoppingType}
                            onChange={(e) => setShoppingType(e.target.value as any)}
                            className="w-full bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-[#1B4332] outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 focus:border-[#2D6A4F] focus:bg-white transition-all appearance-none cursor-pointer"
                          >
                            <option value="clothing">👕 Clothes / Shoes (Cotton, leather averages)</option>
                            <option value="electronics">💻 Consumer Electronics (laptop, tablet, phone)</option>
                            <option value="furniture">🛋️ Home Goods / Furniture piece</option>
                            <option value="general">📦 Miscellaneous / Plastic parcel</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#5E7E71] pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5E7E71] uppercase tracking-wider block">New Item count</label>
                        <div className="flex items-center border border-[#E2E8F0] rounded-xl bg-[#F8FAFB] overflow-hidden divide-x divide-[#E2E8F0]">
                          <button
                            type="button"
                            onClick={() => setShoppingCount(Math.max(1, shoppingCount - 1))}
                            className="flex-1 py-3 text-center text-[#5E7E71] hover:bg-neutral-100 hover:text-[#1B4332] transition-all font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="flex-[2] py-3 text-center text-sm font-black text-[#1B4332] bg-white">
                            {shoppingCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShoppingCount(shoppingCount + 1)}
                            className="flex-1 py-3 text-center text-[#5E7E71] hover:bg-neutral-100 hover:text-[#1B4332] transition-all font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Real-time Calculation Preview */}
            <div id="live-calculation-box" className="p-4 rounded-2xl bg-[#F8FAFB] flex items-center justify-between shadow-3xs border border-[#E2E8F0]">
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#5E7E71] font-bold uppercase tracking-wider">Live CO₂ calculation</span>
                <p className="text-xs text-[#5E7E71] font-medium">Lifecycle emission coefficient impact</p>
              </div>
              <div className="text-right">
                <span id="live-preview-box" className={`inline-flex px-3.5 py-1.5 bg-white font-black text-sm tracking-tight rounded-xl border ${
                  liveCo2 < 5 ? 'text-[#2D6A4F] border-[#2D6A4F]/20' : 
                  liveCo2 <= 15 ? 'text-amber-600 border-amber-200' : 'text-rose-600 border-rose-200'
                }`}>
                  {liveCo2.toFixed(1)} kg CO₂
                </span>
              </div>
            </div>

            {/* Log Submission Button */}
            <button
              type="submit"
              disabled={liveCo2 <= 0}
              className={`w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all ${
                liveCo2 <= 0 
                ? 'bg-[#E2E8F0] cursor-not-allowed text-[#5E7E71]/60' 
                : 'bg-[#2D6A4F] hover:bg-[#1B4332] cursor-pointer shadow-md shadow-[#2D6A4F]/10 active:scale-98'
              }`}
            >
              <Plus className="w-4 h-4" /> Save & Log Action
            </button>
          </form>

        </div>
      </div>

      {/* Logged Activities List Table view */}
      <div id="recent-logs-box" className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-sans font-bold text-[#1B4332] text-lg">Activity History</h3>
              <p className="text-xs text-[#5E7E71] mt-0.5">Your recorded carbon impact log</p>
            </div>
            <span className="text-xs font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2.5 py-1 rounded-full border border-[#2D6A4F]/25 uppercase tracking-wider">
              {recentLogs.length} logged
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {recentLogs.length === 0 ? (
                // Beautiful Empty State Illustration
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-12 px-6"
                >
                  <div className="w-14 h-14 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center mb-4 border border-[#2D6A4F]/15">
                    <Leaf className="w-7 h-7" />
                  </div>
                  <h4 className="font-sans font-bold text-[#1B4332] text-sm">Carbon Log Empty</h4>
                  <p className="text-xs text-[#5E7E71] max-w-[200px] mt-1 leading-relaxed font-semibold">
                    No activities logged for today yet. Use the selector to submit your details.
                  </p>
                </motion.div>
              ) : (
                recentLogs.map((log) => {
                  const cat = CATEGORY_INFO[log.category];
                  return (
                    <motion.div
                      key={log.id}
                      layoutId={`log-card-${log.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex items-center justify-between p-3 bg-[#F8FAFB] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-base p-2 rounded-lg bg-white shadow-3xs shrink-0 border border-neutral-100">{cat?.icon || '🌱'}</span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1B4332] truncate">{log.typeLabel}</h4>
                          <p className="text-[10px] text-[#5E7E71] mt-0.5 font-bold">
                            {log.inputValue} {log.unitLabel} • {log.date === new Date().toISOString().split('T')[0] ? 'Today' : log.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          log.co2 < 5 ? 'text-[#2D6A4F] bg-emerald-50' : 
                          log.co2 <= 15 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50'
                        }`}>
                          {log.co2.toFixed(1)} kg
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => onDeleteLog(log.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#5E7E71] hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all outline-none cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {recentLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-right">
            <span className="text-[10px] text-[#5E7E71] font-bold">
              Log conforms to global greenhouse lifecycle data.
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
