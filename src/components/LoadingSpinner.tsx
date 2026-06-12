import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12" id="loading-spinner">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute h-full w-full rounded-full border-4 border-indigo-100"></div>
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Loading tickets...</p>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="w-full space-y-4" id="skeleton-loader">
      <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-full"></div>
      <div className="space-y-2">
        <div className="h-16 bg-slate-50 rounded-lg animate-pulse w-full"></div>
        <div className="h-16 bg-slate-50 rounded-lg animate-pulse w-full"></div>
        <div className="h-16 bg-slate-50 rounded-lg animate-pulse w-full"></div>
      </div>
    </div>
  );
}
