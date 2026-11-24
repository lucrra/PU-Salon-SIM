// Price List resmi PU Salon & Barbershop
// Sumber: poster price list resmi (harga dalam Rupiah)

export const PRICE_LIST_META = {
  title: 'Price List',
  brand: 'PU Salon & Barbershop',
  tagline: 'Premium Beauty & Hair Care Studio',
  updatedAt: '2026-11',
  instagram: 'pusalonandbarbershop',
  tiktok: 'pusalonandbarbershop',
  note: 'Harga dapat berubah sewaktu-waktu. Harga panjang rambut dan kondisi rambut tertentu dapat menyesuaikan konsultasi stylist.'
};

export const PRICE_LIST_CATEGORIES = [
  {
    id: 'hair-cut',
    code: '01',
    name: 'Hair Cut',
    groups: [
      {
        label: 'Anak (< SMP)',
        items: [
          { variant: 'Male', price: 25000 },
          { variant: 'Female', price: 35000 }
        ]
      },
      {
        label: 'Dewasa',
        items: [
          { variant: 'Male', detail: 'Cuci + Vit', price: 35000 },
          { variant: 'Female', detail: 'Cuci blow + Vit', price: 55000 }
        ]
      }
    ]
  },
  {
    id: 'creambath',
    code: '02',
    name: 'Creambath & Vit',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Male', detail: 'Massage + Cuci', price: 75000 },
          { variant: 'Female', detail: 'Massage + Cuci blow', price: 100000 }
        ]
      }
    ]
  },
  {
    id: 'hairmask-keratin',
    code: '03',
    name: 'Hairmask Keratin',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Male', detail: 'P – T', price: 75000 },
          { variant: 'Female', detail: 'P – T', price: 150000 },
          { variant: 'Female', detail: 'T – P', price: 200000 }
        ]
      }
    ]
  },
  {
    id: 'semir-hitam',
    code: '04',
    name: 'Semir Hitam',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Male', price: 100000 },
          { variant: 'Female', detail: 'Pendek', price: 150000 },
          { variant: 'Female', detail: 'Tanggung', price: 300000 },
          { variant: 'Female', detail: 'Panjang', price: 350000 }
        ]
      }
    ]
  },
  {
    id: 'semir-warna',
    code: '05',
    name: 'Semir Warna',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Male', price: 200000 },
          { variant: 'Female', detail: 'Pendek', price: 250000 },
          { variant: 'Female', detail: 'Tanggung', price: 350000 },
          { variant: 'Female', detail: 'Panjang', price: 600000 }
        ]
      }
    ]
  },
  {
    id: 'semir-toning',
    code: '06',
    name: 'Semir Toning',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Male', detail: 'P – T', price: 200000 },
          { variant: 'Female', detail: 'Pendek', price: 400000 },
          { variant: 'Female', detail: 'Tanggung', price: 600000 },
          { variant: 'Female', detail: 'Panjang', priceLabel: '> 600.000' }
        ]
      }
    ]
  },
  {
    id: 'perming',
    code: '07',
    name: 'Perming',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Male', price: 200000 },
          { variant: 'Female', detail: 'Pendek', price: 400000 },
          { variant: 'Female', detail: 'Tanggung', price: 600000 },
          { variant: 'Female', detail: 'Panjang', price: 800000 }
        ]
      }
    ]
  },
  {
    id: 'smoothing',
    code: '08',
    name: 'Smoothing',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Female', detail: 'Pendek', price: 250000 },
          { variant: 'Female', detail: 'Tanggung', price: 400000 },
          { variant: 'Female', detail: 'Panjang', price: 700000 }
        ]
      }
    ]
  },
  {
    id: 'cuci-blow-catok',
    code: '09',
    name: 'Cuci Blow & Catok',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Semua Pelanggan', price: 35000 }
        ]
      }
    ]
  },
  {
    id: 'rias-wajah',
    code: '10',
    name: 'Rias Wajah',
    groups: [
      {
        label: '',
        items: [
          { variant: 'Semua Pelanggan', price: 250000 }
        ]
      }
    ]
  }
];
