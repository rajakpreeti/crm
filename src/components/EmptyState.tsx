import React from 'react';
import { FileQuestion, Plus } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters?: () => void;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export default function EmptyState({ onClearFilters, showCreateButton = false, onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm" id="empty-state">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
        <FileQuestion className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">No Tickets Found</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        We couldn't find any tickets matching your search query or status filters. Try adjusting your search criteria.
      </p>
      
      <div className="mt-5 flex gap-3">
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
        
        {showCreateButton && onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </button>
        )}
      </div>
    </div>
  );
}
