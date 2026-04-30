'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Car,
  CheckCircle2,
  Heart,
  Home,
  LayoutDashboard,
  ListFilter,
  Loader2,
  LogIn,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  UserRound,
} from 'lucide-react';
import { api, API_BASE_URL } from '@/api/client';
import type { AuthUser, Category, Listing, Notification } from '@/types/marketplace';

const fallbackCategories: Category[] = [
  { id: 'cars', name: 'Cars', slug: 'cars', sortOrder: 1, isActive: true },
  { id: 'real-estate', name: 'Real Estate', slug: 'real-estate', sortOrder: 2, isActive: true },
  { id: 'electronics', name: 'Electronics', slug: 'electronics', sortOrder: 3, isActive: true },
  { id: 'jobs', name: 'Jobs', slug: 'jobs', sortOrder: 4, isActive: true },
  { id: 'furniture', name: 'Furniture', slug: 'furniture', sortOrder: 5, isActive: true },
  { id: 'general', name: 'General', slug: 'general', sortOrder: 6, isActive: true },
];

const fallbackListings: Listing[] = [
  {
    id: 'demo-1',
    userId: 'seller-1',
    categoryId: 'cars',
    categoryName: 'Cars',
    title: 'Toyota Land Cruiser GXR 2021',
    description: 'Clean title, full service history, leather interior, ready for inspection.',
    price: 58500,
    city: 'Baghdad',
    location: 'Mansour',
    status: 'active',
    views: 1240,
    favoritesCount: 86,
    isFeatured: true,
    isTop: true,
    userName: 'Karrar Motors',
    userRating: 4.8,
    primaryImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    userId: 'seller-2',
    categoryId: 'real-estate',
    categoryName: 'Real Estate',
    title: 'Modern family house near Erbil Citadel',
    description: 'Three bedrooms, private garden, parking, and a bright open living space.',
    price: 185000,
    city: 'Erbil',
    location: 'Ainkawa',
    status: 'active',
    views: 856,
    favoritesCount: 44,
    isFeatured: true,
    isTop: false,
    userName: 'Darin Properties',
    userRating: 4.6,
    primaryImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    userId: 'seller-3',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Natural titanium, battery health 99%, box and original cable included.',
    price: 1025,
    city: 'Basra',
    location: 'Ashar',
    status: 'active',
    views: 2340,
    favoritesCount: 132,
    isFeatured: false,
    isTop: true,
    userName: 'Basra Tech',
    userRating: 4.9,
    primaryImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    userId: 'seller-4',
    categoryId: 'furniture',
    categoryName: 'Furniture',
    title: 'Walnut dining set for eight',
    description: 'Solid wood table, eight chairs, excellent condition, delivery available.',
    price: 740,
    city: 'Najaf',
    location: 'Al Salam',
    status: 'active',
    views: 421,
    favoritesCount: 18,
    isFeatured: false,
    isTop: false,
    userName: 'Home Select',
    userRating: 4.3,
    primaryImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date().toISOString(),
  },
];

type ViewMode = 'browse' | 'sell' | 'messages' | 'admin';

