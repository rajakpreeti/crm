import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import DashboardView from './pages/DashboardView';
import CreateTicketView from './pages/CreateTicketView';
import TicketDetailView from './pages/TicketDetailView';

export default function App() {
  // Capture initial URL pathname (e.g. / or /create-ticket or /ticket/TKT-001)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Listen to popstate event (navigating back or forward using web browser controls)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Soft navigation trigger that pushes route state onto browser history
  const handleNavigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  // Extract ticketId from path matching e.g., /ticket/TKT-001
  const ticketIdMatch = currentPath.match(/^\/ticket\/([a-zA-Z0-9-]+)/);
  const matchedTicketId = ticketIdMatch ? ticketIdMatch[1] : null;

  // Render correct subview matching path
  const renderView = () => {
    if (currentPath === '/') {
      return <DashboardView onNavigate={handleNavigate} />;
    } else if (currentPath === '/create-ticket') {
      return <CreateTicketView onNavigate={handleNavigate} />;
    } else if (matchedTicketId) {
      return <TicketDetailView ticketId={matchedTicketId} onNavigate={handleNavigate} />;
    } else {
      // Fallback/NotFound handles redirecting to dashboard gracefully
      return (
        <div className="text-center py-12 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500">The path you requested does not exist in support-crm route state.</p>
          <button
            onClick={() => handleNavigate('/')}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Go back to Dashboard
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans" id="app-root-container">
      {/* Toast Notification Container */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
          },
          success: {
            iconTheme: {
              primary: '#4f46e5',
              secondary: '#ffffff',
            },
          }
        }}
      />

      {/* Global Navbar */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Content Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="animate-fade-in">
          {renderView()}
        </div>
      </main>

      {/* App foot */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} support-crm Ticketing Backoffice. All rights reserved.</span>
          <span className="flex items-center justify-center gap-1.5 hover:text-slate-600 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Connected to Atlas Cluster
          </span>
        </div>
      </footer>
    </div>
  );
}
