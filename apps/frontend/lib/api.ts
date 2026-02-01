// Simple API client
import type { Campaign, AdSlot, Placement } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

// Campaign input type for create/update
interface CampaignInput {
  name: string;
  description?: string;
  budget: number;
  startDate: string;
  endDate: string;
  sponsorId: string;
}

// AdSlot input type for create/update
interface AdSlotInput {
  name: string;
  description?: string;
  type: AdSlot['type'];
  basePrice: number;
  publisherId: string;
}

// Placement input type for create
interface PlacementInput {
  campaignId: string;
  adSlotId: string;
  creativeId: string;
  publisherId: string;
  agreedPrice: number;
  startDate: string;
  endDate: string;
}

// Dashboard stats type
interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpent: number;
  totalImpressions: number;
}

// Campaigns
export const getCampaigns = (sponsorId?: string) =>
  api<Campaign[]>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');
export const getCampaign = (id: string) => api<Campaign>(`/api/campaigns/${id}`);
export const createCampaign = (data: CampaignInput) =>
  api<Campaign>('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });

// Ad Slots
export const getAdSlots = (publisherId?: string) =>
  api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');
export const getAdSlot = (id: string) => api<AdSlot>(`/api/ad-slots/${id}`);
export const createAdSlot = (data: AdSlotInput) =>
  api<AdSlot>('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });

// Placements
export const getPlacements = () => api<Placement[]>('/api/placements');
export const createPlacement = (data: PlacementInput) =>
  api<Placement>('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getStats = () => api<DashboardStats>('/api/dashboard/stats');