export default function MarketplacePage() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [view, setView] = useState<ViewMode>('browse');
  const [listings, setListings] = useState<Listing[]>(fallbackListings);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(false);
  const [apiState, setApiState] = useState<'live' | 'demo'>('demo');
  const [token, setToken] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notice, setNotice] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminStats, setAdminStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('marketplace-token') || '';
    const savedUser = window.localStorage.getItem('marketplace-user');
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser) as AuthUser);
  }, []);

  const loadMarketplace = useCallback(async (nextQuery: string, nextCategory: string, nextCity: string) => {
    setLoading(true);
    try {
      const [searchResponse, categoriesResponse] = await Promise.all([
        api.searchListings({
          q: nextQuery,
          category: nextCategory,
          city: nextCity,
          includeFacets: true,
          pageSize: 24,
        }),
        api.getCategories(),
      ]);

      setListings(searchResponse.results.length ? searchResponse.results : fallbackListings);
      setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : categoriesResponse.data);
      setApiState('live');
    } catch {
      setListings(filterFallback(nextQuery, nextCategory, nextCity));
      setCategories(fallbackCategories);
      setApiState('demo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarketplace('', '', '');
  }, [loadMarketplace]);

  async function refreshNotifications() {
    if (!token) return;
    try {
      const response = await api.getNotifications(token);
      setNotifications(response.data);
    } catch {
      setNotifications([]);
    }
  }

  async function refreshAdminStats() {
    if (!token) return;
    try {
      setAdminStats(await api.getAdminStats(token));
    } catch {
      setAdminStats(null);
    }
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    void loadMarketplace(query, category, city);
  }

  async function favoriteListing(listingId: string) {
    if (!token) {
      setNotice('Sign in first to save listings.');
      return;
    }

    try {
      await api.addFavorite(token, listingId);
      setNotice('Listing saved to favorites.');
    } catch {
      setNotice('Could not save this listing yet.');
    }
  }

  async function handleVerified(nextToken: string, nextUser: AuthUser) {
    setToken(nextToken);
    setUser(nextUser);
    window.localStorage.setItem('marketplace-token', nextToken);
    window.localStorage.setItem('marketplace-user', JSON.stringify(nextUser));
    setNotice(`Welcome, ${nextUser.firstName}.`);
    await Promise.all([refreshNotifications(), refreshAdminStats()]);
  }

  const activeCategory = useMemo(
    () => categories.find((item) => item.id === category || item.slug === category || item.name === category),
    [categories, category],
  );

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <Store aria-hidden="true" />
          <div>
            <strong>Iraqi Marketplace</strong>
            <span>{apiState === 'live' ? 'Live API connected' : 'Demo data mode'}</span>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <button className={view === 'browse' ? 'active' : ''} onClick={() => setView('browse')}>
            <Search aria-hidden="true" /> Browse
          </button>
          <button className={view === 'sell' ? 'active' : ''} onClick={() => setView('sell')}>
            <Plus aria-hidden="true" /> Sell
          </button>
          <button className={view === 'messages' ? 'active' : ''} onClick={() => setView('messages')}>
            <MessageSquare aria-hidden="true" /> Messages
          </button>
          <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>
            <LayoutDashboard aria-hidden="true" /> Admin
          </button>
        </nav>

        <div className="sidebar-panel">
          <span className="label">Categories</span>
          <div className="category-list">
            <button className={!category ? 'selected' : ''} onClick={() => { setCategory(''); void loadMarketplace(query, '', city); }}>
              <ListFilter aria-hidden="true" /> All categories
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                className={category === item.id || category === item.slug ? 'selected' : ''}
                onClick={() => {
                  const nextCategory = item.id || item.slug;
                  setCategory(nextCategory);
                  void loadMarketplace(query, nextCategory, city);
                }}
              >
                {item.slug === 'cars' ? <Car aria-hidden="true" /> : <Home aria-hidden="true" />}
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <form className="searchbar" onSubmit={handleSearch}>
            <Search aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cars, homes, phones..." />
            <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" />
            <button type="submit" aria-label="Search listings">
              {loading ? <Loader2 className="spin" aria-hidden="true" /> : <SlidersHorizontal aria-hidden="true" />}
            </button>
          </form>

          <div className="account-strip">
            <button className="icon-button" onClick={() => void refreshNotifications()} aria-label="Refresh notifications">
              <Bell aria-hidden="true" />
              {notifications.length > 0 && <span>{notifications.length}</span>}
            </button>
            {user ? (
              <div className="user-chip">
                <UserRound aria-hidden="true" />
                <span>{user.firstName}</span>
              </div>
            ) : (
              <span className="muted">Guest</span>
            )}
          </div>
        </header>

        {notice && (
          <button className="notice" onClick={() => setNotice('')}>
            <CheckCircle2 aria-hidden="true" /> {notice}
          </button>
        )}

        {view === 'browse' && (
          <BrowseView
            listings={listings}
            activeCategory={activeCategory}
            loading={loading}
            onFavorite={favoriteListing}
          />
        )}
        {view === 'sell' && <SellView token={token} categories={categories} onCreated={() => void loadMarketplace(query, category, city)} onNotice={setNotice} />}
        {view === 'messages' && <MessagesView signedIn={!!token} notifications={notifications} />}
        {view === 'admin' && <AdminView token={token} stats={adminStats} onRefresh={() => void refreshAdminStats()} />}
      </section>

      <aside className="right-panel">
        <AuthPanel onVerified={handleVerified} user={user} />
        <div className="api-card">
          <span className="label">Backend</span>
          <strong>{API_BASE_URL}</strong>
          <p>{apiState === 'live' ? 'Requests are hitting the NestJS API.' : 'Backend is offline or empty; UI is using sample listings.'}</p>
        </div>
        <div className="api-card">
          <span className="label">Workflow</span>
          <div className="mini-steps">
            <span><ShieldCheck aria-hidden="true" /> OTP auth</span>
            <span><Sparkles aria-hidden="true" /> Search</span>
            <span><MessageSquare aria-hidden="true" /> Chat</span>
          </div>
        </div>
      </aside>
    </main>
  );
}

