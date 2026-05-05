'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OTP() {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    if (otp === '000000') {
      setVerified(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setError('Invalid OTP. Use demo code: 000000');
    }
  };

  const handleResend = async () => {
    setResending(true);
    // Simulate API call
    setTimeout(() => {
      setCountdown(300);
      setResending(false);
      setOtp('');
      setError('');
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-6">Your email has been successfully verified.</p>
            <p className="text-sm text-gray-500">Redirecting to marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4">
            MP
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
          <p className="text-gray-600 mt-2">Enter the code we sent to your email</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-center text-3xl tracking-widest font-bold"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">Demo code: 000000</p>
            </div>

            {/* Countdown */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Code expires in:</p>
              <p className={`text-2xl font-bold ${countdown < 60 ? 'text-red-600' : 'text-teal-600'}`}>
                {formatTime(countdown)}
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50"
            >
              Verify Email
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            {countdown === 0 ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50"
              >
                {resending ? 'Resending...' : 'Resend Code'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                You can resend in {formatTime(countdown)}
              </p>
            )}
          </div>

          {/* Back Button */}
          <Link
            href="/login"
            className="block w-full text-center text-gray-600 hover:text-gray-900 font-medium py-3 mt-6 border-t"
          >
            ← Back to Login
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold mb-4">FAQs</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Why didn't I receive the code?</p>
              <p className="text-gray-600">Check your spam folder or request a new code</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Can I change my email?</p>
              <p className="text-gray-600">Contact support to update your email address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
