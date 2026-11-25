import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  SALON_PROFILE,
  INITIAL_STAFF,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_BATCHES,
  INITIAL_CUSTOMERS,
  INITIAL_APPOINTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_FINANCIAL_RECORDS,
  INITIAL_INVENTORY_MOVEMENTS,
  INITIAL_WAREHOUSES,
  INITIAL_WAREHOUSE_STOCK,
  INITIAL_REQUISITIONS,
  INITIAL_GOODS_RECEIPTS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_STOCK_ADJUSTMENTS,
  INITIAL_PURCHASE_RETURNS
} from '../data/initialData';
import { getCustomerPoints, pointsForAmount, resolveTier } from '../utils/loyalty';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Helper to load and save to localStorage
  const loadState = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`pu_salon_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error loading ${key}`, e);
      return fallback;
    }
  };

  const [staff, setStaff] = useState(() => loadState('staff', INITIAL_STAFF));
  const [services, setServices] = useState(() => loadState('services', INITIAL_SERVICES));
  const [products, setProducts] = useState(() => loadState('products', INITIAL_PRODUCTS));
  const [batches, setBatches] = useState(() => loadState('batches', INITIAL_BATCHES));
  const [customers, setCustomers] = useState(() => loadState('customers', INITIAL_CUSTOMERS));
  const [appointments, setAppointments] = useState(() => loadState('appointments', INITIAL_APPOINTMENTS));
  const [transactions, setTransactions] = useState(() => loadState('transactions', INITIAL_TRANSACTIONS));
  const [suppliers, setSuppliers] = useState(() => loadState('suppliers', INITIAL_SUPPLIERS));
  const [purchaseOrders, setPurchaseOrders] = useState(() => loadState('pos', INITIAL_PURCHASE_ORDERS));
  const [financialRecords, setFinancialRecords] = useState(() => loadState('finances', INITIAL_FINANCIAL_RECORDS));
  const [movements, setMovements] = useState(() => loadState('movements', INITIAL_INVENTORY_MOVEMENTS));

  // SCM state
  const [warehouses, setWarehouses] = useState(() => loadState('warehouses', INITIAL_WAREHOUSES));
  const [warehouseStock, setWarehouseStock] = useState(() => loadState('warehouseStock', INITIAL_WAREHOUSE_STOCK));
  const warehouseStockRef = useRef(warehouseStock);
  const [requisitions, setRequisitions] = useState(() => loadState('requisitions', INITIAL_REQUISITIONS));
  const [goodsReceipts, setGoodsReceipts] = useState(() => loadState('goodsReceipts', INITIAL_GOODS_RECEIPTS));
  const [stockTransfers, setStockTransfers] = useState(() => loadState('stockTransfers', INITIAL_STOCK_TRANSFERS));
  const [stockAdjustments, setStockAdjustments] = useState(() => loadState('stockAdjustments', INITIAL_STOCK_ADJUSTMENTS));
  const [purchaseReturns, setPurchaseReturns] = useState(() => loadState('purchaseReturns', INITIAL_PURCHASE_RETURNS));

  // Current User Role: 'owner' | 'admin' | 'staff'
  const [userRole, setUserRole] = useState(() => loadState('role', 'owner'));
  const [activeStaffId, setActiveStaffId] = useState(() => loadState('activeStaffId', 'stf-1'));

  // Autentikasi (simulasi JWT login)
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadState('authenticated', false));
  const [currentUser, setCurrentUser] = useState(() => loadState('currentUser', null));

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Pending POS Cart (used when converting appointment to POS)
  const [initialPOSCart, setInitialPOSCart] = useState(null);

  // Active receipt modal
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Notifications / Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ id: Date.now(), type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('pu_salon_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('pu_salon_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('pu_salon_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('pu_salon_batches', JSON.stringify(batches)); }, [batches]);
  useEffect(() => { localStorage.setItem('pu_salon_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('pu_salon_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('pu_salon_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('pu_salon_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('pu_salon_pos', JSON.stringify(purchaseOrders)); }, [purchaseOrders]);
  useEffect(() => { localStorage.setItem('pu_salon_finances', JSON.stringify(financialRecords)); }, [financialRecords]);
  useEffect(() => { localStorage.setItem('pu_salon_movements', JSON.stringify(movements)); }, [movements]);
  useEffect(() => { localStorage.setItem('pu_salon_warehouses', JSON.stringify(warehouses)); }, [warehouses]);
  useEffect(() => { localStorage.setItem('pu_salon_warehouseStock', JSON.stringify(warehouseStock)); }, [warehouseStock]);
  useEffect(() => { warehouseStockRef.current = warehouseStock; }, [warehouseStock]);
  useEffect(() => { localStorage.setItem('pu_salon_requisitions', JSON.stringify(requisitions)); }, [requisitions]);
  useEffect(() => { localStorage.setItem('pu_salon_goodsReceipts', JSON.stringify(goodsReceipts)); }, [goodsReceipts]);
  useEffect(() => { localStorage.setItem('pu_salon_stockTransfers', JSON.stringify(stockTransfers)); }, [stockTransfers]);
  useEffect(() => { localStorage.setItem('pu_salon_stockAdjustments', JSON.stringify(stockAdjustments)); }, [stockAdjustments]);
  useEffect(() => { localStorage.setItem('pu_salon_purchaseReturns', JSON.stringify(purchaseReturns)); }, [purchaseReturns]);
  useEffect(() => { localStorage.setItem('pu_salon_role', JSON.stringify(userRole)); }, [userRole]);
  useEffect(() => { localStorage.setItem('pu_salon_activeStaffId', JSON.stringify(activeStaffId)); }, [activeStaffId]);
  useEffect(() => { localStorage.setItem('pu_salon_authenticated', JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('pu_salon_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

  // Autentikasi — login/logout simulasi (JWT-style session)
  const demoAccounts = [
    { id: 'owner', role: 'owner', name: 'Yuni Puspita', email: 'owner@pusalon.co.id', label: 'Owner / Pemilik', password: 'demo123' },
    { id: 'admin', role: 'admin', name: 'Dian Kartika', email: 'admin@pusalon.co.id', label: 'Admin Salon', password: 'demo123' },
    { id: 'staff', role: 'staff', name: 'Budi Santoso', email: 'staff@pusalon.co.id', label: 'Staf / Stylist', password: 'demo123' }
  ];

  const login = ({ email, password }) => {
    const account = demoAccounts.find(a => a.email.toLowerCase() === String(email || '').trim().toLowerCase());
    if (!account || password !== account.password) {
      return { success: false, message: 'Email atau password tidak sesuai. Gunakan akun demo di bawah.' };
    }
    setUserRole(account.role);
    if (account.role === 'staff') setActiveStaffId('stf-1');
    setCurrentUser({
      name: account.name,
      email: account.email,
      role: account.role,
      label: account.label,
      token: `jwt.${btoa(`${account.email}:${Date.now()}`).replace(/=/g, '')}.demo`,
      loginAt: new Date().toISOString()
    });
    setIsAuthenticated(true);
    showToast('success', 'Login Berhasil', `Selamat datang kembali, ${account.name}!`);
    return { success: true, account };
  };

  const loginAs = (roleId) => {
    const account = demoAccounts.find(a => a.role === roleId) || demoAccounts[0];
    return login({ email: account.email, password: account.password });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
    showToast('info', 'Sesi Berakhir', 'Anda telah keluar dari sistem dengan aman.');
  };

  // Reset to demo data
  const resetAllData = () => {
    setStaff(INITIAL_STAFF);
    setServices(INITIAL_SERVICES);
    setProducts(INITIAL_PRODUCTS);
    setBatches(INITIAL_BATCHES);
    setCustomers(INITIAL_CUSTOMERS);
    setAppointments(INITIAL_APPOINTMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setFinancialRecords(INITIAL_FINANCIAL_RECORDS);
    setMovements(INITIAL_INVENTORY_MOVEMENTS);
    setWarehouses(INITIAL_WAREHOUSES);
    setWarehouseStock(INITIAL_WAREHOUSE_STOCK);
    setRequisitions(INITIAL_REQUISITIONS);
    setGoodsReceipts(INITIAL_GOODS_RECEIPTS);
    setStockTransfers(INITIAL_STOCK_TRANSFERS);
    setStockAdjustments(INITIAL_STOCK_ADJUSTMENTS);
    setPurchaseReturns(INITIAL_PURCHASE_RETURNS);
    showToast('info', 'Data Direset', 'Semua data contoh PU Salon & Barbershop telah dikembalikan ke awal.');
  };

  // 1. Operating Hours & Schedule Helpers
  const checkOperatingHours = (dateStr, timeStr) => {
    // Salon buka setiap hari mulai Senin, 11:00 - 21:00 (last order 20:00)
    const [h, m] = timeStr.split(':').map(Number);
    const timeInMins = h * 60 + m;

    const open = 11 * 60;
    const close = 21 * 60;
    const lastOrder = 20 * 60;

    if (timeInMins < open || timeInMins > close) {
      return { valid: false, message: 'Jam operasional Senin-Minggu adalah 11:00 - 21:00 (Last order 20:00)' };
    }
    if (timeInMins > lastOrder) {
      return { valid: false, message: 'Last order untuk hari ini adalah pukul 20:00' };
    }
    return { valid: true };
  };

  // Check Overlap for Staff
  const checkStaffAvailability = (staffId, dateStr, startTime, endTime, excludeAppointmentId = null) => {
    const existing = appointments.filter(apt => 
      apt.staffId === staffId &&
      apt.date === dateStr &&
      apt.status !== 'cancelled' &&
      apt.id !== excludeAppointmentId
    );

    const toMins = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const newStart = toMins(startTime);
    const newEnd = toMins(endTime);

    for (const apt of existing) {
      const aptStart = toMins(apt.startTime);
      const aptEnd = toMins(apt.endTime);
      // Overlap if newStart < aptEnd and newEnd > aptStart
      if (newStart < aptEnd && newEnd > aptStart) {
        return { available: false, conflictingWith: apt };
      }
    }
    return { available: true };
  };

  // Owner: perbarui profil staf (nama, foto, kontak, komisi, status)
  const updateStaff = (staffId, updates) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== staffId) return s;
      const nextCommission = updates.commissionRate !== undefined
        ? Math.min(1, Math.max(0, Number(updates.commissionRate) || 0))
        : s.commissionRate;
      return { ...s, ...updates, commissionRate: nextCommission };
    }));
    showToast('success', 'Profil Staf Diperbarui', `Data ${updates.name || 'staf'} berhasil disimpan.`);
  };

  // 2. Appointment CRUD & Workflows
  const createAppointment = (appointmentData) => {
    // Check operating hours
    const hoursCheck = checkOperatingHours(appointmentData.date, appointmentData.startTime);
    if (!hoursCheck.valid) {
      showToast('error', 'Di Luar Jam Operasional', hoursCheck.message);
      return { success: false, message: hoursCheck.message };
    }

    // Check staff availability
    const availCheck = checkStaffAvailability(
      appointmentData.staffId,
      appointmentData.date,
      appointmentData.startTime,
      appointmentData.endTime
    );

    if (!availCheck.available) {
      const msg = `Staf ini sudah memiliki janji (${availCheck.conflictingWith.customerName} @ ${availCheck.conflictingWith.startTime} - ${availCheck.conflictingWith.endTime})`;
      showToast('error', 'Jadwal Bentrok', msg);
      return { success: false, message: msg };
    }

    const newApt = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      code: `APT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`,
      status: appointmentData.status || 'pending',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newApt, ...prev]);
    showToast('success', 'Reservasi Berhasil', `Janji temu #${newApt.code} untuk ${newApt.customerName} telah dibuat.`);
    return { success: true, appointment: newApt };
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: newStatus };
      }
      return apt;
    }));
    showToast('info', 'Status Diperbarui', `Status janji temu diubah menjadi: ${newStatus.toUpperCase()}`);
  };

  const convertAppointmentToPOS = (apt) => {
    // Build initial cart items from appointment services
    const items = (apt.serviceIds || []).map(srvId => {
      const srv = services.find(s => s.id === srvId);
      return srv ? {
        id: srv.id,
        name: srv.name,
        price: srv.price,
        type: 'service',
        qty: 1,
        subtotal: srv.price
      } : null;
    }).filter(Boolean);

    setInitialPOSCart({
      appointmentId: apt.id,
      customerId: apt.customerId,
      customerName: apt.customerName,
      staffId: apt.staffId,
      staffName: apt.staffName,
      items: items
    });

    setActiveTab('pos');
    showToast('info', 'Lanjut ke Kasir POS', `Data janji temu ${apt.customerName} dimasukkan ke keranjang kasir.`);
  };

  // 2b. Warehouse Stock Engine — alokasi & pemindahan stok antar gudang.
  // Mengembalikan detail alokasi agar mutasi stok SCM mencatat gudang asal.
  const deductWarehouseStock = (productId, qty) => {
    const product = products.find(p => p.id === productId);
    const order = product && product.type === 'retail'
      ? ['wh-retail', 'wh-main', 'wh-barber']
      : ['wh-barber', 'wh-main', 'wh-retail'];

    const source = warehouseStockRef.current || warehouseStock;
    const allocations = [];
    let remaining = qty;

    for (const wid of order) {
      if (remaining <= 0) break;
      const row = source.find(r => r.warehouseId === wid && r.productId === productId);
      if (!row || row.qty <= 0) continue;
      const take = Math.min(row.qty, remaining);
      allocations.push({ warehouseId: wid, qty: take });
      remaining -= take;
    }

    if (allocations.length > 0) {
      const next = source.map(row => {
        const alloc = allocations.find(a => a.warehouseId === row.warehouseId);
        if (!alloc || row.productId !== productId) return row;
        return { ...row, qty: Math.max(0, row.qty - alloc.qty) };
      });
      warehouseStockRef.current = next;
      setWarehouseStock(next);
    }

    return { allocations, unallocated: remaining };
  };

  // 3. FIFO Inventory Deduction Engine
  const deductStockFIFO = (productId, qtyToDeduct, reference = 'POS', meta = {}) => {
    let remainingToDeduct = qtyToDeduct;

    // Find and sort product batches FIFO (earliest dateIn first)
    const currentBatches = [...batches]
      .filter(b => b.productId === productId && b.remainingQty > 0)
      .sort((a, b) => new Date(a.dateIn) - new Date(b.dateIn));

    let updatedBatches = [...batches];

    for (let i = 0; i < currentBatches.length; i++) {
      if (remainingToDeduct <= 0) break;
      const b = currentBatches[i];
      const deductFromThisBatch = Math.min(b.remainingQty, remainingToDeduct);

      updatedBatches = updatedBatches.map(batchItem => {
        if (batchItem.id === b.id) {
          return {
            ...batchItem,
            remainingQty: batchItem.remainingQty - deductFromThisBatch
          };
        }
        return batchItem;
      });

      remainingToDeduct -= deductFromThisBatch;
    }

    setBatches(updatedBatches);

    // Update overall current stock on product
    setProducts(prev => prev.map(prod => {
      if (prod.id === productId) {
        const newStock = Math.max(0, prod.currentStock - qtyToDeduct);
        return { ...prod, currentStock: newStock };
      }
      return prod;
    }));

    // Update allocation per warehouse & capture the source warehouse(s)
    const { allocations, unallocated } = deductWarehouseStock(productId, qtyToDeduct);

    // Log movement(s) — satu baris per gudang asal agar audit SCM akurat
    const product = products.find(p => p.id === productId);
    const baseMovement = {
      date: new Date().toISOString(),
      productId,
      productName: product ? product.name : 'Unknown Product',
      type: 'out',
      reference,
      channel: meta.channel || 'manual',
      invoiceNo: meta.invoiceNo || null,
      customerName: meta.customerName || null,
      staffName: meta.staffName || null,
      sourceId: meta.sourceId || null,
      notes: meta.notes || `Pengurangan stok otomatis (${reference})`
    };

    const movementRows = allocations.map(alloc => ({
      ...baseMovement,
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      qty: alloc.qty,
      warehouseId: alloc.warehouseId
    }));

    if (unallocated > 0) {
      movementRows.push({
        ...baseMovement,
        id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        qty: unallocated,
        warehouseId: meta.warehouseId || null
      });
    }

    if (movementRows.length === 0) {
      movementRows.push({
        ...baseMovement,
        id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        qty: qtyToDeduct,
        warehouseId: meta.warehouseId || null
      });
    }

    setMovements(prev => [...movementRows, ...prev]);
  };

  // 4. POS Transaction Checkout Engine
  const processPOSTransaction = ({
    appointmentId,
    customerId,
    customerName,
    staffId,
    staffName,
    items,
    subtotal,
    discount,
    discountReason,
    total,
    paymentMethod,
    cashGiven,
    change,
    notes
  }) => {
    const invoiceNo = `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.slice(0, 10);

    // Ringkasan integrasi CRM: poin & potensi kenaikan tier
    const existingCustomer = customerId ? customers.find(c => c.id === customerId) : null;
    const pointsEarned = existingCustomer ? pointsForAmount(total) : 0;
    const tierBefore = existingCustomer ? (existingCustomer.tier || 'Standard') : null;
    const tierAfter = existingCustomer
      ? resolveTier((existingCustomer.totalSpent || 0) + total, tierBefore)
      : null;
    const tierUpgraded = Boolean(tierBefore && tierAfter && tierAfter !== tierBefore);

    const newTransaction = {
      id: `trx-${Date.now()}`,
      invoiceNo,
      date: nowIso,
      customerId,
      customerName: customerName || 'Pelanggan Umum (Walk-in)',
      staffId,
      staffName,
      items,
      subtotal,
      discount: discount || 0,
      discountReason: discountReason || '',
      total,
      paymentMethod,
      paymentStatus: 'paid',
      cashGiven: Number(cashGiven) || total,
      change: Number(change) || 0,
      pointsEarned,
      tierBefore,
      tierAfter,
      tierUpgraded,
      notes: notes || 'Transaksi kasir selesai'
    };

    // 1. Add Transaction
    setTransactions(prev => [newTransaction, ...prev]);

    // 2. Reduce Stock for Retail Items & Service Formula Materials (ERP -> SCM)
    items.forEach(item => {
      if (item.type === 'product') {
        deductStockFIFO(item.id, item.qty, invoiceNo, {
          channel: 'pos',
          invoiceNo,
          customerName: newTransaction.customerName,
          staffName,
          sourceId: newTransaction.id,
          notes: `Penjualan POS ${invoiceNo} • ${newTransaction.customerName}`
        });
      } else if (item.type === 'service') {
        const service = services.find(s => s.id === item.id);
        if (service && service.materials) {
          service.materials.forEach(mat => {
            deductStockFIFO(mat.productId, mat.qty * item.qty, `${invoiceNo} (${service.name})`, {
              channel: 'pos',
              invoiceNo,
              customerName: newTransaction.customerName,
              staffName,
              sourceId: newTransaction.id,
              notes: `Pemakaian bahan ${service.name} • ${invoiceNo}`
            });
          });
        }
      }
    });

    // 3. Connect to Financial Management (Auto Record Income)
    const newFinanceRecord = {
      id: `fin-${Date.now()}`,
      type: 'income',
      category: 'POS Sales',
      description: `Pendapatan POS #${invoiceNo} (${items.length} item) - ${customerName}`,
      amount: total,
      date: todayDate,
      paymentMethod: paymentMethod === 'qris' ? 'QRIS' : 'Tunai',
      referenceId: newTransaction.id
    };
    setFinancialRecords(prev => [newFinanceRecord, ...prev]);

    // 4. Update Customer History, Loyalty Points & Auto Tier in CRM
    if (customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id !== customerId) return c;
        const nextSpent = (c.totalSpent || 0) + total;
        const currentTier = c.tier || 'Standard';
        return {
          ...c,
          visitCount: (c.visitCount || 0) + 1,
          totalSpent: nextSpent,
          loyaltyPoints: getCustomerPoints(c) + pointsEarned,
          tier: resolveTier(nextSpent, currentTier),
          lastVisit: todayDate,
          lastTransactionId: newTransaction.id,
          lastInvoiceNo: invoiceNo
        };
      }));
    }

    // 5. If linked to an appointment, mark it as completed
    if (appointmentId) {
      setAppointments(prev => prev.map(apt => {
        if (apt.id === appointmentId) {
          return { ...apt, status: 'completed' };
        }
        return apt;
      }));
    }

    // 6. Set receipt modal
    setActiveReceipt(newTransaction);
    const loyaltyNote = customerId
      ? ` • +${pointsEarned} poin CRM${tierUpgraded ? ` • Naik ke ${tierAfter}` : ''}`
      : '';
    showToast('success', 'Transaksi Selesai!', `Struk #${invoiceNo} berhasil diproses via ${paymentMethod.toUpperCase()}${loyaltyNote}`);
    return newTransaction;
  };

  // 5. Inventory & Supplier Purchase Order Workflows
  const createPurchaseOrder = (poData) => {
    const now = new Date();
    const newPO = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber: `PO-${new Date().toISOString().slice(0,7).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`,
      status: poData.status || 'ordered',
      date: new Date().toISOString().slice(0, 10),
      expectedDate: poData.expectedDate || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      warehouseId: poData.warehouseId || 'wh-main',
      receivedDate: null
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    showToast('success', 'Purchase Order Dibuat', `PO #${newPO.poNumber} berhasil diterbitkan.`);
    return newPO;
  };

  const receivePurchaseOrder = (poId, warehouseId) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    const today = new Date().toISOString().slice(0, 10);
    const targetWarehouseId = warehouseId || po.warehouseId || 'wh-main';
    const targetWarehouse = warehouses.find(w => w.id === targetWarehouseId);

    // 1. Mark PO as received
    setPurchaseOrders(prev => prev.map(p => {
      if (p.id === poId) {
        return { ...p, status: 'received', receivedDate: today, warehouseId: targetWarehouseId };
      }
      return p;
    }));

    // 2. Create FIFO Batches, increase stock & warehouse allocation
    const newBatchesToAdd = [];
    po.items.forEach(item => {
      const batchNo = `BATCH-${today.replace(/-/g,'')}-${Math.floor(10 + Math.random() * 90)}`;
      newBatchesToAdd.push({
        id: `btc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: item.productId,
        batchNo: batchNo,
        dateIn: today,
        initialQty: item.qty,
        remainingQty: item.qty,
        costPrice: item.unitPrice,
        expiryDate: new Date(Date.now() + 365*2*24*60*60*1000).toISOString().slice(0, 10), // +2 years
        supplierId: po.supplierId,
        warehouseId: targetWarehouseId
      });

      // Increase product stock
      setProducts(prevProds => prevProds.map(prod => {
        if (prod.id === item.productId) {
          return { ...prod, currentStock: prod.currentStock + item.qty };
        }
        return prod;
      }));

      // Increase warehouse allocation
      setWarehouseStock(prev => {
        const existing = prev.find(r => r.warehouseId === targetWarehouseId && r.productId === item.productId);
        if (existing) {
          return prev.map(r => r.id === existing.id ? { ...r, qty: r.qty + item.qty } : r);
        }
        return [...prev, {
          id: `wst-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          warehouseId: targetWarehouseId,
          productId: item.productId,
          qty: item.qty
        }];
      });

      // Log movement
      setMovements(prevMoves => [
        {
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: today,
          productId: item.productId,
          productName: item.productName,
          type: 'in',
          qty: item.qty,
          reference: po.poNumber,
          warehouseId: targetWarehouseId,
          notes: `Penerimaan Barang Supplier (${po.supplierName})`
        },
        ...prevMoves
      ]);
    });

    setBatches(prev => [...newBatchesToAdd, ...prev]);

    // 3. Record goods receipt (dokumen penerimaan barang)
    const newReceipt = {
      id: `gr-${Date.now()}`,
      number: `GR-${today.replace(/-/g, '').slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`,
      poId: po.id,
      poNumber: po.poNumber,
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      warehouseId: targetWarehouseId,
      receivedDate: today,
      receivedBy: 'Admin Gudang',
      status: 'completed',
      items: po.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        qtyOrdered: item.qty,
        qtyReceived: item.qty,
        condition: 'good'
      })),
      notes: `Penerimaan otomatis dari ${po.poNumber}`
    };
    setGoodsReceipts(prev => [newReceipt, ...prev]);

    // 4. Connect to Finance (Auto Record Expense for Restock)
    const newExpense = {
      id: `fin-${Date.now()}`,
      type: 'expense',
      category: 'Restock Bahan & Produk',
      description: `Pelunasan Pembelian ${po.poNumber} (${po.supplierName})`,
      amount: po.totalAmount,
      date: today,
      paymentMethod: 'Transfer Bank',
      referenceId: po.id
    };
    setFinancialRecords(prev => [newExpense, ...prev]);

    showToast('success', 'Barang Diterima & Stok Bertambah', `PO #${po.poNumber} diterima di ${targetWarehouse ? targetWarehouse.name : 'gudang'}. Batch FIFO, alokasi gudang, dan jurnal pengeluaran diperbarui.`);
  };

  // 5b. SCM — Master Pemasok
  const addSupplier = (data) => {
    const newSup = {
      ...data,
      id: `sup-${Date.now()}`,
      code: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      productsSupplied: data.productsSupplied || [],
      status: 'active',
      rating: Number(data.rating) || 4.5,
      leadTimeDays: Number(data.leadTimeDays) || 5,
      since: new Date().toISOString().slice(0, 10)
    };
    setSuppliers(prev => [...prev, newSup]);
    showToast('success', 'Pemasok Ditambahkan', `${newSup.name} terdaftar sebagai pemasok resmi.`);
    return newSup;
  };

  const updateSupplier = (id, data) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    showToast('info', 'Data Pemasok Diperbarui', 'Perubahan data pemasok berhasil disimpan.');
  };

  const deleteSupplier = (id) => {
    const sup = suppliers.find(s => s.id === id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
    showToast('info', 'Pemasok Dihapus', `${sup ? sup.name : 'Pemasok'} berhasil dihapus dari direktori.`);
  };

  // 5c. SCM — Pengadaan (Purchase Requisition → Purchase Order)
  const createRequisition = (data) => {
    const now = new Date();
    const items = (data.items || []).map(i => {
      const prod = products.find(p => p.id === i.productId);
      return {
        productId: i.productId,
        productName: prod ? prod.name : (i.productName || 'Produk'),
        qty: Number(i.qty) || 1,
        unit: prod ? prod.unit : 'pcs',
        estimatedPrice: Number(i.estimatedPrice) || (prod ? prod.buyPrice : 0)
      };
    });

    const supplier = suppliers.find(s => s.id === data.supplierId);
    const newReq = {
      ...data,
      id: `pr-${Date.now()}`,
      number: `PR-${now.toISOString().slice(0, 7).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      date: now.toISOString().slice(0, 10),
      status: 'pending',
      supplierId: data.supplierId || (suppliers[0] ? suppliers[0].id : ''),
      supplierName: supplier ? supplier.name : (suppliers[0] ? suppliers[0].name : 'Supplier'),
      items,
      totalEstimate: items.reduce((acc, i) => acc + i.qty * i.estimatedPrice, 0)
    };

    setRequisitions(prev => [newReq, ...prev]);
    showToast('success', 'Permintaan Pembelian Diajukan', `PR #${newReq.number} menunggu persetujuan.`);
    return newReq;
  };

  const approveRequisition = (id) => {
    setRequisitions(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    showToast('success', 'PR Disetujui', 'Permintaan pembelian siap dikonversi menjadi Purchase Order.');
  };

  const rejectRequisition = (id, reason) => {
    setRequisitions(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'rejected',
      notes: reason ? `${r.notes ? r.notes + ' — ' : ''}Ditolak: ${reason}` : r.notes
    } : r));
    showToast('info', 'PR Ditolak', 'Permintaan pembelian ditolak.');
  };

  const convertRequisitionToPO = (id) => {
    const req = requisitions.find(r => r.id === id);
    if (!req) return null;

    const supplier = suppliers.find(s => s.id === req.supplierId) || suppliers[0];
    const items = req.items.map(i => ({
      productId: i.productId,
      productName: i.productName,
      qty: i.qty,
      unitPrice: i.estimatedPrice,
      total: i.qty * i.estimatedPrice
    }));
    const totalAmount = items.reduce((acc, i) => acc + i.total, 0);
    const leadDays = supplier && supplier.leadTimeDays ? supplier.leadTimeDays : 7;

    const newPO = createPurchaseOrder({
      supplierId: supplier ? supplier.id : '',
      supplierName: supplier ? supplier.name : 'Supplier',
      items,
      totalAmount,
      notes: req.notes,
      warehouseId: req.warehouseId,
      requisitionId: req.id,
      expectedDate: new Date(Date.now() + leadDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    });

    setRequisitions(prev => prev.map(r => r.id === id ? { ...r, status: 'converted', poId: newPO.id } : r));
    showToast('info', 'PR Dikonversi ke PO', `PR #${req.number} telah menjadi ${newPO.poNumber}.`);
    return newPO;
  };

  // 5d. SCM — Gudang (transfer & stock opname)
  const createStockTransfer = ({ fromWarehouseId, toWarehouseId, productId, qty, notes, requestedBy }) => {
    const product = products.find(p => p.id === productId);
    const qtyNum = Number(qty) || 0;

    if (!product || qtyNum <= 0) {
      showToast('error', 'Transfer Gagal', 'Jumlah atau produk transfer tidak valid.');
      return { success: false };
    }
    if (fromWarehouseId === toWarehouseId) {
      showToast('error', 'Transfer Gagal', 'Gudang asal dan gudang tujuan tidak boleh sama.');
      return { success: false };
    }

    const sourceRow = warehouseStock.find(r => r.warehouseId === fromWarehouseId && r.productId === productId);
    const available = sourceRow ? sourceRow.qty : 0;
    if (qtyNum > available) {
      showToast('error', 'Stok Tidak Cukup', `Stok ${product.name} di gudang asal hanya ${available} ${product.unit}.`);
      return { success: false };
    }

    const today = new Date().toISOString().slice(0, 10);
    const number = `TRF-${today.replace(/-/g, '').slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;
    const fromName = warehouses.find(w => w.id === fromWarehouseId)?.name || 'Gudang Asal';
    const toName = warehouses.find(w => w.id === toWarehouseId)?.name || 'Gudang Tujuan';

    setWarehouseStock(prev => {
      const next = prev.map(r => ({ ...r }));
      const src = next.find(r => r.warehouseId === fromWarehouseId && r.productId === productId);
      if (src) src.qty -= qtyNum;
      const dest = next.find(r => r.warehouseId === toWarehouseId && r.productId === productId);
      if (dest) {
        dest.qty += qtyNum;
      } else {
        next.push({ id: `wst-${Date.now()}`, warehouseId: toWarehouseId, productId, qty: qtyNum });
      }
      return next;
    });

    setStockTransfers(prev => [{
      id: `trf-${Date.now()}`,
      number,
      date: today,
      fromWarehouseId,
      toWarehouseId,
      productId,
      productName: product.name,
      qty: qtyNum,
      status: 'completed',
      requestedBy: requestedBy || 'Admin Gudang',
      notes: notes || ''
    }, ...prev]);

    setMovements(prev => [
      {
        id: `mov-${Date.now()}-out`,
        date: today,
        productId,
        productName: product.name,
        type: 'out',
        qty: qtyNum,
        reference: number,
        warehouseId: fromWarehouseId,
        notes: `Transfer keluar ke ${toName}`
      },
      {
        id: `mov-${Date.now()}-in`,
        date: today,
        productId,
        productName: product.name,
        type: 'in',
        qty: qtyNum,
        reference: number,
        warehouseId: toWarehouseId,
        notes: `Transfer masuk dari ${fromName}`
      },
      ...prev
    ]);

    showToast('success', 'Transfer Stok Berhasil', `${qtyNum} ${product.unit} ${product.name} dipindahkan dari ${fromName} ke ${toName}.`);
    return { success: true };
  };

  const createStockAdjustment = ({ warehouseId, productId, physicalQty, reason }) => {
    const product = products.find(p => p.id === productId);
    const row = warehouseStock.find(r => r.warehouseId === warehouseId && r.productId === productId);
    const systemQty = row ? row.qty : 0;
    const physical = Math.max(0, Number(physicalQty) || 0);
    const difference = physical - systemQty;
    const today = new Date().toISOString().slice(0, 10);
    const number = `ADJ-${today.replace(/-/g, '').slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;
    const whName = warehouses.find(w => w.id === warehouseId)?.name || 'Gudang';

    setWarehouseStock(prev => {
      const existing = prev.find(r => r.warehouseId === warehouseId && r.productId === productId);
      if (existing) {
        return prev.map(r => r.id === existing.id ? { ...r, qty: physical } : r);
      }
      return [...prev, { id: `wst-${Date.now()}`, warehouseId, productId, qty: physical }];
    });

    setProducts(prev => prev.map(p => p.id === productId
      ? { ...p, currentStock: Math.max(0, p.currentStock + difference) }
      : p));

    setStockAdjustments(prev => [{
      id: `adj-${Date.now()}`,
      number,
      date: today,
      warehouseId,
      productId,
      productName: product ? product.name : 'Produk',
      systemQty,
      physicalQty: physical,
      difference,
      reason: reason || 'Stock opname',
      status: 'approved',
      approvedBy: 'Owner'
    }, ...prev]);

    if (difference !== 0) {
      setMovements(prev => [{
        id: `mov-${Date.now()}`,
        date: today,
        productId,
        productName: product ? product.name : 'Produk',
        type: difference > 0 ? 'in' : 'out',
        qty: Math.abs(difference),
        reference: number,
        warehouseId,
        notes: `Penyesuaian stock opname ${whName} (${difference > 0 ? '+' : ''}${difference})`
      }, ...prev]);
    }

    showToast(
      'success',
      'Stock Opname Disimpan',
      `Selisih ${difference >= 0 ? '+' : ''}${difference} ${product ? product.unit : 'unit'} — ${product ? product.name : 'produk'} (${whName}).`
    );
    return { success: true, difference };
  };

  const addWarehouse = (data) => {
    const newWh = {
      ...data,
      id: `wh-${Date.now()}`,
      code: data.code || `GD-${String(warehouses.length + 1).padStart(3, '0')}`,
      capacity: Number(data.capacity) || 100,
      status: 'active'
    };
    setWarehouses(prev => [...prev, newWh]);
    showToast('success', 'Gudang Ditambahkan', `Gudang "${newWh.name}" (${newWh.code}) berhasil didaftarkan.`);
    return newWh;
  };

  const createPurchaseReturn = ({
    supplierId,
    warehouseId,
    productId,
    qty,
    reason,
    poNumber,
    resolution,
    submittedBy,
    notes
  }) => {
    const product = products.find(p => p.id === productId);
    const supplier = suppliers.find(s => s.id === supplierId);
    const wh = warehouses.find(w => w.id === warehouseId);
    const returnQty = Math.max(1, Number(qty) || 1);
    const unitPrice = product ? product.buyPrice : 0;
    const totalRefund = returnQty * unitPrice;
    const today = new Date().toISOString().slice(0, 10);
    const number = `RTN-${today.replace(/-/g, '').slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;

    const currentWhStock = warehouseStock.find(r => r.warehouseId === warehouseId && r.productId === productId)?.qty || 0;
    if (currentWhStock < returnQty) {
      showToast('error', 'Stok Tidak Cukup', `Stok ${product?.name || 'produk'} di ${wh?.name || 'gudang'} hanya ${currentWhStock} unit.`);
      return { success: false, message: 'Stok tidak cukup' };
    }

    setWarehouseStock(prev => prev.map(r => {
      if (r.warehouseId === warehouseId && r.productId === productId) {
        return { ...r, qty: Math.max(0, r.qty - returnQty) };
      }
      return r;
    }));

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, currentStock: Math.max(0, p.currentStock - returnQty) };
      }
      return p;
    }));

    setMovements(prev => [{
      id: `mov-${Date.now()}`,
      date: today,
      productId,
      productName: product ? product.name : 'Produk',
      type: 'out',
      qty: returnQty,
      reference: number,
      warehouseId,
      notes: `Retur pemasok ${supplier?.name || 'Supplier'}: ${reason}`
    }, ...prev]);

    if (resolution === 'Pengembalian Dana') {
      addFinancialRecord({
        date: today,
        type: 'income',
        category: 'Retur Pembelian',
        amount: totalRefund,
        description: `Pengembalian dana retur ${number} dari ${supplier?.name || 'Supplier'} (${returnQty} unit ${product?.name})`,
        paymentMethod: 'Transfer Bank'
      });
    }

    const newReturn = {
      id: `rtn-${Date.now()}`,
      number,
      date: today,
      poNumber: poNumber || '—',
      supplierId,
      supplierName: supplier ? supplier.name : 'Pemasok',
      warehouseId,
      productId,
      productName: product ? product.name : 'Produk',
      qty: returnQty,
      unit: product ? product.unit : 'pcs',
      unitPrice,
      totalRefund,
      reason,
      resolution: resolution || 'Tukar Barang Baru',
      status: 'approved',
      submittedBy: submittedBy || 'Staff Gudang',
      notes: notes || ''
    };

    setPurchaseReturns(prev => [newReturn, ...prev]);
    showToast('success', 'Retur Pembelian Dicatat', `Retur ${number} (${returnQty} ${product ? product.unit : 'unit'}) kepada ${supplier ? supplier.name : 'supplier'} berhasil diproses.`);
    return { success: true, newReturn };
  };

  // 6. Financial Entry Management
  const addFinancialRecord = (record) => {
    const newRec = {
      ...record,
      id: `fin-${Date.now()}`,
      date: record.date || new Date().toISOString().slice(0, 10)
    };
    setFinancialRecords(prev => [newRec, ...prev]);
    showToast('success', 'Jurnal Ditambahkan', `${record.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} senilai Rp ${Number(record.amount).toLocaleString('id-ID')} telah dicatat.`);
  };

  // 7. Customer CRUD & Birthday Promos
  const addCustomer = (customerData) => {
    const newCust = {
      ...customerData,
      id: `cst-${Date.now()}`,
      visitCount: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      tier: customerData.tier || 'Standard',
      lastVisit: null,
      lastTransactionId: null,
      lastInvoiceNo: null
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast('success', 'Pelanggan Baru', `Data ${newCust.name} berhasil disimpan.`);
    return newCust;
  };

  const updateCustomer = (id, updatedData) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    showToast('info', 'Data Pelanggan Diperbarui', 'Perubahan berhasil disimpan.');
  };

  // Helper: check if a customer has birthday today or this month
  const getCustomerBirthdayStatus = (birthdayStr) => {
    if (!birthdayStr) return { isToday: false, isThisMonth: false };
    const bday = new Date(birthdayStr);
    const today = new Date();
    const isThisMonth = bday.getMonth() === today.getMonth();
    const isToday = isThisMonth && bday.getDate() === today.getDate();
    return { isToday, isThisMonth };
  };

  return (
    <AppContext.Provider
      value={{
        salonProfile: SALON_PROFILE,
        staff,
        setStaff,
        updateStaff,
        services,
        setServices,
        products,
        setProducts,
        batches,
        customers,
        setCustomers,
        appointments,
        setAppointments,
        transactions,
        suppliers,
        purchaseOrders,
        financialRecords,
        movements,
        warehouses,
        warehouseStock,
        requisitions,
        goodsReceipts,
        stockTransfers,
        stockAdjustments,
        purchaseReturns,
        setPurchaseReturns,
        userRole,
        setUserRole,
        activeStaffId,
        setActiveStaffId,
        isAuthenticated,
        currentUser,
        demoAccounts,
        login,
        loginAs,
        logout,
        activeTab,
        setActiveTab,
        initialPOSCart,
        setInitialPOSCart,
        activeReceipt,
        setActiveReceipt,
        toast,
        showToast,
        resetAllData,
        checkOperatingHours,
        checkStaffAvailability,
        createAppointment,
        updateAppointmentStatus,
        convertAppointmentToPOS,
        processPOSTransaction,
        deductStockFIFO,
        createPurchaseOrder,
        receivePurchaseOrder,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addWarehouse,
        createRequisition,
        approveRequisition,
        rejectRequisition,
        convertRequisitionToPO,
        createStockTransfer,
        createStockAdjustment,
        createPurchaseReturn,
        addFinancialRecord,
        addCustomer,
        updateCustomer,
        getCustomerBirthdayStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
