'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (phone.length >= 10) {
        setStep('otp');
        setLoading(false);
      } else {
        setError('Please enter a valid phone number');
        setLoading(false);
      }
    }, 500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call with demo OTP
    setTimeout(() => {
      if (otp === '000000' || otp.length === 6) {
        // Simulate successful login
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        router.push('/');
      } else {
        setError('Invalid OTP. Demo OTP is: 000000');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4">
            MP
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">Buy and sell with ease</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 'phone' ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Login with Phone</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="964 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your Iraqi mobile number</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <Link
                href="/signup"
                className="block w-full text-center text-teal-600 hover:text-teal-700 font-medium py-3 border border-teal-600 rounded-lg hover:bg-teal-50 transition"
              >
                Create New Account
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
              <p className="text-gray-600 mb-6">
                We've sent a code to <span className="font-medium">{phone}</span>
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-2xl tracking-widest text-center font-bold"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">Demo OTP: 000000</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError('');
                  setOtp('');
                }}
                className="w-full text-center text-teal-600 hover:text-teal-700 font-medium py-3 mt-4"
              >
                ← Change Phone Number
              </button>
            </>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-xs text-gray-600">
            <p>Demo credentials for testing:</p>
            <p className="font-mono mt-1">Phone: 9647735123456</p>
            <p className="font-mono">OTP: 000000</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          By logging in, you agree to our{' '}
          <a href="#" className="text-teal-600 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
