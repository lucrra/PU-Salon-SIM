import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  ChevronDown,
  PlusCircle,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  LogOut,
  Menu,
  Sparkles,
  Shield,
  BookOpen
} from 'lucide-react';

export const Header = ({ onOpenMenu }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    staff,
    activeStaffId,
    products,
    appointments,
    transactions,
    currentUser,
    logout
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const tabTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Ringkasan performa bisnis, pendapatan, dan aktivitas hari ini' },
    booking: { title: 'Booking & Jadwal', subtitle: 'Kelola reservasi pelanggan dan ketersediaan staf' },
    pricelist: { title: 'Layanan & Price List', subtitle: 'Buku menu harga resmi seluruh layanan salon' },
    pos: { title: 'Transaksi (Kasir)', subtitle: 'Pembayaran cepat dengan Tunai & QRIS' },
    crm: { title: 'Pelanggan', subtitle: 'Database pelanggan, riwayat treatment, dan promo' },
    inventory: { title: 'Produk & Stok', subtitle: 'Stok produk ritel & bahan salon dengan FIFO' },
    procurement: { title: 'Pemasok & Purchase Order', subtitle: 'Pengadaan bahan ke pemasok resmi' },
    scm: { title: 'Gudang & Supply Chain', subtitle: 'Distribusi stok multi-gudang dan stock opname' },
    finance: { title: 'Laporan Keuangan', subtitle: 'Laba rugi, arus kas, dan rincian pendapatan' },
    users: { title: 'Akun & Staf', subtitle: 'Jadwal kerja, komisi, dan hak akses (RBAC)' },
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  const lowStockItems = products.filter(p => p.currentStock <= p.minStock);
  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = transactions.filter(t => t.date.startsWith(todayStr)).length;
  const targetVisitors = 30;

  const activeStaffName = staff.find(s => s.id === activeStaffId)?.name?.split(' ')[0] || 'Staf';
  const displayName = currentUser?.name || (userRole === 'owner' ? 'Yuni' : userRole === 'admin' ? 'Dian' : activeStaffName);
  const initials = displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-ivory-300/60 bg-ivory-100/80 backdrop-blur-xl">
      <div className="h-[76px] px-4 md:px-8 flex items-center justify-between gap-3">
        {/* Left: menu + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMenu}
            className="lg:hidden w-10 h-10 rounded-xl bg-white border border-ivory-300 flex items-center justify-center text-charcoal-600"
            aria-label="Buka menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="font-display text-lg md:text-xl font-bold text-charcoal-900 flex items-center gap-2 truncate">
              {currentTabInfo.title}
              {activeTab === 'dashboard' && <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />}
            </h1>
            <p className="text-[11px] text-charcoal-500 mt-0.5 truncate hidden sm:block">{currentTabInfo.subtitle}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Target meter */}
          <div className="hidden xl:flex items-center gap-3 bg-white/80 px-3.5 py-2 rounded-2xl border border-ivory-300">
            <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">Target</div>
            <div className="text-xs font-bold text-charcoal-800">
              {todayCount}<span className="text-charcoal-400 font-medium"> / {targetVisitors}</span>
            </div>
            <div className="w-16 bg-ivory-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-champagne-500 to-gold-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (todayCount / targetVisitors) * 100)}%` }}
              />
            </div>
          </div>

          {/* Quick POS */}
          {userRole !== 'staff' && (
            <button onClick={() => setActiveTab('pos')} className="hidden sm:inline-flex btn-brand whitespace-nowrap">
              <PlusCircle className="w-4 h-4" /> <span className="hidden xl:inline">Pesanan Baru</span><span className="xl:hidden">Pesanan</span>
            </button>
          )}

          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 bg-white/80 pl-3 pr-2 py-2 rounded-2xl border border-ivory-300 w-52 focus-within:ring-4 focus-within:ring-champagne-200/50 focus-within:border-champagne-300 transition">
            <Search className="w-3.5 h-3.5 text-charcoal-400" />
            <input
              placeholder="Cari"
              className="bg-transparent text-xs text-charcoal-700 placeholder:text-charcoal-400 outline-none w-full"
            />
            <kbd className="text-[9px] font-bold text-charcoal-400 bg-ivory-100 border border-ivory-300 rounded px-1.5 py-0.5">⌘K</kbd>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifMenu(v => !v); setShowProfile(false); }}
              className="w-10 h-10 rounded-2xl bg-white/85 border border-ivory-300 flex items-center justify-center text-charcoal-600 hover:text-champagne-600 hover:border-champagne-300 transition relative"
            >
              <Bell className="w-4 h-4" />
              {(lowStockItems.length + pendingAppointments.length) > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-champagne-500 to-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-glow-pink">
                  {lowStockItems.length + pendingAppointments.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-luxury border border-ivory-300 p-4 z-50 animate-fadeUp">
                <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                  <span className="font-display font-bold text-xs text-charcoal-900">Pemberitahuan</span>
                  <span className="text-[10px] text-charcoal-400">{todayLabel}</span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto scroll-thin">
                  {lowStockItems.length > 0 && (
                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs">
                      <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {lowStockItems.length} Produk Menipis
                      </div>
                      <ul className="text-[11px] text-amber-800 list-disc list-inside space-y-0.5">
                        {lowStockItems.map(p => <li key={p.id}>{p.name} · sisa {p.currentStock} {p.unit}</li>)}
                      </ul>
                    </div>
                  )}
                  {pendingAppointments.length > 0 && (
                    <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/70 text-xs">
                      <div className="flex items-center gap-2 font-bold text-blue-900 mb-1">
                        <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                        {pendingAppointments.length} Janji Temu Menunggu
                      </div>
                      <p className="text-[11px] text-blue-700">Konfirmasi dari modul Booking untuk menjaga jadwal tetap rapi.</p>
                    </div>
                  )}
                  {lowStockItems.length === 0 && pendingAppointments.length === 0 && (
                    <div className="text-center py-6 text-xs text-charcoal-400 flex flex-col items-center gap-1.5">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      Semua operasional berjalan optimal.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfile(v => !v); setShowNotifMenu(false); }}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 bg-white/85 border border-ivory-300 hover:border-champagne-300 rounded-2xl transition"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-champagne-500 via-gold-500 to-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                {initials}
              </div>
              <div className="text-left hidden sm:block max-w-[110px]">
                <div className="text-[11px] font-bold text-charcoal-800 truncate">{displayName}</div>
                <p className="text-[9px] text-charcoal-400 capitalize truncate">{currentUser?.label || userRole}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-luxury border border-ivory-300 p-2 z-50 animate-fadeUp">
                <div className="p-3 border-b border-ivory-200">
                  <div className="text-xs font-bold text-charcoal-900">{currentUser?.name || displayName}</div>
                  <div className="text-[10px] text-charcoal-400">{currentUser?.email || 'demo@pusalon.co.id'}</div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="chip bg-champagne-50 text-champagne-700 border border-champagne-200 capitalize">
                      <Shield className="w-3 h-3" /> {userRole}
                    </span>
                    <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Sesi aktif
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { setShowProfile(false); setActiveTab('pricelist'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-ivory-100"
                >
                  <BookOpen className="w-4 h-4 text-champagne-500" /> Buku Menu & Price List
                </button>
                <button
                  onClick={() => { setShowProfile(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari sistem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
