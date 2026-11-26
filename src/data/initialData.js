// Initial data for PU Salon & Barbershop ERP System

export const SALON_PROFILE = {
  name: "PU Salon & Barbershop",
  tagline: "Premium Beauty & Hair Care Studio",
  address: "Jl. Maera Sari No.11, Banjarsari, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275",
  phone: "0812-3456-7890",
  email: "halo@pusalon.co.id",
  operatingHours: {
    monday: { open: "11:00", close: "16:00", lastOrder: "15:00", label: "Senin (11:00 - 16:00)" },
    regular: { open: "11:00", close: "21:00", lastOrder: "20:00", label: "Selasa - Minggu (11:00 - 21:00)" }
  },
  qrisPayload: "00020101021226600016ID.CO.GOPAY.WWW01189360091438901234560215000000000000001510400005204581253033605802ID5920PU SALON BARBERSHOP6007JAKARTA61051424062070703A016304E8A9"
};

export const INITIAL_STAFF = [
  {
    id: "stf-1",
    name: "Budi Santoso",
    role: "Senior Barber",
    specialty: "Gentlemen Cut, Fade, Beard Sculpting & Hot Towel",
    phone: "0813-8899-1122",
    email: "budi@pusalon.co.id",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "available", // available, busy, off
    commissionRate: 0.15,
    todayServed: 5,
    rating: 4.9
  },
  {
    id: "stf-2",
    name: "Siti Rahmawati",
    role: "Senior Hair Stylist & Colorist",
    specialty: "Balayage, Creambath Tradisional, Hair Spa & Blow Dry",
    phone: "0821-4455-7788",
    email: "siti@pusalon.co.id",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    status: "available",
    commissionRate: 0.15,
    todayServed: 4,
    rating: 4.95
  },
  {
    id: "stf-3",
    name: "Rian Pratama",
    role: "All-Round Barber & Stylist",
    specialty: "Modern Cuts, Scalp Therapy & Reflexology",
    phone: "0857-1122-3344",
    email: "rian@pusalon.co.id",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "available",
    commissionRate: 0.12,
    todayServed: 3,
    rating: 4.85
  }
];