function filterFallback(nextQuery: string, nextCategory: string, nextCity: string) {
  return fallbackListings.filter((listing) => {
    const matchesQuery = !nextQuery || `${listing.title} ${listing.description}`.toLowerCase().includes(nextQuery.toLowerCase());
    const matchesCategory = !nextCategory || listing.categoryId === nextCategory || listing.categoryName === nextCategory;
    const matchesCity = !nextCity || listing.city.toLowerCase().includes(nextCity.toLowerCase());
    return matchesQuery && matchesCategory && matchesCity;
  });
}

function BrowseView({
  listings,
  activeCategory,
  loading,
  onFavorite,
}: {
  listings: Listing[];
  activeCategory?: Category;
  loading: boolean;
  onFavorite: (listingId: string) => void;
}) {
  return (
    <section className="content-flow">
      <div className="section-heading">
        <div>
          <span className="label">Marketplace</span>
          <h1>{activeCategory ? activeCategory.name : 'Fresh listings across Iraq'}</h1>
        </div>
        <div className="metric-row">
          <span>{listings.length} listings</span>
          <span>Updated now</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><Loader2 className="spin" aria-hidden="true" /> Loading marketplace...</div>
      ) : (
        <div className="listing-grid">
          {listings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <div
                className="listing-image"
                role="img"
                aria-label={listing.title}
                style={{ backgroundImage: `url(${listing.primaryImage || listing.images?.[0]?.imageUrl || fallbackListings[0].primaryImage})` }}
              />
              <div className="listing-body">
                <div className="listing-meta">
                  <span>{listing.categoryName || listing.categoryId}</span>
                  <span>{listing.city}</span>
                </div>
                <h2>{listing.title}</h2>
                <p>{listing.description}</p>
                <div className="listing-bottom">
                  <strong>${Number(listing.price).toLocaleString()}</strong>
                  <button onClick={() => onFavorite(listing.id)} aria-label="Save listing">
                    <Heart aria-hidden="true" />
                  </button>
                </div>
                <div className="seller-line">
                  <span>{listing.userName || 'Local seller'}</span>
                  <span><Star aria-hidden="true" /> {listing.userRating || 4.5}</span>
                  <span>{listing.favoritesCount} saved</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SellView({
  token,
  categories,
  onCreated,
  onNotice,
}: {
  token: string;
  categories: Category[];
  onCreated: () => void;
  onNotice: (notice: string) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      onNotice('Sign in before creating a listing.');
      return;
    }

    const data = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await api.createListing(token, {
        categoryId: data.get('categoryId'),
        title: data.get('title'),
        description: data.get('description'),
        price: Number(data.get('price')),
        city: data.get('city'),
        location: data.get('location'),
        images: [data.get('imageUrl')].filter(Boolean),
        attributes: {
          condition: data.get('condition'),
        },
      });
      onNotice('Listing created.');
      event.currentTarget.reset();
      onCreated();
    } catch {
      onNotice('Could not create listing. Check backend data and auth.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="form-surface">
      <div className="section-heading">
        <div>
          <span className="label">Sell</span>
          <h1>Create a listing</h1>
        </div>
      </div>
      <form className="listing-form" onSubmit={submit}>
        <label>Title<input name="title" required minLength={5} placeholder="Samsung Galaxy S24 Ultra" /></label>
        <label>Category<select name="categoryId" required>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Description<textarea name="description" required minLength={10} placeholder="Condition, included accessories, delivery details..." /></label>
        <label>Price<input name="price" type="number" min="1" required placeholder="950" /></label>
        <label>City<input name="city" required placeholder="Baghdad" /></label>
        <label>Location<input name="location" placeholder="Mansour" /></label>
        <label>Image URL<input name="imageUrl" placeholder="https://..." /></label>
        <label>Condition<input name="condition" placeholder="like new" /></label>
        <button className="primary-action" type="submit" disabled={saving}>
          {saving ? <Loader2 className="spin" aria-hidden="true" /> : <Plus aria-hidden="true" />}
          Publish listing
        </button>
      </form>
    </section>
  );
}

function MessagesView({ signedIn, notifications }: { signedIn: boolean; notifications: Notification[] }) {
  return (
    <section className="split-view">
      <div className="section-heading">
        <div>
          <span className="label">Inbox</span>
          <h1>Messages and alerts</h1>
        </div>
      </div>
      <div className="message-list">
        {!signedIn && <p className="empty">Sign in to load conversations from the backend.</p>}
        {notifications.length === 0 && signedIn && <p className="empty">No notifications yet.</p>}
        {notifications.map((item) => (
          <article className="message-item" key={item.id}>
            <Bell aria-hidden="true" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
            </div>
            <span>{item.isRead ? 'Read' : 'New'}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminView({ token, stats, onRefresh }: { token: string; stats: Record<string, number> | null; onRefresh: () => void }) {
  return (
    <section className="content-flow">
      <div className="section-heading">
        <div>
          <span className="label">Admin</span>
          <h1>Operations overview</h1>
        </div>
        <button className="secondary-action" onClick={onRefresh} disabled={!token}>
          <LayoutDashboard aria-hidden="true" /> Refresh
        </button>
      </div>
      <div className="stats-grid">
        {['users', 'activeUsers', 'listings', 'activeListings', 'pendingReports', 'conversations'].map((key) => (
          <div className="stat-card" key={key}>
            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
            <strong>{stats?.[key] ?? '-'}</strong>
          </div>
        ))}
      </div>
      {!token && <p className="empty">Sign in with an admin account to load live moderation stats.</p>}
    </section>
  );
}

function AuthPanel({ onVerified, user }: { onVerified: (token: string, user: AuthUser) => void; user: AuthUser | null }) {
  const [phoneNumber, setPhoneNumber] = useState('+964');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function sendOtp() {
    setBusy(true);
    try {
      await api.sendOtp(phoneNumber);
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setBusy(true);
    try {
      const response = await api.verifyOtp(phoneNumber, otp);
      onVerified(response.accessToken, response.user);
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <div className="auth-card">
        <span className="label">Signed in</span>
        <strong>{user.firstName} {user.lastName}</strong>
        <p>{user.city} - rating {user.rating || 0}</p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <span className="label">Account</span>
      <strong>OTP sign in</strong>
      <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+964..." />
      {sent && <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="6-digit OTP" />}
      <button onClick={sent ? verifyOtp : sendOtp} disabled={busy}>
        {busy ? <Loader2 className="spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
        {sent ? 'Verify OTP' : 'Send OTP'}
      </button>
    </div>
  );
}
