'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  category: string;
  image: string;
  views: number;
  favorites: number;
  isNew?: boolean;
}

const CATEGORIES = [
  { id: 'cars', name: 'Cars' },
  { id: 'real-estate', name: 'Real Estate' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'phones', name: 'Phones' },
  { id: 'computers', name: 'Computers' },
];

const LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Toyota Land Cruiser GXR 2021',
    price: 58500,
    city: 'Baghdad',
    category: 'Cars',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=500&q=60',
    views: 1240,
    favorites: 86,
    isNew: true,
  },
  {
    id: '2',
    title: 'Modern family house near Erbil Citadel',
    price: 185000,
    city: 'Erbil',
    category: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=60',
    views: 856,
    favorites: 44,
  },
  {
    id: '3',
    title: 'iPhone 13 Pro 256GB - Excellent Condition',
    price: 450,
    city: 'Baghdad',
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=500&q=60',
    views: 523,
    favorites: 34,
  },
  {
    id: '4',
    title: 'Gaming Laptop - ASUS ROG 2023',
    price: 1200,
    city: 'Erbil',
    category: 'Computers',
    image: 'https://images.unsplash.com/photo-1588872657840-218e412ee62e?auto=format&fit=crop&w=500&q=60',
    views: 345,
    favorites: 23,
    isNew: true,
  },
  {
    id: '5',
    title: 'Vintage Wooden Dining Set',
    price: 800,
    city: 'Baghdad',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=60',
    views: 412,
    favorites: 18,
  },
  {
    id: '6',
    title: 'Smart TV 55 inch 4K LG',
    price: 650,
    city: 'Baghdad',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=60',
    views: 678,
    favorites: 45,
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const filteredListings = LISTINGS.filter(listing => {
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    const matchesSearch = !searchQuery || listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Buy & Sell Locally
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              Find great deals on anything you want or sell what you don't need. Connect with your community safely and easily.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg-glow p-2 max-w-2xl">
              <input
                type="text"
                placeholder="Search for items, locations, or sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-secondary-900 rounded-lg focus:outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-primary-100 sticky top-16 z-30 shadow-md-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
                !selectedCategory
                  ? 'bg-gradient-primary text-white shadow-md-glow'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-primary text-white shadow-md-glow'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredListings.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-secondary-500 text-xl font-medium">No listings found</p>
            <p className="text-secondary-400 mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold gradient-text">Popular Listings</h2>
              <p className="text-secondary-600">Showing {filteredListings.length} results</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, idx) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="card card-hover group animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-48 bg-secondary-200 rounded-lg mb-4">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {listing.isNew && (
                        <span className="badge-primary bg-accent-green text-white px-3 py-1 text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                      <span className="badge bg-secondary-900/80 text-white">{listing.category}</span>
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(listing.id, e)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                    >
                      <svg
                        className={`w-5 h-5 transition-colors ${favorites.has(listing.id) ? 'fill-accent-red text-accent-red' : 'text-secondary-400'}`}
                        fill={favorites.has(listing.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="font-bold text-lg text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {listing.title}
                    </h3>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold gradient-text">
                        ${listing.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-secondary-600 mb-4 pb-4 border-b border-secondary-100">
                      <span className="flex items-center gap-1">
                        📍 {listing.city}
                      </span>
                      <span className="flex items-center gap-1">
                        👁️ {listing.views}
                      </span>
                    </div>
                    
                    <button className="btn-primary w-full text-sm">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 animate-fade-in">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', title: 'Browse & Search', desc: 'Find exactly what you\'re looking for using our easy search and filters.' },
              { icon: '💬', title: 'Connect & Chat', desc: 'Message sellers directly to ask questions and negotiate prices.' },
              { icon: '✅', title: 'Buy or Sell', desc: 'Complete your transaction safely and securely.' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-primary-100 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