export const INITIAL_SERVICES = [
  {
    id: "srv-1",
    code: "BAR-01",
    name: "Gentlemen Signature Cut & Wash",
    category: "Barbershop",
    price: 65000,
    duration: 45,
    description: "Potong rambut presisi, keramas relaksasi, pembersihan leher & styling pomade.",
    materials: [
      { productId: "prd-9", qty: 1, unit: "roll", name: "Neck Paper" },
      { productId: "prd-1", qty: 5, unit: "gr", name: "Pomade Wax" }
    ]
  },
  {
    id: "srv-2",
    code: "BAR-02",
    name: "Fade & Beard Grooming + Hot Towel",
    category: "Barbershop",
    price: 85000,
    duration: 60,
    description: "Cukur fade rapi, penataan jenggot, handuk hangat aromaterapi & beard oil.",
    materials: [
      { productId: "prd-9", qty: 1, unit: "roll", name: "Neck Paper" },
      { productId: "prd-10", qty: 1, unit: "pcs", name: "Silet Feather" },
      { productId: "prd-6", qty: 2, unit: "ml", name: "Beard Oil" }
    ]
  },
  {
    id: "srv-3",
    code: "BAR-03",
    name: "Junior / Kids Haircut (Dibawah 12 Th)",
    category: "Barbershop",
    price: 45000,
    duration: 30,
    description: "Potong rambut anak yang ramah, cepat, rapi dan nyaman.",
    materials: [
      { productId: "prd-9", qty: 1, unit: "roll", name: "Neck Paper" }
    ]
  },
  {
    id: "srv-4",
    code: "TRT-01",
    name: "Creambath Tradisional Aromaterapi",
    category: "Treatment",
    price: 95000,
    duration: 60,
    description: "Perawatan kulit kepala dengan ekstrak Ginseng/Lidah Buaya, pijat bahu & leher.",
    materials: [
      { productId: "prd-2", qty: 50, unit: "gr", name: "Makarizo Creambath Cream" }
    ]
  },
  {
    id: "srv-5",
    code: "TRT-02",
    name: "L'Oreal Professionnel Hair Spa & Blow Dry",
    category: "Treatment",
    price: 150000,
    duration: 75,
    description: "Deep conditioning premium untuk rambut kering/rusak, relaksasi uap & blow salon.",
    materials: [
      { productId: "prd-3", qty: 60, unit: "ml", name: "L'Oreal Hair Spa Cream" },
      { productId: "prd-5", qty: 2, unit: "ml", name: "Vitamin Serum" }
    ]
  },
  {
    id: "srv-6",
    code: "TRT-03",
    name: "Scalp Detox & Anti-Dandruff Therapy",
    category: "Treatment",
    price: 120000,
    duration: 60,
    description: "Pembersihan kerak ketombe mendalam, eksfoliasi kulit kepala & serum pendingin mint.",
    materials: [
      { productId: "prd-2", qty: 40, unit: "gr", name: "Creambath Cream" }
    ]
  },
  {
    id: "srv-7",
    code: "STY-01",
    name: "Wash, Blow Styling & Hair Serum",
    category: "Styling",
    price: 55000,
    duration: 35,
    description: "Cuci rambut segar dengan shampoo aromaterapi, blow kering bervolume & serum kilau.",
    materials: [
      { productId: "prd-5", qty: 1, unit: "ml", name: "Hair Serum" }
    ]
  },
  {
    id: "srv-8",
    code: "COL-01",
    name: "Hair Glossing & Fashion Coloring",
    category: "Coloring",
    price: 350000,
    duration: 120,
    description: "Pewarnaan rambut trendi atau penutupan uban dengan formula aman minim amonia.",
    materials: [
      { productId: "prd-8", qty: 50, unit: "gr", name: "Bleaching/Color Powder" }
    ]
  },
  {
    id: "srv-9",
    code: "TRT-04",
    name: "Keratin Smooth & Gloss Therapy",
    category: "Treatment",
    price: 450000,
    duration: 120,
    description: "Pelurusan lembut bebas frizzy tahan 3-4 bulan dengan kilau maksimal.",
    materials: [
      { productId: "prd-4", qty: 80, unit: "ml", name: "Smoothing Cream" }
    ]
  },
  {
    id: "srv-10",
    code: "SPA-01",
    name: "Reflexology & Scalp Massage (Add-on)",
    category: "Spa",
    price: 40000,
    duration: 30,
    description: "Pijat kepala, leher, dan pundak untuk meredakan ketegangan otot.",
    materials: []
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prd-1",
    sku: "RET-POM-01",
    name: "Suavecito Matte Pomade 113g",
    category: "Retail",
    type: "retail", // retail (dijual), material (bahan salon)
    unit: "pcs",
    minStock: 5,
    currentStock: 16,
    buyPrice: 85000,
    sellPrice: 135000,
    description: "Pomade water-based daya tahan kuat matte finish tanpa kilap berlebih."
  },
  {
    id: "prd-2",
    sku: "MAT-CRM-01",
    name: "Makarizo Hair Energy Creambath 500g",
    category: "Material",
    type: "material",
    unit: "jar",
    minStock: 3,
    currentStock: 8,
    buyPrice: 65000,
    sellPrice: 0,
    description: "Krim creambath salon wangi kiwi & royal jelly."
  },
  {
    id: "prd-3",
    sku: "MAT-SPA-01",
    name: "L'Oreal Professionnel Hair Spa 500ml",
    category: "Material",
    type: "material",
    unit: "jar",
    minStock: 3,
    currentStock: 4,
    buyPrice: 125000,
    sellPrice: 0,
    description: "Krim hair spa profesional dengan air murni dan ekstrak teratai."
  },
  {
    id: "prd-4",
    sku: "MAT-SMT-01",
    name: "Matrix Opti.Straight Smoothing Cream 500ml",
    category: "Material",
    type: "material",
    unit: "pack",
    minStock: 2,
    currentStock: 3,
    buyPrice: 145000,
    sellPrice: 0,
    description: "Obat pelurus rambut salon teknologi auto-control."
  },
  {
    id: "prd-5",
    sku: "RET-SRM-01",
    name: "Makarizo Vitaglitz Hair Serum 8ml (Box)",
    category: "Retail",
    type: "retail",
    unit: "box",
    minStock: 5,
    currentStock: 12,
    buyPrice: 35000,
    sellPrice: 60000,
    description: "Serum vitamin rambut melindungi dari panas catokan & sinar UV."
  },
  {
    id: "prd-6",
    sku: "RET-OIL-01",
    name: "Beard Oil Sandalwood & Cedar 30ml",
    category: "Retail",
    type: "retail",
    unit: "bottle",
    minStock: 3,
    currentStock: 7,
    buyPrice: 48000,
    sellPrice: 85000,
    description: "Minyak penumbuh dan pelembut jenggot wangi kayu mewah."
  },
  {
    id: "prd-7",
    sku: "RET-MOR-01",
    name: "Moroccanoil Treatment 100ml",
    category: "Retail",
    type: "retail",
    unit: "bottle",
    minStock: 3,
    currentStock: 2, // Low stock alert!
    buyPrice: 280000,
    sellPrice: 390000,
    description: "Serum minyak argan murni pelopor perawatan rambut nomor satu dunia."
  },
  {
    id: "prd-8",
    sku: "MAT-BLC-01",
    name: "Bleaching Powder Blue 500g",
    category: "Material",
    type: "material",
    unit: "can",
    minStock: 3,
    currentStock: 1, // Low stock alert!
    buyPrice: 110000,
    sellPrice: 0,
    description: "Bubuk bleaching pengangkat warna hingga level 8+ anti brassy."
  },
  {
    id: "prd-9",
    sku: "MAT-NCK-01",
    name: "Kertas Leher Barbershop (Neck Paper Roll)",
    category: "Material",
    type: "material",
    unit: "roll",
    minStock: 5,
    currentStock: 15,
    buyPrice: 12000,
    sellPrice: 0,
    description: "Kertas leher elastis sekali pakai higienis barbershop."
  },
  {
    id: "prd-10",
    sku: "MAT-BLD-01",
    name: "Pisau Silet Feather Double Edge (Isi 100)",
    category: "Material",
    type: "material",
    unit: "box",
    minStock: 2,
    currentStock: 4,
    buyPrice: 75000,
    sellPrice: 0,
    description: "Silet jepang platinum tajam presisi untuk cukur kumis dan jenggot."
  },
  {
    id: "prd-11",
    sku: "RET-SHM-01",
    name: "Makarizo Hair Energy Shampoo 250ml",
    category: "Retail",
    type: "retail",
    unit: "bottle",
    minStock: 5,
    currentStock: 18,
    buyPrice: 52000,
    sellPrice: 78000,
    description: "Sampo salon harian dengan vitamin B5 & royal jelly, lembut untuk perawatan rambut di rumah."
  },
  {
    id: "prd-12",
    sku: "RET-CND-01",
    name: "Makarizo Hair Energy Conditioner 250ml",
    category: "Retail",
    type: "retail",
    unit: "bottle",
    minStock: 5,
    currentStock: 15,
    buyPrice: 55000,
    sellPrice: 82000,
    description: "Kondisioner pelembap untuk rambut kering setelah keramas, memudahkan sisir tanpa kusut."
  },
  {
    id: "prd-13",
    sku: "RET-MSK-01",
    name: "L'Oreal Elseve Total Repair Hair Mask 300ml",
    category: "Retail",
    type: "retail",
    unit: "jar",
    minStock: 4,
    currentStock: 10,
    buyPrice: 98000,
    sellPrice: 145000,
    description: "Masker rambut rusak akibat catok & pewarnaan, dipakai 2-3 kali seminggu di rumah."
  },
  {
    id: "prd-14",
    sku: "RET-VIT-01",
    name: "Ellips Hair Vitamin Pro-Keratin 6x1ml",
    category: "Retail",
    type: "retail",
    unit: "sachet",
    minStock: 8,
    currentStock: 24,
    buyPrice: 28000,
    sellPrice: 45000,
    description: "Vitamin rambut kapsul pro-keratin untuk kilau & kekuatan rambut, praktis dibawa pulang."
  },
  {
    id: "prd-15",
    sku: "RET-LVS-01",
    name: "Leave-In Serum Anti Frizz 100ml",
    category: "Retail",
    type: "retail",
    unit: "bottle",
    minStock: 4,
    currentStock: 9,
    buyPrice: 72000,
    sellPrice: 115000,
    description: "Serum tanpa bilas penakluk rambut mengembang, cocok sebelum blow atau aktivitas luar ruang."
  },
  {
    id: "prd-16",
    sku: "RET-OIL-02",
    name: "Hair Oil Argan & Jojoba 50ml",
    category: "Retail",
    type: "retail",
    unit: "bottle",
    minStock: 3,
    currentStock: 8,
    buyPrice: 82000,
    sellPrice: 128000,
    description: "Minyak argan & jojoba untuk menutrisi ujung rambut kering dan mengurangi rambut bercabang."
  }
];

