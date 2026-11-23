import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  QrCode,
  DollarSign,
  User,
  Scissors,
  Package,
  Cake,
  CheckCircle,
  Receipt,
  Sparkles
} from 'lucide-react';
import { QRISModal } from '../common/QRISModal';

export const POSModule = () => {
  const {
    services,
    products,
    customers,
    staff,
    processPOSTransaction,
    initialPOSCart,
    setInitialPOSCart,
    getCustomerBirthdayStatus,
    userRole,
    activeStaffId
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(userRole === 'staff' ? activeStaffId : staff[0]?.id || '');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'qris'
  const [cashGiven, setCashGiven] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  const [linkedAppointmentId, setLinkedAppointmentId] = useState(null);

  // QRIS Payment Modal State
  const [isQRISOpen, setIsQRISOpen] = useState(false);

  // If initialPOSCart was provided from appointment conversion
  useEffect(() => {
    if (initialPOSCart) {
      if (initialPOSCart.items) {
        setCart(initialPOSCart.items);
      }
      if (initialPOSCart.customerId) {
        const cust = customers.find(c => c.id === initialPOSCart.customerId);
        if (cust) setSelectedCustomer(cust);
      }
      if (initialPOSCart.staffId) {
        setSelectedStaffId(initialPOSCart.staffId);
      }
      if (initialPOSCart.appointmentId) {
        setLinkedAppointmentId(initialPOSCart.appointmentId);
      }
      // Clear after applying
      setInitialPOSCart(null);
    }
  }, [initialPOSCart, customers]);

  // Birthday status check
  const birthdayStatus = selectedCustomer ? getCustomerBirthdayStatus(selectedCustomer.birthday) : { isToday: false, isThisMonth: false };

  // Categories
  const categories = [
    { id: 'all', label: 'Semua Item' },
    { id: 'services', label: 'Layanan Salon' },
    { id: 'retail', label: 'Produk Ritel' },
    { id: 'barber', label: 'Barbershop' },
    { id: 'treatment', label: 'Treatment & Spa' },
  ];

  // Filter Catalog
  const serviceItems = services.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category.toLowerCase(),
    type: 'service',
    price: s.price,
    duration: s.duration,
    stock: null,
    unit: 'sesi',
    description: s.description
  }));

  const productItems = products.filter(p => p.type === 'retail').map(p => ({
    id: p.id,
    name: p.name,
    category: 'retail',
    type: 'product',
    price: p.sellPrice,
    duration: null,
    stock: p.currentStock,
    unit: p.unit,
    description: p.description
  }));

  const allItems = [...serviceItems, ...productItems];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = true;
    if (activeCategory === 'services') matchesCategory = item.type === 'service';
    else if (activeCategory === 'retail') matchesCategory = item.type === 'product';
    else if (activeCategory === 'barber') matchesCategory = item.category.includes('barber');
    else if (activeCategory === 'treatment') matchesCategory = item.category.includes('treatment') || item.category.includes('spa');
    return matchesSearch && matchesCategory;
  });

  // Cart operations
  const addToCart = (item) => {
    // If it's a product, check stock
    if (item.type === 'product' && item.stock <= 0) {
      alert('Stok produk ini sedang habis!');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (item.type === 'product' && existing.qty >= item.stock) {
          alert(`Maksimal stok tersedia hanya ${item.stock} ${item.unit}.`);
          return prev;
        }
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1, subtotal: (i.qty + 1) * i.price } : i);
      }
      return [...prev, { ...item, qty: 1, subtotal: item.price }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = i.qty + delta;
          if (newQty <= 0) return null;
          // check stock for product
          if (i.type === 'product' && newQty > i.stock) {
            alert(`Stok hanya tersedia ${i.stock} ${i.unit}.`);
            return i;
          }
          return { ...i, qty: newQty, subtotal: newQty * i.price };
        }
        return i;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscountAmount(0);
    setDiscountReason('');
    setCashGiven('');
    setTransactionNotes('');
    setLinkedAppointmentId(null);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const finalTotal = Math.max(0, subtotal - Number(discountAmount));
  const changeAmount = paymentMethod === 'cash' && cashGiven ? Math.max(0, Number(cashGiven) - finalTotal) : 0;

  // Apply Birthday Promo 15%
  const applyBirthdayDiscount = () => {
    const disc = Math.round(subtotal * 0.15);
    setDiscountAmount(disc);
    setDiscountReason('Promo Ulang Tahun 15%');
  };

  // Apply Member Tier Discount
  const applyMemberDiscount = () => {
    if (!selectedCustomer) return;
    if (selectedCustomer.tier === 'Gold') {
      const disc = Math.round(subtotal * 0.10);
      setDiscountAmount(disc);
      setDiscountReason('Diskon Member Gold 10%');
    } else if (selectedCustomer.tier === 'Silver') {
      const disc = Math.round(subtotal * 0.05);
      setDiscountAmount(disc);
      setDiscountReason('Diskon Member Silver 5%');
    }
  };

  // Execute Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang kasir masih kosong.');
      return;
    }

    if (paymentMethod === 'cash') {
      const given = Number(cashGiven);
      if (!given || given < finalTotal) {
        alert(`Uang tunai yang diterima kurang! Total tagihan adalah Rp ${finalTotal.toLocaleString('id-ID')}`);
        return;
      }
      finalizeTransaction();
    } else if (paymentMethod === 'qris') {
      setIsQRISOpen(true);
    }
  };

  const finalizeTransaction = () => {
    const assignedStaff = staff.find(s => s.id === selectedStaffId);

    processPOSTransaction({
      appointmentId: linkedAppointmentId,
      customerId: selectedCustomer ? selectedCustomer.id : null,
      customerName: selectedCustomer ? selectedCustomer.name : 'Pelanggan Walk-In',
      staffId: selectedStaffId,
      staffName: assignedStaff ? assignedStaff.name : 'Staff Kasir',
      items: cart,
      subtotal,
      discount: Number(discountAmount),
      discountReason,
      total: finalTotal,
      paymentMethod,
      cashGiven: paymentMethod === 'cash' ? Number(cashGiven) : finalTotal,
      change: changeAmount,
      notes: transactionNotes
    });

    clearCart();
    setIsQRISOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Left Column: Product & Service Catalog (7 cols) */}
      <div className="lg:col-span-7 flex flex-col bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 overflow-hidden">
        {/* Catalog Search & Category Tabs */}
        <div className="space-y-3 pb-4 border-b border-ivory-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Cari layanan potong, creambath, pomade, serum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-charcoal-900 text-ivory-50 shadow-sm'
                    : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="flex-1 overflow-y-auto pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200/90 hover:border-champagne-400 hover:bg-ivory-100/80 transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    item.type === 'service' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.type === 'service' ? 'Layanan Salon' : 'Produk Ritel'}
                  </span>
                  {item.duration && (
                    <span className="text-[10px] text-charcoal-400 font-medium">{item.duration} mnt</span>
                  )}
                  {item.stock !== null && (
                    <span className={`text-[10px] font-bold ${item.stock <= 3 ? 'text-rose-600' : 'text-charcoal-500'}`}>
                      Stok: {item.stock} {item.unit}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-charcoal-900 group-hover:text-champagne-900 leading-snug">
                  {item.name}
                </h4>
                <p className="text-[10px] text-charcoal-500 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-ivory-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-champagne-800">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
                <span className="w-6 h-6 rounded-lg bg-champagne-500 text-charcoal-900 group-hover:bg-champagne-400 flex items-center justify-center shadow-sm">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: POS Cart & Checkout (5 cols) */}
      <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 overflow-hidden">
        {/* Cart Header: Customer & Staff Selection */}
        <div className="space-y-3 pb-3 border-b border-ivory-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-champagne-600" />
              <h3 className="font-serif font-bold text-base text-charcoal-900">Pesanan Kasir</h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Bersihkan
              </button>
            )}
          </div>

          {/* Select Customer */}
          <div>
            <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-1">Pelanggan</label>
            <select
              value={selectedCustomer ? selectedCustomer.id : ''}
              onChange={(e) => {
                const c = customers.find(cust => cust.id === e.target.value);
                setSelectedCustomer(c || null);
              }}
              className="w-full px-3 py-1.5 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs font-medium focus:outline-none focus:border-champagne-500"
            >
              <option value="">-- Pelanggan Walk-In (Umum) --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone}) - {c.tier}</option>
              ))}
            </select>
          </div>

          {/* Birthday Promo Banner Alert */}
          {birthdayStatus.isThisMonth && (
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 text-xs flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2 text-amber-900">
                <Cake className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold">{birthdayStatus.isToday ? 'Ulang Tahun Hari Ini!' : 'Ulang Tahun Bulan Ini!'}</div>
                  <div className="text-[10px] text-amber-700">Pelanggan berhak diskon 15%</div>
                </div>
              </div>
              <button
                onClick={applyBirthdayDiscount}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg shadow-sm"
              >
                Gunakan 15%
              </button>
            </div>
          )}

          {/* Staff in Charge */}
          <div>
            <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-1">Staf Pelaksana</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full px-3 py-1.5 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs font-medium focus:outline-none focus:border-champagne-500"
            >
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-charcoal-400 text-xs space-y-2">
              <ShoppingBag className="w-8 h-8 stroke-[1.5] text-charcoal-300" />
              <span>Keranjang masih kosong.</span>
              <span className="text-[10px] text-charcoal-400">Pilih layanan atau produk di katalog kiri.</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-ivory-50 border border-ivory-200 flex items-center justify-between gap-2 text-xs">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-charcoal-900 truncate">{item.name}</div>
                  <div className="text-[10px] text-charcoal-500">
                    Rp {item.price.toLocaleString('id-ID')} x {item.qty}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-6 h-6 rounded-lg bg-ivory-200 hover:bg-ivory-300 flex items-center justify-center font-bold text-charcoal-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-charcoal-800">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 rounded-lg bg-ivory-200 hover:bg-ivory-300 flex items-center justify-center font-bold text-charcoal-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <div className="font-bold text-charcoal-900">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[10px] text-rose-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Payment Controls */}
        <div className="border-t border-ivory-200 pt-3 space-y-2.5 shrink-0">
          {/* Subtotal, Discount & Total */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-charcoal-500">
              <span>Subtotal Item:</span>
              <span className="font-bold text-charcoal-800">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            {/* Discount input */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-charcoal-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-champagne-600" /> Diskon (Rp):
              </span>
              <input
                type="number"
                placeholder="0"
                value={discountAmount || ''}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-24 px-2 py-1 text-right bg-ivory-100 border border-ivory-300 rounded-lg text-xs font-bold text-charcoal-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-between text-sm font-bold pt-2 border-t border-ivory-200 text-charcoal-900">
              <span className="font-serif text-base">Total Bayar:</span>
              <span className="font-serif text-lg text-champagne-900">Rp {finalTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Method Selector (Cash & QRIS) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-charcoal-900 text-ivory-50 border-charcoal-900 shadow-sm'
                  : 'bg-ivory-100 text-charcoal-700 border-ivory-300 hover:bg-ivory-200'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Tunai (Cash)</span>
            </button>
            <button
              onClick={() => setPaymentMethod('qris')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'qris'
                  ? 'bg-purple-900 text-ivory-50 border-purple-900 shadow-sm'
                  : 'bg-ivory-100 text-charcoal-700 border-ivory-300 hover:bg-ivory-200'
              }`}
            >
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>QRIS Instan</span>
            </button>
          </div>

          {/* Cash Payment Details */}
          {paymentMethod === 'cash' && (
            <div className="space-y-1.5 p-2.5 rounded-xl bg-ivory-100/80 border border-ivory-300 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-600 font-medium">Uang Diterima:</span>
                <input
                  type="number"
                  placeholder="Jumlah bayar..."
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="w-32 px-2 py-1 text-right bg-white border border-ivory-300 rounded-lg text-xs font-bold text-charcoal-800"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex gap-1 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setCashGiven(finalTotal)}
                  className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-semibold text-charcoal-600 hover:bg-ivory-200"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  onClick={() => setCashGiven(Math.ceil(finalTotal / 50000) * 50000)}
                  className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-semibold text-charcoal-600 hover:bg-ivory-200"
                >
                  Rp {(Math.ceil(finalTotal / 50000) * 50000).toLocaleString('id-ID')}
                </button>
                <button
                  type="button"
                  onClick={() => setCashGiven(Math.ceil(finalTotal / 100000) * 100000)}
                  className="px-2 py-0.5 bg-white border border-ivory-300 rounded text-[10px] font-semibold text-charcoal-600 hover:bg-ivory-200"
                >
                  Rp {(Math.ceil(finalTotal / 100000) * 100000).toLocaleString('id-ID')}
                </button>
              </div>

              <div className="flex justify-between text-xs pt-1 border-t border-ivory-200">
                <span className="text-charcoal-600 font-semibold">Kembalian:</span>
                <span className="font-bold text-emerald-700">Rp {changeAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-luxury transition-all active:scale-[0.99] ${
              cart.length === 0
                ? 'bg-ivory-300 text-charcoal-400 cursor-not-allowed'
                : 'bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 shadow-gold'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Selesaikan & Cetak Struk (Rp {finalTotal.toLocaleString('id-ID')})</span>
          </button>
        </div>
      </div>

      {/* QRIS Interactive Payment Modal */}
      {isQRISOpen && (
        <QRISModal
          total={finalTotal}
          onSuccess={finalizeTransaction}
          onCancel={() => setIsQRISOpen(false)}
        />
      )}
    </div>
  );
};
