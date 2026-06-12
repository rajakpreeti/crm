import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, User, Mail, FileText, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateTicketViewProps {
  onNavigate: (path: string) => void;
}

export default function CreateTicketView({ onNavigate }: CreateTicketViewProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (!customerName.trim()) {
      toast.error('Customer Name is required');
      return;
    }
    if (!customerEmail.trim()) {
      toast.error('Customer Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }

    setIsSubmitting(true);
    const loadToast = toast.loading('Filing support ticket on MongoDB Atlas...');

    try {
      const response = await axios.post('/api/tickets', {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        subject: subject.trim(),
        description: description.trim()
      });

      const { ticketId } = response.data;
      toast.success(`Ticket ${ticketId} successfully created!`, { id: loadToast });
      
      // Reset Form fields
      setCustomerName('');
      setCustomerEmail('');
      setSubject('');
      setDescription('');

      // Redirect to home page
      onNavigate('/');
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to file customer ticket';
      toast.error(`Error: ${errMsg}`, { id: loadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="create-ticket-view">
      {/* Return Navigation bar */}
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Return to Dashboard
      </button>

      {/* Header Panel */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Support Ticket</h1>
        <p className="text-sm text-slate-500 mt-1">
          Open a new case for customer support. All required fields will compile to generate a unique system ticket code automatically.
        </p>
      </div>

      {/* Main card form containing fields */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name field */}
            <div className="space-y-1.5">
              <label htmlFor="customerName" className="text-sm font-semibold text-slate-700 block">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  id="customerName"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Preeti Rajak"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden rounded-xl text-slate-800 transition-colors shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Customer Email field */}
            <div className="space-y-1.5">
              <label htmlFor="customerEmail" className="text-sm font-semibold text-slate-700 block">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="customerEmail"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. rajakpreeti462@gmail.com"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden rounded-xl text-slate-800 transition-colors shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Subject field */}
          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-sm font-semibold text-slate-700 block">
              Subject <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Unable to process payments at checkout"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden rounded-xl text-slate-800 transition-colors shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          {/* Description field */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700 block">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue or inquiry in detail so support engineering can resolve it..."
              disabled={isSubmitting}
              className="w-full px-4 py-3 text-sm bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden rounded-xl text-slate-800 transition-colors shadow-2xs disabled:bg-slate-50 disabled:text-slate-400 resize-none"
            />
          </div>

          {/* Action submission buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-800 hover:bg-slate-55 rounded-xl border border-slate-200 transition-colors disabled:opacity-55 cursor-pointer"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors disabled:opacity-55 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Ticket...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