export const INITIAL_BATCHES = [
  { id: "btc-1", productId: "prd-1", batchNo: "BATCH-2026-001", dateIn: "2026-10-15", initialQty: 10, remainingQty: 6, costPrice: 85000, expiryDate: "2028-10-15", supplierId: "sup-2" },
  { id: "btc-2", productId: "prd-1", batchNo: "BATCH-2026-009", dateIn: "2026-11-05", initialQty: 10, remainingQty: 10, costPrice: 85000, expiryDate: "2028-11-05", supplierId: "sup-2" },
  { id: "btc-3", productId: "prd-2", batchNo: "BATCH-2026-002", dateIn: "2026-10-20", initialQty: 10, remainingQty: 8, costPrice: 65000, expiryDate: "2028-04-20", supplierId: "sup-1" },
  { id: "btc-4", productId: "prd-3", batchNo: "BATCH-2026-003", dateIn: "2026-10-25", initialQty: 5, remainingQty: 4, costPrice: 125000, expiryDate: "2028-06-30", supplierId: "sup-3" },
  { id: "btc-5", productId: "prd-7", batchNo: "BATCH-2026-004", dateIn: "2026-10-10", initialQty: 5, remainingQty: 2, costPrice: 280000, expiryDate: "2028-09-01", supplierId: "sup-3" },
  { id: "btc-6", productId: "prd-8", batchNo: "BATCH-2026-005", dateIn: "2026-10-12", initialQty: 4, remainingQty: 1, costPrice: 110000, expiryDate: "2027-12-31", supplierId: "sup-1" },
  { id: "btc-7", productId: "prd-11", batchNo: "BATCH-2026-011", dateIn: "2026-11-20", initialQty: 18, remainingQty: 18, costPrice: 52000, expiryDate: "2028-11-20", supplierId: "sup-2" },
  { id: "btc-8", productId: "prd-12", batchNo: "BATCH-2026-012", dateIn: "2026-11-20", initialQty: 15, remainingQty: 15, costPrice: 55000, expiryDate: "2028-11-20", supplierId: "sup-2" },
  { id: "btc-9", productId: "prd-13", batchNo: "BATCH-2026-013", dateIn: "2026-11-20", initialQty: 10, remainingQty: 10, costPrice: 98000, expiryDate: "2028-11-20", supplierId: "sup-3" },
  { id: "btc-10", productId: "prd-14", batchNo: "BATCH-2026-014", dateIn: "2026-11-20", initialQty: 24, remainingQty: 24, costPrice: 28000, expiryDate: "2028-11-20", supplierId: "sup-1" },
  { id: "btc-11", productId: "prd-15", batchNo: "BATCH-2026-015", dateIn: "2026-11-20", initialQty: 9, remainingQty: 9, costPrice: 72000, expiryDate: "2028-11-20", supplierId: "sup-3" },
  { id: "btc-12", productId: "prd-16", batchNo: "BATCH-2026-016", dateIn: "2026-11-20", initialQty: 8, remainingQty: 8, costPrice: 82000, expiryDate: "2028-11-20", supplierId: "sup-2" }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "cst-1",
    name: "Dimas Anggara",
    phone: "0812-9988-7711",
    address: "Jl. Maera Sari No.11, Banjarsari, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275",
    birthday: "1994-11-20", // TODAY is his birthday! For birthday promo testing
    tier: "Gold",
    visitCount: 14,
    totalSpent: 1250000,
    loyaltyPoints: 125,
    lastVisit: "2026-11-05",
    notes: "Potongan langganan: Low taper fade, selalu pakai pomade suavecito."
  },
  {
    id: "cst-2",
    name: "Clarissa Putri",
    phone: "0818-4433-2211",
    address: "Jl. Maera Sari No.11, Banjarsari, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275",
    birthday: "1998-11-28", // Also birthday this month!
    tier: "Gold",
    visitCount: 9,
    totalSpent: 2100000,
    loyaltyPoints: 210,
    lastVisit: "2026-11-12",
    notes: "Suka Creambath Ginseng dan Blow bervolume natural."
  },
  {
    id: "cst-3",
    name: "Hendro Wijaya",
    phone: "0856-7788-9900",
    address: "Jl. Maera Sari No.11, Banjarsari, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275",
    birthday: "1988-04-15",
    tier: "Silver",
    visitCount: 6,
    totalSpent: 520000,
    loyaltyPoints: 52,
    lastVisit: "2026-10-28",
    notes: "Potong rapi formal, pencukuran jenggot bersih."
  },
  {
    id: "cst-4",
    name: "Nadya Salsabila",
    phone: "0878-1234-5678",
    address: "Jl. Maera Sari No.11, Banjarsari, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275",
    birthday: "2001-07-09",
    tier: "Silver",
    visitCount: 5,
    totalSpent: 890000,
    loyaltyPoints: 89,
    lastVisit: "2026-11-01",
    notes: "Pernah coloring balayage ash brown, treatment rutin hair spa."
  },
  {
    id: "cst-5",
    name: "Kevin Sanjaya",
    phone: "0813-5566-7788",
    address: "Jl. Maera Sari No.11, Banjarsari, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275",
    birthday: "1996-02-18",
    tier: "Standard",
    visitCount: 2,
    totalSpent: 150000,
    loyaltyPoints: 15,
    lastVisit: "2026-11-10",
    notes: "Baru coba barbershop, langganan potongan Budi."
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt-1",
    code: "APT-20261120-001",
    customerId: "cst-1",
    customerName: "Dimas Anggara",
    customerPhone: "0812-9988-7711",
    staffId: "stf-1",
    staffName: "Budi Santoso",
    serviceIds: ["srv-1"],
    serviceNames: ["Gentlemen Signature Cut & Wash"],
    totalAmount: 65000,
    date: "2026-11-20",
    startTime: "11:30",
    endTime: "12:15",
    status: "in_progress", // pending, confirmed, in_progress, completed, cancelled
    type: "online", // online, walk_in
    notes: "Ulang tahun hari ini! Cek promo birthday 15%."
  },
  {
    id: "apt-2",
    code: "APT-20261120-002",
    customerId: "cst-2",
    customerName: "Clarissa Putri",
    customerPhone: "0818-4433-2211",
    staffId: "stf-2",
    staffName: "Siti Rahmawati",
    serviceIds: ["srv-5"],
    serviceNames: ["L'Oreal Professionnel Hair Spa & Blow Dry"],
    totalAmount: 150000,
    date: "2026-11-20",
    startTime: "13:00",
    endTime: "14:15",
    status: "confirmed",
    type: "online",
    notes: "Minta blow bervolume keluar."
  },
  {
    id: "apt-3",
    code: "APT-20261120-003",
    customerId: "cst-5",
    customerName: "Kevin Sanjaya",
    customerPhone: "0813-5566-7788",
    staffId: "stf-3",
    staffName: "Rian Pratama",
    serviceIds: ["srv-1", "srv-10"],
    serviceNames: ["Gentlemen Signature Cut & Wash", "Reflexology & Scalp Massage"],
    totalAmount: 105000,
    date: "2026-11-20",
    startTime: "14:30",
    endTime: "15:45",
    status: "pending",
    type: "walk_in",
    notes: "Walk-in booking siang hari."
  },
  {
    id: "apt-4",
    code: "APT-20261120-004",
    customerId: "cst-3",
    customerName: "Hendro Wijaya",
    customerPhone: "0856-7788-9900",
    staffId: "stf-1",
    staffName: "Budi Santoso",
    serviceIds: ["srv-2"],
    serviceNames: ["Fade & Beard Grooming + Hot Towel"],
    totalAmount: 85000,
    date: "2026-11-20",
    startTime: "16:00",
    endTime: "17:00",
    status: "confirmed",
    type: "online",
    notes: "Persiapan meeting besok pagi."
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "trx-101",
    invoiceNo: "INV-20261120-001",
    date: "2026-11-20T11:15:00",
    customerId: "cst-3",
    customerName: "Hendro Wijaya",
    staffId: "stf-1",
    staffName: "Budi Santoso",
    items: [
      { id: "srv-1", name: "Gentlemen Signature Cut & Wash", type: "service", price: 65000, qty: 1, subtotal: 65000 },
      { id: "prd-1", name: "Suavecito Matte Pomade 113g", type: "product", price: 135000, qty: 1, subtotal: 135000 }
    ],
    subtotal: 200000,
    discount: 10000,
    discountReason: "Diskon Member Silver 5%",
    total: 190000,
    paymentMethod: "qris", // cash, qris
    paymentStatus: "paid",
    cashGiven: 190000,
    change: 0,
    notes: "Pembayaran QRIS sukses via GoPay"
  },
  {
    id: "trx-102",
    invoiceNo: "INV-20261119-002",
    date: "2026-11-19T15:30:00",
    customerId: "cst-4",
    customerName: "Nadya Salsabila",
    staffId: "stf-2",
    staffName: "Siti Rahmawati",
    items: [
      { id: "srv-4", name: "Creambath Tradisional Aromaterapi", type: "service", price: 95000, qty: 1, subtotal: 95000 },
      { id: "srv-7", name: "Wash, Blow Styling & Hair Serum", type: "service", price: 55000, qty: 1, subtotal: 55000 }
    ],
    subtotal: 150000,
    discount: 0,
    discountReason: "",
    total: 150000,
    paymentMethod: "cash",
    paymentStatus: "paid",
    cashGiven: 200000,
    change: 50000,
    notes: "Lunas tunai"
  },
  {
    id: "trx-103",
    invoiceNo: "INV-20261119-003",
    date: "2026-11-19T18:20:00",
    customerId: "cst-1",
    customerName: "Dimas Anggara",
    staffId: "stf-3",
    staffName: "Rian Pratama",
    items: [
      { id: "srv-2", name: "Fade & Beard Grooming + Hot Towel", type: "service", price: 85000, qty: 1, subtotal: 85000 }
    ],
    subtotal: 85000,
    discount: 8500,
    discountReason: "Diskon Member Gold 10%",
    total: 76500,
    paymentMethod: "qris",
    paymentStatus: "paid",
    cashGiven: 76500,
    change: 0,
    notes: "QRIS BCA"
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: "sup-1",
    code: "SUP-001",
    name: "PT Makarizo Beauty Indonesia",
    contactPerson: "Ibu Linda Wijaya",
    phone: "021-8976-5544",
    email: "orders@makarizo.co.id",
    address: "Kawasan Industri Pulo Gadung, Jakarta Timur",
    productsSupplied: ["Creambath Cream", "Bleaching Powder", "Hair Tonic"],
    category: "Bahan Perawatan",
    paymentTerms: "NET 30",
    leadTimeDays: 5,
    rating: 4.7,
    status: "active",
    since: "2023-04-12"
  },
  {
    id: "sup-2",
    code: "SUP-002",
    name: "CV Barbershop Supply Jaya",
    contactPerson: "Pak Rudi Hartono",
    phone: "0811-9876-1234",
    email: "sales@barbersupply.id",
    address: "Jl. Mangga Dua Raya No. 45, Jakarta Barat",
    productsSupplied: ["Suavecito Pomade", "Silet Feather", "Kertas Leher", "Beard Oil"],
    category: "Peralatan & Retail Barber",
    paymentTerms: "NET 14",
    leadTimeDays: 3,
    rating: 4.9,
    status: "active",
    since: "2022-09-01"
  },
  {
    id: "sup-3",
    code: "SUP-003",
    name: "L'Oreal Professionnel Distributor Resmi",
    contactPerson: "Bpk. Edwin Pratama",
    phone: "021-5299-8800",
    email: "b2b@loreal-dist.co.id",
    address: "Gedung Cyber 2 Lantai 18, HR Rasuna Said, Jakarta",
    productsSupplied: ["L'Oreal Hair Spa", "Moroccanoil Treatment", "Matrix Opti.Straight"],
    category: "Bahan Premium",
    paymentTerms: "NET 45",
    leadTimeDays: 7,
    rating: 4.6,
    status: "active",
    since: "2023-01-18"
  },
  {
    id: "sup-4",
    code: "SUP-004",
    name: "PT Duta Abadi Prima",
    contactPerson: "Ibu Ratna Sari",
    phone: "021-6388-7711",
    email: "cs@dutaabadi.co.id",
    address: "Ruko Mega Grosir Cempaka Mas Blok I No. 8, Jakarta Pusat",
    productsSupplied: ["Kertas Leher", "Silet Feather", "Alat Cukur", "Disinfektan"],
    category: "Konsumsi & Perlengkapan",
    paymentTerms: "COD",
    leadTimeDays: 2,
    rating: 4.4,
    status: "active",
    since: "2024-06-05"
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: "po-1",
    poNumber: "PO-202611-001",
    supplierId: "sup-2",
    supplierName: "CV Barbershop Supply Jaya",
    date: "2026-11-15",
    status: "received", // draft, ordered, received, cancelled
    items: [
      { productId: "prd-1", productName: "Suavecito Matte Pomade 113g", qty: 10, unitPrice: 85000, total: 850000 },
      { productId: "prd-9", productName: "Kertas Leher Barbershop", qty: 10, unitPrice: 12000, total: 120000 }
    ],
    totalAmount: 970000,
    receivedDate: "2026-11-17",
    expectedDate: "2026-11-17",
    warehouseId: "wh-main",
    notes: "Stok restock awal bulan sudah diterima lengkap di gudang salon."
  },
  {
    id: "po-2",
    poNumber: "PO-202611-002",
    supplierId: "sup-3",
    supplierName: "L'Oreal Professionnel Distributor",
    date: "2026-11-18",
    status: "ordered",
    items: [
      { productId: "prd-7", productName: "Moroccanoil Treatment 100ml", qty: 6, unitPrice: 280000, total: 1680000 },
      { productId: "prd-3", productName: "L'Oreal Hair Spa 500ml", qty: 5, unitPrice: 125000, total: 625000 }
    ],
    totalAmount: 2305000,
    receivedDate: null,
    expectedDate: "2026-11-25",
    warehouseId: "wh-main",
    notes: "Pesanan mendesak untuk restock Moroccanoil yang menipis."
  }
];

