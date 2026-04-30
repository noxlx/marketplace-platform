export type ListingStatus = 'active' | 'sold' | 'expired' | 'suspended' | 'draft';

export type Listing = {
  id: string;
  userId: string;
  categoryId: string;
  categoryName?: string;
  title: string;
  description: string;
  price: number;
  city: string;
  location?: string;
  status: ListingStatus;
  views: number;
  favoritesCount: number;
  isFeatured: boolean;
  isTop: boolean;
  isPromoted?: boolean;
  userName?: string;
  userRating?: number;
  primaryImage?: string;
  images?: Array<{ id: string; imageUrl: string; thumbnailUrl?: string; isPrimary: boolean }>;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
};

export type SearchResponse = {
  results: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: string;
  executionTime: number;
  facets?: {
    categories: Array<{ name: string; count: number }>;
    cities: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
  };
};

export type AuthUser = {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  city: string;
  profileImage?: string;
  isVerified: boolean;
  rating: number;
  completedTransactions: number;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
};

export type Conversation = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'message' | 'favorite' | 'review' | 'listing' | 'system';
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
};
