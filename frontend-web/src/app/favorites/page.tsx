'use client';

import Link from 'next/link';

interface FavoriteListing {
  id: string;
  title: string;
  price: number;
  city: string;
  category: string;
  image: string;
  isSaved: boolean;
}

const FAVORITES: FavoriteListing[] = [
  {
    id: '1',
    title: 'Toyota Land Cruiser GXR 2021',
    price: 58500,
    city: 'Baghdad',
    category: 'Cars',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=500&q=60',
    isSaved: true,
  },
  {
    id: '2',
    title: 'Modern family house near Erbil Citadel',
    price: 185000,
    city: 'Erbil',
    category: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=60',
    isSaved: true,
  },
  {
    id: '6',
    title: 'Smart TV 55 inch 4K LG',
    price: 650,
    city: 'Baghdad',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=60',
    isSaved: true,
  },
];

export default function Favorites() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Saved Listings</h1>
          <p className="text-gray-600">You have {FAVORITES.length} saved listings</p>
        </div>

        {FAVORITES.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="text-xl font-bold mb-2">No saved listings yet</h2>
            <p className="text-gray-600 mb-6">Start saving listings to compare later</p>
            <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
              Browse Listings →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FAVORITES.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
                <div className="relative overflow-hidden h-48 bg-gray-200">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <button className="absolute top-2 right-2 bg-white rounded-full p-2 text-red-600 hover:bg-red-50">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-teal-600">${listing.price.toLocaleString()}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{listing.category}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>📍 {listing.city}</span>
                  </div>
                  
                  <Link href={`/listings/${listing.id}`} className="w-full block text-center bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