export const INITIAL_FINANCIAL_RECORDS = [
  {
    id: "fin-1",
    type: "income", // income, expense
    category: "POS Sales",
    description: "Pendapatan POS Kasir #INV-20261120-001",
    amount: 190000,
    date: "2026-11-20",
    paymentMethod: "QRIS",
    referenceId: "trx-101"
  },
  {
    id: "fin-2",
    type: "income",
    category: "POS Sales",
    description: "Pendapatan POS Kasir #INV-20261119-002",
    amount: 150000,
    date: "2026-11-19",
    paymentMethod: "Tunai",
    referenceId: "trx-102"
  },
  {
    id: "fin-3",
    type: "income",
    category: "POS Sales",
    description: "Pendapatan POS Kasir #INV-20261119-003",
    amount: 76500,
    date: "2026-11-19",
    paymentMethod: "QRIS",
    referenceId: "trx-103"
  },
  {
    id: "fin-4",
    type: "expense",
    category: "Restock Bahan & Produk",
    description: "Pelunasan PO-202611-001 - CV Barbershop Supply Jaya",
    amount: 970000,
    date: "2026-11-17",
    paymentMethod: "Transfer Bank",
    referenceId: "po-1"
  },
  {
    id: "fin-5",
    type: "expense",
    category: "Utilitas & Operasional",
    description: "Pembayaran Listrik PLN Salon Bulan November",
    amount: 1250000,
    date: "2026-11-10",
    paymentMethod: "Transfer Bank",
    referenceId: null
  },
  {
    id: "fin-6",
    type: "expense",
    category: "Utilitas & Operasional",
    description: "Internet Biznet Fiber & Telepon",
    amount: 450000,
    date: "2026-11-08",
    paymentMethod: "Auto Debit",
    referenceId: null
  },
  {
    id: "fin-7",
    type: "income",
    category: "POS Sales",
    description: "Akumulasi Penjualan POS Minggu ke-2 November",
    amount: 4850000,
    date: "2026-11-14",
    paymentMethod: "Tunai & QRIS",
    referenceId: null
  },
  {
    id: "fin-8",
    type: "income",
    category: "POS Sales",
    description: "Akumulasi Penjualan POS Minggu ke-1 November",
    amount: 5200000,
    date: "2026-11-07",
    paymentMethod: "Tunai & QRIS",
    referenceId: null
  }
];

