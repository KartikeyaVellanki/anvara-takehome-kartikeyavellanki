'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Action state type for form handling
export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// Helper to get auth cookie for backend API calls
async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('better-auth.session_token');

  return {
    'Content-Type': 'application/json',
    ...(sessionCookie && { Cookie: `better-auth.session_token=${sessionCookie.value}` }),
  };
}

// Create a new campaign
export async function createCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const budget = formData.get('budget') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const status = formData.get('status') as string;

  // Client-side validation
  const fieldErrors: Record<string, string> = {};

  if (!name || name.trim().length === 0) {
    fieldErrors.name = 'Name is required';
  }

  if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
    fieldErrors.budget = 'Budget must be a positive number';
  }

  if (!startDate) {
    fieldErrors.startDate = 'Start date is required';
  }

  if (!endDate) {
    fieldErrors.endDate = 'End date is required';
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    fieldErrors.endDate = 'End date must be after start date';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/api/campaigns`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        budget: Number(budget),
        startDate,
        endDate,
        status: status || 'DRAFT',
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Failed to create campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Update an existing campaign
export async function updateCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const budget = formData.get('budget') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const status = formData.get('status') as string;

  if (!id) {
    return { success: false, error: 'Campaign ID is required' };
  }

  // Client-side validation
  const fieldErrors: Record<string, string> = {};

  if (!name || name.trim().length === 0) {
    fieldErrors.name = 'Name is required';
  }

  if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
    fieldErrors.budget = 'Budget must be a positive number';
  }

  if (!startDate) {
    fieldErrors.startDate = 'Start date is required';
  }

  if (!endDate) {
    fieldErrors.endDate = 'End date is required';
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    fieldErrors.endDate = 'End date must be after start date';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        budget: Number(budget),
        startDate,
        endDate,
        status,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Failed to update campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Delete a campaign
export async function deleteCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;

  if (!id) {
    return { success: false, error: 'Campaign ID is required' };
  }

  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Failed to delete campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}
