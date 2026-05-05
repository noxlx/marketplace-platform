'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  status: string;
  views: number;
  image: string;
  createdAt: string;
}

const MY_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Toyota Land Cruiser GXR 2021',
    price: 58500,
    city: 'Baghdad',
    status: 'active',
    views: 1240,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=500&q=60',
    createdAt: '3 days ago',
  },
  {
    id: '2',
    title: 'Gaming Laptop - ASUS ROG',
    price: 1200,
    city: 'Erbil',
    status: 'active',
    views: 456,
    image: 'https://images.unsplash.com/photo-1588872657840-218e412ee62e?auto=format&fit=crop&w=500&q=60',
    createdAt: '7 days ago',
  },
  {
    id: '3',
    title: 'iPhone 13 Pro',
    price: 450,
    city: 'Baghdad',
    status: 'sold',
    views: 892,
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=500&q=60',
    createdAt: '15 days ago',
  },
];

export default function MyListings() {
  const [filter, setFilter] = useState('all');

  const filteredListings = filter === 'all' 
    ? MY_LISTINGS 
    : MY_LISTINGS.filter(l => l.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'sold': return 'bg-blue-100 text-blue-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your active and sold listings</p>
          </div>
          <Link
            href="/listings/create"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-medium"
          >
            + Post New Listing
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'sold', 'expired'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && ` (${MY_LISTINGS.filter(l => l.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-bold mb-2">No listings</h2>
            <p className="text-gray-600 mb-6">Create your first listing to get started</p>
            <Link href="/listings/create" className="text-teal-600 hover:text-teal-700 font-medium">
              Create Listing →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-teal-600"
                    >
                      {listing.title}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(listing.status)}`}>
                      {listing.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-teal-600 font-bold text-lg mb-2">
                    ${listing.price.toLocaleString()}
                  </div>

                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>📍 {listing.city}</span>
                    <span>👁️ {listing.views} views</span>
                    <span>⏰ {listing.createdAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center">
                  <button className="p-2 hover:bg-gray-100 rounded transition" title="Edit">
                    ✏️
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition" title="More options">
                    ⋮
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