export const INITIAL_INVENTORY_MOVEMENTS = [
  { id: "mov-1", date: "2026-11-17", productId: "prd-1", productName: "Suavecito Matte Pomade", type: "in", qty: 10, reference: "PO-202611-001", notes: "Barang masuk dari supplier" },
  { id: "mov-2", date: "2026-11-17", productId: "prd-9", productName: "Kertas Leher Barbershop", type: "in", qty: 10, reference: "PO-202611-001", notes: "Barang masuk dari supplier" },
  { id: "mov-3", date: "2026-11-20", productId: "prd-1", productName: "Suavecito Matte Pomade", type: "out", qty: 1, reference: "INV-20261120-001", notes: "Penjualan Ritel Kasir POS" },
  { id: "mov-4", date: "2026-11-19", productId: "prd-2", productName: "Makarizo Creambath", type: "out", qty: 1, reference: "SRV-TRT-01", notes: "Pemakaian treatment salon" }
];

// ============================================================
// SCM (Supply Chain Management) — Gudang, Pemasok, Pengadaan
// ============================================================

export const INITIAL_WAREHOUSES = [
  {
    id: "wh-main",
    code: "GD-UTM",
    name: "Gudang Utama",
    type: "main",
    address: "Jl. Maera Sari No.11, Banjarsari, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275",
    manager: "Budi Santoso",
    capacity: 120,
    status: "active"
  },
  {
    id: "wh-barber",
    code: "GD-BRB",
    name: "Gudang Barbershop",
    type: "barber",
    address: "Area Barbershop — Lantai 1",
    manager: "Rian Pratama",
    capacity: 60,
    status: "active"
  },
  {
    id: "wh-retail",
    code: "GD-RTL",
    name: "Gudang Retail & Display",
    type: "retail",
    address: "Area Kasir & Display — Lantai 1",
    manager: "Siti Rahmawati",
    capacity: 60,
    status: "active"
  }
];

