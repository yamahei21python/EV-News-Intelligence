import { GITHUB_RAW_BASE_URL } from './constants';
import type { AnalysisReport } from './types';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export async function getAvailableDates(): Promise<string[]> {
  try {
    return await fetchJson<string[]>(`${GITHUB_RAW_BASE_URL}/dates.json`);
  } catch (error) {
    console.error('Error fetching dates:', error);
    return [];
  }
}

export async function getReports(date?: string): Promise<AnalysisReport[]> {
  const url = date 
    ? `${GITHUB_RAW_BASE_URL}/archive/${date}.json`
    : `${GITHUB_RAW_BASE_URL}/final_reports.json`;

  try {
    return await fetchJson<AnalysisReport[]>(url);
  } catch (error) {
    console.error('Error loading reports:', error);
    return [];
  }
}