import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  Scissors,
  ArrowRight,
  CalendarDays,
  Star,
  Flower2,
  Palette,
  Wand2,
  Sparkle,
  Brush,
  Sun
} from 'lucide-react';
import {
  PRICE_LIST_CATEGORIES,
  SALON_GALLERY,
  HERO_IMAGE,
  formatIDR,
  priceLabel
} from '../../data/priceList';

const iconFor = (id) => {
  const map = {
    'hair-cut': Scissors,
    haircut: Scissors,
    creambath: Flower2,
    'hairmask-keratin': Sparkle,
    hairmask: Sparkle,
    'semir-hitam': Palette,
    'semir-warna': Wand2,
    'semir-toning': Sun,
    perming: Sparkles,
    smoothing: Brush,
    'cuci-blow-catok': Sun,
    'cuci-blow': Sun,
    'rias-wajah': Sparkles,
  };
  return map[id] || Sparkles;
};

const accents = [
  'from-champagne-500 to-gold-500',
  'from-gold-500 to-blue-500',
  'from-blue-500 to-violet-500',
  'from-charcoal-700 to-gold-500',
  'from-champagne-500 to-violet-500',
  'from-gold-400 to-champagne-500',
  'from-blue-400 to-champagne-500',
  'from-violet-500 to-blue-400',
  'from-champagne-400 to-blue-400',
  'from-gold-500 to-champagne-500',
];

