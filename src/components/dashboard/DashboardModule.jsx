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
  Sparkles,
  CheckCircle,
  Truck,
  BookOpen,
  ArrowRight,
  Star,
  Clock
} from 'lucide-react';
import { HERO_IMAGE, PROMO_IMAGES, formatIDR } from '../../data/priceList';

export const DashboardModule = () => {
  const {
    transactions,
    customers,
    appointments,
    products,
    staff,
    setActiveTab,
    convertAppointmentToPOS,
    userRole,
    currentUser,
    salonProfile
  } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);

  const todayRevenue = transactions
    .filter(t => t.date.startsWith(todayStr))
    .reduce((acc, t) => acc + t.total, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyRevenue = transactions
    .filter(t => new Date(t.date) >= sevenDaysAgo)
    .reduce((acc, t) => acc + t.total, 0);

  const currentMonthStr = todayStr.slice(0, 7);
  const monthlyRevenue = transactions
    .filter(t => t.date.startsWith(currentMonthStr))
    .reduce((acc, t) => acc + t.total, 0);

  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().slice(0, 10);
    const dayTotal = transactions
      .filter(t => t.date.startsWith(dStr))
      .reduce((sum, t) => sum + t.total, 0);
    return { date: dStr, label: days[d.getDay()], dayNum: d.getDate(), total: dayTotal };
  });

  const maxDayRevenue = Math.max(...chartDays.map(d => d.total), 500000);

  const displayName = currentUser?.name?.split(' ')[0] || 'Yuni';
  const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  const kpis = [
    {
      label: 'Pendapatan Hari Ini',
      value: formatIDR(todayRevenue),
      sub: `Bulan ini ${formatIDR(monthlyRevenue)}`,
      icon: DollarSign,
      tint: 'from-champagne-500 to-pink-400',
      soft: 'bg-champagne-50 text-champagne-700',
      trend: '+12,4%',
    },
    {
      label: 'Total Pelanggan',
      value: `${customers.length} orang`,
      sub: `${customers.filter(c => c.tier === 'Gold').length} Gold · ${customers.filter(c => c.tier === 'Silver').length} Silver`,
      icon: Users,
      tint: 'from-blue-500 to-cyan-400',
      soft: 'bg-blue-50 text-blue-700',
      trend: '+6,1%',
    },
    {
      label: 'Janji Temu Hari Ini',
      value: `${todayAppointments.length} janji`,
      sub: `${completedAppointments.length} selesai · ${pendingAppointments.length} menunggu`,
      icon: CalendarCheck,
      tint: 'from-gold-500 to-champagne-400',
      soft: 'bg-violet-50 text-violet-700',
      trend: 'aktif',
    },
    {
      label: 'Status Inventaris',
      value: lowStockProducts.length > 0 ? `${lowStockProducts.length} menipis` : 'Aman',
      sub: `${products.length} SKU produk & bahan`,
      icon: AlertTriangle,
      tint: lowStockProducts.length > 0 ? 'from-rose-500 to-orange-400' : 'from-emerald-500 to-teal-400',
      soft: lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600',
      trend: 'real-time',
    },
  ];

  const quickActions = [
    { id: 'pos', label: 'Transaksi', desc: 'Kasir Tunai & QRIS', icon: ShoppingBag, tint: 'from-champagne-500 to-pink-400' },
    { id: 'booking', label: 'Booking', desc: 'Jadwal & reservasi', icon: CalendarCheck, tint: 'from-gold-500 to-violet-400' },
    { id: 'pricelist', label: 'Price List', desc: 'Buku menu layanan', icon: BookOpen, tint: 'from-blue-500 to-cyan-400' },
    { id: 'crm', label: 'Pelanggan', desc: 'CRM & riwayat', icon: Users, tint: 'from-violet-500 to-champagne-400' },
  ];

  const promos = [
    { img: PROMO_IMAGES.hairSpa, tag: 'Hair Spa', title: 'Creambath + Massage', desc: 'Relaksasi 60 menit dengan vitamin rambut', price: 100000, tone: 'from-champagne-600/85' },
    { img: PROMO_IMAGES.coloring, tag: 'Coloring', title: 'Semir Warna Baru', desc: 'Konsultasi warna gratis oleh colorist', price: 250000, tone: 'from-gold-600/85' },
    { img: PROMO_IMAGES.barber, tag: 'Barber', title: 'Fade & Hot Towel', desc: 'Gentlemen grooming lengkap', price: 85000, tone: 'from-blue-700/85' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] shadow-luxury">
        <img src={HERO_IMAGE} alt="PU Salon" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-900/70 to-champagne-800/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(236,76,135,.35),transparent_45%),radial-gradient(circle_at_30%_100%,rgba(79,140,255,.28),transparent_45%)]" />

        <div className="relative z-10 p-7 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 text-white max-w-xl">
            <span className="chip bg-white/15 border border-white/20 text-champagne-100 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" /> {todayLabel} · {salonProfile.tagline}
            </span>
            <h2 className="font-display text-2xl md:text-3xl xl:text-4xl font-extrabold leading-tight">
              Selamat datang, <span className="bg-gradient-to-r from-champagne-200 via-gold-300 to-blue-200 bg-clip-text text-transparent">{displayName}</span> ✨
            </h2>
            <p className="text-xs md:text-sm text-white/75 leading-relaxed max-w-lg">
              Senang melihat Anda kembali. Semua kebutuhan operasional salon kini ada dalam satu tempat.
              Mari pastikan semua aktivitas PU Salon berjalan lancar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
            <button onClick={() => setActiveTab('booking')} className="btn-brand px-5 py-3 whitespace-nowrap">
              <CalendarCheck className="w-4 h-4" /> Jadwal Hari Ini
            </button>
            {userRole !== 'staff' && (
              <button onClick={() => setActiveTab('pos')} className="btn-ghost bg-white/10 text-white border-white/25 hover:bg-white/20 hover:text-white px-5 py-3 whitespace-nowrap">
                <ShoppingBag className="w-4 h-4" /> Buka Kasir
              </button>
            )}
          </div>
        </div>
      </section>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="surface p-5 hover:shadow-luxury transition-shadow duration-300 group">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-400">{k.label}</span>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${k.soft} group-hover:scale-105 transition-transform`}>
                <k.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 font-display text-2xl font-extrabold text-charcoal-900 leading-none">{k.value}</div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[10px] text-charcoal-500 truncate">{k.sub}</span>
              <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <TrendingUp className="w-3 h-3" /> {k.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map(a => (
          <button
            key={a.id}
            onClick={() => setActiveTab(a.id)}
            className="surface p-4 flex items-center gap-3 text-left hover:-translate-y-0.5 hover:shadow-luxury transition-all duration-300 group"
          >
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${a.tint} text-white flex items-center justify-center shadow-glow-pink/40 shrink-0`}>
              <a.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-charcoal-800 group-hover:text-champagne-700 transition-colors truncate">{a.label}</div>
              <div className="text-[10px] text-charcoal-400 truncate">{a.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-charcoal-300 ml-auto shrink-0 group-hover:text-champagne-500 group-hover:translate-x-0.5 transition" />
          </button>
        ))}
      </div>

      {/* Chart + schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="surface p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-base font-bold text-charcoal-900">Tren Pendapatan 7 Hari</h3>
                <p className="text-[11px] text-charcoal-400 mt-0.5">Kumulatif penjualan kasir dan jasa salon</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">Total 7 hari</div>
                <div className="font-display text-sm font-bold gradient-text">{formatIDR(weeklyRevenue)}</div>
              </div>
            </div>

            <div className="h-52 flex items-end gap-2.5 border-b border-ivory-200 px-1 pb-1">
              {chartDays.map((item, idx) => {
                const heightPercent = maxDayRevenue > 0 ? Math.max(10, (item.total / maxDayRevenue) * 100) : 10;
                const isToday = idx === chartDays.length - 1;
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-20">
                      {formatIDR(item.total)}
                    </div>
                    <div className="w-full max-w-[40px] h-full flex items-end rounded-t-xl bg-ivory-100 overflow-hidden">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                          isToday
                            ? 'bg-gradient-to-t from-champagne-600 to-gold-400 shadow-glow-pink'
                            : 'bg-gradient-to-t from-violet-400/80 to-blue-300/70'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold ${isToday ? 'text-champagne-700' : 'text-charcoal-400'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-charcoal-400 pt-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-champagne-500 to-gold-400" /> Hari ini</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-violet-400 to-blue-300" /> Hari sebelumnya</span>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-charcoal-900">Transaksi Terkini</h3>
                <p className="text-[11px] text-charcoal-400 mt-0.5">Pembayaran Tunai & QRIS yang selesai</p>
              </div>
              {userRole !== 'staff' && (
                <button onClick={() => setActiveTab('pos')} className="text-[11px] font-bold text-champagne-700 hover:text-champagne-800 flex items-center gap-1">
                  Kasir <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="divide-y divide-ivory-200">
              {transactions.slice(0, 4).map(trx => (
                <div key={trx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-ivory-50/70 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[9px] shrink-0 ${
                      trx.paymentMethod === 'qris' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {trx.paymentMethod.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-charcoal-900 flex items-center gap-2 truncate">
                        {trx.customerName}
                        <span className="text-[9px] text-charcoal-400 font-normal">#{trx.invoiceNo}</span>
                      </div>
                      <div className="text-[10px] text-charcoal-500 truncate">
                        {trx.items.map(i => i.name).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-charcoal-900">{formatIDR(trx.total)}</div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-bold bg-emerald-50 text-emerald-700">Lunas</span>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="py-8 text-center text-xs text-charcoal-400">Belum ada transaksi.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-charcoal-900">Jadwal Hari Ini</h3>
                <p className="text-[11px] text-charcoal-400 mt-0.5">{todayAppointments.length} janji temu</p>
              </div>
              <button onClick={() => setActiveTab('booking')} className="text-[11px] font-bold text-champagne-700">Semua</button>
            </div>

            <div className="space-y-2.5 max-h-[330px] overflow-y-auto scroll-thin pr-1">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-xs text-charcoal-400">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-charcoal-300" />
                  Tidak ada janji temu hari ini.
                </div>
              ) : (
                todayAppointments.map(apt => (
                  <div key={apt.id} className="p-3 rounded-2xl bg-ivory-50/80 border border-ivory-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-charcoal-900">{apt.startTime} — {apt.endTime}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                        apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700'
                          : apt.status === 'in_progress' ? 'bg-blue-100 text-blue-700 animate-pulse'
                            : apt.status === 'confirmed' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-charcoal-800">{apt.customerName}</div>
                    <div className="text-[10px] text-charcoal-500 truncate">
                      {apt.serviceNames.join(', ')} · {apt.staffName}
                    </div>
                    {userRole !== 'staff' && apt.status !== 'completed' && (
                      <button
                        onClick={() => convertAppointmentToPOS(apt)}
                        className="w-full mt-1 py-1.5 rounded-xl bg-gradient-to-r from-champagne-500 to-gold-500 text-white font-bold text-[10px] hover:opacity-90 transition flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3 h-3" /> Proses ke Kasir
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Staff */}
          <div className="surface p-6">
            <h3 className="font-display text-base font-bold text-charcoal-900 mb-4">Performa Staf</h3>
            <div className="space-y-2.5">
              {staff.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-ivory-50 border border-ivory-200/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-champagne-200" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-charcoal-900 truncate">{s.name}</div>
                      <div className="text-[9px] text-charcoal-400 truncate">{s.role}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-bold text-champagne-700">{s.todayServed} selesai</div>
                    <div className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5 justify-end">
                      <Star className="w-2.5 h-2.5 fill-emerald-500" /> {s.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Promo gallery */}
      <div className="surface p-6">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <span className="chip bg-champagne-50 text-champagne-700 border border-champagne-200">
              <Sparkles className="w-3.5 h-3.5" /> Menu Favorit
            </span>
            <h3 className="font-display text-lg font-bold text-charcoal-900 mt-2">Layanan Paling Dicari</h3>
            <p className="text-[11px] text-charcoal-500">Tampilkan ke pelanggan untuk meningkatkan engagement & repeat order.</p>
          </div>
          <button onClick={() => setActiveTab('pricelist')} className="btn-ghost shrink-0">
            <BookOpen className="w-4 h-4" /> Price List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promos.map(p => (
            <button
              key={p.title}
              onClick={() => setActiveTab('pricelist')}
              className="relative overflow-hidden rounded-3xl text-left group h-44"
            >
              <img src={p.img} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-t ${p.tone} via-charcoal-900/30 to-transparent`} />
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <span className="chip bg-white/20 border border-white/25 text-white self-start mb-1.5">{p.tag}</span>
                <div className="font-display text-sm font-bold leading-tight">{p.title}</div>
                <div className="text-[10px] text-white/75">{p.desc}</div>
                <div className="mt-1.5 text-xs font-bold text-champagne-200">Mulai {formatIDR(p.price)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Low stock */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-900 font-display font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Peringatan Stok Menipis
            </div>
            <span className="chip bg-amber-200 text-amber-900">{lowStockProducts.length} item</span>
          </div>
          <p className="text-[11px] text-amber-800 mb-3">Stok di bawah batas minimum — buat pesanan ke pemasok agar operasional tetap lancar.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {lowStockProducts.map(prod => (
              <div key={prod.id} className="flex items-center justify-between bg-white/85 p-2.5 rounded-xl text-xs border border-amber-100">
                <span className="font-medium text-charcoal-800 truncate">{prod.name}</span>
                <span className="font-bold text-rose-600 text-[10px] shrink-0">sisa {prod.currentStock} {prod.unit}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('procurement')} className="mt-3 btn-brand">
            <Truck className="w-3.5 h-3.5" /> Buat Purchase Order
          </button>
        </div>
      )}
    </div>
  );
};
