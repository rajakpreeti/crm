import React from 'react';
import { Eye, Clock, Calendar, User, FileText } from 'lucide-react';
import StatusBadge, { TicketStatus } from './StatusBadge';

interface SimplifiedTicket {
  ticketId: string;
  customerName: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
}

interface TicketTableProps {
  tickets: SimplifiedTicket[];
  onViewDetails: (ticketId: string) => void;
}

export default function TicketTable({ tickets, onViewDetails }: TicketTableProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs" id="ticket-table-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
              <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {tickets.map((ticket) => (
              <tr 
                key={ticket.ticketId} 
                className="hover:bg-slate-50/75 transition-colors group"
              >
                {/* Ticket ID */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-150">
                    {ticket.ticketId}
                  </span>
                </td>

                {/* Customer Name */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                      {ticket.customerName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {ticket.customerName}
                    </span>
                  </div>
                </td>

                {/* Subject */}
                <td className="px-6 py-4.5 max-w-xs md:max-w-md">
                  <div className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {ticket.subject}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Created Date */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDate(ticket.createdAt)}
                  </div>
                </td>

                {/* Action button */}
                <td className="px-6 py-4.5 whitespace-nowrap text-right">
                  <button
                    onClick={() => onViewDetails(ticket.ticketId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 active:bg-indigo-700 border border-indigo-150 hover:border-indigo-600 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
