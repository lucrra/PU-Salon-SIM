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
  Trash2,
  Printer,
  Download,
  Edit,
  Eye,
  RotateCcw,
  FileSpreadsheet,
  ExternalLink
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

// CSV Export Helper
const exportToCSV = (filename, headers, rows) => {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };
  const headerLine = headers.map(h => escapeCsv(h.label)).join(',');
  const rowLines = rows.map(r => headers.map(h => escapeCsv(r[h.key])).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${todayStr()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
    purchaseReturns = [],
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addWarehouse,
    createRequisition,
    approveRequisition,
    rejectRequisition,
    convertRequisitionToPO,
    receivePurchaseOrder,
    createStockTransfer,
    createStockAdjustment,
    createPurchaseReturn,
    salonProfile
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockWarehouseId, setStockWarehouseId] = useState('all');

  // Modal states
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editSupplierModal, setEditSupplierModal] = useState(null);
  const [supplierDetailModal, setSupplierDetailModal] = useState(null);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [receivePO, setReceivePO] = useState(null);
  const [receiveWarehouseId, setReceiveWarehouseId] = useState('wh-main');
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [documentModal, setDocumentModal] = useState(null);

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

  // Warehouse form
  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    code: '',
    type: 'branch',
    address: '',
    manager: '',
    capacity: 100
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

  // Return form
  const [returnForm, setReturnForm] = useState({
    supplierId: suppliers[0]?.id || '',
    warehouseId: 'wh-main',
    productId: defaultProduct.id,
    qty: 1,
    poNumber: '',
    reason: 'Kemasan rusak / bocor saat pengiriman',
    resolution: 'Tukar Barang Baru',
    submittedBy: '',
    notes: ''
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

  const handleUpdateSupplier = (e) => {
    e.preventDefault();
    if (!editSupplierModal || !editSupplierModal.name.trim()) return;
    updateSupplier(editSupplierModal.id, {
      ...editSupplierModal,
      productsSupplied: Array.isArray(editSupplierModal.productsSupplied)
        ? editSupplierModal.productsSupplied
        : String(editSupplierModal.productsSupplied || '').split(',').map(s => s.trim()).filter(Boolean)
    });
    setEditSupplierModal(null);
  };

  const handleAddWarehouse = (e) => {
    e.preventDefault();
    if (!warehouseForm.name.trim()) return;
    addWarehouse({
      ...warehouseForm,
      capacity: Number(warehouseForm.capacity) || 100
    });
    setWarehouseModalOpen(false);
    setWarehouseForm({ name: '', code: '', type: 'branch', address: '', manager: '', capacity: 100 });
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

  const handleCreateReturn = (e) => {
    e.preventDefault();
    const res = createPurchaseReturn(returnForm);
    if (res.success) {
      setReturnModalOpen(false);
      setReturnForm({
        supplierId: suppliers[0]?.id || '',
        warehouseId: 'wh-main',
        productId: defaultProduct.id,
        qty: 1,
        poNumber: '',
        reason: 'Kemasan rusak / bocor saat pengiriman',
        resolution: 'Tukar Barang Baru',
        submittedBy: '',
        notes: ''
      });
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
    { id: 'procurement', label: 'Pengadaan & Retur', icon: ClipboardList },
    { id: 'warehouse', label: 'Multi-Gudang', icon: Warehouse },
    { id: 'reports', label: 'Laporan & Ekspor', icon: FileSpreadsheet }
  ];

  return (
    <div className="space-y-6">
      {/* Module header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-charcoal-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-champagne-600" />
            Supply Chain Management (SCM)
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Pemasok resmi, pengadaan berjenjang (PR → PO → GR), retur barang, dan kontrol inventaris multi-gudang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPrModalOpen(true)}
            className="px-4 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Ajukan PR</span>
          </button>
          <button
            onClick={() => setTransferModalOpen(true)}
            className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Stok</span>
          </button>
          <button
            onClick={() => setReturnModalOpen(true)}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retur Barang</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <KpiCard label="Nilai Persediaan" value={rupiah(inventoryValue)} hint={`${products.length} SKU terdaftar`} icon={Wallet} tone="gold" />
            <KpiCard label="Stok Kritis" value={`${lowStockProducts.length} Produk`} hint="Di bawah batas minimum" icon={AlertTriangle} tone="rose" />
            <KpiCard label="PO Aktif" value={`${activePOs.length} Pesanan`} hint={rupiah(activePOs.reduce((a, p) => a + p.totalAmount, 0))} icon={Truck} tone="amber" />
            <KpiCard label="PR Menunggu" value={`${pendingReqs.length} Permintaan`} hint={`${suppliers.length} pemasok rekanan`} icon={ClipboardList} tone="blue" />
            <KpiCard label="Retur Pembelian" value={`${purchaseReturns.length} Klaim`} hint={rupiah(purchaseReturns.reduce((a, r) => a + (r.totalRefund || 0), 0))} icon={RotateCcw} tone="purple" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Reorder suggestions */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal-900">Rekomendasi Pengadaan Ulang (Auto-Reorder)</h3>
                  <p className="text-[11px] text-charcoal-500">Produk yang menyentuh batas minimum stok beserta rekomendasi kuantitas pembelian.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                  {reorderList.length} item kritis
                </span>
              </div>

              {reorderList.length === 0 ? (
                <div className="p-8 text-center text-xs text-charcoal-500 bg-ivory-50 rounded-2xl border border-ivory-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Semua stok produk saat ini aman di atas ambang minimum.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-charcoal-400 border-b border-ivory-200">
                        <th className="text-left py-2 pr-2 font-bold">Produk</th>
                        <th className="text-center py-2 px-2 font-bold">Stok Sekarang</th>
                        <th className="text-center py-2 px-2 font-bold">Min Stok</th>
                        <th className="text-center py-2 px-2 font-bold">Saran Beli</th>
                        <th className="text-right py-2 pl-2 font-bold">Estimasi Biaya</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reorderList.map(({ product, suggestedQty, estimatedCost }) => (
                        <tr key={product.id} className="border-b border-ivory-100 last:border-0 hover:bg-ivory-50">
                          <td className="py-2.5 pr-2">
                            <div className="font-bold text-charcoal-800">{product.name}</div>
                            <div className="text-[10px] text-charcoal-400 font-mono">{product.sku} • {product.category}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`font-bold ${product.currentStock <= 0 ? 'text-rose-600' : 'text-amber-700'}`}>
                              {product.currentStock} {product.unit}
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
                <p className="text-[11px] text-charcoal-500">Log audit pergerakan barang masuk, keluar, dan transfer.</p>
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
                        <div className="text-[11px] font-bold text-charcoal-800 flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{mov.productName}</span>
                          {mov.channel === 'pos' && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[8px] font-bold uppercase shrink-0">
                              POS
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-charcoal-500 truncate">
                          {mov.channel === 'pos' && mov.invoiceNo ? `${mov.invoiceNo} • ` : ''}
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-charcoal-900">Kapasitas & Alokasi Multi-Gudang</h3>
              <button
                onClick={() => setWarehouseModalOpen(true)}
                className="text-xs font-bold text-champagne-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Gudang
              </button>
            </div>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSupplierModalOpen(true)}
                className="px-4 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah Pemasok</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSuppliers.map(sup => (
              <div key={sup.id} className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-3 hover:border-champagne-400 transition-all flex flex-col justify-between">
                <div>
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

                  <div className="space-y-1.5 text-[11px] text-charcoal-600 mt-3">
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-champagne-600" /><span>{sup.phone}</span></div>
                    <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-champagne-600" /><span className="truncate">{sup.email}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-champagne-600" /><span className="truncate">{sup.address}</span></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center my-3">
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
                      {Number(sup.rating || 0).toFixed(1)}
                    </div>
                    <div className="text-charcoal-500">
                      Belanja: <span className="font-bold text-charcoal-800">{rupiah(sup.totalSpend)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-ivory-200 mt-2">
                    <div className="text-[10px] font-bold text-charcoal-400 uppercase mb-1">Kategori & Produk</div>
                    <div className="flex flex-wrap gap-1">
                      {sup.category && (
                        <span className="px-2 py-0.5 rounded-lg bg-champagne-100 text-champagne-800 text-[10px] font-bold border border-champagne-200">
                          {sup.category}
                        </span>
                      )}
                      {(sup.productsSupplied || []).slice(0, 3).map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-ivory-100 text-charcoal-700 text-[10px] font-medium border border-ivory-200">
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-charcoal-400 mt-1.5">Termin: <span className="font-semibold text-charcoal-600">{sup.paymentTerms}</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-ivory-200 mt-2">
                  <button
                    onClick={() => setSupplierDetailModal(sup)}
                    className="p-1.5 text-charcoal-500 hover:text-charcoal-800 hover:bg-ivory-100 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                    title="Detail Pemasok"
                  >
                    <Eye className="w-3.5 h-3.5" /> Detail
                  </button>
                  <button
                    onClick={() => setEditSupplierModal({ ...sup, productsSupplied: (sup.productsSupplied || []).join(', ') })}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                    title="Edit Pemasok"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus pemasok ${sup.name}?`)) {
                        deleteSupplier(sup.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-[11px] font-semibold"
                    title="Hapus Pemasok"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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

      {/* ================= PROCUREMENT & RETURNS ================= */}
      {activeTabSub === 'procurement' && (
        <div className="space-y-6">
          {/* Requisitions */}
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-champagne-600" /> Permintaan Pembelian (Purchase Requisition / PR)
                </h3>
                <p className="text-[11px] text-charcoal-500">Alur pengajuan dan persetujuan pengadaan bahan/produk sebelum diterbitkan menjadi Purchase Order.</p>
              </div>
              <button
                onClick={() => setPrModalOpen(true)}
                className="px-3.5 py-2 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Ajukan PR Baru
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
                    Departemen: <span className="font-semibold text-charcoal-700">{req.department}</span> • Diajukan: <span className="font-semibold text-charcoal-700">{req.requestedBy || '—'}</span> • Tanggal: {fmtDate(req.date)} • Gudang Tujuan: <span className="font-semibold text-charcoal-700">{warehouseName(req.warehouseId)}</span>
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
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Setujui (Approve)
                        </button>
                        <button
                          onClick={() => rejectRequisition(req.id, 'Tidak sesuai alokasi anggaran')}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <button
                        onClick={() => convertRequisitionToPO(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" /> Terbitkan Purchase Order
                      </button>
                    )}
                    {req.status === 'converted' && req.poId && (
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {purchaseOrders.find(p => p.id === req.poId)?.poNumber || 'PO sudah diterbitkan'}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {requisitions.length === 0 && (
                <div className="p-8 text-center text-xs text-charcoal-500">Belum ada pengajuan permintaan pembelian.</div>
              )}
            </div>
          </div>

          {/* Purchase orders */}
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-champagne-600" /> Purchase Order (PO)
              </h3>
              <p className="text-[11px] text-charcoal-500">Pesanan resmi kepada pemasok beserta estimasi tanggal pengiriman dan penerimaan.</p>
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
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Terima Barang
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-charcoal-500">
                    Pemasok: <span className="font-semibold text-charcoal-700">{po.supplierName}</span> • Order: {fmtDate(po.date)} • Estimasi Tiba: {fmtDate(po.expectedDate)} • Gudang: <span className="font-semibold text-charcoal-700">{warehouseName(po.warehouseId)}</span>
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
                <PackageCheck className="w-4 h-4 text-champagne-600" /> Penerimaan Barang (Goods Receipt / GR)
              </h3>
              <p className="text-[11px] text-charcoal-500">Arsip dokumen serah terima fisik barang masuk dari pemasok ke gudang tujuan.</p>
            </div>

            {goodsReceipts.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal-500 bg-ivory-50 rounded-2xl border border-ivory-200">
                Belum ada dokumen penerimaan barang.
              </div>
            ) : (
              <div className="space-y-2">
                {goodsReceipts.map(gr => (
                  <div key={gr.id} className="p-3.5 rounded-2xl border border-ivory-200 bg-ivory-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[11px] text-charcoal-900">{gr.number}</span>
                      <Badge status={gr.status} />
                      <span className="text-[11px] text-charcoal-700 font-semibold">{gr.poNumber} • {gr.supplierName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-charcoal-500">
                        {fmtDate(gr.receivedDate)} • {warehouseName(gr.warehouseId)} • oleh {gr.receivedBy}
                      </span>
                      <button
                        onClick={() => setDocumentModal({ type: 'gr', data: gr })}
                        className="px-2.5 py-1 bg-white hover:bg-ivory-100 border border-ivory-300 rounded-lg text-[10px] font-bold text-charcoal-700 flex items-center gap-1 shadow-2xs"
                      >
                        <Printer className="w-3 h-3" /> Cetak GR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Returns (Retur Pembelian) */}
          <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" /> Retur Pembelian ke Pemasok (Purchase Return)
                </h3>
                <p className="text-[11px] text-charcoal-500">Pengembalian barang rusak, cacat produksi, atau kedaluwarsa kepada pemasok dengan pemotongan stok otomatis.</p>
              </div>
              <button
                onClick={() => setReturnModalOpen(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Buat Retur Pembelian
              </button>
            </div>

            {purchaseReturns.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal-500 bg-ivory-50 rounded-2xl border border-ivory-200">
                Belum ada transaksi retur barang ke pemasok.
              </div>
            ) : (
              <div className="space-y-3">
                {purchaseReturns.map(rtn => (
                  <div key={rtn.id} className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-charcoal-900">{rtn.number}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                          {rtn.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ivory-200 text-charcoal-700">
                          Solusi: {rtn.resolution}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-rose-700">Nilai: {rupiah(rtn.totalRefund)}</div>
                    </div>

                    <div className="text-[11px] text-charcoal-600">
                      Pemasok: <span className="font-semibold text-charcoal-800">{rtn.supplierName}</span> • Gudang Asal: <span className="font-semibold text-charcoal-800">{warehouseName(rtn.warehouseId)}</span> • Tanggal: {fmtDate(rtn.date)} • Petugas: {rtn.submittedBy}
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-rose-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-charcoal-900">{rtn.productName}</div>
                        <div className="text-[11px] text-charcoal-500">Alasan: <span className="italic text-rose-700">"{rtn.reason}"</span></div>
                      </div>
                      <div className="text-right font-bold text-charcoal-800 shrink-0">
                        {rtn.qty} {rtn.unit}
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => setDocumentModal({ type: 'return', data: rtn })}
                        className="px-2.5 py-1 bg-white hover:bg-ivory-100 border border-ivory-300 rounded-lg text-[10px] font-bold text-charcoal-700 flex items-center gap-1 shadow-2xs"
                      >
                        <Printer className="w-3 h-3" /> Cetak Bukti Retur
                      </button>
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900">Multi-Gudang & Titik Penyimpanan</h3>
              <p className="text-[11px] text-charcoal-500">Kelola master gudang, batas kapasitas, dan penanggung jawab operasional.</p>
            </div>
            <button
              onClick={() => setWarehouseModalOpen(true)}
              className="px-3.5 py-2 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Tambah Gudang Baru
            </button>
          </div>

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
                      <div className="text-[10px] text-charcoal-500">PIC: {wh.manager || '—'}</div>
                    </div>
                  </div>
                  <Badge status={wh.status} />
                </div>
                <div className="text-[10px] text-charcoal-500 flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-champagne-600" />
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
                  <span className="text-charcoal-500 font-medium">{wh.skuCount} SKU aktif</span>
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
                  <Package className="w-4 h-4 text-champagne-600" /> Posisi Stok Fisik
                </h3>
                <p className="text-[11px] text-charcoal-500">Stok real-time per titik gudang atau konsolidasi seluruh fasilitas.</p>
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
                  className="px-3.5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
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
                  <ArrowRightLeft className="w-4 h-4 text-champagne-600" /> Transfer Antar Gudang
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
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-charcoal-900">{trf.qty} unit</span>
                      <button
                        onClick={() => setDocumentModal({ type: 'transfer', data: trf })}
                        className="p-1 text-charcoal-500 hover:text-charcoal-800 hover:bg-ivory-200 rounded"
                        title="Cetak Surat Jalan"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                  <ClipboardCheck className="w-4 h-4 text-champagne-600" /> Log Stock Opname
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

      {/* ================= REPORTS & EXPORTS ================= */}
      {activeTabSub === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-2">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-champagne-600" /> Pusat Laporan & Ekspor Data SCM
            </h3>
            <p className="text-xs text-charcoal-500">
              Unduh laporan rekapitulasi data rantai pasok dalam format CSV (kompatibel penuh dengan Microsoft Excel, Google Sheets, dan Numbers).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Export Stock */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-charcoal-900">Laporan Posisi Stok Multi-Gudang</h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  Mencakup SKU, nama produk, kategori, harga beli, harga jual, stok minimum, stok fisik di masing-masing gudang, dan total valuasi aset.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = [
                    { label: 'SKU', key: 'sku' },
                    { label: 'Nama Produk', key: 'name' },
                    { label: 'Kategori', key: 'category' },
                    { label: 'Unit', key: 'unit' },
                    { label: 'Stok Saat Ini', key: 'currentStock' },
                    { label: 'Min Stok', key: 'minStock' },
                    { label: 'Harga Beli (Rp)', key: 'buyPrice' },
                    { label: 'Total Nilai Aset (Rp)', key: 'totalValue' }
                  ];
                  const rows = products.map(p => ({
                    sku: p.sku,
                    name: p.name,
                    category: p.category,
                    unit: p.unit,
                    currentStock: p.currentStock,
                    minStock: p.minStock,
                    buyPrice: p.buyPrice,
                    totalValue: p.currentStock * p.buyPrice
                  }));
                  exportToCSV('Laporan_Stok_SCM_PUSalon', headers, rows);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" /> Ekspor Stok ke CSV
              </button>
            </div>

            {/* Export Procurement & PO */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-charcoal-900">Laporan Pengadaan & Purchase Order (PO)</h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  Rekapitulasi nomor PO, nama pemasok, tanggal pemesanan, tanggal diterima, status pengiriman, total nominal belanja, dan daftar item.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = [
                    { label: 'Nomor PO', key: 'poNumber' },
                    { label: 'Tanggal Order', key: 'date' },
                    { label: 'Estimasi Tiba', key: 'expectedDate' },
                    { label: 'Tanggal Diterima', key: 'receivedDate' },
                    { label: 'Nama Pemasok', key: 'supplierName' },
                    { label: 'Total Belanja (Rp)', key: 'totalAmount' },
                    { label: 'Status', key: 'status' }
                  ];
                  const rows = purchaseOrders.map(po => ({
                    poNumber: po.poNumber,
                    date: po.date,
                    expectedDate: po.expectedDate || '—',
                    receivedDate: po.receivedDate || '—',
                    supplierName: po.supplierName,
                    totalAmount: po.totalAmount,
                    status: po.status
                  }));
                  exportToCSV('Laporan_Pengadaan_PO_PUSalon', headers, rows);
                }}
                className="w-full py-2.5 bg-champagne-600 hover:bg-champagne-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" /> Ekspor PO ke CSV
              </button>
            </div>

            {/* Export Transfers */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-charcoal-900">Laporan Transfer Stok Antar Gudang</h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  Catatan historis perpindahan stok dari gudang asal ke gudang tujuan, tanggal transfer, nama pemohon, dan kuantitas barang.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = [
                    { label: 'Nomor Transfer', key: 'number' },
                    { label: 'Tanggal', key: 'date' },
                    { label: 'Gudang Asal', key: 'fromWarehouse' },
                    { label: 'Gudang Tujuan', key: 'toWarehouse' },
                    { label: 'Nama Produk', key: 'productName' },
                    { label: 'Kuantitas', key: 'qty' },
                    { label: 'Diminta Oleh', key: 'requestedBy' },
                    { label: 'Status', key: 'status' }
                  ];
                  const rows = stockTransfers.map(trf => ({
                    number: trf.number || trf.id,
                    date: trf.date,
                    fromWarehouse: warehouseName(trf.fromWarehouseId),
                    toWarehouse: warehouseName(trf.toWarehouseId),
                    productName: trf.productName,
                    qty: trf.qty,
                    requestedBy: trf.requestedBy || '—',
                    status: trf.status
                  }));
                  exportToCSV('Laporan_Transfer_Stok_PUSalon', headers, rows);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" /> Ekspor Transfer ke CSV
              </button>
            </div>

            {/* Export Returns */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-3">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-charcoal-900">Laporan Retur Pembelian ke Pemasok</h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  Data pengembalian barang cacat/rusak, nomor dokumen retur, pemasok tujuan, alasan retur, nilai pengembalian, dan jenis resolusi.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = [
                    { label: 'Nomor Retur', key: 'number' },
                    { label: 'Tanggal', key: 'date' },
                    { label: 'Nama Pemasok', key: 'supplierName' },
                    { label: 'Gudang Asal', key: 'warehouse' },
                    { label: 'Nama Produk', key: 'productName' },
                    { label: 'Jumlah Retur', key: 'qty' },
                    { label: 'Nilai Refund (Rp)', key: 'totalRefund' },
                    { label: 'Alasan Retur', key: 'reason' },
                    { label: 'Resolusi', key: 'resolution' }
                  ];
                  const rows = purchaseReturns.map(rtn => ({
                    number: rtn.number,
                    date: rtn.date,
                    supplierName: rtn.supplierName,
                    warehouse: warehouseName(rtn.warehouseId),
                    productName: rtn.productName,
                    qty: rtn.qty,
                    totalRefund: rtn.totalRefund,
                    reason: rtn.reason,
                    resolution: rtn.resolution
                  }));
                  exportToCSV('Laporan_Retur_Pembelian_PUSalon', headers, rows);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" /> Ekspor Retur ke CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* Add Supplier Modal */}
      {supplierModalOpen && (
        <Modal
          title="Tambah Pemasok Baru"
          subtitle="Lengkapi data master pemasok rekanan untuk kebutuhan pengadaan salon."
          onClose={() => setSupplierModalOpen(false)}
        >
          <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Nama Perusahaan / Pemasok *</label>
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
                <label className="block font-bold text-charcoal-700 mb-1">Contact Person (PIC)</label>
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
                  placeholder="Bahan Treatment / Barbershop"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="0812-xxxx"
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
              <label className="block font-bold text-charcoal-700 mb-1">Alamat Kantor / Gudang</label>
              <input
                type="text"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Alamat lengkap kota"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Termin Pembayaran</label>
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
                <label className="block font-bold text-charcoal-700 mb-1">Rating Awal</label>
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
              <label className="block font-bold text-charcoal-700 mb-1">Produk yang Disuplai (pisahkan dengan koma)</label>
              <input
                type="text"
                value={supplierForm.productsSupplied}
                onChange={(e) => setSupplierForm({ ...supplierForm, productsSupplied: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Pomade, Bleaching, Silet, Shampoo"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setSupplierModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold">Simpan Pemasok</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Supplier Modal */}
      {editSupplierModal && (
        <Modal
          title={`Edit Pemasok — ${editSupplierModal.name}`}
          subtitle="Perbarui kontak, termin pembayaran, atau rating performa pemasok."
          onClose={() => setEditSupplierModal(null)}
        >
          <form onSubmit={handleUpdateSupplier} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Nama Pemasok *</label>
              <input
                required
                type="text"
                value={editSupplierModal.name}
                onChange={(e) => setEditSupplierModal({ ...editSupplierModal, name: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">PIC (Contact Person)</label>
                <input
                  type="text"
                  value={editSupplierModal.contactPerson || ''}
                  onChange={(e) => setEditSupplierModal({ ...editSupplierModal, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={editSupplierModal.category || ''}
                  onChange={(e) => setEditSupplierModal({ ...editSupplierModal, category: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={editSupplierModal.phone || ''}
                  onChange={(e) => setEditSupplierModal({ ...editSupplierModal, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editSupplierModal.email || ''}
                  onChange={(e) => setEditSupplierModal({ ...editSupplierModal, email: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Alamat</label>
              <input
                type="text"
                value={editSupplierModal.address || ''}
                onChange={(e) => setEditSupplierModal({ ...editSupplierModal, address: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Termin</label>
                <select
                  value={editSupplierModal.paymentTerms}
                  onChange={(e) => setEditSupplierModal({ ...editSupplierModal, paymentTerms: e.target.value })}
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
                  value={editSupplierModal.leadTimeDays || 5}
                  onChange={(e) => setEditSupplierModal({ ...editSupplierModal, leadTimeDays: Number(e.target.value) })}
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
                  value={editSupplierModal.rating || 4.5}
                  onChange={(e) => setEditSupplierModal({ ...editSupplierModal, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Produk Suplai (pisahkan koma)</label>
              <input
                type="text"
                value={editSupplierModal.productsSupplied || ''}
                onChange={(e) => setEditSupplierModal({ ...editSupplierModal, productsSupplied: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setEditSupplierModal(null)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm">Simpan Perubahan</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Supplier Detail Modal */}
      {supplierDetailModal && (
        <Modal
          title={`Profil Pemasok — ${supplierDetailModal.name}`}
          subtitle={`Kode: ${supplierDetailModal.code} • Status: ${supplierDetailModal.status}`}
          onClose={() => setSupplierDetailModal(null)}
          wide
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-ivory-50 rounded-2xl border border-ivory-200">
                <div className="text-[10px] text-charcoal-400 font-bold uppercase">Total PO</div>
                <div className="text-lg font-bold text-charcoal-900">{supplierDetailModal.poCount}</div>
              </div>
              <div className="p-3 bg-ivory-50 rounded-2xl border border-ivory-200">
                <div className="text-[10px] text-charcoal-400 font-bold uppercase">Total Belanja</div>
                <div className="text-lg font-bold text-charcoal-900">{rupiah(supplierDetailModal.totalSpend)}</div>
              </div>
              <div className="p-3 bg-ivory-50 rounded-2xl border border-ivory-200">
                <div className="text-[10px] text-charcoal-400 font-bold uppercase">Lead Time</div>
                <div className="text-lg font-bold text-charcoal-900">{supplierDetailModal.leadTimeDays} Hari</div>
              </div>
              <div className="p-3 bg-ivory-50 rounded-2xl border border-ivory-200">
                <div className="text-[10px] text-charcoal-400 font-bold uppercase">Rating</div>
                <div className="text-lg font-bold text-amber-600 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  {Number(supplierDetailModal.rating || 0).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-ivory-50/60 rounded-2xl border border-ivory-200 space-y-2">
              <div className="font-bold text-charcoal-900 text-sm">Informasi Kontak & Legalitas</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-charcoal-600">
                <div>PIC: <span className="font-semibold text-charcoal-800">{supplierDetailModal.contactPerson || '—'}</span></div>
                <div>Telepon: <span className="font-semibold text-charcoal-800">{supplierDetailModal.phone}</span></div>
                <div>Email: <span className="font-semibold text-charcoal-800">{supplierDetailModal.email}</span></div>
                <div>Termin: <span className="font-semibold text-charcoal-800">{supplierDetailModal.paymentTerms}</span></div>
                <div className="sm:col-span-2">Alamat: <span className="font-semibold text-charcoal-800">{supplierDetailModal.address}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-charcoal-900 text-sm">Riwayat Purchase Order (PO)</div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {purchaseOrders.filter(p => p.supplierId === supplierDetailModal.id).map(po => (
                  <div key={po.id} className="p-3 bg-white rounded-xl border border-ivory-200 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-charcoal-900">{po.poNumber}</div>
                      <div className="text-[10px] text-charcoal-400">{fmtDate(po.date)} • {po.items.length} item</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-charcoal-900">{rupiah(po.totalAmount)}</span>
                      <Badge status={po.status} />
                    </div>
                  </div>
                ))}
                {purchaseOrders.filter(p => p.supplierId === supplierDetailModal.id).length === 0 && (
                  <div className="p-4 text-center text-charcoal-400 bg-ivory-50 rounded-xl">Belum ada riwayat PO untuk pemasok ini.</div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-ivory-200">
              <button onClick={() => setSupplierDetailModal(null)} className="px-5 py-2 bg-charcoal-900 text-ivory-50 font-bold rounded-xl">Tutup</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Warehouse Modal */}
      {warehouseModalOpen && (
        <Modal
          title="Tambah Gudang / Titik Simpan Baru"
          subtitle="Daftarkan fasilitas gudang atau display baru untuk penempatan stok."
          onClose={() => setWarehouseModalOpen(false)}
        >
          <form onSubmit={handleAddWarehouse} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Nama Fasilitas Gudang *</label>
              <input
                required
                type="text"
                value={warehouseForm.name}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Gudang Cabang Kelapa Gading 2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Kode Gudang</label>
                <input
                  type="text"
                  value={warehouseForm.code}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-mono uppercase"
                  placeholder="GD-CBG2"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Kapasitas Maksimal (Unit)</label>
                <input
                  type="number"
                  min="1"
                  value={warehouseForm.capacity}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, capacity: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Tipe Fasilitas</label>
                <select
                  value={warehouseForm.type}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  <option value="main">Gudang Utama</option>
                  <option value="barber">Gudang Barbershop</option>
                  <option value="retail">Gudang Display Retail</option>
                  <option value="branch">Gudang Cabang</option>
                  <option value="chemical">Gudang Bahan Kimia</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">PIC / Manajer Gudang</label>
                <input
                  type="text"
                  value={warehouseForm.manager}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, manager: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="Nama penanggung jawab"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Alamat / Lokasi Spesifik</label>
              <input
                type="text"
                value={warehouseForm.address}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Lantai 2, Ruang Khusus Inventaris"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setWarehouseModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold">Daftarkan Gudang</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create PR Modal */}
      {prModalOpen && (
        <Modal
          title="Ajukan Permintaan Pembelian (PR)"
          subtitle="PR akan melalui approval sebelum dikonversi menjadi PO resmi."
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
              <label className="block font-bold text-charcoal-700 mb-1">Catatan Kebutuhan</label>
              <input
                type="text"
                value={prForm.notes}
                onChange={(e) => setPrForm({ ...prForm, notes: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Alasan kebutuhan mendesak / stok menipis"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-ivory-200">
              <div className="text-xs text-charcoal-500">
                Estimasi Total: <span className="font-bold text-charcoal-900">{rupiah(prEstimate)}</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPrModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold">Ajukan PR</button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Receive PO Modal */}
      {receivePO && (
        <Modal
          title={`Terima Barang — ${receivePO.poNumber}`}
          subtitle={`${receivePO.supplierName} • Total Belanja: ${rupiah(receivePO.totalAmount)}`}
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
              <span>Konfirmasi ini otomatis menambah stok produk, mencatat nomor batch FIFO baru, menerbitkan Goods Receipt, dan mencatat pengeluaran di jurnal kas.</span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button onClick={() => setReceivePO(null)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button onClick={handleReceive} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <PackageCheck className="w-4 h-4" /> Konfirmasi Terima
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Transfer Stock Modal */}
      {transferModalOpen && (
        <Modal
          title="Transfer Stok Antar Gudang"
          subtitle="Pindahkan stok fisik dari satu gudang ke gudang lainnya secara real-time."
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
              <label className="block font-bold text-charcoal-700 mb-1">Produk yang Ditransfer *</label>
              <select
                value={transferForm.productId}
                onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
              >
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Total: {p.currentStock})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Jumlah Unit *</label>
                <input
                  type="number"
                  min="1"
                  value={transferForm.qty}
                  onChange={(e) => setTransferForm({ ...transferForm, qty: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-bold"
                />
                <div className="text-[10px] text-charcoal-500 mt-1">Tersedia di asal: <span className="font-bold text-charcoal-800">{transferAvailable}</span></div>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Diminta / Disiapkan Oleh</label>
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
                placeholder="Keperluan transfer (mis: penambahan display)"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setTransferModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <ArrowRightLeft className="w-4 h-4" /> Proses Transfer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock Adjustment (Opname) Modal */}
      {adjustModalOpen && (
        <Modal
          title="Stock Opname & Penyesuaian Fisik"
          subtitle="Cocokkan saldo stok sistem dengan hasil hitungan fisik riil di gudang."
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
                <label className="block font-bold text-charcoal-700 mb-1">Hasil Hitung Fisik *</label>
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
                placeholder="Contoh: kemasan rusak, tester display habis, salah hitung"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setAdjustModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <ClipboardCheck className="w-4 h-4" /> Simpan Hasil Opname
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Return to Supplier Modal */}
      {returnModalOpen && (
        <Modal
          title="Ajukan Retur Pembelian ke Pemasok"
          subtitle="Kembalikan barang rusak/cacat. Sistem otomatis memotong saldo stok gudang."
          onClose={() => setReturnModalOpen(false)}
        >
          <form onSubmit={handleCreateReturn} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Pemasok Tujuan *</label>
                <select
                  value={returnForm.supplierId}
                  onChange={(e) => setReturnForm({ ...returnForm, supplierId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Gudang Asal Barang *</label>
                <select
                  value={returnForm.warehouseId}
                  onChange={(e) => setReturnForm({ ...returnForm, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Produk yang Diretur *</label>
              <select
                value={returnForm.productId}
                onChange={(e) => setReturnForm({ ...returnForm, productId: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
              >
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.currentStock})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Kuantitas Retur *</label>
                <input
                  type="number"
                  min="1"
                  value={returnForm.qty}
                  onChange={(e) => setReturnForm({ ...returnForm, qty: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Nomor Referensi PO (Opsional)</label>
                <input
                  type="text"
                  value={returnForm.poNumber}
                  onChange={(e) => setReturnForm({ ...returnForm, poNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="PO-202611-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Bentuk Resolusi</label>
                <select
                  value={returnForm.resolution}
                  onChange={(e) => setReturnForm({ ...returnForm, resolution: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                >
                  <option value="Tukar Barang Baru">Tukar Barang Baru</option>
                  <option value="Pengembalian Dana">Pengembalian Dana (Cash/Transfer)</option>
                  <option value="Potong Tagihan PO Berikutnya">Potong Tagihan (Credit Note)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Petugas Pelapor</label>
                <input
                  type="text"
                  value={returnForm.submittedBy}
                  onChange={(e) => setReturnForm({ ...returnForm, submittedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  placeholder="Nama staf gudang"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Alasan Retur / Kerusakan *</label>
              <input
                required
                type="text"
                value={returnForm.reason}
                onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                placeholder="Misal: Kemasan pecah saat pengiriman, segel terbuka"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button type="button" onClick={() => setReturnModalOpen(false)} className="px-4 py-2 font-semibold text-charcoal-500">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <RotateCcw className="w-4 h-4" /> Proses Retur
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Official Document Viewer Modal (Surat Jalan / Goods Receipt / Bukti Retur) */}
      {documentModal && (
        <Modal
          title={`Dokumen Resmi: ${documentModal.type === 'transfer' ? 'Surat Jalan Transfer' : documentModal.type === 'gr' ? 'Goods Receipt' : 'Bukti Retur Pembelian'}`}
          subtitle="Format cetak dokumen resmi operasional PU Salon & Barbershop Studio."
          onClose={() => setDocumentModal(null)}
          wide
        >
          <div className="p-6 bg-white border border-ivory-300 rounded-2xl shadow-sm text-charcoal-900 space-y-4 print:p-0">
            {/* Header Document */}
            <div className="border-b-2 border-charcoal-900 pb-3 flex justify-between items-start">
              <div>
                <h2 className="font-serif font-bold text-lg tracking-wide text-charcoal-900">{salonProfile?.name || 'PU SALON & BARBERSHOP'}</h2>
                <p className="text-[10px] text-charcoal-500">{salonProfile?.address || 'Jl. Boulevard Raya Blok PU No. 12, Kelapa Gading'}</p>
                <p className="text-[10px] text-charcoal-500">Telp: {salonProfile?.phone || '0812-3456-7890'} • Enterprise ERP SIM</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-xs px-2.5 py-1 bg-ivory-100 border border-ivory-300 rounded-lg">
                  {documentModal.data?.number || documentModal.data?.id}
                </span>
                <div className="text-[10px] text-charcoal-500 mt-1">Tanggal: {fmtDate(documentModal.data?.date || documentModal.data?.receivedDate)}</div>
              </div>
            </div>

            {/* Document Content Details */}
            {documentModal.type === 'transfer' && (
              <div className="space-y-3 text-xs">
                <div className="text-center font-serif font-bold text-base text-charcoal-900 uppercase tracking-wider py-1 border-b border-ivory-200">
                  SURAT JALAN TRANSFER BARANG ANTAR GUDANG
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 bg-ivory-50 p-3 rounded-xl border border-ivory-200 text-[11px]">
                  <div>Gudang Asal (Pengirim): <span className="font-bold text-charcoal-900">{warehouseName(documentModal.data?.fromWarehouseId)}</span></div>
                  <div>Gudang Tujuan (Penerima): <span className="font-bold text-charcoal-900">{warehouseName(documentModal.data?.toWarehouseId)}</span></div>
                  <div>Petugas Pemohon: <span className="font-bold text-charcoal-900">{documentModal.data?.requestedBy || 'Staff'}</span></div>
                  <div>Catatan Operasional: <span className="italic text-charcoal-700">{documentModal.data?.notes || '—'}</span></div>
                </div>

                <table className="w-full text-xs border border-ivory-300 mt-2">
                  <thead className="bg-ivory-100 text-[10px] uppercase font-bold text-charcoal-700">
                    <tr>
                      <th className="py-2 px-3 text-left border-b border-ivory-300">No</th>
                      <th className="py-2 px-3 text-left border-b border-ivory-300">Deskripsi Produk</th>
                      <th className="py-2 px-3 text-center border-b border-ivory-300">Kuantitas</th>
                      <th className="py-2 px-3 text-left border-b border-ivory-300">Kondisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border-b border-ivory-200">1</td>
                      <td className="py-2 px-3 border-b border-ivory-200 font-bold">{documentModal.data?.productName}</td>
                      <td className="py-2 px-3 border-b border-ivory-200 text-center font-bold">{documentModal.data?.qty} unit</td>
                      <td className="py-2 px-3 border-b border-ivory-200 text-emerald-700 font-semibold">Baik & Tersegel</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {documentModal.type === 'gr' && (
              <div className="space-y-3 text-xs">
                <div className="text-center font-serif font-bold text-base text-charcoal-900 uppercase tracking-wider py-1 border-b border-ivory-200">
                  BUKTI PENERIMAAN BARANG (GOODS RECEIPT)
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 bg-ivory-50 p-3 rounded-xl border border-ivory-200 text-[11px]">
                  <div>Pemasok (Supplier): <span className="font-bold text-charcoal-900">{documentModal.data?.supplierName}</span></div>
                  <div>Nomor PO Ref: <span className="font-bold text-charcoal-900">{documentModal.data?.poNumber}</span></div>
                  <div>Gudang Penyimpanan: <span className="font-bold text-charcoal-900">{warehouseName(documentModal.data?.warehouseId)}</span></div>
                  <div>Diterima Oleh: <span className="font-bold text-charcoal-900">{documentModal.data?.receivedBy}</span></div>
                </div>

                <table className="w-full text-xs border border-ivory-300 mt-2">
                  <thead className="bg-ivory-100 text-[10px] uppercase font-bold text-charcoal-700">
                    <tr>
                      <th className="py-2 px-3 text-left border-b border-ivory-300">No</th>
                      <th className="py-2 px-3 text-left border-b border-ivory-300">Nama Produk</th>
                      <th className="py-2 px-3 text-center border-b border-ivory-300">Qty Dipesan</th>
                      <th className="py-2 px-3 text-center border-b border-ivory-300">Qty Diterima</th>
                      <th className="py-2 px-3 text-left border-b border-ivory-300">Kondisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(documentModal.data?.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 border-b border-ivory-200">{idx + 1}</td>
                        <td className="py-2 px-3 border-b border-ivory-200 font-bold">{it.productName}</td>
                        <td className="py-2 px-3 border-b border-ivory-200 text-center">{it.qtyOrdered || it.qty}</td>
                        <td className="py-2 px-3 border-b border-ivory-200 text-center font-bold text-emerald-700">{it.qtyReceived || it.qty}</td>
                        <td className="py-2 px-3 border-b border-ivory-200 text-charcoal-600 font-medium">{it.condition || 'Bagus'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {documentModal.type === 'return' && (
              <div className="space-y-3 text-xs">
                <div className="text-center font-serif font-bold text-base text-rose-800 uppercase tracking-wider py-1 border-b border-ivory-200">
                  BUKTI RETUR PEMBELIAN (RETURN TO VENDOR)
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-[11px]">
                  <div>Tujuan Pemasok: <span className="font-bold text-charcoal-900">{documentModal.data?.supplierName}</span></div>
                  <div>Gudang Asal: <span className="font-bold text-charcoal-900">{warehouseName(documentModal.data?.warehouseId)}</span></div>
                  <div>Bentuk Resolusi: <span className="font-bold text-charcoal-900">{documentModal.data?.resolution}</span></div>
                  <div>Total Nilai: <span className="font-bold text-rose-700">{rupiah(documentModal.data?.totalRefund)}</span></div>
                </div>

                <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 text-xs">
                  <div>Produk: <span className="font-bold text-charcoal-900">{documentModal.data?.productName}</span> ({documentModal.data?.qty} {documentModal.data?.unit})</div>
                  <div className="mt-1">Alasan Retur: <span className="italic text-rose-700">"{documentModal.data?.reason}"</span></div>
                </div>
              </div>
            )}

            {/* Signature Blocks */}
            <div className="grid grid-cols-3 gap-6 pt-8 text-center text-xs text-charcoal-700">
              <div>
                <p className="font-semibold text-charcoal-500">Yang Menyerahkan,</p>
                <div className="h-16"></div>
                <p className="font-bold text-charcoal-900 border-t border-charcoal-400 pt-1 mx-4">( Petugas Gudang )</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal-500">Pembawa / Kurir,</p>
                <div className="h-16"></div>
                <p className="font-bold text-charcoal-900 border-t border-charcoal-400 pt-1 mx-4">( Ekspedisi / Driver )</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal-500">Yang Menerima,</p>
                <div className="h-16"></div>
                <p className="font-bold text-charcoal-900 border-t border-charcoal-400 pt-1 mx-4">( Penanggung Jawab )</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-ivory-200 print:hidden">
              <button onClick={() => setDocumentModal(null)} className="px-4 py-2 font-semibold text-charcoal-500">Tutup</button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Cetak Dokumen
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
