'use client';

import { useState } from 'react';

interface Report {
  id: string;
  type: string;
  user: string;
  reason: string;
  status: string;
  createdAt: string;
}

const REPORTS: Report[] = [
  {
    id: '1',
    type: 'Listing',
    user: 'Ahmed Hassan',
    reason: 'Fake listing - item already sold',
    status: 'pending',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    type: 'User',
    user: 'Sara Mohammed',
    reason: 'Fraudulent seller - non-payment',
    status: 'pending',
    createdAt: '5 hours ago',
  },
  {
    id: '3',
    type: 'Listing',
    user: 'Omar Al-Rashid',
    reason: 'Offensive content',
    status: 'resolved',
    createdAt: '1 day ago',
  },
];

export default function AdminDashboard() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState(REPORTS);

  const handleResolve = (id: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
    setSelectedReport(null);
  };

  const stats = [
    { label: 'Total Users', value: '12,847', change: '+320 this week', icon: '👥' },
    { label: 'Active Listings', value: '5,234', change: '+145 today', icon: '📋' },
    { label: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length.toString(), change: 'Need action', icon: '⚠️' },
    { label: 'Revenue (30d)', value: '$24,580', change: '+15% vs last month', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-teal-100 mt-2">Platform overview and moderation tools</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Reports Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Pending Reports</h2>
              
              {reports.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No pending reports</p>
              ) : (
                <div className="space-y-3">
                  {reports.filter(r => r.status === 'pending').map(report => (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-teal-500 cursor-pointer transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex gap-2 mb-2">
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {report.type}
                            </span>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                              PENDING
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{report.user}</p>
                          <p className="text-sm text-gray-600 mt-1">{report.reason}</p>
                          <p className="text-xs text-gray-500 mt-2">{report.createdAt}</p>
                        </div>
                        <span className="text-2xl">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Users</h2>
              <div className="space-y-3">
                {['Mohammed Ahmed', 'Layla Hassan', 'Tariq Al-Rashid', 'Fatima Omar', 'Karim Al-Bakr'].map((name, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-full text-white flex items-center justify-center text-xs font-bold">
                        {name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    <span className="text-xs text-gray-500">Joined today</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Report Details */}
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Report Details</h3>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Type</p>
                    <p className="font-medium">{selectedReport.type}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Reported User</p>
                    <p className="font-medium">{selectedReport.user}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Reason</p>
                    <p className="font-medium">{selectedReport.reason}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedReport.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {selectedReport.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Report Date</p>
                    <p className="font-medium">{selectedReport.createdAt}</p>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    {selectedReport.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleResolve(selectedReport.id)}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          Approve & Resolve
                        </button>
                        <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium">
                          Dismiss Report
                        </button>
                      </>
                    )}
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                      View User Profile
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-600">Select a report to view details</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded transition">
                  🔒 Ban User
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded transition">
                  🗑️ Delete Listing
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded transition">
                  📧 Send Message
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded transition">
                  📊 View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
