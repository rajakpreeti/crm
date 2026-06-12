import React from 'react';

export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

interface StatusBadgeProps {
  status: TicketStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let dotClass = '';

  switch (status) {
    case 'Open':
      bgClass = 'bg-amber-50';
      textClass = 'text-amber-700';
      borderClass = 'border-amber-200';
      dotClass = 'bg-amber-500';
      break;
    case 'In Progress':
      bgClass = 'bg-indigo-50';
      textClass = 'text-indigo-700';
      borderClass = 'border-indigo-200';
      dotClass = 'bg-indigo-600';
      break;
    case 'Closed':
      bgClass = 'bg-emerald-50';
      textClass = 'text-emerald-700';
      borderClass = 'border-emerald-200';
      dotClass = 'bg-emerald-500';
      break;
    default:
      bgClass = 'bg-slate-50';
      textClass = 'text-slate-700';
      borderClass = 'border-slate-200';
      dotClass = 'bg-slate-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${bgClass} ${textClass} ${borderClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
}
