import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
  History,
  Boxes,
  Truck,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';

export const InventoryModule = () => {
  const {
    products,
    setProducts,
    batches,
    movements,
    suppliers,
    setActiveTab,
    showToast,
    userRole
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('products'); // 'products' | 'batches' | 'movements'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [adjustType, setAdjustType] = useState('in'); // 'in' | 'out' | 'adjustment'
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustNotes, setAdjustNotes] = useState('');

  // Low stock products
  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.type === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Handle manual stock adjustment
  const handleStockAdjustment = (e) => {
    e.preventDefault();
    if (!selectedProduct || adjustQty <= 0) return;

    const qtyNumber = Number(adjustQty);
    const newStock = adjustType === 'in'
      ? selectedProduct.currentStock + qtyNumber
      : Math.max(0, selectedProduct.currentStock - qtyNumber);

    // Update product stock
    setProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        return { ...p, currentStock: newStock };
      }
      return p;
    }));

    showToast(
      'success',
      'Penyesuaian Stok Berhasil',
      `${selectedProduct.name} telah disesuaikan (${adjustType === 'in' ? '+' : '-'}${qtyNumber} ${selectedProduct.unit}). Stok sekarang: ${newStock}`
    );

    setIsAdjustModalOpen(false);
    setAdjustQty(1);
    setAdjustNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Total Jenis SKU</div>
            <div className="text-2xl font-serif font-bold text-charcoal-900 mt-1">{products.length} Produk</div>
            <div className="text-[11px] text-charcoal-500 font-medium">
              {products.filter(p=>p.type==='retail').length} Ritel • {products.filter(p=>p.type==='material').length} Bahan Salon
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
            <Boxes className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Stok Menipis (Alert)</div>
            <div className={`text-2xl font-serif font-bold mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {lowStockCount} Item
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">Di bawah batas minimum</div>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Metode Valuasi</div>
            <div className="text-lg font-serif font-bold text-charcoal-900 mt-1">FIFO (First In First Out)</div>
            <div className="text-[11px] text-champagne-800 font-bold">Stok terlama dipakai/dijual duluan</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Layers className="w-6 h-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Control Bar & Sub-Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 bg-ivory-100 p-1 rounded-2xl border border-ivory-300">
          <button
            onClick={() => setActiveTabSub('products')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'products' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Boxes className="w-4 h-4 text-champagne-600" />
            <span>Katalog Produk & Stok</span>
          </button>
          <button
            onClick={() => setActiveTabSub('batches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'batches' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Antrean Batch FIFO</span>
          </button>
          <button
            onClick={() => setActiveTabSub('movements')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'movements' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>Log Mutasi Stok</span>
          </button>
        </div>

        {/* Search, Filter & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Cari nama atau SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:border-champagne-500"
            />
          </div>

          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="px-3.5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-champagne-400" />
            <span>Koreksi Stok</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Products Table */}
      {activeTabSub === 'products' && (
        <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory-100/80 border-b border-ivory-300 text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">SKU & Nama Barang</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Sisa Stok</th>
                  <th className="py-3.5 px-4">Min. Stok</th>
                  <th className="py-3.5 px-4">Harga Beli Modal</th>
                  <th className="py-3.5 px-4">Harga Jual Ritel</th>
                  <th className="py-3.5 px-4">Status Stok</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 text-xs">
                {filteredProducts.map(prod => {
                  const isLow = prod.currentStock <= prod.minStock;
                  return (
                    <tr key={prod.id} className="hover:bg-ivory-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-charcoal-900">{prod.name}</div>
                        <div className="text-[10px] font-mono text-charcoal-400">{prod.sku}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          prod.type === 'retail' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {prod.type === 'retail' ? 'Ritel Konsumen' : 'Bahan Treatment'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-charcoal-900">
                        {prod.currentStock} <span className="text-charcoal-500 font-normal">{prod.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-charcoal-500">
                        {prod.minStock} {prod.unit}
                      </td>
                      <td className="py-3 px-4 font-semibold text-charcoal-700">
                        Rp {prod.buyPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 font-bold text-champagne-800">
                        {prod.sellPrice > 0 ? `Rp ${prod.sellPrice.toLocaleString('id-ID')}` : '- (Pemakaian Salon)'}
                      </td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Menipis (Restock)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isLow && (
                          <button
                            onClick={() => setActiveTab('procurement')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg shadow-sm"
                          >
                            Pesan ke Supplier
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: FIFO Batches Viewer */}
      {activeTabSub === 'batches' && (
        <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-charcoal-900">Pelacakan Batch FIFO Aktif</h3>
            <p className="text-xs text-charcoal-400">
              Antrean inventaris diprioritaskan berdasarkan tanggal masuk terawal (First-In, First-Out).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory-100/80 border-b border-ivory-300 text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Nomor Batch</th>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Tgl Masuk</th>
                  <th className="py-3 px-4">Sisa / Awal Qty</th>
                  <th className="py-3 px-4">Harga Beli Modal</th>
                  <th className="py-3 px-4">Kadaluwarsa</th>
                  <th className="py-3 px-4">Status Antrean</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 text-xs">
                {batches.map((btc, idx) => {
                  const product = products.find(p => p.id === btc.productId);
                  const isExhausted = btc.remainingQty === 0;
                  return (
                    <tr key={btc.id} className={`hover:bg-ivory-50/70 transition-colors ${isExhausted ? 'opacity-50 bg-gray-50' : ''}`}>
                      <td className="py-3 px-4 font-mono font-bold text-charcoal-800">
                        {btc.batchNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-charcoal-900">{product?.name || 'Produk'}</div>
                      </td>
                      <td className="py-3 px-4 text-charcoal-600">{btc.dateIn}</td>
                      <td className="py-3 px-4 font-bold text-charcoal-900">
                        {btc.remainingQty} / {btc.initialQty} {product?.unit}
                      </td>
                      <td className="py-3 px-4 font-semibold text-charcoal-700">
                        Rp {btc.costPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-charcoal-500">{btc.expiryDate}</td>
                      <td className="py-3 px-4">
                        {isExhausted ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-200 text-gray-700">Habis</span>
                        ) : idx === 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 animate-pulse">
                            Prioritas Keluar (FIFO #1)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-ivory-200 text-charcoal-700">
                            Antrean #{idx + 1}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Stock Movement Log */}
      {activeTabSub === 'movements' && (
        <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-charcoal-900">Histori Pergerakan Stok (Audit Trail)</h3>
            <p className="text-xs text-charcoal-400">
              Setiap pemakaian jasa salon, penjualan POS, dan penerimaan PO dicatat secara transparan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory-100/80 border-b border-ivory-300 text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Nama Produk</th>
                  <th className="py-3 px-4">Jenis Mutasi</th>
                  <th className="py-3 px-4">Jumlah (Qty)</th>
                  <th className="py-3 px-4">No. Referensi</th>
                  <th className="py-3 px-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 text-xs">
                {movements.map(mov => (
                  <tr key={mov.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="py-3 px-4 text-charcoal-500 font-mono text-[11px]">{mov.date}</td>
                    <td className="py-3 px-4 font-bold text-charcoal-900">{mov.productName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        mov.type === 'in' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {mov.type === 'in' ? <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> : <ArrowUpRight className="w-3 h-3 text-rose-600" />}
                        {mov.type === 'in' ? 'Stok Masuk' : 'Stok Keluar'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 font-bold ${mov.type === 'in' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {mov.type === 'in' ? `+${mov.qty}` : `-${mov.qty}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-charcoal-600">{mov.reference}</td>
                    <td className="py-3 px-4 text-charcoal-500">{mov.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-charcoal-900">Koreksi Stok Fisik / Penyesuaian</h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700">✕</button>
            </div>

            <form onSubmit={handleStockAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Pilih Produk</label>
                <select
                  value={selectedProduct?.id || ''}
                  onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value) || null)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-medium focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stok Saat Ini: {p.currentStock} {p.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Tipe Penyesuaian</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('in')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      adjustType === 'in' ? 'bg-emerald-600 text-white' : 'bg-ivory-100 text-charcoal-600'
                    }`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" /> Stok Masuk (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('out')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      adjustType === 'out' ? 'bg-rose-600 text-white' : 'bg-ivory-100 text-charcoal-600'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Stok Keluar (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Jumlah (Qty)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Alasan Penyesuaian</label>
                <input
                  type="text"
                  placeholder="Contoh: Stok opname bulanan, barang rusak..."
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 font-semibold text-charcoal-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold rounded-xl"
                >
                  Simpan Koreksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
