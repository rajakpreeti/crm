import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, PlusCircle, LayoutDashboard, Database, HelpCircle } from 'lucide-react';
import DashboardCards from '../components/DashboardCards';
import SearchBar from '../components/SearchBar';
import StatusFilter from '../components/StatusFilter';
import TicketTable from '../components/TicketTable';
import EmptyState from '../components/EmptyState';
import { SkeletonLoader } from '../components/LoadingSpinner';
import { TicketStatus } from '../components/StatusBadge';
import toast from 'react-hot-toast';

interface SimplifiedTicket {
  ticketId: string;
  customerName: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
}

interface DashboardViewProps {
  onNavigate: (path: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [tickets, setTickets] = useState<SimplifiedTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dbMode, setDbMode] = useState<string>('');

  // Fetch tickets with active status filter and search query
  const fetchTickets = async (showRefreshToast = false) => {
    if (showRefreshToast) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const url = `/api/tickets?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get<SimplifiedTicket[]>(url);
      const data = response.data;
      
      if (!Array.isArray(data)) {
        setTickets([]);
        setDbMode('');
        return;
      }

      setTickets(data);
      
      // Capture the database status header from headers
      const modeHeader = response.headers['x-database-mode'] || '';
      setDbMode(modeHeader);

      if (showRefreshToast) {
        toast.success(`Synchronized: Running on ${modeHeader || 'System Engine'}`, { id: 'sync' });
      }
    } catch (err: any) {
      console.error(err);
      setTickets([]);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'System failed to load tickets';
      toast.error(errorMessage, { id: 'fetch-err' });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Trigger search and status filter fetches
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTickets();
    }, 250); // Small debounce for search inputs to prevent overwhelming MongoDB connection

    return () => clearTimeout(delayDebounce);
  }, [statusFilter, searchQuery]);

  // Quick reset helper
  const handleClearFilters = () => {
    setStatusFilter('All');
    setSearchQuery('');
    toast.success('Filters cleared successfully');
  };

  return (
    <div className="space-y-6" id="dashboard-view-wrapper">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Operations Command</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time ticketing overview, customer inquiries, and engineering response escalations.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => fetchTickets(true)}
            disabled={isRefreshing || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 active:bg-slate-100 rounded-lg shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Database Mode Warning / Notice Banner */}
      {dbMode === 'In-Memory Demo Sandbox' && (
        <div className="bg-amber-50/75 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-800 animate-fade-in">
          <div className="flex gap-2.5 items-start sm:items-center">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 mt-1 sm:mt-0 animate-pulse" />
            <div className="text-xs">
              <span className="font-bold block">Local Sandbox Mode Activated</span>
              <span className="text-amber-700 font-medium">
                The <code className="bg-amber-100/90 font-mono text-[11px] px-1.5 py-0.5 rounded border border-amber-200">MONGODB_URI</code> environment key is currently unspecified. The backend is running on a high-fidelity in-memory database prepopulated with demo tickets. Full ticketing CRUD operations, status state changes, and staff resolution logs are active.
              </span>
            </div>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 rounded-md px-2.5 py-1 select-none">
            Interactive Test Drive
          </div>
        </div>
      )}

      {/* Real-time Dashboard Stats summary */}
      <DashboardCards
        tickets={tickets}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Filtration & Search Dashboard Operations bar */}
      <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-2xl flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <div className="flex gap-3 items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:inline">Status:</span>
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      {/* Grid Content: Main Table */}
      {loading ? (
        <SkeletonLoader />
      ) : tickets.length > 0 ? (
        <TicketTable
          tickets={tickets}
          onViewDetails={(ticketId) => onNavigate(`/ticket/${ticketId}`)}
        />
      ) : (
        <EmptyState
          onClearFilters={handleClearFilters}
          showCreateButton={true}
          onCreateClick={() => onNavigate('/create-ticket')}
        />
      )}
    </div>
  );
}
