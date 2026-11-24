import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRICE_LIST_META, PRICE_LIST_CATEGORIES } from '../../data/priceList';
import {
  Tags,
  Search,
  Printer,
  Copy,
  Download,
  Sparkles,
  Scissors,
  Instagram,
  Music2,
  Info
} from 'lucide-react';

const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

const priceLabel = (item) => item.priceLabel || rupiah(item.price);

export const PriceListModule = () => {
  const { showToast } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRICE_LIST_CATEGORIES
      .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
      .map(cat => {
        const groups = cat.groups
          .map(group => ({
            ...group,
            items: group.items.filter(item => {
              if (!q) return true;
              const haystack = `${cat.name} ${group.label} ${item.variant} ${item.detail || ''}`.toLowerCase();
              return haystack.includes(q);
            })
          }))
          .filter(group => group.items.length > 0);
        return { ...cat, groups };
      })
      .filter(cat => cat.groups.length > 0);
  }, [query, activeCategory]);

  const totalVariants = useMemo(
    () => PRICE_LIST_CATEGORIES.reduce(
      (acc, cat) => acc + cat.groups.reduce((sum, group) => sum + group.items.length, 0),
      0
    ),
    []
  );

  const numericPrices = useMemo(
    () => PRICE_LIST_CATEGORIES
      .flatMap(cat => cat.groups.flatMap(group => group.items.map(item => item.price)))
      .filter(price => typeof price === 'number'),
    []
  );

  const minPrice = Math.min(...numericPrices);
  const maxPrice = Math.max(...numericPrices);

  const buildShareText = () => {
    const lines = [
      `${PRICE_LIST_META.brand.toUpperCase()} — ${PRICE_LIST_META.title.toUpperCase()}`,
      PRICE_LIST_META.tagline,
      ''
    ];

    PRICE_LIST_CATEGORIES.forEach(cat => {
      lines.push(`${cat.code}. ${cat.name.toUpperCase()}`);
      cat.groups.forEach(group => {
        if (group.label) lines.push(`   ${group.label}`);
        group.items.forEach(item => {
          const detail = item.detail ? ` (${item.detail})` : '';
          lines.push(`   - ${item.variant}${detail}: ${priceLabel(item)}`);
        });
      });
      lines.push('');
    });

    lines.push(`Instagram/TikTok: @${PRICE_LIST_META.instagram}`);
    lines.push(PRICE_LIST_META.note);
    return lines.join('\n');
  };

  const fallbackCopy = (text) => {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.left = '0';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  };

  const handleCopy = async () => {
    const text = buildShareText();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showToast('success', 'Teks Disalin', 'Price list siap ditempel ke WhatsApp atau media sosial.');
        return;
      }
      if (fallbackCopy(text)) {
        showToast('success', 'Teks Disalin', 'Price list siap ditempel ke WhatsApp atau media sosial.');
        return;
      }
      showToast('error', 'Gagal Menyalin', 'Browser menolak akses clipboard. Silakan gunakan tombol CSV.');
    } catch (err) {
      if (fallbackCopy(text)) {
        showToast('success', 'Teks Disalin', 'Price list siap ditempel ke WhatsApp atau media sosial.');
      } else {
        showToast('error', 'Gagal Menyalin', 'Browser menolak akses clipboard. Silakan gunakan tombol CSV.');
      }
    }
  };

  const handleExportCSV = () => {
    const rows = [['Kategori', 'Grup', 'Varian', 'Detail', 'Harga']];
    PRICE_LIST_CATEGORIES.forEach(cat => {
      cat.groups.forEach(group => {
        group.items.forEach(item => {
          rows.push([
            cat.name,
            group.label || '-',
            item.variant,
            item.detail || '-',
            item.priceLabel || item.price
          ]);
        });
      });
    });

    const csv = rows
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'price-list-pu-salon.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('success', 'CSV Diunduh', 'Price list berhasil diekspor ke file CSV.');
  };

  return (
    <div className="space-y-6">
      <div id="printable-price-list" className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-900 to-charcoal-800 text-ivory-50 rounded-3xl p-6 md:p-8 shadow-luxury relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-champagne-500/10 blur-2xl" />
          <div className="absolute right-8 bottom-6 opacity-10">
            <Scissors className="w-32 h-32" />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-champagne-300 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" /> Katalog Harga Resmi
              </div>
              <h2 className="font-serif font-bold text-3xl md:text-4xl mt-1 text-ivory-50">
                {PRICE_LIST_META.title}
              </h2>
              <p className="text-xs text-charcoal-300 mt-1.5 max-w-xl">
                {PRICE_LIST_META.brand} — {PRICE_LIST_META.tagline}. Daftar harga layanan salon, barbershop, dan rias.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] text-charcoal-300">
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Update {PRICE_LIST_META.updatedAt}</span>
                <span className="flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5 text-champagne-400" /> @{PRICE_LIST_META.instagram}</span>
                <span className="flex items-center gap-1.5"><Music2 className="w-3.5 h-3.5 text-champagne-400" /> @{PRICE_LIST_META.tiktok}</span>
              </div>
            </div>

            <div className="no-print flex flex-wrap items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-ivory-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4" /> Salin Teks
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-ivory-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">Kategori Layanan</div>
              <div className="text-xl font-serif font-bold text-charcoal-900 mt-1">{PRICE_LIST_CATEGORIES.length} Kategori</div>
              <div className="text-[11px] text-charcoal-500">Salon, barbershop &amp; rias</div>
            </div>
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
              <Tags className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">Varian Harga</div>
              <div className="text-xl font-serif font-bold text-charcoal-900 mt-1">{totalVariants} Varian</div>
              <div className="text-[11px] text-charcoal-500">Berdasarkan gender &amp; panjang rambut</div>
            </div>
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">Rentang Harga</div>
              <div className="text-base sm:text-lg font-serif font-bold text-charcoal-900 mt-1 leading-tight break-words">{rupiah(minPrice)} – {rupiah(maxPrice)}</div>
              <div className="text-[11px] text-charcoal-500">Harga mulai dari layanan dasar</div>
            </div>
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="no-print bg-white p-4 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari layanan, varian, atau kategori..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-100 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-champagne-300"
              />
            </div>
            <div className="text-[11px] text-charcoal-500">
              Menampilkan <span className="font-bold text-charcoal-800">{categories.length}</span> dari {PRICE_LIST_CATEGORIES.length} kategori
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-charcoal-900 text-ivory-50'
                  : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
              }`}
            >
              Semua
            </button>
            {PRICE_LIST_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-charcoal-900 text-ivory-50'
                    : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map(cat => {
            const itemCount = cat.groups.reduce((sum, group) => sum + group.items.length, 0);
            return (
              <div
                key={cat.id}
                className="print-card bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3 hover:border-champagne-400 transition-all"
              >
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-ivory-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-charcoal-900 text-champagne-300 font-serif font-bold text-sm flex items-center justify-center shrink-0">
                      {cat.code}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-base text-charcoal-900 leading-tight">{cat.name}</h3>
                      <div className="text-[10px] text-charcoal-400 uppercase tracking-wider font-semibold">
                        {itemCount} varian harga
                      </div>
                    </div>
                  </div>
                  <Tags className="w-4 h-4 text-champagne-500 shrink-0" />
                </div>

                <div className="space-y-2">
                  {cat.groups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-1">
                      {group.label && (
                        <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider pt-1">
                          {group.label}
                        </div>
                      )}
                      {group.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center justify-between gap-3 py-1.5 border-b border-ivory-100 last:border-0"
                        >
                          <div className="min-w-0 flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs text-charcoal-800">{item.variant}</span>
                            {item.detail && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-ivory-100 border border-ivory-200 text-charcoal-500">
                                {item.detail}
                              </span>
                            )}
                          </div>
                          <div className="font-serif font-bold text-sm text-charcoal-900 whitespace-nowrap">
                            {priceLabel(item)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {cat.id === 'semir-toning' && (
                  <div className="flex items-start gap-1.5 text-[10px] text-charcoal-500 italic pt-1">
                    <Info className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>Harga rambut panjang menyesuaikan panjang & kondisi rambut saat konsultasi.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-10 text-center text-xs text-charcoal-500">
            Tidak ada layanan yang cocok dengan pencarian "{query}".
          </div>
        )}

        {/* Footer note */}
        <div className="bg-ivory-100 rounded-3xl border border-ivory-300 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2 text-[11px] text-charcoal-600">
            <Info className="w-4 h-4 text-champagne-600 mt-0.5 shrink-0" />
            <span>{PRICE_LIST_META.note}</span>
          </div>
          <div className="text-[11px] font-bold text-charcoal-700 whitespace-nowrap">
            @{PRICE_LIST_META.instagram}
          </div>
        </div>
      </div>
    </div>
  );
};
