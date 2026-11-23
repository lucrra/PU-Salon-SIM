import React, { createContext, useContext, useState, useEffect } from 'react';
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
  INITIAL_INVENTORY_MOVEMENTS
} from '../data/initialData';

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

  // Current User Role: 'owner' | 'admin' | 'staff'
  const [userRole, setUserRole] = useState(() => loadState('role', 'owner'));
  const [activeStaffId, setActiveStaffId] = useState(() => loadState('activeStaffId', 'stf-1'));

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
  useEffect(() => { localStorage.setItem('pu_salon_role', JSON.stringify(userRole)); }, [userRole]);
  useEffect(() => { localStorage.setItem('pu_salon_activeStaffId', JSON.stringify(activeStaffId)); }, [activeStaffId]);

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
    showToast('info', 'Data Direset', 'Semua data contoh PU Salon & Barbershop telah dikembalikan ke awal.');
  };

  // 1. Operating Hours & Schedule Helpers
  const checkOperatingHours = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0: Sunday, 1: Monday, ...
    const isMonday = day === 1;

    // Time to minutes
    const [h, m] = timeStr.split(':').map(Number);
    const timeInMins = h * 60 + m;

    if (isMonday) {
      const open = 11 * 60;
      const close = 16 * 60;
      const lastOrder = 15 * 60;
      if (timeInMins < open || timeInMins > close) {
        return { valid: false, message: 'Hari Senin jam operasional adalah 11:00 - 16:00 (Last order 15:00)' };
      }
      if (timeInMins > lastOrder) {
        return { valid: false, message: 'Last order untuk hari Senin adalah pukul 15:00' };
      }
    } else {
      const open = 11 * 60;
      const close = 21 * 60;
      const lastOrder = 20 * 60;
      if (timeInMins < open || timeInMins > close) {
        return { valid: false, message: 'Jam operasional Selasa-Minggu adalah 11:00 - 21:00 (Last order 20:00)' };
      }
      if (timeInMins > lastOrder) {
        return { valid: false, message: 'Last order untuk hari ini adalah pukul 20:00' };
      }
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

  // 3. FIFO Inventory Deduction Engine
  const deductStockFIFO = (productId, qtyToDeduct, reference = 'POS') => {
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

    // Log movement
    const product = products.find(p => p.id === productId);
    const newMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toISOString().slice(0, 10),
      productId,
      productName: product ? product.name : 'Unknown Product',
      type: 'out',
      qty: qtyToDeduct,
      reference,
      notes: `Pengurangan stok otomatis (${reference})`
    };

    setMovements(prev => [newMovement, ...prev]);
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
      notes: notes || 'Transaksi kasir selesai'
    };

    // 1. Add Transaction
    setTransactions(prev => [newTransaction, ...prev]);

    // 2. Reduce Stock for Retail Items & Service Formula Materials
    items.forEach(item => {
      if (item.type === 'product') {
        deductStockFIFO(item.id, item.qty, invoiceNo);
      } else if (item.type === 'service') {
        const service = services.find(s => s.id === item.id);
        if (service && service.materials) {
          service.materials.forEach(mat => {
            deductStockFIFO(mat.productId, mat.qty * item.qty, `${invoiceNo} (${service.name})`);
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

    // 4. Update Customer History & Visit Count in CRM
    if (customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === customerId) {
          return {
            ...c,
            visitCount: (c.visitCount || 0) + 1,
            totalSpent: (c.totalSpent || 0) + total,
            lastVisit: todayDate
          };
        }
        return c;
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
    showToast('success', 'Transaksi Selesai!', `Struk #${invoiceNo} berhasil diproses via ${paymentMethod.toUpperCase()}`);
    return newTransaction;
  };

  // 5. Inventory & Supplier Purchase Order Workflows
  const createPurchaseOrder = (poData) => {
    const newPO = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber: `PO-${new Date().toISOString().slice(0,7).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`,
      status: poData.status || 'ordered',
      date: new Date().toISOString().slice(0, 10),
      receivedDate: null
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    showToast('success', 'Purchase Order Dibuat', `PO #${newPO.poNumber} berhasil diterbitkan.`);
    return newPO;
  };

  const receivePurchaseOrder = (poId) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    const today = new Date().toISOString().slice(0, 10);

    // 1. Mark PO as received
    setPurchaseOrders(prev => prev.map(p => {
      if (p.id === poId) {
        return { ...p, status: 'received', receivedDate: today };
      }
      return p;
    }));

    // 2. Create FIFO Batches & Increase Stock
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
        supplierId: po.supplierId
      });

      // Increase product stock
      setProducts(prevProds => prevProds.map(prod => {
        if (prod.id === item.productId) {
          return { ...prod, currentStock: prod.currentStock + item.qty };
        }
        return prod;
      }));

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
          notes: `Penerimaan Barang Supplier (${po.supplierName})`
        },
        ...prevMoves
      ]);
    });

    setBatches(prev => [...newBatchesToAdd, ...prev]);

    // 3. Connect to Finance (Auto Record Expense for Restock)
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

    showToast('success', 'Barang Diterima & Stok Bertambah', `PO #${po.poNumber} telah diterima. Stok produk dan jurnal pengeluaran telah diperbarui.`);
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
      tier: 'Standard',
      lastVisit: null
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
        userRole,
        setUserRole,
        activeStaffId,
        setActiveStaffId,
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
