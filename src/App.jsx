import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AuthModule } from './components/auth/AuthModule';
import { DashboardModule } from './components/dashboard/DashboardModule';
import { BookingModule } from './components/booking/BookingModule';
import { PriceListModule } from './components/pricelist/PriceListModule';
import { POSModule } from './components/pos/POSModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { CRMModule } from './components/crm/CRMModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { ProcurementModule } from './components/procurement/ProcurementModule';
import { SCMModule } from './components/scm/SCMModule';
import { UserManagementModule } from './components/users/UserManagementModule';
import { ReceiptModal } from './components/common/ReceiptModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent = () => {
  const { activeTab, toast, isAuthenticated } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <AuthModule />
        <Toast toast={toast} />
      </>
    );
  }

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'booking':
        return <BookingModule />;
      case 'pricelist':
        return <PriceListModule />;
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
    <div className="flex h-screen min-h-screen overflow-hidden font-sans">
      <Sidebar mobileOpen={mobileMenu} onClose={() => setMobileMenu(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMenu={() => setMobileMenu(true)} />
        <main className="flex-1 overflow-y-auto scroll-thin">
          <div className="max-w-7xl mx-auto p-4 md:p-7">
            <div key={activeTab} className="animate-fadeUp">
              {renderModule()}
            </div>
          </div>
        </main>
      </div>

      <ReceiptModal />
      <Toast toast={toast} />
    </div>
  );
};

const Toast = ({ toast }) => {
  if (!toast) return null;
  const styles = {
    success: { wrap: 'bg-charcoal-900/95 border-emerald-400/30', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
    error: { wrap: 'bg-charcoal-900/95 border-rose-400/40', icon: <AlertCircle className="w-5 h-5 text-rose-400" /> },
    info: { wrap: 'bg-charcoal-900/95 border-blue-400/30', icon: <Info className="w-5 h-5 text-blue-400" /> },
  }[toast.type] || { wrap: 'bg-charcoal-900/95 border-white/10', icon: <Info className="w-5 h-5 text-white/70" /> };

  return (
    <div className="fixed bottom-5 right-5 z-[60] animate-in fade-in slide-in-from-bottom-5">
      <div className={`p-4 rounded-2xl shadow-luxury border flex items-start gap-3 max-w-sm backdrop-blur ${styles.wrap}`}>
        <div className="shrink-0 mt-0.5">{styles.icon}</div>
        <div className="flex-1 text-xs">
          <div className="font-bold text-white">{toast.title}</div>
          <div className="text-white/60 mt-0.5 leading-snug">{toast.message}</div>
        </div>
      </div>
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
