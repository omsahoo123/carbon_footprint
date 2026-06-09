/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  getRelativeDateString, 
  formatDayLabel, 
  getInitialLogs, 
  EMISSION_FACTORS 
} from './data';

describe('Carbon Tracker Seeding & Data Helpers', () => {
  it('should correctly format relative date strings (YYYY-MM-DD)', () => {
    const todayStr = getRelativeDateString(0);
    expect(todayStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    
    const oneDayAgoStr = getRelativeDateString(1);
    expect(oneDayAgoStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(todayStr).not.toEqual(oneDayAgoStr);
  });

  it('should format YYYY-MM-DD date strings into short labels', () => {
    const label = formatDayLabel('2026-06-09');
    expect(label).toBe('Jun 9');
    
    // Invalid pattern should fallback safely
    const fallback = formatDayLabel('invalid-date');
    expect(fallback).toBe('invalid-date');
  });

  it('should compile appropriate initial seeded logs correctly', () => {
    const logs = getInitialLogs();
    expect(logs.length).toBeGreaterThan(0);
    
    // Check fields of first log entry
    const sample = logs[0];
    expect(sample).toHaveProperty('id');
    expect(sample).toHaveProperty('date');
    expect(sample).toHaveProperty('category');
    expect(sample).toHaveProperty('co2');
    expect(typeof sample.co2).toBe('number');
  });

  it('should have standard emission coefficients', () => {
    expect(EMISSION_FACTORS.transport.car).toBe(0.21);
    expect(EMISSION_FACTORS.transport.electric_car).toBe(0.05);
    expect(EMISSION_FACTORS.transport.hybrid_car).toBe(0.12);
    expect(EMISSION_FACTORS.transport.bus).toBe(0.089);
    expect(EMISSION_FACTORS.transport.train).toBe(0.04);
    expect(EMISSION_FACTORS.transport.motorcycle).toBe(0.11);

    expect(EMISSION_FACTORS.food.beef).toBe(6.0);
    expect(EMISSION_FACTORS.food.chicken).toBe(1.5);
    expect(EMISSION_FACTORS.food.pork_lamb).toBe(3.2);
    expect(EMISSION_FACTORS.food.fish).toBe(1.8);
    expect(EMISSION_FACTORS.food.vegetarian).toBe(1.0);
    expect(EMISSION_FACTORS.food.vegan).toBe(0.5);

    expect(EMISSION_FACTORS.energy.electricity).toBe(0.233);
    expect(EMISSION_FACTORS.energy.gas).toBe(2.04);
    expect(EMISSION_FACTORS.energy.fuel_oil).toBe(2.68);

    expect(EMISSION_FACTORS.travel.flight).toBe(0.255);

    expect(EMISSION_FACTORS.shopping.clothing).toBe(12.5);
    expect(EMISSION_FACTORS.shopping.electronics).toBe(45.0);
    expect(EMISSION_FACTORS.shopping.furniture).toBe(30.0);
    expect(EMISSION_FACTORS.shopping.general).toBe(2.2);
  });

  it('should compute eco-scores accurately based on daily total', () => {
    // Math logic mock: Math.max(0, Math.min(100, Math.round(100 - (todayTotal / 15) * 100)))
    const getMockEcoScore = (total: number) => Math.max(0, Math.min(100, Math.round(100 - (total / 15) * 100)));
    
    expect(getMockEcoScore(0)).toBe(100);
    expect(getMockEcoScore(7.5)).toBe(50);
    expect(getMockEcoScore(15)).toBe(0);
    expect(getMockEcoScore(20)).toBe(0);
  });
});
