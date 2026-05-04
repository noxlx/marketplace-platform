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

  const filteredListings = LISTINGS.filter(listing => {
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    const matchesSearch = !searchQuery || listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Buy & Sell Locally</h1>
          <p className="text-lg text-teal-100 mb-8">Find great deals on anything you want or sell what you don't need</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                !selectedCategory
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  selectedCategory === cat.name
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
              >
                <div className="relative overflow-hidden h-48 bg-gray-200">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-teal-600">${listing.price.toLocaleString()}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{listing.category}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>📍 {listing.city}</span>
                    <span>👁️ {listing.views}</span>
                  </div>
                  
                  <button className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition font-medium">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-bold text-lg mb-2">Browse & Search</h3>
              <p className="text-gray-600">Find exactly what you're looking for using our easy search and filters.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-lg mb-2">Connect & Chat</h3>
              <p className="text-gray-600">Message sellers directly to ask questions and negotiate prices.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-2">Buy or Sell</h3>
              <p className="text-gray-600">Complete your transaction safely and securely.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
