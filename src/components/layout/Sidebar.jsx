import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBag,
  Package,
  Users,
  Coins,
  Truck,
  Warehouse,
  Tags,
  ShieldCheck,
  Clock,
  Sparkles,
  Scissors,
  RotateCcw
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, userRole, salonProfile, resetAllData, products, appointments, requisitions } = useApp();

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['owner', 'admin', 'staff'] },
    { id: 'booking', label: 'Booking & Jadwal', icon: CalendarDays, roles: ['owner', 'admin', 'staff'], badge: appointments.filter(a => a.status === 'pending').length },
    { id: 'pos', label: 'Kasir POS', icon: ShoppingBag, roles: ['owner', 'admin'] },
    { id: 'pricelist', label: 'Price List', icon: Tags, roles: ['owner', 'admin', 'staff'] },
    { id: 'inventory', label: 'Inventaris & FIFO', icon: Package, roles: ['owner', 'admin'], badge: products.filter(p => p.currentStock <= p.minStock).length, badgeColor: 'bg-rose-500' },
    { id: 'scm', label: 'SCM & Gudang', icon: Warehouse, roles: ['owner', 'admin'], badge: requisitions.filter(r => r.status === 'pending').length },
    { id: 'crm', label: 'CRM Pelanggan', icon: Users, roles: ['owner', 'admin'] },
    { id: 'finance', label: 'Keuangan & Laba', icon: Coins, roles: ['owner'] }, // Owner only
    { id: 'procurement', label: 'Supplier & PO', icon: Truck, roles: ['owner', 'admin'] },
    { id: 'users', label: 'Manajemen Staf', icon: ShieldCheck, roles: ['owner', 'admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  // Determine current operating status
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMins = hour * 60 + minute;

  const isMonday = day === 1;
  const openMins = 11 * 60;
  const closeMins = isMonday ? 16 * 60 : 21 * 60;
  const lastOrderMins = isMonday ? 15 * 60 : 20 * 60;

  const isOpen = currentMins >= openMins && currentMins <= closeMins;
  const isLastOrderTime = currentMins > lastOrderMins && isOpen;

  return (
    <aside className="w-64 bg-charcoal-900 text-ivory-100 flex flex-col justify-between shrink-0 shadow-2xl z-30 transition-all select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-charcoal-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-champagne-600 via-champagne-400 to-gold-400 flex items-center justify-center text-charcoal-900 shadow-gold">
            <Scissors className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-lg tracking-wide text-ivory-50">PU SALON</span>
              <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
            </div>
            <p className="text-[11px] tracking-wider uppercase text-champagne-300 font-medium">& Barbershop Studio</p>
          </div>
        </div>

        {/* Operating Hours Widget */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-charcoal-800/80 border border-charcoal-700/60 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-charcoal-300 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-champagne-400" /> Jam Buka
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
              isOpen 
                ? (isLastOrderTime ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40')
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? (isLastOrderTime ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse') : 'bg-rose-400'}`}></span>
              {isOpen ? (isLastOrderTime ? 'Last Order' : 'Buka') : 'Tutup'}
            </span>
          </div>
          <p className="text-[11px] text-charcoal-300 leading-snug">
            {isMonday ? 'Senin: 11:00 - 16:00 (Last Order 15:00)' : 'Selasa - Minggu: 11:00 - 21:00 (Last Order 20:00)'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-champagne-500/20 to-champagne-400/10 text-champagne-300 border border-champagne-500/30 shadow-sm'
                    : 'text-charcoal-300 hover:text-ivory-100 hover:bg-charcoal-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-champagne-400' : 'text-charcoal-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold text-white ${item.badgeColor || 'bg-champagne-600'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Reset Data */}
      <div className="p-4 border-t border-charcoal-800">
        <button
          onClick={resetAllData}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-charcoal-400 hover:text-champagne-300 hover:bg-charcoal-800 rounded-lg transition-colors"
          title="Reset semua data kembali ke kondisi demo awal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
        <div className="mt-3 text-center text-[10px] text-charcoal-500">
          PU Salon & Barbershop ERP v1.0
        </div>
      </div>
    </aside>
  );
};
