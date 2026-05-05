'use client';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-secondary-200 rounded animate-shimmer"></div>
      <div className="h-12 bg-secondary-200 rounded animate-shimmer"></div>
      <div className="h-32 bg-secondary-200 rounded animate-shimmer"></div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md-glow p-6 space-y-4">
      <div className="h-6 bg-secondary-200 rounded w-3/4 animate-shimmer"></div>
      <div className="h-4 bg-secondary-200 rounded w-full animate-shimmer"></div>
      <div className="h-4 bg-secondary-200 rounded w-5/6 animate-shimmer"></div>
    </div>
  );
}
