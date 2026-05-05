'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

export function Card({ hoverable = false, children, className = '', ...props }: CardProps) {
  const cardClasses = `bg-white rounded-lg shadow-md-glow p-6 transition-all duration-300 ${hoverable ? 'hover:shadow-lg-glow hover:-translate-y-1 cursor-pointer' : ''} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
}

export function Badge({ variant = 'primary', children }: BadgeProps) {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    neutral: 'bg-secondary-100 text-secondary-700',
  };

  return (
    <span className={`badge ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      <input className="input-base" {...props} />
      {error && (
        <p className="text-xs text-accent-red mt-1">{error}</p>
      )}
    </div>
  );
}
