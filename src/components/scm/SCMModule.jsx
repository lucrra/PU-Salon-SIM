import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Warehouse,
  Truck,
  ClipboardList,
  LayoutDashboard,
  Plus,
  Search,
  PackageCheck,
  ArrowRightLeft,
  ClipboardCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  Boxes,
  AlertTriangle,
  Wallet,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Building2,
  Send,
  Trash2
} from 'lucide-react';

const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  ordered: 'bg-amber-100 text-amber-800 border-amber-200',
  received: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  draft: 'bg-charcoal-100 text-charcoal-700 border-charcoal-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

const STATUS_LABELS = {
  pending: 'Menunggu Approval',
  approved: 'Disetujui',
  converted: 'Sudah Jadi PO',
  rejected: 'Ditolak',
  ordered: 'Dipesan',
  received: 'Diterima',
  completed: 'Selesai',
  draft: 'Draft',
  cancelled: 'Dibatalkan',
  active: 'Aktif'
};

const Badge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
    {STATUS_LABELS[status] || status}
  </span>
);

const Modal = ({ title, subtitle, onClose, children, wide }) => (
  <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`bg-white w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4 max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-start justify-between pb-3 border-b border-ivory-200">
        <div>
          <h3 className="font-serif font-bold text-base text-charcoal-900">{title}</h3>
          {subtitle && <p className="text-[11px] text-charcoal-500 mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="text-charcoal-400 hover:text-charcoal-700 text-lg leading-none">✕</button>
      </div>
      {children}
    </div>
  </div>
);

const KpiCard = ({ label, value, hint, icon: Icon, tone }) => {
  const tones = {
    gold: 'bg-champagne-100 text-champagne-800',
    rose: 'bg-rose-100 text-rose-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700'
  };
  return (
    <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">{label}</div>
        <div className="text-xl font-serif font-bold text-charcoal-900 mt-1 truncate">{value}</div>
        {hint && <div className="text-[11px] text-charcoal-500 font-medium mt-0.5">{hint}</div>}
      </div>
      <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${tones[tone] || tones.gold}`}>
        <Icon className="w-5 h-5 stroke-[2]" />
      </div>
    </div>
  );
};

