import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Iraqi Marketplace',
  description: 'A classified marketplace for listings, search, chat, and local deals.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-secondary-50 to-primary-50">
        {/* Header/Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-primary-100 shadow-md-glow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md-glow group-hover:shadow-lg-glow transition-all">
                  <span className="text-white font-bold text-lg">🏪</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent hidden sm:inline">Marketplace</span>
              </Link>

              {/* Search Bar - Desktop */}
              <div className="hidden md:flex flex-1 max-w-md mx-6">
                <div className="relative w-full group">
                  <input
                    type="text"
                    placeholder="Search listings..."
                    className="w-full px-4 py-2 border border-primary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300 transition-colors"
                  />
                  <svg className="absolute right-3 top-2.5 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
              </div>

              {/* Right Navigation */}
              <nav className="flex items-center gap-4">
                {/* Create Button */}
                <Link
                  href="/listings/create"
                  className="hidden sm:flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg-glow transition-all duration-300 hover:scale-105 font-medium"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Post</span>
                </Link>

                {/* Icons */}
                <button className="p-2.5 hover:bg-primary-100 rounded-lg transition-colors duration-200 relative group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary-700 group-hover:text-primary-700">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-red rounded-full animate-pulse-glow"></span>
                </button>

                <Link href="/favorites" className="p-2.5 hover:bg-primary-100 rounded-lg transition-colors duration-200 group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary-700 group-hover:text-accent-red">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </Link>

                <Link href="/chat" className="p-2.5 hover:bg-primary-100 rounded-lg transition-colors duration-200 group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary-700 group-hover:text-primary-700">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </Link>

                <Link href="/profile" className="p-2.5 hover:bg-primary-100 rounded-lg transition-colors duration-200 group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary-700 group-hover:text-primary-700">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Link>
              </nav>
            </div>

            {/* Search Bar - Mobile */}
            <div className="md:hidden pb-3 animate-fade-in">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <svg className="absolute right-3 top-2.5 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 text-secondary-300 mt-20 border-t border-primary-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="group">
                <h3 className="text-white font-semibold mb-4 group-hover:text-primary-400 transition-colors">Browse</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">All Categories</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Popular</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Recently Added</a></li>
                </ul>
              </div>
              <div className="group">
                <h3 className="text-white font-semibold mb-4 group-hover:text-primary-400 transition-colors">Selling</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Post Listing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">My Listings</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div className="group">
                <h3 className="text-white font-semibold mb-4 group-hover:text-primary-400 transition-colors">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                </ul>
              </div>
              <div className="group">
                <h3 className="text-white font-semibold mb-4 group-hover:text-primary-400 transition-colors">About</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-secondary-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-secondary-400">&copy; 2026 Iraqi Marketplace. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
