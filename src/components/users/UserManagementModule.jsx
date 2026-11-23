import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Percent,
  Scissors,
  Sparkles,
  Edit2
} from 'lucide-react';

export const UserManagementModule = () => {
  const {
    staff,
    setStaff,
    userRole,
    setUserRole,
    activeStaffId,
    setActiveStaffId,
    showToast
  } = useApp();

  const [selectedStaff, setSelectedStaff] = useState(staff[0] || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    role: '',
    specialty: '',
    phone: '',
    commissionRate: 0.15,
    status: 'available'
  });

  const openEditModal = (s) => {
    setSelectedStaff(s);
    setEditFormData({
      name: s.name,
      role: s.role,
      specialty: s.specialty,
      phone: s.phone,
      commissionRate: s.commissionRate,
      status: s.status
    });
    setIsEditModalOpen(true);
  };

  const handleStatusToggle = (staffId, newStatus) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: newStatus } : s));
    showToast('info', 'Status Staf Berubah', `Status diubah menjadi: ${newStatus.toUpperCase()}`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedStaff) return;

    setStaff(prev => prev.map(s => {
      if (s.id === selectedStaff.id) {
        return { ...s, ...editFormData, commissionRate: Number(editFormData.commissionRate) };
      }
      return s;
    }));

    showToast('success', 'Data Staf Disimpan', `Informasi ${editFormData.name} berhasil diperbarui.`);
    setIsEditModalOpen(false);
  };

  // RBAC Matrix Definition
  const permissions = [
    { module: 'Dashboard Utama & Ringkasan', owner: true, admin: true, staff: true },
    { module: 'Booking & Kalender Reservasi', owner: true, admin: true, staff: 'Hanya jadwal sendiri' },
    { module: 'Point of Sales (Kasir & Struk)', owner: true, admin: true, staff: false },
    { module: 'Manajemen Inventaris & FIFO', owner: true, admin: true, staff: false },
    { module: 'CRM & Riwayat Pelanggan', owner: true, admin: true, staff: 'Lihat data' },
    { module: 'Laporan Keuangan & Laba Rugi (P&L)', owner: true, admin: false, staff: false },
    { module: 'Supplier & Purchase Order (PO)', owner: true, admin: true, staff: false },
    { module: 'Manajemen Tim & Pengaturan Hak Akses', owner: true, admin: 'Terbatas', staff: false }
  ];

  return (
    <div className="space-y-6">
      {/* 3 Active Staff Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900">3 Staf Utama PU Salon & Barbershop</h3>
            <p className="text-xs text-charcoal-500">Kelola kehadiran, spesialisasi layanan, dan komisi pengerjaan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staff.map(s => {
            const isAvailable = s.status === 'available';
            const isBusy = s.status === 'busy';

            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4 hover:border-champagne-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-champagne-400 shadow-sm"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-base text-charcoal-900">{s.name}</h4>
                        <div className="text-xs font-semibold text-champagne-800">{s.role}</div>
                        <div className="text-[10px] text-charcoal-400 mt-0.5">{s.phone}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => openEditModal(s)}
                      className="p-1.5 text-charcoal-400 hover:text-charcoal-800 hover:bg-ivory-100 rounded-lg"
                      title="Edit Data Staf"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 p-2.5 bg-ivory-50 rounded-xl border border-ivory-200 text-xs space-y-1">
                    <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Spesialisasi:</div>
                    <div className="text-charcoal-700 font-medium leading-relaxed">{s.specialty}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-ivory-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-ivory-100/60 rounded-xl">
                      <div className="text-[10px] text-charcoal-400 font-semibold">Komisi Layanan:</div>
                      <div className="font-bold text-charcoal-900 text-sm mt-0.5">{Math.round(s.commissionRate * 100)}%</div>
                    </div>
                    <div className="p-2 bg-ivory-100/60 rounded-xl">
                      <div className="text-[10px] text-charcoal-400 font-semibold">Tamu Hari Ini:</div>
                      <div className="font-bold text-champagne-800 text-sm mt-0.5">{s.todayServed} Selesai</div>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleStatusToggle(s.id, 'available')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        isAvailable
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tersedia</span>
                    </button>
                    <button
                      onClick={() => handleStatusToggle(s.id, 'busy')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        isBusy
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
                      }`}
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Melayani</span>
                    </button>
                    <button
                      onClick={() => handleStatusToggle(s.id, 'off')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        s.status === 'off'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Libur</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-6 space-y-4">
        <div>
          <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-champagne-600" />
            <span>Matriks Hak Akses Pengguna (Role-Based Access Control)</span>
          </h3>
          <p className="text-xs text-charcoal-400">
            Pembagian wewenang antara Pemilik (Owner), Administrator Kasir, dan Staf Salon.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory-100/80 border-b border-ivory-300 text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                <th className="py-3 px-4">Modul Sistem ERP</th>
                <th className="py-3 px-4 text-center">Owner (Pemilik)</th>
                <th className="py-3 px-4 text-center">Admin Salon</th>
                <th className="py-3 px-4 text-center">Staf Stylist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-charcoal-800">{p.module}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Akses Penuh
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.admin === true ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Diizinkan
                      </span>
                    ) : p.admin === false ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3 text-rose-600" /> Terkunci
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {p.admin}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.staff === true ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Diizinkan
                      </span>
                    ) : p.staff === false ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3 text-rose-600" /> Terkunci
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {p.staff}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Staff Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-charcoal-900">Edit Profil Staf Salon</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Nama Staf</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Jabatan / Role</label>
                <input
                  type="text"
                  required
                  value={editFormData.role}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Spesialisasi & Keahlian</label>
                <input
                  type="text"
                  value={editFormData.specialty}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Rate Komisi (0.15 = 15%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={editFormData.commissionRate}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, commissionRate: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-charcoal-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
