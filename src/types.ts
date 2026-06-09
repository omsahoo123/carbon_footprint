/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityCategory = 'transport' | 'food' | 'energy' | 'travel' | 'shopping';

export interface ActivityLog {
  id: string;
  date: string; // YYYY-MM-DD
  category: ActivityCategory;
  typeLabel: string; // e.g. "Standard Car", "Beef Meal"
  inputValue: number; // e.g. 15 km, 2 meals
  unitLabel: string; // e.g. "km", "meals", "kWh"
  co2: number; // kg CO2
}

export interface DaySubmission {
  date: string; // YYYY-MM-DD
  totalCo2: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  co2: number; // kg CO2 per week
  isCurrentUser: boolean;
  avatar: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  saving: number; // kg CO2
  category: ActivityCategory;
  accepted: boolean;
  completed: boolean;
}
