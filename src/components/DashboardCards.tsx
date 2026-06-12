import React from 'react';
import { Layers, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { TicketStatus } from './StatusBadge';

interface SimplifiedTicket {
  ticketId: string;
  customerName: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
}

interface DashboardCardsProps {
  tickets: SimplifiedTicket[];
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

export default function DashboardCards({ tickets, activeFilter, onFilterChange }: DashboardCardsProps) {
  const total = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const closedCount = tickets.filter(t => t.status === 'Closed').length;

  const cards = [
    {
      id: 'All',
      title: 'Total Tickets',
      value: total,
      icon: Layers,
      color: 'border-slate-200 text-slate-400',
      bg: 'bg-indigo-50/50',
      labelColor: 'text-slate-400',
      subtext: 'Volume count',
      subtextColor: 'text-slate-400'
    },
    {
      id: 'Open',
      title: 'Open',
      value: openCount,
      icon: AlertCircle,
      color: 'border-amber-200 text-yellow-500',
      bg: 'bg-amber-50/50',
      labelColor: 'text-amber-500',
      subtext: 'Needs attention',
      subtextColor: 'text-amber-500/80'
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      value: inProgressCount,
      icon: RefreshCw,
      color: 'border-indigo-200 text-indigo-500',
      bg: 'bg-indigo-50/50',
      labelColor: 'text-indigo-500',
      subtext: 'Active now',
      subtextColor: 'text-indigo-500/80'
    },
    {
      id: 'Closed',
      title: 'Closed',
      value: closedCount,
      icon: CheckCircle,
      color: 'border-emerald-200 text-emerald-500',
      bg: 'bg-emerald-50/50',
      labelColor: 'text-emerald-500',
      subtext: 'Resolved cases',
      subtextColor: 'text-emerald-500/80'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-cards-container">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onFilterChange(card.id)}
            className={`cursor-pointer rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 select-none ${
              isSelected
                ? 'bg-indigo-900 text-white shadow-md border-indigo-950 scale-[1.01]'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pointer-events-none">
              <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-200' : card.labelColor}`}>
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${isSelected ? 'text-indigo-200 bg-indigo-950/40' : 'text-slate-400'}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2 pointer-events-none">
              <span className={`text-3xl font-extrabold tracking-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                {card.value}
              </span>
              <span className={`text-xs font-medium ${isSelected ? 'text-indigo-200/80' : card.subtextColor}`}>
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
