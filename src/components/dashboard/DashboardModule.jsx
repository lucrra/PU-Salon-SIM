import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Users,
  CalendarCheck,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle,
  Truck
} from 'lucide-react';

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

  // Completed & Pending Appointments
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const inProgressAppointments = appointments.filter(a => a.status === 'in_progress');
  const todayAppointments = appointments.filter(a => a.date === todayStr);

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
    return { date: dStr, label: `${dayName} (${d.getDate()}/${d.getMonth()+1})`, total: dayTotal };
  });

  const maxDayRevenue = Math.max(...chartDays.map(d => d.total), 500000);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-800 text-ivory-50 shadow-luxury relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-500/20 border border-champagne-400/30 text-champagne-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem ERP Terpadu PU Salon & Barbershop</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-ivory-50">
            Selamat Datang
          </h2>
          <p className="text-xs text-charcoal-300 max-w-xl">
            Semua modul operasional terhubung secara otomatis: booking janji temu, kasir POS Tunai/QRIS, pengurangan inventaris FIFO, CRM pelanggan, dan pembukuan laba rugi.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => setActiveTab('booking')}
            className="px-4 py-2.5 rounded-2xl bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs transition-all shadow-gold flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Lihat Jadwal Hari Ini</span>
          </button>
          {userRole !== 'staff' && (
            <button
              onClick={() => setActiveTab('pos')}
              className="px-4 py-2.5 rounded-2xl bg-charcoal-700/80 hover:bg-charcoal-700 text-ivory-100 font-bold text-xs border border-charcoal-600 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-champagne-400" />
              <span>Buka Kasir POS</span>
            </button>
          )}
        </div>
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-champagne-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-ivory-300/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Pendapatan Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-champagne-50 text-champagne-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-charcoal-900">
              Rp {todayRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Bulan ini: Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-ivory-300/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Total Pelanggan CRM</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-charcoal-900">
              {customers.length} Orang
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium mt-1">
              {customers.filter(c => c.tier === 'Gold').length} Member Gold • {customers.filter(c => c.tier === 'Silver').length} Silver
            </div>
          </div>
        </div>

        {/* Total Bookings Today */}
        <div className="bg-white p-5 rounded-2xl border border-ivory-300/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Janji Temu Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-charcoal-900">
              {todayAppointments.length} Janji
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium flex items-center gap-2 mt-1">
              <span className="text-emerald-600 font-bold">{completedAppointments.length} Selesai</span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{pendingAppointments.length} Menunggu</span>
            </div>
          </div>
        </div>

        {/* Total Transactions & Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-ivory-300/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Status Inventaris</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-charcoal-900">
              {lowStockProducts.length > 0 ? `${lowStockProducts.length} Menipis` : 'Aman (Optimal)'}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium mt-1">
              {products.length} Total SKU Produk & Bahan
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-serif font-bold text-charcoal-900">Tren Pendapatan 7 Hari Terakhir</h3>
                <p className="text-xs text-charcoal-400">Total kumulatif penjualan kasir dan jasa salon</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-charcoal-400">7 Hari: </span>
                <span className="text-sm font-bold text-champagne-800">Rp {weeklyRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Custom Interactive HTML/SVG Bar Chart */}
            <div className="h-56 flex items-end gap-3 pt-6 border-b border-ivory-200 px-2">
              {chartDays.map((item, idx) => {
                const heightPercent = maxDayRevenue > 0 ? Math.max(12, (item.total / maxDayRevenue) * 100) : 10;
                const isToday = idx === chartDays.length - 1;
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-900 text-ivory-50 text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-20">
                      Rp {item.total.toLocaleString('id-ID')}
                    </div>
                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-ivory-200 rounded-t-xl overflow-hidden flex items-end">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                          isToday
                            ? 'bg-gradient-to-t from-champagne-600 to-champagne-400 shadow-gold'
                            : 'bg-gradient-to-t from-charcoal-700 to-charcoal-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    {/* Label */}
                    <span className={`text-[10px] font-semibold ${isToday ? 'text-champagne-700 font-bold' : 'text-charcoal-400'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-charcoal-400 pt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-champagne-500"></span> Hari Ini
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-charcoal-600"></span> Hari Sebelumnya
              </span>
            </div>
          </div>

          {/* Recent POS Transactions */}
          <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-charcoal-900">Transaksi Kasir Terkini</h3>
                <p className="text-xs text-charcoal-400">Pembayaran tunai & QRIS yang berhasil diselesaikan</p>
              </div>
              {userRole !== 'staff' && (
                <button
                  onClick={() => setActiveTab('pos')}
                  className="text-xs font-bold text-champagne-700 hover:text-champagne-800 transition-colors"
                >
                  Lihat Kasir &rarr;
                </button>
              )}
            </div>

            <div className="divide-y divide-ivory-200">
              {transactions.slice(0, 4).map(trx => (
                <div key={trx.id} className="py-3.5 flex items-center justify-between hover:bg-ivory-50/60 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      trx.paymentMethod === 'qris' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {trx.paymentMethod.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal-900 flex items-center gap-2">
                        <span>{trx.customerName}</span>
                        <span className="text-[10px] text-charcoal-400 font-normal">#{trx.invoiceNo}</span>
                      </div>
                      <div className="text-[11px] text-charcoal-500">
                        {trx.items.map(i => i.name).join(', ')} • Staf: {trx.staffName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-charcoal-900">
                      Rp {trx.total.toLocaleString('id-ID')}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                      Lunas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Appointments & Low Stock Warnings */}
        <div className="space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-charcoal-900">Jadwal Hari Ini</h3>
                <p className="text-xs text-charcoal-400">{todayAppointments.length} janji temu tercatat</p>
              </div>
              <button
                onClick={() => setActiveTab('booking')}
                className="text-xs font-bold text-champagne-700 hover:text-champagne-800"
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-charcoal-900">{apt.startTime} - {apt.endTime}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          apt.status === 'in_progress' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                          apt.status === 'confirmed' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-charcoal-400 capitalize">{apt.type}</span>
                    </div>

                    <div className="text-xs font-semibold text-charcoal-800">
                      {apt.customerName}
                    </div>
                    <div className="text-[11px] text-charcoal-500">
                      {apt.serviceNames.join(', ')} • Stylist: <span className="font-semibold text-charcoal-700">{apt.staffName}</span>
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
                  <div key={prod.id} className="flex items-center justify-between bg-white/80 p-2 rounded-xl text-xs">
                    <span className="font-medium text-charcoal-800">{prod.name}</span>
                    <span className="font-bold text-rose-600 text-[11px]">Sisa {prod.currentStock} {prod.unit} (Min {prod.minStock})</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('procurement')}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Buat Purchase Order (PO)</span>
              </button>
            </div>
          )}

          {/* 3 Staff Performance Snapshot */}
          <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft space-y-4">
            <h3 className="text-base font-serif font-bold text-charcoal-900">Performa 3 Staf Hari Ini</h3>
            <div className="space-y-3">
              {staff.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-ivory-50 border border-ivory-200/80">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-xl object-cover border border-champagne-300" />
                    <div>
                      <div className="text-xs font-bold text-charcoal-900">{s.name}</div>
                      <div className="text-[10px] text-charcoal-500">{s.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-champagne-800">{s.todayServed} Selesai</span>
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
