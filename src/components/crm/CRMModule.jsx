import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Cake,
  Calendar,
  Phone,
  MapPin,
  Award,
  Clock,
  History,
  ShoppingBag,
  Sparkles,
  Edit2
} from 'lucide-react';

export const CRMModule = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    transactions,
    appointments,
    getCustomerBirthdayStatus,
    setActiveTab,
    setInitialPOSCart
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0] || null);

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    birthday: '',
    tier: 'Standard',
    notes: ''
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery) ||
                          (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      birthday: '',
      tier: 'Standard',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingId(c.id);
    setFormData({
      name: c.name,
      phone: c.phone,
      address: c.address || '',
      birthday: c.birthday || '',
      tier: c.tier || 'Standard',
      notes: c.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingId) {
      updateCustomer(editingId, formData);
      if (selectedCustomer && selectedCustomer.id === editingId) {
        setSelectedCustomer(prev => ({ ...prev, ...formData }));
      }
    } else {
      const newC = addCustomer(formData);
      setSelectedCustomer(newC);
    }
    setIsModalOpen(false);
  };

  // Get treatment history of selected customer
  const customerTransactions = transactions.filter(t => t.customerId === selectedCustomer?.id);
  const customerAppointments = appointments.filter(a => a.customerId === selectedCustomer?.id);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Total Pelanggan Terdaftar</div>
            <div className="text-2xl font-serif font-bold text-charcoal-900 mt-1">{customers.length} Orang</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Tersimpan dalam database CRM</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Users className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Member VIP (Gold & Silver)</div>
            <div className="text-2xl font-serif font-bold text-champagne-800 mt-1">
              {customers.filter(c => c.tier === 'Gold' || c.tier === 'Silver').length} Member
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">Diskon loyalitas otomatis</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
            <Award className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Ulang Tahun Bulan Ini</div>
            <div className="text-2xl font-serif font-bold text-amber-600 mt-1">
              {customers.filter(c => getCustomerBirthdayStatus(c.birthday).isThisMonth).length} Orang
            </div>
            <div className="text-[11px] text-amber-700 font-bold">Promo Spesial Diskon 15%</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Cake className="w-6 h-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Main Grid: Customer List (7 cols) + Customer Detail Profile (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Directory List */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-ivory-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                placeholder="Cari nama, no WA, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:border-champagne-500"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl text-xs font-semibold text-charcoal-700"
            >
              <option value="all">Semua Tier</option>
              <option value="Gold">Gold Tier</option>
              <option value="Silver">Silver Tier</option>
              <option value="Standard">Standard Tier</option>
            </select>

            <button
              onClick={openAddModal}
              className="px-3.5 py-2 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Pelanggan</span>
            </button>
          </div>

          {/* Customer Cards List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-xs text-charcoal-400">
                Tidak ada data pelanggan yang cocok.
              </div>
            ) : (
              filteredCustomers.map(c => {
                const bdayStatus = getCustomerBirthdayStatus(c.birthday);
                const isSelected = selectedCustomer?.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-champagne-50 border-champagne-400 shadow-sm'
                        : 'bg-ivory-50/70 border-ivory-200 hover:bg-ivory-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-charcoal-900 text-ivory-100 font-serif font-bold text-sm flex items-center justify-center shadow-sm">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-charcoal-900">{c.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            c.tier === 'Gold' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            c.tier === 'Silver' ? 'bg-slate-200 text-slate-800' : 'bg-ivory-200 text-charcoal-600'
                          }`}>
                            {c.tier}
                          </span>
                          {bdayStatus.isThisMonth && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Cake className="w-2.5 h-2.5" /> Ultah
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-charcoal-500 flex items-center gap-3 mt-0.5">
                          <span>{c.phone}</span>
                          <span>•</span>
                          <span>{c.visitCount} Kunjungan</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-champagne-800">
                        Rp {c.totalSpent.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-charcoal-400">Total Belanja</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Customer Profile & History (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft space-y-5">
          {selectedCustomer ? (
            <>
              {/* Profile Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-ivory-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-champagne-600 to-gold-400 text-charcoal-900 font-serif font-bold text-lg flex items-center justify-center shadow-gold">
                    {selectedCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-charcoal-900">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 bg-champagne-100 text-champagne-800 text-[10px] font-bold rounded-full">
                        Member {selectedCustomer.tier}
                      </span>
                      <span className="text-xs text-charcoal-500 font-medium">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openEditModal(selectedCustomer)}
                  className="p-2 text-charcoal-400 hover:text-charcoal-800 hover:bg-ivory-100 rounded-xl transition-colors"
                  title="Edit Data Pelanggan"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Detail Info & Notes */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-charcoal-600">
                  <MapPin className="w-3.5 h-3.5 text-champagne-600 shrink-0" />
                  <span>{selectedCustomer.address || 'Alamat belum diisi'}</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal-600">
                  <Cake className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Tanggal Lahir: {selectedCustomer.birthday ? new Date(selectedCustomer.birthday).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>
                <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 text-charcoal-700 text-[11px]">
                  <span className="font-bold text-charcoal-900 block mb-0.5">Catatan Preferensi / Treatment:</span>
                  {selectedCustomer.notes || 'Belum ada catatan khusus.'}
                </div>
              </div>

              {/* Treatment & Transaction History */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-xs text-charcoal-900 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-champagne-600" />
                  <span>Riwayat Treatment & Belanja ({customerTransactions.length})</span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {customerTransactions.length === 0 ? (
                    <div className="text-center py-6 text-[11px] text-charcoal-400">
                      Belum ada riwayat transaksi kasir.
                    </div>
                  ) : (
                    customerTransactions.map(trx => (
                      <div key={trx.id} className="p-2.5 rounded-xl bg-ivory-100/70 border border-ivory-200 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-charcoal-800">
                            {trx.items.map(i => i.name).join(', ')}
                          </div>
                          <div className="text-[10px] text-charcoal-500 font-mono">
                            {trx.invoiceNo} • {new Date(trx.date).toLocaleDateString('id-ID')} • Staf: {trx.staffName}
                          </div>
                        </div>
                        <div className="font-bold text-champagne-800 text-right">
                          Rp {trx.total.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Fast Booking or POS conversion */}
              <button
                onClick={() => {
                  setInitialPOSCart({
                    customerId: selectedCustomer.id,
                    customerName: selectedCustomer.name,
                    items: []
                  });
                  setActiveTab('pos');
                }}
                className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-champagne-400" />
                <span>Buat Transaksi Kasir untuk {selectedCustomer.name}</span>
              </button>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-charcoal-400 text-xs">
              Pilih pelanggan di daftar sebelah kiri.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                {editingId ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Dimas Anggara"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Nomor WhatsApp / HP *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">
                  Tanggal Lahir <span className="font-normal text-xs text-charcoal-400">(untuk promo diskon ulang tahun)</span>
                </label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Membership Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-medium"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Silver">Silver (5% Disc)</option>
                    <option value="Gold">Gold (10% Disc)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">
                  Alamat <span className="font-normal text-xs text-charcoal-400">(untuk treatment khusus & promosi)</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Contoh: Jl. Maera Sari No.11, Banjarsari, Semarang"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
                <p className="text-[10px] text-charcoal-400 mt-1">Data nama, tanggal lahir, dan alamat disimpan untuk treatment khusus serta promosi/diskon ulang tahun.</p>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Catatan Treatment / Gaya Rambut</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Contoh: Suka fade tipis, kulit kepala sensitif..."
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-charcoal-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
