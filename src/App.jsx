import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardModule } from './components/dashboard/DashboardModule';
import { BookingModule } from './components/booking/BookingModule';
import { POSModule } from './components/pos/POSModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { CRMModule } from './components/crm/CRMModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { ProcurementModule } from './components/procurement/ProcurementModule';
import { SCMModule } from './components/scm/SCMModule';
import { UserManagementModule } from './components/users/UserManagementModule';
import { ReceiptModal } from './components/common/ReceiptModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent = () => {
  const { activeTab, toast } = useApp();

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'booking':
        return <BookingModule />;
      case 'pos':
        return <POSModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'scm':
        return <SCMModule />;
      case 'crm':
        return <CRMModule />;
      case 'finance':
        return <FinanceModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'users':
        return <UserManagementModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-ivory-100 overflow-hidden font-sans selection:bg-champagne-300 selection:text-charcoal-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Module Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* Global Receipt Modal */}
      <ReceiptModal />

      {/* Global Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className={`p-4 rounded-2xl shadow-luxury border flex items-start gap-3 max-w-sm ${
            toast.type === 'success' ? 'bg-charcoal-900 text-ivory-50 border-champagne-500/40' :
            toast.type === 'error' ? 'bg-rose-950 text-rose-50 border-rose-500/50' :
            'bg-charcoal-900 text-ivory-50 border-charcoal-700'
          }`}>
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-champagne-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-ivory-100">{toast.title}</div>
              <div className="text-charcoal-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