// Alokasi stok per gudang (total per produk = currentStock pada INITIAL_PRODUCTS)
export const INITIAL_WAREHOUSE_STOCK = [
  { id: "wst-1", warehouseId: "wh-main", productId: "prd-1", qty: 10 },
  { id: "wst-2", warehouseId: "wh-retail", productId: "prd-1", qty: 6 },
  { id: "wst-3", warehouseId: "wh-main", productId: "prd-2", qty: 5 },
  { id: "wst-4", warehouseId: "wh-barber", productId: "prd-2", qty: 3 },
  { id: "wst-5", warehouseId: "wh-main", productId: "prd-3", qty: 2 },
  { id: "wst-6", warehouseId: "wh-barber", productId: "prd-3", qty: 2 },
  { id: "wst-7", warehouseId: "wh-main", productId: "prd-4", qty: 2 },
  { id: "wst-8", warehouseId: "wh-barber", productId: "prd-4", qty: 1 },
  { id: "wst-9", warehouseId: "wh-main", productId: "prd-5", qty: 7 },
  { id: "wst-10", warehouseId: "wh-retail", productId: "prd-5", qty: 5 },
  { id: "wst-11", warehouseId: "wh-main", productId: "prd-6", qty: 4 },
  { id: "wst-12", warehouseId: "wh-retail", productId: "prd-6", qty: 3 },
  { id: "wst-13", warehouseId: "wh-retail", productId: "prd-7", qty: 2 },
  { id: "wst-14", warehouseId: "wh-barber", productId: "prd-8", qty: 1 },
  { id: "wst-15", warehouseId: "wh-main", productId: "prd-9", qty: 9 },
  { id: "wst-16", warehouseId: "wh-barber", productId: "prd-9", qty: 6 },
  { id: "wst-17", warehouseId: "wh-main", productId: "prd-10", qty: 2 },
  { id: "wst-18", warehouseId: "wh-barber", productId: "prd-10", qty: 2 },
  { id: "wst-19", warehouseId: "wh-retail", productId: "prd-11", qty: 12 },
  { id: "wst-20", warehouseId: "wh-main", productId: "prd-11", qty: 6 },
  { id: "wst-21", warehouseId: "wh-retail", productId: "prd-12", qty: 10 },
  { id: "wst-22", warehouseId: "wh-main", productId: "prd-12", qty: 5 },
  { id: "wst-23", warehouseId: "wh-retail", productId: "prd-13", qty: 7 },
  { id: "wst-24", warehouseId: "wh-main", productId: "prd-13", qty: 3 },
  { id: "wst-25", warehouseId: "wh-retail", productId: "prd-14", qty: 18 },
  { id: "wst-26", warehouseId: "wh-main", productId: "prd-14", qty: 6 },
  { id: "wst-27", warehouseId: "wh-retail", productId: "prd-15", qty: 6 },
  { id: "wst-28", warehouseId: "wh-main", productId: "prd-15", qty: 3 },
  { id: "wst-29", warehouseId: "wh-retail", productId: "prd-16", qty: 5 },
  { id: "wst-30", warehouseId: "wh-main", productId: "prd-16", qty: 3 }
];

