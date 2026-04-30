import type { AuthResponse, Category, Listing, Notification, SearchResponse } from '@/types/marketplace';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type RequestOptions = RequestInit & {
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(path, API_BASE_URL);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  searchListings(query: Record<string, string | number | boolean | undefined>) {
    return request<SearchResponse>('/api/v1/search', { query });
  },
  listListings(query: Record<string, string | number | boolean | undefined>) {
    return request<{ data: Listing[]; total: number; page: number; pageSize: number; totalPages: number }>(
      '/api/v1/listings',
      { query },
    );
  },
  getCategories() {
    return request<{ data: Category[] } | Category[]>('/api/v1/categories');
  },
  sendOtp(phoneNumber: string) {
    return request<{ message: string }>('/api/v1/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  },
  verifyOtp(phoneNumber: string, otp: string) {
    return request<AuthResponse>('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    });
  },
  createListing(token: string, payload: Record<string, unknown>) {
    return request<Listing>('/api/v1/listings', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    });
  },
  addFavorite(token: string, listingId: string) {
    return request('/api/v1/favorites/' + listingId, { method: 'POST', token });
  },
  getNotifications(token: string) {
    return request<{ data: Notification[] }>('/api/v1/notifications/me', { token });
  },
  getAdminStats(token: string) {
    return request<Record<string, number>>('/api/v1/admin/stats', { token });
  },
};

export { API_BASE_URL };
