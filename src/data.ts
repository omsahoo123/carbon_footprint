/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivityCategory, ActivityLog, LeaderboardEntry, Challenge } from './types';

// Emission factors compliant with user guidelines (kg CO2 per unit)
export const EMISSION_FACTORS = {
  transport: {
    car: 0.21,         // kg/km (Car)
    electric_car: 0.05,// kg/km
    hybrid_car: 0.12,  // kg/km
    bus: 0.089,       // kg/km (Bus)
    train: 0.04,       // kg/km
    motorcycle: 0.11,  // kg/km
  },
  food: {
    beef: 6.0,         // kg per meal (Beef)
    chicken: 1.5,      // kg per meal (Chicken)
    pork_lamb: 3.2,    // kg per meal
    fish: 1.8,         // kg per meal
    vegetarian: 1.0,   // kg per meal
    vegan: 0.5,        // kg per meal (Vegan)
  },
  energy: {
    electricity: 0.233,// kg/kWh (Electricity)
    gas: 2.04,         // kg/m³ (Gas heating)
    fuel_oil: 2.68,    // kg/liter
  },
  travel: {
    flight: 0.255,     // kg/km per person (Flight)
  },
  shopping: {
    clothing: 12.5,    // kg CO2 per item
    electronics: 45.0, // kg CO2 per item
    furniture: 30.0,   // kg CO2 per item
    general: 2.2,      // kg CO2 per single transaction/misc item
  }
};

// Formattable labels and units
export const CATEGORY_INFO: Record<ActivityCategory, { name: string; icon: string; bg: string; text: string; lightBg: string }> = {
  transport: { name: 'Transport', icon: '🚙', bg: 'bg-emerald-600', text: 'text-emerald-700', lightBg: 'bg-emerald-50' },
  food: { name: 'Food', icon: '🍔', bg: 'bg-amber-600', text: 'text-amber-700', lightBg: 'bg-amber-50' },
  energy: { name: 'Energy', icon: '⚡', bg: 'bg-teal-600', text: 'text-teal-700', lightBg: 'bg-teal-50' },
  travel: { name: 'Travel', icon: '✈️', bg: 'bg-cyan-600', text: 'text-cyan-700', lightBg: 'bg-cyan-50' },
  shopping: { name: 'Shopping', icon: '🛍️', bg: 'bg-indigo-600', text: 'text-indigo-700', lightBg: 'bg-indigo-50' },
};

// Helper to calculate date string relative to today
export function getRelativeDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Format date into human readable, e.g. "Jun 9"
export function formatDayLabel(dateStr: string): string {
  // Parse dateStr "YYYY-MM-DD"
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month, day);
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Generate pre-loaded sample logs
export function getInitialLogs(): ActivityLog[] {
  // Let's seed data for the last 7 days so charts are beautifully pre-populated.
  return [
    // 6 days ago
    {
      id: 'pre-1',
      date: getRelativeDateString(6),
      category: 'transport',
      typeLabel: 'Standard Car',
      inputValue: 35,
      unitLabel: 'km',
      co2: Number((35 * EMISSION_FACTORS.transport.car).toFixed(2)), // 7.35
    },
    {
      id: 'pre-2',
      date: getRelativeDateString(6),
      category: 'food',
      typeLabel: 'Beef Meal',
      inputValue: 1,
      unitLabel: 'meal',
      co2: EMISSION_FACTORS.food.beef, // 6.0
    },
    // 5 days ago
    {
      id: 'pre-3',
      date: getRelativeDateString(5),
      category: 'transport',
      typeLabel: 'Bus Ride',
      inputValue: 25,
      unitLabel: 'km',
      co2: Number((25 * EMISSION_FACTORS.transport.bus).toFixed(2)), // 2.23
    },
    {
      id: 'pre-4',
      date: getRelativeDateString(5),
      category: 'food',
      typeLabel: 'Vegan Food',
      inputValue: 2,
      unitLabel: 'meals',
      co2: EMISSION_FACTORS.food.vegan * 2, // 1.0
    },
    {
      id: 'pre-5',
      date: getRelativeDateString(5),
      category: 'energy',
      typeLabel: 'Electricity',
      inputValue: 12,
      unitLabel: 'kWh',
      co2: Number((12 * EMISSION_FACTORS.energy.electricity).toFixed(2)), // 2.80
    },
    // 4 days ago
    {
      id: 'pre-6',
      date: getRelativeDateString(4),
      category: 'food',
      typeLabel: 'Chicken Meal',
      inputValue: 1,
      unitLabel: 'meal',
      co2: EMISSION_FACTORS.food.chicken, // 1.5
    },
    {
      id: 'pre-7',
      date: getRelativeDateString(4),
      category: 'energy',
      typeLabel: 'Electricity',
      inputValue: 6,
      unitLabel: 'kWh',
      co2: Number((6 * EMISSION_FACTORS.energy.electricity).toFixed(2)), // 1.40
    },
    // 3 days ago
    {
      id: 'pre-8',
      date: getRelativeDateString(3),
      category: 'travel',
      typeLabel: 'Flight (Short-Haul)',
      inputValue: 180,
      unitLabel: 'km',
      co2: Number((180 * EMISSION_FACTORS.travel.flight).toFixed(2)), // 45.9
    },
    {
      id: 'pre-9',
      date: getRelativeDateString(3),
      category: 'food',
      typeLabel: 'Vegetarian Meal',
      inputValue: 2,
      unitLabel: 'meals',
      co2: EMISSION_FACTORS.food.vegetarian * 2, // 2.0
    },
    // 2 days ago
    {
      id: 'pre-10',
      date: getRelativeDateString(2),
      category: 'transport',
      typeLabel: 'Standard Car',
      inputValue: 15,
      unitLabel: 'km',
      co2: Number((15 * EMISSION_FACTORS.transport.car).toFixed(2)), // 3.15
    },
    {
      id: 'pre-11',
      date: getRelativeDateString(2),
      category: 'food',
      typeLabel: 'Beef Meal',
      inputValue: 1,
      unitLabel: 'meal',
      co2: EMISSION_FACTORS.food.beef, // 6.0
    },
    {
      id: 'pre-12',
      date: getRelativeDateString(2),
      category: 'shopping',
      typeLabel: 'Clothing/Apparel',
      inputValue: 1,
      unitLabel: 'items',
      co2: EMISSION_FACTORS.shopping.clothing, // 12.5
    },
    // 1 day ago
    {
      id: 'pre-13',
      date: getRelativeDateString(1),
      category: 'transport',
      typeLabel: 'Standard Car',
      inputValue: 20,
      unitLabel: 'km',
      co2: Number((20 * EMISSION_FACTORS.transport.car).toFixed(2)), // 4.2
    },
    {
      id: 'pre-14',
      date: getRelativeDateString(1),
      category: 'food',
      typeLabel: 'Chicken Meal',
      inputValue: 2,
      unitLabel: 'meals',
      co2: EMISSION_FACTORS.food.chicken * 2, // 3.0
    },
    {
      id: 'pre-15',
      date: getRelativeDateString(1),
      category: 'energy',
      typeLabel: 'Electricity',
      inputValue: 9,
      unitLabel: 'kWh',
      co2: Number((9 * EMISSION_FACTORS.energy.electricity).toFixed(2)), // 2.1
    },
    // Today
    {
      id: 'pre-16',
      date: getRelativeDateString(0),
      category: 'transport',
      typeLabel: 'Electric Car',
      inputValue: 10,
      unitLabel: 'km',
      co2: Number((10 * EMISSION_FACTORS.transport.electric_car).toFixed(2)), // 0.5
    },
    {
      id: 'pre-17',
      date: getRelativeDateString(0),
      category: 'food',
      typeLabel: 'Vegan Food',
      inputValue: 1,
      unitLabel: 'meal',
      co2: EMISSION_FACTORS.food.vegan, // 0.5
    }
  ];
}