export const INITIAL_REQUISITIONS = [
  {
    id: "pr-1",
    number: "PR-202611-001",
    date: "2026-11-21",
    department: "Barbershop",
    requestedBy: "Budi Santoso",
    warehouseId: "wh-barber",
    priority: "high",
    status: "pending", // pending, approved, converted, rejected
    supplierId: "sup-4",
    supplierName: "PT Duta Abadi Prima",
    items: [
      { productId: "prd-9", productName: "Kertas Leher Barbershop (Neck Paper Roll)", qty: 20, unit: "roll", estimatedPrice: 12000 },
      { productId: "prd-10", productName: "Pisau Silet Feather Double Edge (Isi 100)", qty: 5, unit: "box", estimatedPrice: 75000 }
    ],
    totalEstimate: 615000,
    notes: "Kebutuhan operasional barbershop 2 minggu ke depan."
  },
  {
    id: "pr-2",
    number: "PR-202611-002",
    date: "2026-11-22",
    department: "Retail",
    requestedBy: "Siti Rahmawati",
    warehouseId: "wh-retail",
    priority: "high",
    status: "approved",
    supplierId: "sup-3",
    supplierName: "L'Oreal Professionnel Distributor Resmi",
    items: [
      { productId: "prd-7", productName: "Moroccanoil Treatment 100ml", qty: 10, unit: "bottle", estimatedPrice: 280000 }
    ],
    totalEstimate: 2800000,
    notes: "Stok display tersisa 2 botol, permintaan pelanggan tinggi."
  },
  {
    id: "pr-3",
    number: "PR-202611-003",
    date: "2026-11-18",
    department: "Purchasing",
    requestedBy: "Budi Santoso",
    warehouseId: "wh-main",
    priority: "medium",
    status: "converted",
    poId: "po-2",
    supplierId: "sup-3",
    supplierName: "L'Oreal Professionnel Distributor Resmi",
    items: [
      { productId: "prd-7", productName: "Moroccanoil Treatment 100ml", qty: 6, unit: "bottle", estimatedPrice: 280000 },
      { productId: "prd-3", productName: "L'Oreal Professionnel Hair Spa 500ml", qty: 5, unit: "jar", estimatedPrice: 125000 }
    ],
    totalEstimate: 2305000,
    notes: "Sudah dikonversi menjadi PO-202611-002."
  },
  {
    id: "pr-4",
    number: "PR-202611-004",
    date: "2026-11-20",
    department: "Barbershop",
    requestedBy: "Rian Pratama",
    warehouseId: "wh-barber",
    priority: "low",
    status: "rejected",
    supplierId: "sup-1",
    supplierName: "PT Makarizo Beauty Indonesia",
    items: [
      { productId: "prd-8", productName: "Bleaching Powder Blue 500g", qty: 10, unit: "can", estimatedPrice: 110000 }
    ],
    totalEstimate: 1100000,
    notes: "Stok bleaching masih cukup, pengadaan ditunda ke bulan depan."
  }
];

