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
}

const ALL_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Toyota Land Cruiser GXR 2021',
    price: 58500,
    city: 'Baghdad',
    category: 'Cars',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=500&q=60',
    views: 1240,
  },
  {
    id: '2',
    title: 'Modern family house',
    price: 185000,
    city: 'Erbil',
    category: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=60',
    views: 856,
  },
  {
    id: '3',
    title: 'iPhone 13 Pro 256GB',
    price: 450,
    city: 'Baghdad',
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=500&q=60',
    views: 523,
  },
  {
    id: '4',
    title: 'Gaming Laptop - ASUS ROG',
    price: 1200,
    city: 'Erbil',
    category: 'Computers',
    image: 'https://images.unsplash.com/photo-1588872657840-218e412ee62e?auto=format&fit=crop&w=500&q=60',
    views: 345,
  },
];

export default function SearchResults() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevant',
  });

  const filteredListings = ALL_LISTINGS.filter(listing => {
    const matchesQuery = !query || listing.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !filters.category || listing.category === filters.category;
    const matchesCity = !filters.city || listing.city === filters.city;
    const matchesMinPrice = !filters.minPrice || listing.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || listing.price <= parseInt(filters.maxPrice);

    return matchesQuery && matchesCategory && matchesCity && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-4">Search Results</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search listings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4">Filters</h2>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Cars">Cars</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Phones">Phones</option>
                    <option value="Computers">Computers</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Cities</option>
                    <option value="Baghdad">Baghdad</option>
                    <option value="Erbil">Erbil</option>
                    <option value="Basra">Basra</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>

                <button
                  onClick={() => setFilters({ category: '', city: '', minPrice: '', maxPrice: '', sortBy: 'relevant' })}
                  className="w-full py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <span className="font-bold">{filteredListings.length}</span> results
              </p>
            </div>

            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-teal-600">${listing.price.toLocaleString()}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{listing.category}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>📍 {listing.city}</span>
                        <span>👁️ {listing.views}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