// Daily target and recommendations
export const CO2_GOALS = {
  dailyTarget: 8.0, // kg CO2 per day goal
  weeklyTarget: 56.0, // kg CO2 per week goal
  globalAverageDaily: 12.5, // kg CO2 global average daily per person
};

// Daily tips of the day list
export const ECO_TIPS = [
  "Drying your clothes on a rack instead of using a heating dryer saves about 1.5 kg of CO₂ per load.",
  "Switching off electronic devices at the wall instead of standby mode can save up to 40 kg of CO₂ per year.",
  "Swapping just one beef meal for chicken or a vegan option today saves up to 5.5 kg of CO₂.",
  "Upgrading to smart LED light bulbs reduces energy footprint from lighting by up to 80%.",
  "Riding a bicycle for trips under 5km instead of driving saves around 1.0 kg of CO₂ per trip.",
  "Lowering your thermostat by just 1°C in cold weather can reduce home energy heating footprint by 7%.",
  "Reducing food waste is one of the single most effective household actions to curb global emission totals.",
  "Using public transit during rush hours can be up to 10x more carbon-efficient per passenger than individual driving."
];

// Initial Challenge cards
export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Go Meatless Today',
    description: 'Swap your meals today for vegetarian or vegan options to immediately lower agricultural emissions.',
    saving: 4.5,
    category: 'food',
    accepted: false,
    completed: false
  },
  {
    id: 'ch-2',
    title: 'Active Commuter Challenge',
    description: 'Walk, cycle, or ride a kick scooter for any short trips today under 4 km instead of taking a car.',
    saving: 3.2,
    category: 'transport',
    accepted: false,
    completed: false
  },
  {
    id: 'ch-3',
    title: 'Vampire Power Shutdown',
    description: 'Unplug your standby devices, consoles, microwave clocks, and laptop chargers overnight to stop idle energy draw.',
    saving: 0.8,
    category: 'energy',
    accepted: false,
    completed: false
  },
  {
    id: 'ch-4',
    title: 'Cold Laundry Cycle',
    description: 'Wash your laundry cycle at 30°C or cold tap water rather than 40°C+ to save water heaters energy.',
    saving: 1.4,
    category: 'energy',
    accepted: false,
    completed: false
  },
  {
    id: 'ch-5',
    title: 'Zero Waste Grocery Trip',
    description: 'Carry reusable organic bags and choose unpackaged produce today to bypass plastic packaging footprints.',
    saving: 1.1,
    category: 'shopping',
    accepted: false,
    completed: false
  }
];

// Leaderboard entries (weekly)
export function getInitialLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, name: 'Ava Greenfield', co2: 24.8, isCurrentUser: false, avatar: '🥑' },
    { rank: 2, name: 'Liam Eco-Force', co2: 38.6, isCurrentUser: false, avatar: '🦊' },
    { rank: 3, name: 'You', co2: 0, isCurrentUser: true, avatar: '🌱' }, // We'll compute this dynamically in frontend state
    { rank: 4, name: 'Sophia Sterling', co2: 52.3, isCurrentUser: false, avatar: '🦦' },
    { rank: 5, name: 'Marcus Solas', co2: 68.2, isCurrentUser: false, avatar: '🌾' },
    { rank: 6, name: 'Emma Carbon-Less', co2: 74.9, isCurrentUser: false, avatar: '🐨' }
  ];
}