export const INITIAL_GOODS_RECEIPTS = [
  {
    id: "gr-1",
    number: "GR-202611-001",
    poId: "po-1",
    poNumber: "PO-202611-001",
    supplierId: "sup-2",
    supplierName: "CV Barbershop Supply Jaya",
    warehouseId: "wh-main",
    receivedDate: "2026-11-17",
    receivedBy: "Budi Santoso",
    status: "completed",
    items: [
      { productId: "prd-1", productName: "Suavecito Matte Pomade 113g", qtyOrdered: 10, qtyReceived: 10, condition: "good" },
      { productId: "prd-9", productName: "Kertas Leher Barbershop", qtyOrdered: 10, qtyReceived: 10, condition: "good" }
    ],
    notes: "Diterima lengkap dan langsung masuk Gudang Utama."
  }
];

export const INITIAL_STOCK_TRANSFERS = [
  {
    id: "trf-1",
    number: "TRF-202611-001",
    date: "2026-11-18",
    fromWarehouseId: "wh-main",
    toWarehouseId: "wh-retail",
    productId: "prd-1",
    productName: "Suavecito Matte Pomade 113g",
    qty: 4,
    status: "completed",
    requestedBy: "Siti Rahmawati",
    notes: "Penambahan display retail depan kasir."
  },
  {
    id: "trf-2",
    number: "TRF-202611-002",
    date: "2026-11-19",
    fromWarehouseId: "wh-main",
    toWarehouseId: "wh-barber",
    productId: "prd-9",
    productName: "Kertas Leher Barbershop (Neck Paper Roll)",
    qty: 5,
    status: "completed",
    requestedBy: "Budi Santoso",
    notes: "Stok harian barbershop."
  },
  {
    id: "trf-3",
    number: "TRF-202611-003",
    date: "2026-11-20",
    fromWarehouseId: "wh-main",
    toWarehouseId: "wh-barber",
    productId: "prd-2",
    productName: "Makarizo Hair Energy Creambath 500g",
    qty: 2,
    status: "completed",
    requestedBy: "Rian Pratama",
    notes: "Persiapan treatment creambath akhir pekan."
  }
];

export const INITIAL_STOCK_ADJUSTMENTS = [
  {
    id: "adj-1",
    number: "ADJ-202611-001",
    date: "2026-11-19",
    warehouseId: "wh-barber",
    productId: "prd-8",
    productName: "Bleaching Powder Blue 500g",
    systemQty: 2,
    physicalQty: 1,
    difference: -1,
    reason: "Stock opname: kemasan rusak/pecah saat penyimpanan",
    status: "approved",
    approvedBy: "Owner"
  },
  {
    id: "adj-2",
    number: "ADJ-202611-002",
    date: "2026-11-20",
    warehouseId: "wh-retail",
    productId: "prd-6",
    productName: "Beard Oil Sandalwood & Cedar 30ml",
    systemQty: 4,
    physicalQty: 3,
    difference: -1,
    reason: "Stock opname: tester display terpakai",
    status: "approved",
    approvedBy: "Owner"
  }
];

export const INITIAL_PURCHASE_RETURNS = [
  {
    id: "rtn-1",
    number: "RTN-202611-001",
    date: "2026-11-20",
    poNumber: "PO-202611-001",
    supplierId: "sup-2",
    supplierName: "CV Barbershop Supply Jaya",
    warehouseId: "wh-main",
    productId: "prd-9",
    productName: "Kertas Leher Barbershop (Neck Paper Roll)",
    qty: 2,
    unit: "roll",
    unitPrice: 12000,
    totalRefund: 24000,
    reason: "Kemasan sobek dan lembap saat pengiriman",
    status: "approved",
    resolution: "Tukar Barang Baru",
    submittedBy: "Budi Santoso",
    notes: "Sudah dikonfirmasi dengan PIC supplier via WhatsApp."
  }
];

