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

// Valid ad slot types
const VALID_AD_SLOT_TYPES = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];

// Helper to get auth cookie for backend API calls
async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('better-auth.session_token');
  
  return {
    'Content-Type': 'application/json',
    ...(sessionCookie && { Cookie: `better-auth.session_token=${sessionCookie.value}` }),
  };
}

// Create a new ad slot
export async function createAdSlot(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const basePrice = formData.get('basePrice') as string;

  // Client-side validation
  const fieldErrors: Record<string, string> = {};
  
  if (!name || name.trim().length === 0) {
    fieldErrors.name = 'Name is required';
  }
  
  if (!type || !VALID_AD_SLOT_TYPES.includes(type)) {
    fieldErrors.type = 'Please select a valid type';
  }
  
  if (!basePrice || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
    fieldErrors.basePrice = 'Base price must be a positive number';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${API_URL}/api/ad-slots`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        type,
        basePrice: Number(basePrice),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Failed to create ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Update an existing ad slot
export async function updateAdSlot(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const basePrice = formData.get('basePrice') as string;
  const isAvailable = formData.get('isAvailable') === 'true';

  if (!id) {
    return { success: false, error: 'Ad slot ID is required' };
  }

  // Client-side validation
  const fieldErrors: Record<string, string> = {};
  
  if (!name || name.trim().length === 0) {
    fieldErrors.name = 'Name is required';
  }
  
  if (!type || !VALID_AD_SLOT_TYPES.includes(type)) {
    fieldErrors.type = 'Please select a valid type';
  }
  
  if (!basePrice || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
    fieldErrors.basePrice = 'Base price must be a positive number';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        type,
        basePrice: Number(basePrice),
        isAvailable,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Failed to update ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Delete an ad slot
export async function deleteAdSlot(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;

  if (!id) {
    return { success: false, error: 'Ad slot ID is required' };
  }

  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Failed to delete ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Toggle ad slot availability
export async function toggleAdSlotAvailability(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const currentAvailability = formData.get('isAvailable') === 'true';

  if (!id) {
    return { success: false, error: 'Ad slot ID is required' };
  }

  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        isAvailable: !currentAvailability,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Failed to update availability' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}
