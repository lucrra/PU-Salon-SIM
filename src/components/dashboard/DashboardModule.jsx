import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Users,
  CalendarCheck,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  Scissors,
  Truck
} from 'lucide-react';

const rupiahShort = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.0', '')}jt`;
  if (n >= 1000) return `${Math.round(n / 1000)}rb`;
  return `${n}`;
};

const APT_STATUS_LABEL = {
  pending: 'Menunggu',
  confirmed: 'Terkonfirmasi',
  in_progress: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Batal'
};

export const DashboardModule = () => {
  const {
    transactions,
    customers,
    appointments,
    products,
    staff,
    financialRecords,
    setActiveTab,
    convertAppointmentToPOS,
    userRole
  } = useApp();

  // Date helpers
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Calculate Revenues
  const todayRevenue = transactions
    .filter(t => t.date.startsWith(todayStr))
    .reduce((acc, t) => acc + t.total, 0);

  // Weekly Revenue (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyRevenue = transactions
    .filter(t => new Date(t.date) >= sevenDaysAgo)
    .reduce((acc, t) => acc + t.total, 0);

  // Monthly Revenue (current month)
  const currentMonthStr = todayStr.slice(0, 7);
  const monthlyRevenue = transactions
    .filter(t => t.date.startsWith(currentMonthStr))
    .reduce((acc, t) => acc + t.total, 0);

  // Today's appointments & status breakdown
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const todayCompleted = todayAppointments.filter(a => a.status === 'completed').length;
  const todayPending = todayAppointments.filter(a => a.status === 'pending').length;
  const todayInProgress = todayAppointments.filter(a => a.status === 'in_progress').length;

  // Latest transactions (newest first) for the dashboard feed
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Low stock products
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);

  // Revenue by last 7 days chart data
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().slice(0, 10);
    const dayName = days[d.getDay()];
    const dayTotal = transactions
      .filter(t => t.date.startsWith(dStr))
      .reduce((sum, t) => sum + t.total, 0);
    return { date: dStr, label: dayName, dateLabel: `${d.getDate()}/${d.getMonth()+1}`, total: dayTotal };
  });

  const maxDayRevenue = Math.max(...chartDays.map(d => d.total), 1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-800 text-ivory-50 shadow-luxury relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-champagne-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-6 -bottom-10 opacity-[0.07] pointer-events-none">
          <Scissors className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="min-w-0 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-500/15 border border-champagne-400/30 text-champagne-300 text-[11px] font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem ERP Terpadu</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-ivory-50 leading-tight">
              Selamat Datang
            </h2>
            <p className="text-xs text-charcoal-300 max-w-2xl leading-relaxed">
              Semua modul operasional terhubung otomatis: booking, kasir POS Tunai/QRIS, inventaris FIFO, CRM, hingga pembukuan laba rugi.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] text-charcoal-300">
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-champagne-400" />
                <span className="capitalize">{todayLabel}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-champagne-400" />
                <span>Senin 11:00–16:00 • Selasa–Minggu 11:00–21:00</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('booking')}
              className="px-4 py-2.5 rounded-2xl bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs transition-all shadow-gold flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Lihat Jadwal Hari Ini</span>
            </button>
            {userRole !== 'staff' && (
              <button
                onClick={() => setActiveTab('pos')}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-ivory-100 font-bold text-xs border border-white/15 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-champagne-400" />
                <span>Buka Kasir POS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 hover:border-champagne-300 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">Pendapatan Hari Ini</span>
            <div className="w-9 h-9 shrink-0 rounded-xl bg-champagne-50 text-champagne-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-serif font-bold text-charcoal-900 break-words">
              Rp {todayRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bulan ini: <span className="font-bold text-charcoal-700">Rp {monthlyRevenue.toLocaleString('id-ID')}</span></span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 hover:border-champagne-300 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">Total Pelanggan CRM</span>
            <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-serif font-bold text-charcoal-900">
              {customers.length} Orang
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium mt-1">
              {customers.filter(c => c.tier === 'Gold').length} Member Gold • {customers.filter(c => c.tier === 'Silver').length} Silver
            </div>
          </div>
        </div>

        {/* Total Bookings Today */}
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 hover:border-champagne-300 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">Janji Temu Hari Ini</span>
            <div className="w-9 h-9 shrink-0 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-serif font-bold text-charcoal-900">
              {todayAppointments.length} Janji
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
              <span className="text-emerald-600 font-bold">{todayCompleted} Selesai</span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{todayPending} Menunggu</span>
              {todayInProgress > 0 && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 font-bold">{todayInProgress} Berlangsung</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Total Transactions & Low Stock Alert */}
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 hover:border-champagne-300 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">Status Inventaris</span>
            <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-serif font-bold text-charcoal-900">
              {lowStockProducts.length > 0 ? `${lowStockProducts.length} Menipis` : 'Aman (Optimal)'}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium mt-1">
              {products.length} Total SKU Produk &amp; Bahan
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Chart + Today's Schedule & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Revenue Trends Chart & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart Card */}
          <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-serif font-bold text-charcoal-900">Tren Pendapatan 7 Hari Terakhir</h3>
                <p className="text-xs text-charcoal-400">Total kumulatif penjualan kasir dan jasa salon</p>
              </div>
              <div className="text-xs font-semibold text-charcoal-500 bg-ivory-100 border border-ivory-200 rounded-xl px-3 py-1.5 w-fit">
                7 Hari: <span className="font-bold text-champagne-800">Rp {weeklyRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Custom Interactive HTML/SVG Bar Chart */}
            <div className="h-56 flex items-end gap-1.5 sm:gap-3 pt-6 border-b border-ivory-200 px-1 sm:px-2">
              {chartDays.map((item, idx) => {
                const isToday = idx === chartDays.length - 1;
                const isZero = item.total === 0;
                const heightPercent = isZero ? 6 : Math.min(92, Math.max(10, (item.total / maxDayRevenue) * 100));
                return (
                  <div key={item.date} className="flex-1 h-full flex flex-col items-center justify-end gap-2 group min-w-0">
                    {/* Bar + value label */}
                    <div className="relative w-full max-w-[42px] flex-1 flex items-end">
                      {!isZero && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 text-[9px] font-bold text-charcoal-500 whitespace-nowrap"
                          style={{ bottom: `calc(${heightPercent}% + 4px)` }}
                        >
                          {rupiahShort(item.total)}
                        </div>
                      )}
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                          isZero
                            ? 'bg-ivory-300'
                            : isToday
                              ? 'bg-gradient-to-t from-champagne-600 to-champagne-400 shadow-gold'
                              : 'bg-gradient-to-t from-charcoal-700 to-charcoal-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    {/* Label */}
                    <div className="text-center leading-tight">
                      <div className={`text-[10px] font-bold ${isToday ? 'text-champagne-700' : 'text-charcoal-500'}`}>
                        {item.label}
                      </div>
                      <div className="text-[9px] text-charcoal-400">{item.dateLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[11px] text-charcoal-400 pt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-champagne-500"></span> Hari Ini
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-charcoal-600"></span> Hari Sebelumnya
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ivory-300"></span> Tanpa Transaksi
              </span>
            </div>
          </div>

          {/* Recent POS Transactions */}
          <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-charcoal-900">Transaksi Kasir Terkini</h3>
                <p className="text-xs text-charcoal-400">Pembayaran tunai &amp; QRIS yang berhasil diselesaikan</p>
              </div>
              {userRole !== 'staff' && (
                <button
                  onClick={() => setActiveTab('pos')}
                  className="text-xs font-bold text-champagne-700 hover:text-champagne-800 transition-colors w-fit"
                >
                  Lihat Kasir &rarr;
                </button>
              )}
            </div>

            <div className="divide-y divide-ivory-200">
              {recentTransactions.length === 0 ? (
                <div className="py-10 text-center text-xs text-charcoal-400">
                  Belum ada transaksi kasir.
                </div>
              ) : recentTransactions.map(trx => {
                const method = (trx.paymentMethod || 'tunai').toLowerCase();
                const itemNames = (trx.items || []).map(i => i.name).join(', ');
                return (
                  <div key={trx.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-ivory-50/60 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-[10px] ${
                        method === 'qris' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {method.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-charcoal-900 flex items-center gap-2 min-w-0">
                          <span className="truncate">{trx.customerName}</span>
                          <span className="text-[10px] text-charcoal-400 font-normal shrink-0">#{trx.invoiceNo}</span>
                        </div>
                        <div className="text-[11px] text-charcoal-500 truncate">
                          {itemNames} • Staf: {trx.staffName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-charcoal-900 whitespace-nowrap">
                        Rp {trx.total.toLocaleString('id-ID')}
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                        Lunas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Appointments & Low Stock Warnings */}
        <div className="space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-charcoal-900">Jadwal Hari Ini</h3>
                <p className="text-xs text-charcoal-400">{todayAppointments.length} janji temu tercatat</p>
              </div>
              <button
                onClick={() => setActiveTab('booking')}
                className="text-xs font-bold text-champagne-700 hover:text-champagne-800 shrink-0"
              >
                Semua &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-xs text-charcoal-400">
                  Tidak ada janji temu hari ini.
                </div>
              ) : (
                todayAppointments.map(apt => (
                  <div key={apt.id} className="p-3.5 rounded-2xl bg-ivory-100/70 border border-ivory-200/80 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-charcoal-900 whitespace-nowrap">{apt.startTime} - {apt.endTime}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          apt.status === 'in_progress' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                          apt.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                          apt.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {APT_STATUS_LABEL[apt.status] || apt.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-charcoal-400 capitalize shrink-0">{apt.type}</span>
                    </div>

                    <div className="text-xs font-semibold text-charcoal-800">
                      {apt.customerName}
                    </div>
                    <div className="text-[11px] text-charcoal-500">
                      {(apt.serviceNames || []).join(', ')} • Stylist: <span className="font-semibold text-charcoal-700">{apt.staffName}</span>
                    </div>

                    {/* Quick convert to POS button if in progress or confirmed */}
                    {userRole !== 'staff' && apt.status !== 'completed' && (
                      <button
                        onClick={() => convertAppointmentToPOS(apt)}
                        className="w-full mt-1 py-1.5 px-3 rounded-xl bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Proses ke Kasir (POS)</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Warning Card */}
          {lowStockProducts.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/80 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Peringatan Stok Menipis</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full">
                  {lowStockProducts.length} Item
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                Stok barang di bawah batas minimum. Buat pesanan ke supplier agar tidak mengganggu operasional.
              </p>
              <div className="space-y-1.5">
                {lowStockProducts.map(prod => (
                  <div key={prod.id} className="flex items-center justify-between gap-2 bg-white/80 p-2 rounded-xl text-xs">
                    <span className="font-medium text-charcoal-800 truncate">{prod.name}</span>
                    <span className="font-bold text-rose-600 text-[11px] whitespace-nowrap shrink-0">Sisa {prod.currentStock} {prod.unit} (Min {prod.minStock})</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('scm')}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Kelola di SCM &amp; Gudang</span>
              </button>
            </div>
          )}

          {/* 3 Staff Performance Snapshot */}
          <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft space-y-4">
            <div>
              <h3 className="text-base font-serif font-bold text-charcoal-900">Performa 3 Staf Hari Ini</h3>
              <p className="text-xs text-charcoal-400">{staff.length} staf aktif • rating &amp; layanan selesai</p>
            </div>
            <div className="space-y-3">
              {staff.map(s => (
                <div key={s.id} className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-ivory-50 border border-ivory-200/80">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-xl object-cover border border-champagne-300 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-charcoal-900 truncate">{s.name}</div>
                      <div className="text-[10px] text-charcoal-500 truncate">{s.role}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-champagne-800 whitespace-nowrap">{s.todayServed} Selesai</span>
                    <div className="text-[10px] text-emerald-600 font-semibold">Rating ★ {s.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
