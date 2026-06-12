import React from 'react';
import { Ticket, PlusCircle, LayoutDashboard, Database } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo and Brand Title */}
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  support-crm
                </span>
                <span className="ml-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest block leading-none">
                  SaaS Backoffice
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onNavigate('/')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/' 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => onNavigate('/create-ticket')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/create-ticket' 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Create Ticket
              </button>
            </div>
          </div>

          {/* Quick Action Button & Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active System
            </div>
            
            <button
              onClick={() => onNavigate('/create-ticket')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              New Ticket
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
