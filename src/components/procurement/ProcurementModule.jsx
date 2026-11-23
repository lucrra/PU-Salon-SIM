import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  Plus,
  Search,
  PackageCheck,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Boxes,
  FileText,
  AlertCircle
} from 'lucide-react';

export const ProcurementModule = () => {
  const {
    suppliers,
    purchaseOrders,
    products,
    createPurchaseOrder,
    receivePurchaseOrder,
    userRole
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('orders'); // 'orders' | 'suppliers'
  const [searchQuery, setSearchQuery] = useState('');

  // New PO Modal
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poItems, setPoItems] = useState([
    { productId: products[0]?.id || '', qty: 5, unitPrice: products[0]?.buyPrice || 50000 }
  ]);
  const [poNotes, setPoNotes] = useState('');

  // Handle PO Item changes
  const handleAddItemRow = () => {
    setPoItems(prev => [
      ...prev,
      { productId: products[0]?.id || '', qty: 5, unitPrice: products[0]?.buyPrice || 50000 }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    setPoItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setPoItems(prev => {
      return prev.map((item, idx) => {
        if (idx === index) {
          if (field === 'productId') {
            const prod = products.find(p => p.id === value);
            return {
              ...item,
              productId: value,
              unitPrice: prod ? prod.buyPrice : item.unitPrice
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      });
    });
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    if (poItems.length === 0) return;

    const supplier = suppliers.find(s => s.id === selectedSupplierId);

    const calculatedItems = poItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const qty = Number(item.qty) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      return {
        productId: item.productId,
        productName: prod ? prod.name : 'Produk',
        qty,
        unitPrice,
        total: qty * unitPrice
      };
    });

    const totalAmount = calculatedItems.reduce((acc, i) => acc + i.total, 0);

    createPurchaseOrder({
      supplierId: selectedSupplierId,
      supplierName: supplier ? supplier.name : 'Supplier',
      items: calculatedItems,
      totalAmount,
      notes: poNotes
    });

    setIsPOModalOpen(false);
    setPoItems([{ productId: products[0]?.id || '', qty: 5, unitPrice: products[0]?.buyPrice || 50000 }]);
    setPoNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Total Purchase Orders</div>
            <div className="text-2xl font-serif font-bold text-charcoal-900 mt-1">{purchaseOrders.length} Pesanan</div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              {purchaseOrders.filter(p => p.status === 'received').length} Pesanan Selesai Diterima
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
            <Truck className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Menunggu Barang Datang</div>
            <div className="text-2xl font-serif font-bold text-amber-600 mt-1">
              {purchaseOrders.filter(p => p.status === 'ordered').length} PO Aktif
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">Dalam proses pengiriman supplier</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Pemasok Resmi Terdaftar</div>
            <div className="text-2xl font-serif font-bold text-purple-700 mt-1">{suppliers.length} Supplier</div>
            <div className="text-[11px] text-charcoal-500 font-medium">Distributor perlengkapan salon & barbershop</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Boxes className="w-6 h-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Sub Tabs and Actions Bar */}
      <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-ivory-100 p-1 rounded-2xl border border-ivory-300">
          <button
            onClick={() => setActiveTabSub('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'orders' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <FileText className="w-4 h-4 text-champagne-600" />
            <span>Daftar Purchase Order (PO)</span>
          </button>
          <button
            onClick={() => setActiveTabSub('suppliers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'suppliers' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Truck className="w-4 h-4 text-purple-600" />
            <span>Direktori Supplier</span>
          </button>
        </div>

        <button
          onClick={() => setIsPOModalOpen(true)}
          className="px-4 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Buat Purchase Order Baru</span>
        </button>
      </div>

      {/* Content: Orders List */}
      {activeTabSub === 'orders' && (
        <div className="space-y-4">
          {purchaseOrders.map(po => {
            const isReceived = po.status === 'received';
            return (
              <div
                key={po.id}
                className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4 hover:border-champagne-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-ivory-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-charcoal-900">{po.poNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isReceived ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isReceived ? 'Barang Diterima & Masuk Stok' : 'Dipesan (Dalam Pengiriman)'}
                      </span>
                    </div>
                    <div className="text-xs text-charcoal-500 mt-0.5">
                      Supplier: <span className="font-bold text-charcoal-800">{po.supplierName}</span> • Tgl Order: {po.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-champagne-900">
                        Rp {po.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-charcoal-400">{po.items.length} Macam Barang</div>
                    </div>

                    {!isReceived && (
                      <button
                        onClick={() => receivePurchaseOrder(po.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Terima Barang & Restock</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in this PO */}
                <div className="bg-ivory-50 rounded-2xl p-3 border border-ivory-200">
                  <div className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-2">Item yang Dipesan:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-xl border border-ivory-200 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-charcoal-800">{item.productName}</div>
                          <div className="text-[10px] text-charcoal-500">Qty: {item.qty} pcs @ Rp {item.unitPrice.toLocaleString('id-ID')}</div>
                        </div>
                        <div className="font-bold text-charcoal-900">
                          Rp {item.total.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                  {po.notes && (
                    <div className="mt-2 text-[11px] text-charcoal-500 italic">
                      Catatan: "{po.notes}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content: Suppliers Directory */}
      {activeTabSub === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map(sup => (
            <div key={sup.id} className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-ivory-200">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal-900">{sup.name}</h4>
                  <div className="text-[10px] text-charcoal-500">PIC: {sup.contactPerson}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-charcoal-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-champagne-600" />
                  <span>{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-champagne-600" />
                  <span>{sup.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-champagne-600" />
                  <span className="truncate">{sup.address}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-ivory-200">
                <div className="text-[10px] font-bold text-charcoal-400 uppercase mb-1">Produk Disediakan:</div>
                <div className="flex flex-wrap gap-1">
                  {sup.productsSupplied.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-ivory-100 text-charcoal-700 text-[10px] font-medium border border-ivory-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New PO Modal */}
      {isPOModalOpen && (
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-charcoal-900">Buat Purchase Order Baru</h3>
              <button onClick={() => setIsPOModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700">✕</button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Pilih Supplier Resmi *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-medium focus:outline-none"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.contactPerson})</option>
                  ))}
                </select>
              </div>

              {/* Items List to Order */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-charcoal-700">Item Barang yang Dipesan *</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-[11px] font-bold text-champagne-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah Baris Item
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {poItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-ivory-50 border border-ivory-200 flex items-center gap-2">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                        className="flex-1 px-2 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (Sisa: {p.currentStock})</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-16 px-2 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs font-bold text-center"
                      />

                      <input
                        type="number"
                        min="0"
                        placeholder="Harga"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        className="w-24 px-2 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs font-bold text-right"
                      />

                      {poItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengiriman sebelum tanggal 25..."
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsPOModalOpen(false)}
                  className="px-4 py-2 font-semibold text-charcoal-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold"
                >
                  Terbitkan Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