export const PriceListModule = () => {
  const { setActiveTab } = useApp();
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRICE_LIST_CATEGORIES
      .map((cat, idx) => {
        const groups = cat.groups
          .map(g => ({
            ...g,
            items: q
              ? g.items.filter(i =>
                  `${cat.name} ${g.label} ${i.variant} ${i.detail || ''} ${i.priceLabel || i.price || ''}`
                    .toLowerCase()
                    .includes(q))
              : g.items,
          }))
          .filter(g => g.items.length > 0);
        return { ...cat, groups, accent: accents[idx % accents.length] };
      })
      .filter(cat => cat.groups.length > 0)
      .filter(cat => active === 'all' || cat.id === active);
  }, [active, query]);

  const totalItems = PRICE_LIST_CATEGORIES.reduce(
    (acc, c) => acc + c.groups.reduce((sum, g) => sum + g.items.length, 0),
    0
  );

  const countOf = (cat) => cat.groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] shadow-luxury">
        <img src={HERO_IMAGE} alt="PU Salon Studio" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-900/75 to-champagne-800/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(236,76,135,.35),transparent_45%),radial-gradient(circle_at_15%_90%,rgba(79,140,255,.3),transparent_45%)]" />

        <div className="relative z-10 p-8 md:p-11 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl space-y-3 text-white">
            <span className="chip bg-white/15 border border-white/20 text-champagne-100 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" /> Buku Menu Salon
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
              PRICE LIST
              <span className="block text-base md:text-xl font-medium text-champagne-200 tracking-[0.3em] mt-1.5">
                PU SALON &amp; BARBERSHOP
              </span>
            </h1>
            <p className="text-xs md:text-sm text-white/75 max-w-md leading-relaxed">
              Daftar harga resmi layanan hair cut, creambath, coloring, perming, hingga rias wajah.
              Harga transparan — pilih layanan favorit lalu lanjutkan ke booking.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="chip bg-emerald-400/15 text-emerald-200 border border-emerald-300/25">
                <Star className="w-3 h-3" /> 4.9 rating pelanggan
              </span>
              <span className="chip bg-blue-400/15 text-blue-200 border border-blue-300/25">
                {PRICE_LIST_CATEGORIES.length} kategori · {totalItems} layanan
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button onClick={() => setActiveTab('booking')} className="btn-brand px-5 py-3 whitespace-nowrap">
              <CalendarDays className="w-4 h-4" /> Booking Sekarang
            </button>
            <button onClick={() => setActiveTab('pos')} className="btn-ghost px-5 py-3 bg-white/10 text-white border-white/25 hover:bg-white/20 hover:text-white whitespace-nowrap">
              Kasir <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter & search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 min-w-0">
          <button
            onClick={() => setActive('all')}
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              active === 'all'
                ? 'bg-gradient-to-r from-champagne-500 to-gold-500 text-white shadow-glow-pink'
                : 'bg-white/80 border border-ivory-300 text-charcoal-600 hover:border-champagne-300'
            }`}
          >
            Semua Layanan
          </button>
          {PRICE_LIST_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                active === c.id
                  ? 'bg-gradient-to-r from-champagne-500 to-gold-500 text-white shadow-glow-pink'
                  : 'bg-white/80 border border-ivory-300 text-charcoal-600 hover:border-champagne-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="relative lg:w-72 shrink-0">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari layanan…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/85 border border-ivory-300 text-xs text-charcoal-700 placeholder:text-charcoal-400 focus:outline-none focus:ring-4 focus:ring-champagne-200/60 focus:border-champagne-300"
          />
        </div>
      </div>

      {/* Menu book */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {categories.map(cat => {
          const Icon = iconFor(cat.id);
          return (
            <article key={cat.id} className="surface overflow-hidden group">
              <header className={`relative px-6 py-5 bg-gradient-to-r ${cat.accent} text-white`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/25 backdrop-blur flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-white/70">{cat.code}</span>
                        <h2 className="font-display text-lg font-bold leading-tight">{cat.name}</h2>
                      </div>
                      <p className="text-[11px] text-white/75 mt-0.5">
                        {cat.groups[0]?.label ? 'Harga per kategori pelanggan' : 'Daftar harga layanan'}
                      </p>
                    </div>
                  </div>
                  <span className="chip bg-white/15 border border-white/25 text-white shrink-0">
                    {countOf(cat)} item
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-sheen opacity-40 pointer-events-none" />
              </header>

              <div className="divide-y divide-ivory-200/80">
                {cat.groups.map((group, gi) => (
                  <div key={`${cat.id}-g${gi}`}>
                    {group.label && (
                      <div className="px-6 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal-400 bg-ivory-50/60">
                        {group.label}
                      </div>
                    )}
                    {group.items.map((item, idx) => (
                      <div
                        key={`${cat.id}-${gi}-${idx}`}
                        className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-ivory-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 shrink-0 rounded-xl bg-ivory-100 border border-ivory-300 text-[9px] font-bold text-charcoal-500 flex items-center justify-center">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-charcoal-800 truncate">
                              {item.detail || 'Layanan standar'}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                                item.variant === 'Male'
                                  ? 'bg-blue-50 text-blue-700'
                                  : item.variant === 'Female'
                                    ? 'bg-champagne-50 text-champagne-700'
                                    : 'bg-violet-50 text-violet-700'
                              }`}>
                                {item.variant}
                              </span>
                              {group.label && (
                                <span className="text-[9px] text-charcoal-400">{group.label}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-display text-sm font-bold text-charcoal-900">
                            {priceLabel(item)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="surface p-10 text-center text-sm text-charcoal-500">
          Tidak ada layanan yang cocok dengan pencarian “{query}”.
        </div>
      )}

      <p className="text-center text-[10px] text-charcoal-400 leading-relaxed">
        Harga dapat berubah sewaktu-waktu. Panjang rambut dan kondisi rambut tertentu dapat menyesuaikan konsultasi stylist.
      </p>

      {/* Gallery — engagement */}
      <section className="surface p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
          <div>
            <span className="chip bg-champagne-50 text-champagne-700 border border-champagne-200">
              <Sparkles className="w-3.5 h-3.5" /> Galeri
            </span>
            <h2 className="font-display text-xl font-bold text-charcoal-900 mt-2">Momen di PU Salon</h2>
            <p className="text-xs text-charcoal-500 mt-1">Lihat suasana studio, hasil styling, dan treatment favorit pelanggan.</p>
          </div>
          <button onClick={() => setActiveTab('booking')} className="btn-ghost self-start md:self-auto">
            Reservasi Kursi <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SALON_GALLERY.map((g, i) => (
            <figure key={g.src} className={`relative overflow-hidden rounded-2xl group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img
                src={g.src}
                alt={g.title}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 ? 'h-64 md:h-full min-h-[240px]' : 'h-40'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-charcoal-900/10 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-xs font-bold text-white">{g.title}</div>
                <div className="text-[10px] text-white/70">{g.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
};
