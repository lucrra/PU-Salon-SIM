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
  ShieldCheck,
  Clock,
  Sparkles,
  RotateCcw,
  BookOpen,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ mobileOpen = false, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    resetAllData,
    products,
    appointments,
    requisitions,
    currentUser,
    logout
  } = useApp();

  const navGroups = [
    {
      label: 'Ringkasan',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['owner', 'admin', 'staff'] },
        { id: 'finance', label: 'Laporan Keuangan', icon: Coins, roles: ['owner'] },
      ],
    },
    {
      label: 'Operasional',
      items: [
        { id: 'booking', label: 'Booking & Jadwal', icon: CalendarDays, roles: ['owner', 'admin', 'staff'], badge: appointments.filter(a => a.status === 'pending').length },
        { id: 'pricelist', label: 'Layanan & Price List', icon: BookOpen, roles: ['owner', 'admin', 'staff'] },
        { id: 'pos', label: 'Transaksi (Kasir)', icon: ShoppingBag, roles: ['owner', 'admin'] },
        { id: 'crm', label: 'Pelanggan', icon: Users, roles: ['owner', 'admin'] },
      ],
    },
    {
      label: 'Produk & Pemasok',
      items: [
        { id: 'inventory', label: 'Produk & Stok', icon: Package, roles: ['owner', 'admin'], badge: products.filter(p => p.currentStock <= p.minStock).length, badgeColor: 'bg-rose-500' },
        { id: 'procurement', label: 'Pemasok & PO', icon: Truck, roles: ['owner', 'admin'] },
        { id: 'scm', label: 'Gudang (SCM)', icon: Warehouse, roles: ['owner', 'admin'], badge: requisitions.filter(r => r.status === 'pending').length },
      ],
    },
    {
      label: 'Sistem',
      items: [
        { id: 'users', label: 'Akun & Staf', icon: ShieldCheck, roles: ['owner', 'admin'] },
      ],
    },
  ];

  // Operating status
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const isMonday = now.getDay() === 1;
  const openMins = 11 * 60;
  const closeMins = isMonday ? 16 * 60 : 21 * 60;
  const lastOrderMins = isMonday ? 15 * 60 : 20 * 60;
  const isOpen = currentMins >= openMins && currentMins <= closeMins;
  const isLastOrderTime = currentMins > lastOrderMins && isOpen;

  const go = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-charcoal-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[272px] shrink-0 z-50 lg:z-30
          bg-white/85 backdrop-blur-xl border-r border-ivory-300/80 shadow-[8px_0_40px_-24px_rgba(70,45,90,.35)]
          flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="p-5 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-charcoal-950 ring-1 ring-charcoal-800 shadow-sm p-0.5 overflow-hidden shrink-0">
              <img src="/logo.png" alt="PU Salon & Barbershop" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-extrabold text-[17px] tracking-tight text-charcoal-900">
                PU SALON <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              </div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-champagne-600 font-bold">& Barbershop Studio</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-charcoal-400 hover:bg-ivory-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Operating hours */}
        <div className="mx-4 mb-4 rounded-2xl border border-ivory-300/80 bg-gradient-to-br from-ivory-50 to-ivory-100/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-champagne-500" /> Jam Buka
            </span>
            <span className={`chip px-2 py-0.5 border ${
              isOpen
                ? (isLastOrderTime ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? (isLastOrderTime ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse') : 'bg-rose-500'}`} />
              {isOpen ? (isLastOrderTime ? 'Last Order' : 'Buka') : 'Tutup'}
            </span>
          </div>
          <p className="text-[10px] text-charcoal-500 leading-snug mt-1.5">
            {isMonday ? 'Senin · 11:00 — 16:00' : 'Selasa — Minggu · 11:00 — 21:00'}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scroll-thin px-3 pb-3 space-y-4">
          {navGroups.map(group => {
            const items = group.items.filter(i => i.roles.includes(userRole));
            if (!items.length) return null;
            return (
              <div key={group.label}>
                <div className="px-3 pb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-charcoal-400">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => go(item.id)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all duration-200 group ${
                          isActive
                            ? 'nav-pill-active'
                            : 'text-charcoal-600 hover:bg-ivory-100/80 hover:text-charcoal-900'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive ? 'bg-white text-champagne-600 shadow-sm' : 'bg-ivory-100 text-charcoal-400 group-hover:text-champagne-500'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span className="truncate">{item.label}</span>
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          {item.badge > 0 && (
                            <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold text-white ${item.badgeColor || 'bg-gradient-to-r from-champagne-500 to-gold-500'}`}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-champagne-500" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Mini promo */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-champagne-500 via-gold-500 to-blue-500 text-white relative overflow-hidden">
            <div className="absolute -right-6 -bottom-8 w-24 h-24 rounded-full bg-white/15 blur-xl" />
            <Sparkles className="w-4 h-4 mb-2 text-white/90" />
            <div className="text-xs font-bold leading-snug">Buku Menu & Price List</div>
            <p className="text-[10px] text-white/80 mt-1 leading-snug">10 kategori layanan siap dipesan pelanggan.</p>
            <button
              onClick={() => go('pricelist')}
              className="mt-2.5 w-full rounded-xl bg-white/95 text-champagne-700 text-[11px] font-bold py-1.5 hover:bg-white transition"
            >
              Lihat Menu
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-ivory-300/80 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-ivory-50 border border-ivory-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-champagne-500 to-gold-500 text-white flex items-center justify-center text-[10px] font-bold">
              {(currentUser?.name || 'PU').split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-charcoal-800 truncate">{currentUser?.name || 'Pengguna'}</div>
              <div className="text-[9px] text-charcoal-400 capitalize truncate">{currentUser?.label || userRole}</div>
            </div>
            <button onClick={logout} title="Keluar" className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-rose-50">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={resetAllData}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-semibold text-charcoal-400 hover:text-champagne-600 rounded-lg transition-colors"
            title="Reset semua data ke kondisi demo awal"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo Data
          </button>
          <div className="text-center text-[9px] text-charcoal-300">PU Salon ERP v2.0</div>
        </div>
      </aside>
    </>
  );
};
