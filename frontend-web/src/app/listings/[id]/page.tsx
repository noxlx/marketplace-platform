'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock listing data
const MOCK_LISTING = {
  id: '1',
  title: 'Toyota Land Cruiser GXR 2021',
  price: 58500,
  city: 'Baghdad',
  category: 'Cars',
  description: 'This is a premium Toyota Land Cruiser GXR 2021 model in excellent condition. The vehicle has been well-maintained with full service history. Features include leather interior, advanced safety systems, and 4WD capability.',
  image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
  images: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c3ca4b8d0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517521434424-4c07d41f62f4?auto=format&fit=crop&w=800&q=80',
  ],
  views: 1240,
  favorites: 86,
  postedDays: 3,
  seller: {
    name: 'Karrar Motors',
    rating: 4.8,
    reviews: 127,
    phone: '+964 7...',
  },
  details: {
    'Year': '2021',
    'Mileage': '15,000 km',
    'Transmission': 'Automatic',
    'Fuel Type': 'Petrol',
    'Color': 'Silver',
  },
};

export default function ListingDetail() {
  const params = useParams();
  const listingId = params.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <span>{MOCK_LISTING.category}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{MOCK_LISTING.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-gray-200 h-96 relative">
                <img
                  src={MOCK_LISTING.image}
                  alt={MOCK_LISTING.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 bg-white rounded-full p-3 shadow hover:shadow-lg">
                  <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 p-4 bg-gray-100">
                {MOCK_LISTING.images.map((img, i) => (
                  <button key={i} className="w-20 h-20 border-2 border-transparent rounded hover:border-teal-600">
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Price */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{MOCK_LISTING.title}</h1>
                  <p className="text-2xl font-bold text-teal-600">${MOCK_LISTING.price.toLocaleString()}</p>
                </div>
                <span className="text-sm text-gray-500">Posted {MOCK_LISTING.postedDays} days ago</span>
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span>📍 {MOCK_LISTING.city}</span>
                <span>👁️ {MOCK_LISTING.views} views</span>
                <span>❤️ {MOCK_LISTING.favorites} favorites</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{MOCK_LISTING.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(MOCK_LISTING.details).map(([key, value]) => (
                  <div key={key} className="border-b pb-3">
                    <p className="text-sm text-gray-600">{key}</p>
                    <p className="font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Card */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-20">
              <h3 className="text-lg font-bold mb-4">Seller</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {MOCK_LISTING.seller.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{MOCK_LISTING.seller.name}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{MOCK_LISTING.seller.rating} ({MOCK_LISTING.seller.reviews})</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition mb-2 font-medium">
                Contact Seller
              </button>
              
              <button className="w-full border-2 border-teal-600 text-teal-600 py-2 rounded-lg hover:bg-teal-50 transition font-medium">
                Send Message
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">Phone {MOCK_LISTING.seller.phone}</p>
            </div>

            {/* Report Ad */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <button className="w-full text-red-600 hover:text-red-700 text-sm font-medium py-2">
                Report This Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