export const SCMModule = () => {
  const {
    products,
    suppliers,
    purchaseOrders,
    movements,
    warehouses,
    warehouseStock,
    requisitions,
    goodsReceipts,
    stockTransfers,
    stockAdjustments,
    addSupplier,
    createRequisition,
    approveRequisition,
    rejectRequisition,
    convertRequisitionToPO,
    receivePurchaseOrder,
    createStockTransfer,
    createStockAdjustment
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockWarehouseId, setStockWarehouseId] = useState('all');

  // Modal states
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [receivePO, setReceivePO] = useState(null);
  const [receiveWarehouseId, setReceiveWarehouseId] = useState('wh-main');
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);

  const defaultProduct = products[0] || { id: '', buyPrice: 0, unit: 'pcs' };

  // Supplier form
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    category: '',
    paymentTerms: 'NET 30',
    leadTimeDays: 5,
    rating: 4.5,
    productsSupplied: ''
  });

  // Requisition form
  const [prForm, setPrForm] = useState({
    department: 'Barbershop',
    requestedBy: '',
    warehouseId: 'wh-main',
    supplierId: suppliers[0]?.id || '',
    priority: 'medium',
    notes: '',
    items: [{ productId: defaultProduct.id, qty: 5, estimatedPrice: defaultProduct.buyPrice }]
  });

  // Transfer form
  const [transferForm, setTransferForm] = useState({
    fromWarehouseId: 'wh-main',
    toWarehouseId: 'wh-retail',
    productId: defaultProduct.id,
    qty: 1,
    requestedBy: '',
    notes: ''
  });

  // Adjustment form
  const [adjustForm, setAdjustForm] = useState({
    warehouseId: 'wh-main',
    productId: defaultProduct.id,
    physicalQty: 0,
    reason: ''
  });

  // ---------- Derived data ----------
  const inventoryValue = useMemo(
    () => products.reduce((acc, p) => acc + p.currentStock * p.buyPrice, 0),
    [products]
  );

  const lowStockProducts = useMemo(
    () => products.filter(p => p.currentStock <= p.minStock),
    [products]
  );

  const activePOs = useMemo(
    () => purchaseOrders.filter(p => p.status === 'ordered'),
    [purchaseOrders]
  );

  const pendingReqs = useMemo(
    () => requisitions.filter(r => r.status === 'pending'),
    [requisitions]
  );

  const reorderList = useMemo(() => {
    return lowStockProducts.map(p => {
      const suggestedQty = Math.max(p.minStock * 2 - p.currentStock, p.minStock);
      return {
        product: p,
        suggestedQty,
        estimatedCost: suggestedQty * p.buyPrice
      };
    }).sort((a, b) => a.product.currentStock - b.product.currentStock);
  }, [lowStockProducts]);

  const warehouseSummaries = useMemo(() => {
    return warehouses.map(wh => {
      const rows = warehouseStock.filter(r => r.warehouseId === wh.id && r.qty > 0);
      const totalUnits = rows.reduce((acc, r) => acc + r.qty, 0);
      const value = rows.reduce((acc, r) => {
        const prod = products.find(p => p.id === r.productId);
        return acc + r.qty * (prod ? prod.buyPrice : 0);
      }, 0);
      return {
        ...wh,
        totalUnits,
        value,
        skuCount: rows.length,
        capacityPct: wh.capacity ? Math.min(100, Math.round((totalUnits / wh.capacity) * 100)) : 0
      };
    });
  }, [warehouses, warehouseStock, products]);

  const supplierStats = useMemo(() => {
    return suppliers.map(sup => {
      const pos = purchaseOrders.filter(p => p.supplierId === sup.id);
      const received = pos.filter(p => p.status === 'received' && p.receivedDate);
      const onTime = received.filter(p => !p.expectedDate || p.receivedDate <= p.expectedDate);
      return {
        ...sup,
        poCount: pos.length,
        totalSpend: pos.reduce((acc, p) => acc + (p.totalAmount || 0), 0),
        receivedCount: received.length,
        onTimeRate: received.length ? Math.round((onTime.length / received.length) * 100) : null
      };
    });
  }, [suppliers, purchaseOrders]);

  const filteredSuppliers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return supplierStats;
    return supplierStats.filter(s =>
      [s.name, s.code, s.contactPerson, s.email, s.phone, s.category].join(' ').toLowerCase().includes(q)
    );
  }, [supplierStats, searchQuery]);

  const recentMovements = useMemo(() => {
    return [...movements]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [movements]);

  const stockRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let rows = [];

    if (stockWarehouseId === 'all') {
      rows = products.map(p => {
        const allocs = warehouseStock.filter(r => r.productId === p.id && r.qty > 0);
        return {
          product: p,
          qty: p.currentStock,
          warehouses: allocs.length,
          value: p.currentStock * p.buyPrice
        };
      });
    } else {
      rows = warehouseStock
        .filter(r => r.warehouseId === stockWarehouseId)
        .map(r => {
          const prod = products.find(p => p.id === r.productId);
          if (!prod) return null;
          return { product: prod, qty: r.qty, warehouses: 1, value: r.qty * prod.buyPrice };
        })
        .filter(Boolean);
    }

    if (q) {
      rows = rows.filter(r =>
        `${r.product.name} ${r.product.sku} ${r.product.category}`.toLowerCase().includes(q)
      );
    }

    return rows.sort((a, b) => a.product.name.localeCompare(b.product.name));
  }, [products, warehouseStock, stockWarehouseId, searchQuery]);

  const warehouseName = (id) => warehouses.find(w => w.id === id)?.name || (id ? '—' : 'Gudang Utama');

  // ---------- Handlers ----------
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) return;
    addSupplier({
      ...supplierForm,
      productsSupplied: supplierForm.productsSupplied
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    });
    setSupplierModalOpen(false);
    setSupplierForm({
      name: '', contactPerson: '', phone: '', email: '', address: '',
      category: '', paymentTerms: 'NET 30', leadTimeDays: 5, rating: 4.5, productsSupplied: ''
    });
  };

  const updatePrItem = (index, field, value) => {
    setPrForm(prev => {
      const items = prev.items.map((item, idx) => {
        if (idx !== index) return item;
        if (field === 'productId') {
          const prod = products.find(p => p.id === value);
          return { ...item, productId: value, estimatedPrice: prod ? prod.buyPrice : item.estimatedPrice };
        }
        return { ...item, [field]: value };
      });
      return { ...prev, items };
    });
  };

  const addPrItemRow = () => {
    setPrForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: defaultProduct.id, qty: 1, estimatedPrice: defaultProduct.buyPrice }]
    }));
  };

  const removePrItemRow = (index) => {
    setPrForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== index) }));
  };

  const prEstimate = prForm.items.reduce(
    (acc, i) => acc + (Number(i.qty) || 0) * (Number(i.estimatedPrice) || 0),
    0
  );

  const handleCreatePR = (e) => {
    e.preventDefault();
    if (prForm.items.length === 0) return;
    createRequisition({
      ...prForm,
      totalEstimate: prEstimate
    });
    setPrModalOpen(false);
    setPrForm({
      department: 'Barbershop',
      requestedBy: '',
      warehouseId: 'wh-main',
      supplierId: suppliers[0]?.id || '',
      priority: 'medium',
      notes: '',
      items: [{ productId: defaultProduct.id, qty: 5, estimatedPrice: defaultProduct.buyPrice }]
    });
  };

  const openReceiveModal = (po) => {
    setReceivePO(po);
    setReceiveWarehouseId(po.warehouseId || 'wh-main');
  };

  const handleReceive = () => {
    if (!receivePO) return;
    receivePurchaseOrder(receivePO.id, receiveWarehouseId);
    setReceivePO(null);
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const result = createStockTransfer({
      ...transferForm,
      qty: Number(transferForm.qty)
    });
    if (result.success) {
      setTransferModalOpen(false);
      setTransferForm({
        fromWarehouseId: 'wh-main',
        toWarehouseId: 'wh-retail',
        productId: defaultProduct.id,
        qty: 1,
        requestedBy: '',
        notes: ''
      });
    }
  };

  const handleAdjustment = (e) => {
    e.preventDefault();
    const result = createStockAdjustment({
      ...adjustForm,
      physicalQty: Number(adjustForm.physicalQty)
    });
    if (result.success) {
      setAdjustModalOpen(false);
      setAdjustForm({ warehouseId: 'wh-main', productId: defaultProduct.id, physicalQty: 0, reason: '' });
    }
  };

  const adjustSystemQty = warehouseStock.find(
    r => r.warehouseId === adjustForm.warehouseId && r.productId === adjustForm.productId
  )?.qty || 0;

  const adjustDifference = (Number(adjustForm.physicalQty) || 0) - adjustSystemQty;

  const transferAvailable = warehouseStock.find(
    r => r.warehouseId === transferForm.fromWarehouseId && r.productId === transferForm.productId
  )?.qty || 0;

  const subTabs = [
    { id: 'overview', label: 'Ringkasan SCM', icon: LayoutDashboard },
    { id: 'suppliers', label: 'Pemasok', icon: Truck },
    { id: 'procurement', label: 'Pengadaan', icon: ClipboardList },
    { id: 'warehouse', label: 'Gudang', icon: Warehouse }
  ];

  return (
    <div className="space-y-6">
      {/* Module header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-charcoal-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-champagne-600" />
            Supply Chain Management
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Pemasok, pengadaan (PR → PO), penerimaan barang, dan pengelolaan multi-gudang terintegrasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPrModalOpen(true)}
            className="px-4 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Ajukan Permintaan</span>
          </button>
          <button
            onClick={() => setTransferModalOpen(true)}
            className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Stok</span>
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="bg-white p-2 rounded-2xl border border-ivory-300/80 shadow-soft flex items-center gap-1.5 overflow-x-auto">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTabSub === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTabSub(tab.id); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                active ? 'bg-charcoal-900 text-ivory-50 shadow-sm' : 'text-charcoal-600 hover:bg-ivory-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTabSub === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard label="Nilai Persediaan" value={rupiah(inventoryValue)} hint={`${products.length} SKU aktif`} icon={Wallet} tone="gold" />
            <KpiCard label="Stok Kritis" value={`${lowStockProducts.length} Produk`} hint="Di bawah minimum stok" icon={AlertTriangle} tone="rose" />
            <KpiCard label="PO Aktif" value={`${activePOs.length} Pesanan`} hint={rupiah(activePOs.reduce((a, p) => a + p.totalAmount, 0))} icon={Truck} tone="amber" />
            <KpiCard label="PR Menunggu" value={`${pendingReqs.length} Permintaan`} hint={`${suppliers.length} pemasok terdaftar`} icon={ClipboardList} tone="blue" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Reorder suggestions */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal-900">Rekomendasi Pengadaan Ulang</h3>
                  <p className="text-[11px] text-charcoal-500">Produk di bawah minimum stok dan saran kuantitas pembelian.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                  {reorderList.length} item
                </span>
              </div>

              {reorderList.length === 0 ? (
                <div className="p-8 text-center text-xs text-charcoal-500 bg-ivory-50 rounded-2xl border border-ivory-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Semua stok produk berada di atas ambang minimum.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-charcoal-400 border-b border-ivory-200">
                        <th className="text-left py-2 pr-2 font-bold">Produk</th>
                        <th className="text-center py-2 px-2 font-bold">Stok</th>
                        <th className="text-center py-2 px-2 font-bold">Min</th>
                        <th className="text-center py-2 px-2 font-bold">Saran</th>
                        <th className="text-right py-2 pl-2 font-bold">Estimasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reorderList.map(({ product, suggestedQty, estimatedCost }) => (
                        <tr key={product.id} className="border-b border-ivory-100 last:border-0">
                          <td className="py-2.5 pr-2">
                            <div className="font-bold text-charcoal-800">{product.name}</div>
                            <div className="text-[10px] text-charcoal-400 font-mono">{product.sku}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`font-bold ${product.currentStock <= 0 ? 'text-rose-600' : 'text-amber-700'}`}>
                              {product.currentStock}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center text-charcoal-500">{product.minStock}</td>
                          <td className="py-2.5 px-2 text-center font-bold text-charcoal-900">
                            {suggestedQty} {product.unit}
                          </td>
                          <td className="py-2.5 pl-2 text-right font-semibold text-charcoal-700">{rupiah(estimatedCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent movements */}
            <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900">Mutasi Stok Terakhir</h3>
                <p className="text-[11px] text-charcoal-500">Pergerakan barang masuk, keluar, dan transfer.</p>
              </div>
              <div className="space-y-2">
                {recentMovements.map(mov => (
                  <div key={mov.id} className="p-2.5 rounded-xl border border-ivory-200 bg-ivory-50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        mov.type === 'in' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {mov.type === 'in' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-charcoal-800 truncate">{mov.productName}</div>
                        <div className="text-[10px] text-charcoal-500 truncate">
                          {warehouseName(mov.warehouseId)} • {fmtDate(mov.date)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-[11px] font-bold shrink-0 ${mov.type === 'in' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {mov.type === 'in' ? '+' : '−'}{mov.qty}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warehouse summary strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {warehouseSummaries.map(wh => (
              <div key={wh.id} className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
                      <Warehouse className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-charcoal-900">{wh.name}</div>
                      <div className="text-[10px] font-mono text-charcoal-400">{wh.code}</div>
                    </div>
                  </div>
                  <Badge status={wh.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-ivory-50 rounded-xl py-2 border border-ivory-200">
                    <div className="text-[10px] text-charcoal-400 uppercase font-bold">Unit</div>
                    <div className="text-sm font-bold text-charcoal-900">{wh.totalUnits}</div>
                  </div>
                  <div className="bg-ivory-50 rounded-xl py-2 border border-ivory-200">
                    <div className="text-[10px] text-charcoal-400 uppercase font-bold">SKU</div>
                    <div className="text-sm font-bold text-charcoal-900">{wh.skuCount}</div>
                  </div>
                  <div className="bg-ivory-50 rounded-xl py-2 border border-ivory-200">
                    <div className="text-[10px] text-charcoal-400 uppercase font-bold">Kapasitas</div>
                    <div className="text-sm font-bold text-charcoal-900">{wh.capacityPct}%</div>
                  </div>
                </div>
                <div>
                  <div className="h-1.5 rounded-full bg-ivory-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${wh.capacityPct > 85 ? 'bg-rose-500' : wh.capacityPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${wh.capacityPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-charcoal-500 mt-1.5">Nilai stok: <span className="font-bold text-charcoal-800">{rupiah(wh.value)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUPPLIERS ================= */}
      {activeTabSub === 'suppliers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-ivory-300/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, kode, PIC, atau kategori pemasok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-100 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-champagne-300"
              />
            </div>
            <button
              onClick={() => setSupplierModalOpen(true)}
              className="px-4 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Pemasok</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSuppliers.map(sup => (
              <div key={sup.id} className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3 hover:border-champagne-400 transition-all">
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-ivory-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm text-charcoal-900 truncate">{sup.name}</h4>
                      <div className="text-[10px] text-charcoal-500 font-mono">{sup.code} • PIC: {sup.contactPerson}</div>
                    </div>
                  </div>
                  <Badge status={sup.status} />
                </div>

                <div className="space-y-1.5 text-[11px] text-charcoal-600">
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-champagne-600" /><span>{sup.phone}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-champagne-600" /><span className="truncate">{sup.email}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-champagne-600" /><span className="truncate">{sup.address}</span></div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-ivory-50 rounded-xl py-2 border border-ivory-200">
                    <div className="text-[9px] text-charcoal-400 uppercase font-bold">Total PO</div>
                    <div className="text-sm font-bold text-charcoal-900">{sup.poCount}</div>
                  </div>
                  <div className="bg-ivory-50 rounded-xl py-2 border border-ivory-200">
                    <div className="text-[9px] text-charcoal-400 uppercase font-bold">Lead Time</div>
                    <div className="text-sm font-bold text-charcoal-900">{sup.leadTimeDays}h</div>
                  </div>
                  <div className="bg-ivory-50 rounded-xl py-2 border border-ivory-200">
                    <div className="text-[9px] text-charcoal-400 uppercase font-bold">On-Time</div>
                    <div className="text-sm font-bold text-charcoal-900">{sup.onTimeRate === null ? '—' : `${sup.onTimeRate}%`}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {sup.rating.toFixed(1)}
                  </div>
                  <div className="text-charcoal-500">
                    Belanja: <span className="font-bold text-charcoal-800">{rupiah(sup.totalSpend)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-ivory-200">
                  <div className="text-[10px] font-bold text-charcoal-400 uppercase mb-1">Kategori & Produk</div>
                  <div className="flex flex-wrap gap-1">
                    {sup.category && (
                      <span className="px-2 py-0.5 rounded-lg bg-champagne-100 text-champagne-800 text-[10px] font-bold border border-champagne-200">
                        {sup.category}
                      </span>
                    )}
                    {(sup.productsSupplied || []).slice(0, 4).map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-ivory-100 text-charcoal-700 text-[10px] font-medium border border-ivory-200">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-charcoal-400 mt-1.5">Termin: <span className="font-semibold text-charcoal-600">{sup.paymentTerms}</span></div>
                </div>
              </div>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-10 text-center text-xs text-charcoal-500">
              Tidak ada pemasok yang cocok dengan pencarian.
            </div>
          )}
        </div>
      )}

      {/* ================= PROCUREMENT ================= */}
      {activeTabSub === 'procurement' && (
        <div className="space-y-6">
          {/* Requisitions */}
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-champagne-600" /> Permintaan Pembelian (PR)
                </h3>
                <p className="text-[11px] text-charcoal-500">Alur approval sebelum diterbitkan menjadi Purchase Order.</p>
              </div>
              <button
                onClick={() => setPrModalOpen(true)}
                className="px-3.5 py-2 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Ajukan PR
              </button>
            </div>

            <div className="space-y-3">
              {requisitions.map(req => (
                <div key={req.id} className="p-4 rounded-2xl border border-ivory-200 bg-ivory-50/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-charcoal-900">{req.number}</span>
                      <Badge status={req.status} />
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                        req.priority === 'low' ? 'bg-charcoal-100 text-charcoal-600' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {req.priority === 'high' ? 'Prioritas Tinggi' : req.priority === 'low' ? 'Prioritas Rendah' : 'Prioritas Sedang'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-charcoal-900">{rupiah(req.totalEstimate)}</div>
                  </div>

                  <div className="text-[11px] text-charcoal-500">
                    {req.department} • Diajukan oleh <span className="font-semibold text-charcoal-700">{req.requestedBy || '—'}</span> • {fmtDate(req.date)} • Tujuan: <span className="font-semibold text-charcoal-700">{warehouseName(req.warehouseId)}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {req.items.map((item, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-xl border border-ivory-200 text-[11px] flex items-center justify-between gap-2">
                        <span className="font-semibold text-charcoal-800 truncate">{item.productName}</span>
                        <span className="text-charcoal-500 shrink-0">{item.qty} {item.unit}</span>
                      </div>
                    ))}
                  </div>

                  {req.notes && <div className="text-[11px] text-charcoal-500 italic">Catatan: "{req.notes}"</div>}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveRequisition(req.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                        </button>
                        <button
                          onClick={() => rejectRequisition(req.id, 'Tidak sesuai anggaran bulan ini')}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <button
                        onClick={() => convertRequisitionToPO(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Jadikan Purchase Order
                      </button>
                    )}
                    {req.status === 'converted' && req.poId && (
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {purchaseOrders.find(p => p.id === req.poId)?.poNumber || 'PO sudah dibuat'}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {requisitions.length === 0 && (
                <div className="p-8 text-center text-xs text-charcoal-500">Belum ada permintaan pembelian.</div>
              )}
            </div>
          </div>

          {/* Purchase orders */}
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-champagne-600" /> Purchase Order (PO)
              </h3>
              <p className="text-[11px] text-charcoal-500">Pesanan ke pemasok beserta status pengiriman dan penerimaan barang.</p>
            </div>

            <div className="space-y-3">
              {purchaseOrders.map(po => (
                <div key={po.id} className="p-4 rounded-2xl border border-ivory-200 bg-ivory-50/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-charcoal-900">{po.poNumber}</span>
                      <Badge status={po.status} />
                      {po.requisitionId && (
                        <span className="px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-600 text-[10px] font-bold">Dari PR</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-charcoal-900">{rupiah(po.totalAmount)}</div>
                        <div className="text-[10px] text-charcoal-400">{po.items.length} item</div>
                      </div>
                      {po.status === 'ordered' && (
                        <button
                          onClick={() => openReceiveModal(po)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Terima Barang
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-charcoal-500">
                    Pemasok: <span className="font-semibold text-charcoal-700">{po.supplierName}</span> • Order: {fmtDate(po.date)} • Estimasi tiba: {fmtDate(po.expectedDate)} • Gudang: <span className="font-semibold text-charcoal-700">{warehouseName(po.warehouseId)}</span>
                    {po.receivedDate && <> • Diterima: <span className="font-semibold text-emerald-700">{fmtDate(po.receivedDate)}</span></>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-xl border border-ivory-200 text-[11px] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-charcoal-800 truncate">{item.productName}</div>
                          <div className="text-[10px] text-charcoal-500">{item.qty} × {rupiah(item.unitPrice)}</div>
                        </div>
                        <div className="font-bold text-charcoal-900 shrink-0">{rupiah(item.total)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goods receipts */}
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-champagne-600" /> Penerimaan Barang (Goods Receipt)
              </h3>
              <p className="text-[11px] text-charcoal-500">Riwayat dokumen penerimaan barang dari pemasok ke gudang.</p>
            </div>

            {goodsReceipts.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal-500 bg-ivory-50 rounded-2xl border border-ivory-200">
                Belum ada penerimaan barang.
              </div>
            ) : (
              <div className="space-y-2">
                {goodsReceipts.map(gr => (
                  <div key={gr.id} className="p-3 rounded-2xl border border-ivory-200 bg-ivory-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[11px] text-charcoal-900">{gr.number}</span>
                      <Badge status={gr.status} />
                      <span className="text-[11px] text-charcoal-500">{gr.poNumber} • {gr.supplierName}</span>
                    </div>
                    <div className="text-[11px] text-charcoal-500">
                      {fmtDate(gr.receivedDate)} • {warehouseName(gr.warehouseId)} • oleh {gr.receivedBy}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= WAREHOUSE ================= */}
      {activeTabSub === 'warehouse' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {warehouseSummaries.map(wh => (
              <div key={wh.id} className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
                      <Warehouse className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-charcoal-900">{wh.name}</div>
                      <div className="text-[10px] text-charcoal-500">Manajer: {wh.manager}</div>
                    </div>
                  </div>
                  <Badge status={wh.status} />
                </div>
                <div className="text-[10px] text-charcoal-500 flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{wh.address}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] text-charcoal-500 mb-1">
                    <span>{wh.totalUnits} / {wh.capacity} unit</span>
                    <span className="font-bold">{wh.capacityPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ivory-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${wh.capacityPct > 85 ? 'bg-rose-500' : wh.capacityPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${wh.capacityPct}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-ivory-200 text-[11px]">
                  <span className="text-charcoal-500">{wh.skuCount} SKU</span>
                  <span className="font-bold text-charcoal-800">{rupiah(wh.value)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stock table */}
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-champagne-600" /> Posisi Stok
                </h3>
                <p className="text-[11px] text-charcoal-500">Stok real-time per gudang atau agregat seluruh gudang.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={stockWarehouseId}
                  onChange={(e) => setStockWarehouseId(e.target.value)}
                  className="px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Semua Gudang</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>

                <div className="relative">
                  <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari produk / SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-56 pl-9 pr-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-champagne-300"
                  />
                </div>

                <button
                  onClick={() => setAdjustModalOpen(true)}
                  className="px-3.5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" /> Stock Opname
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-charcoal-400 border-b border-ivory-200">
                    <th className="text-left py-2.5 pr-2 font-bold">Produk</th>
                    <th className="text-left py-2.5 px-2 font-bold">SKU</th>
                    <th className="text-center py-2.5 px-2 font-bold">Stok</th>
                    <th className="text-center py-2.5 px-2 font-bold">Min</th>
                    <th className="text-center py-2.5 px-2 font-bold">Status</th>
                    <th className="text-right py-2.5 pl-2 font-bold">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {stockRows.map(({ product, qty, value }) => {
                    const isLow = product.currentStock <= product.minStock;
                    return (
                      <tr key={product.id} className="border-b border-ivory-100 last:border-0 hover:bg-ivory-50">
                        <td className="py-2.5 pr-2">
                          <div className="font-bold text-charcoal-800">{product.name}</div>
                          <div className="text-[10px] text-charcoal-400">{product.category}</div>
                        </td>
                        <td className="py-2.5 px-2 font-mono text-[10px] text-charcoal-500">{product.sku}</td>
                        <td className="py-2.5 px-2 text-center font-bold text-charcoal-900">{qty} <span className="text-[10px] text-charcoal-400 font-medium">{product.unit}</span></td>
                        <td className="py-2.5 px-2 text-center text-charcoal-500">{product.minStock}</td>
                        <td className="py-2.5 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {isLow ? 'Kritis' : 'Aman'}
                          </span>
                        </td>
                        <td className="py-2.5 pl-2 text-right font-semibold text-charcoal-700">{rupiah(value)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transfers & adjustments */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-champagne-600" /> Transfer Stok
                </h3>
                <button
                  onClick={() => setTransferModalOpen(true)}
                  className="text-[11px] font-bold text-champagne-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Buat Transfer
                </button>
              </div>
              <div className="space-y-2">
                {stockTransfers.slice(0, 5).map(trf => (
                  <div key={trf.id} className="p-3 rounded-xl border border-ivory-200 bg-ivory-50 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-charcoal-800 truncate">{trf.productName}</div>
                      <div className="text-[10px] text-charcoal-500">
                        {warehouseName(trf.fromWarehouseId)} → {warehouseName(trf.toWarehouseId)} • {fmtDate(trf.date)}
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-charcoal-900 shrink-0">{trf.qty} unit</div>
                  </div>
                ))}
                {stockTransfers.length === 0 && (
                  <div className="p-6 text-center text-xs text-charcoal-500">Belum ada transfer stok.</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-champagne-600" /> Stock Opname
                </h3>
                <button
                  onClick={() => setAdjustModalOpen(true)}
                  className="text-[11px] font-bold text-champagne-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Catat Opname
                </button>
              </div>
              <div className="space-y-2">
                {stockAdjustments.slice(0, 5).map(adj => (
                  <div key={adj.id} className="p-3 rounded-xl border border-ivory-200 bg-ivory-50 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-charcoal-800 truncate">{adj.productName}</div>
                      <div className="text-[10px] text-charcoal-500 truncate">
                        {warehouseName(adj.warehouseId)} • {adj.reason}
                      </div>
                    </div>
                    <div className={`text-[11px] font-bold shrink-0 ${adj.difference >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {adj.difference >= 0 ? '+' : ''}{adj.difference}
                    </div>
                  </div>
                ))}
                {stockAdjustments.length === 0 && (
                  <div className="p-6 text-center text-xs text-charcoal-500">Belum ada penyesuaian stok.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* Add supplier */}
      {supplierModalOpen && (
        <Modal
          title="Tambah Pemasok Baru"
          subtitle="Lengkapi data master pemasok untuk kebutuhan pengadaan."
          onClose={() => setSupplierModalOpen(false)}
        >
          <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Nama Perusahaan *</label>
              <input
                required
                type="text"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="PT Contoh Suplai Indonesia"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={supplierForm.contactPerson}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="Nama PIC"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={supplierForm.category}
                  onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="Bahan Perawatan"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="021-xxxx"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Email</label>
                <input
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="sales@perusahaan.co.id"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Alamat</label>
              <input
                type="text"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Alamat lengkap"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Termin</label>
                <select
                  value={supplierForm.paymentTerms}
                  onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  <option value="COD">COD</option>
                  <option value="NET 14">NET 14</option>
                  <option value="NET 30">NET 30</option>
                  <option value="NET 45">NET 45</option>
                  <option value="NET 60">NET 60</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Lead Time (hari)</label>
                <input
                  type="number"
                  min="1"
                  value={supplierForm.leadTimeDays}
                  onChange={(e) => setSupplierForm({ ...supplierForm, leadTimeDays: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={supplierForm.rating}
                  onChange={(e) => setSupplierForm({ ...supplierForm, rating: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Produk yang Disuplai (pisahkan koma)</label>
              <input
                type="text"
                value={supplierForm.productsSupplied}
                onChange={(e) => setSupplierForm({ ...supplierForm, productsSupplied: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Pomade, Silet, Kertas Leher"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setSupplierModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold">Simpan Pemasok</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create PR */}
      {prModalOpen && (
        <Modal
          title="Ajukan Permintaan Pembelian (PR)"
          subtitle="PR akan melalui approval sebelum dikonversi menjadi PO."
          onClose={() => setPrModalOpen(false)}
          wide
        >
          <form onSubmit={handleCreatePR} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Departemen</label>
                <select
                  value={prForm.department}
                  onChange={(e) => setPrForm({ ...prForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  <option>Barbershop</option>
                  <option>Retail</option>
                  <option>Treatment</option>
                  <option>Purchasing</option>
                  <option>Operasional</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Diajukan Oleh</label>
                <input
                  type="text"
                  value={prForm.requestedBy}
                  onChange={(e) => setPrForm({ ...prForm, requestedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="Nama staf"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Prioritas</label>
                <select
                  value={prForm.priority}
                  onChange={(e) => setPrForm({ ...prForm, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Gudang Tujuan</label>
                <select
                  value={prForm.warehouseId}
                  onChange={(e) => setPrForm({ ...prForm, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Rekomendasi Pemasok</label>
                <select
                  value={prForm.supplierId}
                  onChange={(e) => setPrForm({ ...prForm, supplierId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-charcoal-700">Item yang Diminta *</label>
                <button type="button" onClick={addPrItemRow} className="text-[11px] font-bold text-champagne-700 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Tambah Item
                </button>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {prForm.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-ivory-50 border border-ivory-200 flex items-center gap-2">
                    <select
                      value={item.productId}
                      onChange={(e) => updatePrItem(idx, 'productId', e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs min-w-0"
                    >
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.currentStock})</option>)}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updatePrItem(idx, 'qty', e.target.value)}
                      className="w-16 px-2 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs font-bold text-center"
                    />
                    <input
                      type="number"
                      min="0"
                      value={item.estimatedPrice}
                      onChange={(e) => updatePrItem(idx, 'estimatedPrice', e.target.value)}
                      className="w-24 px-2 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs font-bold text-right"
                    />
                    {prForm.items.length > 1 && (
                      <button type="button" onClick={() => removePrItemRow(idx)} className="text-rose-500 hover:text-rose-700 px-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Catatan</label>
              <input
                type="text"
                value={prForm.notes}
                onChange={(e) => setPrForm({ ...prForm, notes: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Alasan kebutuhan / catatan tambahan"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-ivory-200">
              <div className="text-xs text-charcoal-500">
                Estimasi total: <span className="font-bold text-charcoal-900">{rupiah(prEstimate)}</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPrModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold">Ajukan PR</button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Receive PO */}
      {receivePO && (
        <Modal
          title={`Terima Barang — ${receivePO.poNumber}`}
          subtitle={`${receivePO.supplierName} • ${rupiah(receivePO.totalAmount)}`}
          onClose={() => setReceivePO(null)}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Gudang Penerima *</label>
              <select
                value={receiveWarehouseId}
                onChange={(e) => setReceiveWarehouseId(e.target.value)}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
              >
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.code})</option>)}
              </select>
            </div>

            <div className="bg-ivory-50 rounded-2xl border border-ivory-200 p-3 space-y-2">
              <div className="text-[10px] font-bold text-charcoal-400 uppercase">Item yang Diterima</div>
              {receivePO.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-charcoal-800">{item.productName}</span>
                  <span className="text-charcoal-600">{item.qty} unit</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Penerimaan akan menambah stok, membuat batch FIFO, mencatat goods receipt, dan mencatat pengeluaran di jurnal keuangan.</span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button onClick={() => setReceivePO(null)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button onClick={handleReceive} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4" /> Konfirmasi Terima
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Transfer stock */}
      {transferModalOpen && (
        <Modal
          title="Transfer Stok Antar Gudang"
          subtitle="Pindahkan stok tanpa mengubah total persediaan perusahaan."
          onClose={() => setTransferModalOpen(false)}
        >
          <form onSubmit={handleTransfer} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Gudang Asal *</label>
                <select
                  value={transferForm.fromWarehouseId}
                  onChange={(e) => setTransferForm({ ...transferForm, fromWarehouseId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Gudang Tujuan *</label>
                <select
                  value={transferForm.toWarehouseId}
                  onChange={(e) => setTransferForm({ ...transferForm, toWarehouseId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Produk *</label>
              <select
                value={transferForm.productId}
                onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
              >
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Jumlah *</label>
                <input
                  type="number"
                  min="1"
                  value={transferForm.qty}
                  onChange={(e) => setTransferForm({ ...transferForm, qty: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-bold"
                />
                <div className="text-[10px] text-charcoal-500 mt-1">Tersedia di asal: <span className="font-bold">{transferAvailable}</span></div>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Diminta Oleh</label>
                <input
                  type="text"
                  value={transferForm.requestedBy}
                  onChange={(e) => setTransferForm({ ...transferForm, requestedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="Nama staf"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Catatan</label>
              <input
                type="text"
                value={transferForm.notes}
                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Alasan transfer"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setTransferModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold rounded-xl flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" /> Proses Transfer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock adjustment / opname */}
      {adjustModalOpen && (
        <Modal
          title="Stock Opname & Penyesuaian"
          subtitle="Cocokkan stok sistem dengan hasil hitung fisik di gudang."
          onClose={() => setAdjustModalOpen(false)}
        >
          <form onSubmit={handleAdjustment} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Gudang *</label>
                <select
                  value={adjustForm.warehouseId}
                  onChange={(e) => setAdjustForm({ ...adjustForm, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Produk *</label>
                <select
                  value={adjustForm.productId}
                  onChange={(e) => setAdjustForm({ ...adjustForm, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-ivory-50 rounded-xl border border-ivory-200 p-3 text-center">
                <div className="text-[10px] text-charcoal-400 uppercase font-bold">Stok Sistem</div>
                <div className="text-lg font-bold text-charcoal-900">{adjustSystemQty}</div>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Stok Fisik *</label>
                <input
                  type="number"
                  min="0"
                  value={adjustForm.physicalQty}
                  onChange={(e) => setAdjustForm({ ...adjustForm, physicalQty: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ivory-100 border border-ivory-300 rounded-xl font-bold text-center"
                />
              </div>
              <div className={`rounded-xl border p-3 text-center ${adjustDifference === 0 ? 'bg-charcoal-50 border-charcoal-200' : adjustDifference > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                <div className="text-[10px] text-charcoal-400 uppercase font-bold">Selisih</div>
                <div className={`text-lg font-bold ${adjustDifference === 0 ? 'text-charcoal-700' : adjustDifference > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {adjustDifference > 0 ? '+' : ''}{adjustDifference}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Alasan Penyesuaian *</label>
              <input
                type="text"
                required
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Contoh: kemasan rusak, tester terpakai, salah input"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setAdjustModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold rounded-xl flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4" /> Simpan Opname
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
