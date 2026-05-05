'use client';

import { useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const typeStyles = {
    success: 'bg-accent-green/90 text-white',
    error: 'bg-accent-red/90 text-white',
    warning: 'bg-accent-amber/90 text-white',
    info: 'bg-primary-600/90 text-white',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg-glow flex items-center gap-3 animate-slide-up ${typeStyles[type]}`}
      role="alert"
    >
      <span className="text-xl font-bold">{typeIcons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-2 hover:opacity-75 transition"
      >
        ×
      </button>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger' }[];
}

export function Modal({ isOpen, title, children, onClose, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
        <div className="border-b border-secondary-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">
            ×
          </button>
        </div>
        
        <div className="px-6 py-4">
          {children}
        </div>
        
        {actions && (
          <div className="border-t border-secondary-200 px-6 py-4 flex justify-end gap-3">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  action.variant === 'danger'
                    ? 'bg-accent-red text-white hover:bg-red-600'
                    : action.variant === 'secondary'
                    ? 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300'
                    : 'bg-gradient-primary text-white hover:shadow-lg-glow'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg-glow border border-secondary-200 min-w-max animate-fade-in z-50">
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
