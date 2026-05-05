'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Karrar',
    lastName: 'Hassan',
    email: 'karrar@example.com',
    phone: '+964 770 123 4567',
    city: 'Baghdad',
    bio: 'Professional seller with verified account. Quick responses and fair pricing.',
  });

  const [formData, setFormData] = useState(profileData);

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">
                {profileData.firstName} {profileData.lastName}
              </h2>
              
              <div className="flex justify-center items-center gap-2 mb-6">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-600">(4.8) 127 reviews</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 w-20">Status:</span>
                  <span className="text-green-600 font-semibold">✓ Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 w-20">Member:</span>
                  <span>Since 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 w-20">Response:</span>
                  <span>&lt; 1 hour</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 transition py-2 rounded-lg">
                Change Password
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Listings</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-bold">145</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Page Views</span>
                  <span className="font-bold">3,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-bold">89</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {!isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-lg font-medium">{profileData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="text-lg font-medium">{profileData.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <p className="text-lg font-medium">{profileData.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Bio</label>
                    <p className="text-lg font-medium">{profileData.bio}</p>
                  </div>
                </div>
              ) : (
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(profileData);
                        setIsEditing(false);
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Link href="/listings/my-listings" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-bold mb-1">My Listings</h3>
                <p className="text-gray-600 text-sm">Manage your active listings</p>
              </Link>

              <Link href="/favorites" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-3xl mb-3">❤️</div>
                <h3 className="font-bold mb-1">Favorites</h3>
                <p className="text-gray-600 text-sm">View your saved listings</p>
              </Link>

              <Link href="/chat" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold mb-1">Messages</h3>
                <p className="text-gray-600 text-sm">Chat with buyers and sellers</p>
              </Link>

              <button className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-left">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="font-bold mb-1">Settings</h3>
                <p className="text-gray-600 text-sm">Account preferences</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
