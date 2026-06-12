import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, MessageSquare, Clock, Calendar, Mail, User, ShieldAlert, BadgeCheck, FileText, Plus, Loader2 } from 'lucide-react';
import StatusBadge, { TicketStatus } from '../components/StatusBadge';
import { SkeletonLoader } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface INote {
  noteText: string;
  createdAt: string;
}

interface TicketDetail {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  notes: INote[];
  createdAt: string;
  updatedAt: string;
}

interface TicketDetailViewProps {
  ticketId: string;
  onNavigate: (path: string) => void;
}

export default function TicketDetailView({ ticketId, onNavigate }: TicketDetailViewProps) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Update state fields
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>('Open');
  const [newNote, setNewNote] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch complete details of a single ticket
  const fetchTicketDetails = async (isQuiet = false) => {
    if (!isQuiet) setLoading(true);
    try {
      const response = await axios.get<TicketDetail>(`/api/tickets/${ticketId}`);
      setTicket(response.data);
      // Synchronize input fields with fetched data
      setSelectedStatus(response.data.status);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to retrieve ticket info';
      toast.error(errMsg);
    } finally {
      if (!isQuiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  // Form submit handler for committing updates
  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const progressToast = toast.loading('Syncing customer case update...');

    try {
      await axios.put(`/api/tickets/${ticketId}`, {
        status: selectedStatus,
        noteText: newNote.trim() !== '' ? newNote.trim() : undefined
      });

      toast.success('Ticket synchronized with MongoDB Atlas!', { id: progressToast });
      setNewNote(''); // Clear note input
      await fetchTicketDetails(true); // Quietly refresh the UI logs
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to update ticket status';
      toast.error(`Error: ${errMsg}`, { id: progressToast });
    } finally {
      setIsUpdating(false);
    }
  };

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6" id="detail-loader">
        <button onClick={() => onNavigate('/')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Dashboard Overview
        </button>
        <SkeletonLoader />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4" id="detail-not-found">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Support Ticket Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested ticket ID "{ticketId}" does not exist in our active database tables.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 px-4  py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard Overview
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6" id="ticket-detail-view-container">
      {/* Return Navigation Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Return to Dashboard
        </button>
        
        <div className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg">
          Last Synced: {formatDate(ticket.updatedAt)}
        </div>
      </div>

      {/* Main Ticket ID Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
              {ticket.ticketId}
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">{ticket.subject}</h1>
          <p className="text-xs text-slate-450 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Created: {formatDate(ticket.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Modified: {formatDate(ticket.updatedAt)}
            </span>
          </p>
        </div>
      </div>

      {/* Grid Layout: Ticket details & update controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left/Middle Column (2 out of 3) - Core content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Metadata & Case description card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-3xs">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Inquirer & Case Profile</h2>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-4 border border-slate-150 rounded-xl">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Primary Customer
                </span>
                <p className="text-sm font-bold text-slate-900">{ticket.customerName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  Customer Email
                </span>
                <a 
                  href={`mailto:${ticket.customerEmail}`}
                  className="text-sm font-bold text-indigo-650 hover:underline hover:text-indigo-700 transition-colors"
                >
                  {ticket.customerEmail}
                </a>
              </div>
            </div>

            {/* Complete original customer description report */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Problem Description
              </span>
              <div className="p-4.5 bg-slate-50/20 border border-slate-200 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </div>
            </div>
          </div>

          {/* Historical Support Logs Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-3xs">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                Case History & Staff Notes
              </h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-150">
                {ticket.notes.length} Notes Left
              </span>
            </div>

            {/* Scrollable list of past comments */}
            {ticket.notes.length > 0 ? (
              <div className="space-y-4">
                {ticket.notes.map((note, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 hover:border-slate-250 transition-colors space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[9px]">
                          ST
                        </div>
                        Staff Agent Notes
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-6 border-l-2 border-indigo-200">
                      {note.noteText}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl space-y-2">
                <MessageSquare className="w-7 h-7 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">No previous comments or escalation logs filed to this ticket.</p>
                <p className="text-[10px] text-slate-400">Add notes via the Side Panel to initialize diagnostic logs.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 out of 3) - Actions & status modifiers */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">CRM Control Action</h2>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-5">
              {/* Status selectors */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Set Ticket Status</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {(['Open', 'In Progress', 'Closed'] as TicketStatus[]).map((status) => {
                    const isSelected = selectedStatus === status;
                    let activeStyles = '';

                    switch (status) {
                      case 'Open':
                        activeStyles = isSelected ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-200 shadow-md shadow-amber-100' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700 border-slate-200';
                        break;
                      case 'In Progress':
                        activeStyles = isSelected ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-200 shadow-md shadow-blue-100' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 border-slate-200';
                        break;
                      case 'Closed':
                        activeStyles = isSelected ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200 shadow-md shadow-emerald-100' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200';
                        break;
                    }

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setSelectedStatus(status)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-between ${activeStyles}`}
                      >
                        <span>{status}</span>
                        {isSelected && <BadgeCheck className="w-4 h-4 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note addition */}
              <div className="space-y-2 pt-1">
                <label htmlFor="newNote" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Add Resolution Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="newNote"
                  rows={4}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter diagnostic logs, actions taken, or dynamic updates to append to this support case..."
                  disabled={isUpdating}
                  className="w-full p-3 text-xs bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden rounded-xl text-slate-800 transition-colors shadow-2xs resize-none disabled:bg-slate-50"
                />
              </div>

              {/* Submit update trigger */}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors disabled:opacity-55 cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating database...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Commit Case Updates
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
