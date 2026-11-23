import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  User,
  Shield,
  ChevronDown,
  PlusCircle,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const Header = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    staff,
    activeStaffId,
    setActiveStaffId,
    products,
    appointments,
    transactions
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Tab Titles
  const tabTitles = {
    dashboard: { title: 'Dashboard Utama', subtitle: 'Ringkasan performa bisnis, penjualan, dan aktivitas harian salon' },
    booking: { title: 'Booking & Penjadwalan', subtitle: 'Kelola reservasi pelanggan online & walk-in serta ketersediaan staf' },
    pos: { title: 'Point of Sales (Kasir)', subtitle: 'Pencatatan transaksi pembayaran cepat dengan Tunai & QRIS' },
    inventory: { title: 'Manajemen Inventaris & FIFO', subtitle: 'Stok produk ritel & bahan salon dengan sistem antrean batch FIFO' },
    crm: { title: 'CRM & Riwayat Pelanggan', subtitle: 'Database pelanggan, riwayat treatment, dan promo ulang tahun' },
    finance: { title: 'Manajemen Keuangan & P&L', subtitle: 'Laporan laba rugi, arus kas, dan rincian pendapatan & beban' },
    procurement: { title: 'Pengadaan & Supplier', subtitle: 'Pemesanan bahan ke pemasok resmi dan penerimaan barang masuk' },
    users: { title: 'Manajemen Staf & Hak Akses', subtitle: 'Pengaturan 3 staf salon, jadwal kerja, komisi, dan peran (RBAC)' }
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  // Alerts for notifications
  const lowStockItems = products.filter(p => p.currentStock <= p.minStock);
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().slice(0, 10));

  // Today's visitors counter (target ~30 visitors/day)
  const todayTransactionsCount = transactions.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 10))).length;
  const targetVisitors = 30;

  const roles = [
    { id: 'owner', label: 'Owner (Pemilik)', desc: 'Akses penuh ke semua modul & laporan laba rugi' },
    { id: 'admin', label: 'Admin Salon', desc: 'Operasional harian, kasir, booking & inventaris' },
    { id: 'staff', label: 'Staf / Stylist', desc: 'Melihat jadwal janji temu & memperbarui status pengerjaan' }
  ];

  return (
    <header className="h-20 bg-ivory-50 border-b border-ivory-300/80 px-8 flex items-center justify-between shrink-0 shadow-soft sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-serif font-bold text-charcoal-900 flex items-center gap-2">
          {currentTabInfo.title}
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">{currentTabInfo.subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Daily Target Meter */}
        <div className="hidden lg:flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-ivory-300 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-700">
            <span className="w-2 h-2 rounded-full bg-champagne-500"></span>
            Target Pengunjung:
            <span className="text-champagne-700 font-bold">{todayTransactionsCount} / {targetVisitors}</span>
          </div>
          <div className="w-16 bg-ivory-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-champagne-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (todayTransactionsCount / targetVisitors) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        {userRole !== 'staff' && (
          <button
            onClick={() => setActiveTab('pos')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 text-xs font-semibold transition-all shadow-sm hover:shadow active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-champagne-400" />
            <span>Kasir Baru</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-10 h-10 rounded-xl bg-white border border-ivory-300 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-100 transition-colors relative shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {(lowStockItems.length > 0 || pendingAppointments.length > 0) && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                {lowStockItems.length + pendingAppointments.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-luxury border border-ivory-300 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <span className="font-semibold text-xs text-charcoal-900">Pemberitahuan Sistem</span>
                <span className="text-[10px] text-charcoal-400">PU Salon ERP</span>
              </div>
              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {lowStockItems.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-amber-900 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lowStockItems.length} Produk Menipis</span>
                    </div>
                    <ul className="text-[11px] text-amber-800 list-disc list-inside">
                      {lowStockItems.map(p => (
                        <li key={p.id}>{p.name} (Sisa {p.currentStock} {p.unit})</li>
                      ))}
                    </ul>
                  </div>
                )}
                {pendingAppointments.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/80 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-blue-900 mb-1">
                      <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{pendingAppointments.length} Janji Temu Menunggu</span>
                    </div>
                    <p className="text-[11px] text-blue-700">Periksa modul Booking untuk konfirmasi janji temu pelanggan.</p>
                  </div>
                )}
                {lowStockItems.length === 0 && pendingAppointments.length === 0 && (
                  <div className="text-center py-6 text-xs text-charcoal-400 flex flex-col items-center gap-1.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span>Semua operasional berjalan optimal.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-3 pl-3 pr-3 py-1.5 bg-white border border-ivory-300 hover:border-champagne-400 rounded-2xl shadow-sm transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-champagne-100 border border-champagne-300 flex items-center justify-center text-champagne-800 font-bold text-xs">
              {userRole === 'owner' ? 'OW' : userRole === 'admin' ? 'AD' : 'ST'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-charcoal-800 capitalize flex items-center gap-1">
                {userRole === 'owner' ? 'Owner (Yuni)' : userRole === 'admin' ? 'Admin (Dian)' : `Staf (${staff.find(s=>s.id===activeStaffId)?.name.split(' ')[0] || 'Staf'})`}
                <Shield className="w-3 h-3 text-champagne-600" />
              </div>
              <p className="text-[10px] text-charcoal-400 capitalize">{userRole} Access</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
          </button>

          {/* Role Dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-luxury border border-ivory-300 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 border-b border-ivory-200 text-xs font-semibold text-charcoal-500">
                Ganti Peran Pengguna (RBAC Simulation)
              </div>
              <div className="py-1 space-y-1">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                      userRole === r.id ? 'bg-champagne-50 border border-champagne-300 text-champagne-900 font-medium' : 'hover:bg-ivory-100 text-charcoal-700'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mt-1 shrink-0 bg-champagne-500"></div>
                    <div>
                      <div className="font-bold">{r.label}</div>
                      <div className="text-[11px] text-charcoal-400 leading-tight">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* If staff role is active, choose which staff */}
              {userRole === 'staff' && (
                <div className="pt-2 border-t border-ivory-200 mt-1">
                  <div className="px-2 pb-1 text-[11px] font-semibold text-charcoal-400">Pilih Staf Login:</div>
                  <div className="space-y-1">
                    {staff.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveStaffId(s.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          activeStaffId === s.id ? 'bg-champagne-200 font-bold text-champagne-900' : 'hover:bg-ivory-100 text-charcoal-700'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] text-charcoal-400">{s.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
