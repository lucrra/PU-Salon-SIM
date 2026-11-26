import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Scissors,
  Edit2,
  Mail,
  Phone,
  Image as ImageIcon,
  Lock,
  Trash2,
  Camera
} from 'lucide-react';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase() || 'ST';

const StaffAvatar = ({ staff, className = '', textClassName = 'text-base' }) => {
  const [failed, setFailed] = useState(false);

  if (!staff?.avatar || failed) {
    return (
      <div
        className={`${className} bg-gradient-to-tr from-charcoal-800 to-charcoal-600 text-ivory-50 flex items-center justify-center font-serif font-bold ${textClassName}`}
        title={staff?.name || 'Staf'}
      >
        {initialsOf(staff?.name)}
      </div>
    );
  }

  return (
    <img
      src={staff.avatar}
      alt={staff.name}
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  );
};

export const UserManagementModule = () => {
  const {
    staff,
    setStaff,
    updateStaff,
    ownerProfile,
    updateOwnerProfile,
    userRole,
    showToast
  } = useApp();

  const isOwner = userRole === 'owner';

  const [selectedStaff, setSelectedStaff] = useState(staff[0] || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    role: '',
    specialty: '',
    phone: '',
    email: '',
    avatar: '',
    commissionRate: 15,
    status: 'available'
  });

  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [ownerFormData, setOwnerFormData] = useState({
    name: '',
    label: '',
    phone: '',
    email: '',
    avatar: ''
  });

  const openOwnerModal = () => {
    if (!isOwner) {
      showToast('error', 'Akses Ditolak', 'Hanya Owner yang dapat mengubah profil ini.');
      return;
    }
    setOwnerFormData({
      name: ownerProfile?.name || '',
      label: ownerProfile?.label || 'Owner / Pemilik',
      phone: ownerProfile?.phone || '',
      email: ownerProfile?.email || '',
      avatar: ownerProfile?.avatar || ''
    });
    setIsOwnerModalOpen(true);
  };

  const handleSaveOwner = (e) => {
    e.preventDefault();
    if (!isOwner) return;

    const name = ownerFormData.name.trim();
    if (!name) {
      showToast('error', 'Nama Wajib Diisi', 'Nama profil Owner tidak boleh kosong.');
      return;
    }

    updateOwnerProfile({
      name,
      label: ownerFormData.label.trim() || 'Owner / Pemilik',
      phone: ownerFormData.phone.trim(),
      email: ownerFormData.email.trim(),
      avatar: ownerFormData.avatar.trim()
    });
    setIsOwnerModalOpen(false);
  };

  const openEditModal = (s) => {
    if (!isOwner) {
      showToast('error', 'Akses Ditolak', 'Hanya Owner yang dapat mengubah data staf.');
      return;
    }
    setSelectedStaff(s);
    setEditFormData({
      name: s.name || '',
      role: s.role || '',
      specialty: s.specialty || '',
      phone: s.phone || '',
      email: s.email || '',
      avatar: s.avatar || '',
      commissionRate: Math.round((s.commissionRate ?? 0) * 100),
      status: s.status || 'available'
    });
    setIsEditModalOpen(true);
  };

  const handleStatusToggle = (staffId, newStatus) => {
    if (!isOwner) {
      showToast('error', 'Akses Ditolak', 'Hanya Owner yang dapat mengubah status staf.');
      return;
    }
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: newStatus } : s));
    showToast('info', 'Status Staf Berubah', `Status diubah menjadi: ${newStatus.toUpperCase()}`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedStaff || !isOwner) return;

    const name = editFormData.name.trim();
    const role = editFormData.role.trim();
    if (!name || !role) {
      showToast('error', 'Data Belum Lengkap', 'Nama dan jabatan staf wajib diisi.');
      return;
    }

    updateStaff(selectedStaff.id, {
      name,
      role,
      specialty: editFormData.specialty.trim(),
      phone: editFormData.phone.trim(),
      email: editFormData.email.trim(),
      avatar: editFormData.avatar.trim(),
      commissionRate: Math.min(100, Math.max(0, Number(editFormData.commissionRate) || 0)) / 100,
      status: editFormData.status
    });

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
      {/* Profil Owner — akun sendiri */}
      {isOwner && (
        <div className="bg-gradient-to-r from-champagne-50 via-white to-blue-50 rounded-3xl border border-champagne-200/80 shadow-soft p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <StaffAvatar
            key={`owner-${ownerProfile?.avatar || 'initials'}`}
            staff={{ name: ownerProfile?.name, avatar: ownerProfile?.avatar }}
            className="w-16 h-16 rounded-2xl border-2 border-champagne-400 shadow-sm shrink-0"
            textClassName="text-xl"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-lg text-charcoal-900 leading-tight break-words">
                {ownerProfile?.name || 'Owner'}
              </h3>
              <span className="chip bg-champagne-100 text-champagne-800 border border-champagne-200">
                <ShieldCheck className="w-3 h-3" /> Akun Anda
              </span>
            </div>
            <div className="text-xs font-semibold text-champagne-800 mt-0.5">
              {ownerProfile?.label || 'Owner / Pemilik'}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-charcoal-500">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-charcoal-300" />
                {ownerProfile?.phone || 'Nomor belum diisi'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-charcoal-300" />
                {ownerProfile?.email || 'Email belum diisi'}
              </span>
            </div>
          </div>
          <button
            onClick={openOwnerModal}
            className="btn-brand shrink-0 self-start sm:self-center"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profil Saya</span>
          </button>
        </div>
      )}

      {/* Staff Profile Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900">Profil Staf PU Salon & Barbershop</h3>
            <p className="text-xs text-charcoal-500">
              Owner dapat mengubah nama, foto profil, kontak, spesialisasi, komisi, dan status kehadiran.
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border w-fit ${
            isOwner
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {isOwner ? 'Owner • Dapat Mengedit' : 'Mode Lihat • Khusus Owner'}
          </span>
        </div>

        {!isOwner && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Anda masuk sebagai <strong>{userRole}</strong>. Data staf hanya dapat diubah oleh akun Owner.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {staff.map(s => {
            const isAvailable = s.status === 'available';
            const isBusy = s.status === 'busy';

            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-5 space-y-4 hover:border-champagne-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <StaffAvatar
                      key={`${s.id}-${s.avatar}`}
                      staff={s}
                      className="w-14 h-14 rounded-2xl border-2 border-champagne-400 shadow-sm shrink-0"
                      textClassName="text-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-base text-charcoal-900 leading-tight break-words">{s.name}</h4>
                      <div className="text-xs font-semibold text-champagne-800 leading-snug mt-0.5">{s.role}</div>
                    </div>

                    {isOwner ? (
                      <button
                        onClick={() => openEditModal(s)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-champagne-800 bg-champagne-50 border border-champagne-200 hover:bg-champagne-100 shrink-0"
                        title="Edit profil staf"
                        aria-label={`Edit profil ${s.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span
                        className="w-8 h-8 flex items-center justify-center text-charcoal-300 shrink-0"
                        title="Hanya Owner yang dapat mengubah data staf"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5 text-[11px] text-charcoal-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 shrink-0 text-charcoal-300" />
                      <span className="truncate">{s.phone || 'Nomor belum diisi'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 shrink-0 text-charcoal-300" />
                      <span className="truncate">{s.email || 'Email belum diisi'}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-ivory-50 rounded-xl border border-ivory-200 text-xs space-y-1">
                    <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Spesialisasi:</div>
                    <div className="text-charcoal-700 font-medium leading-relaxed">{s.specialty || 'Belum diisi'}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-ivory-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-ivory-100/60 rounded-xl">
                      <div className="text-[10px] text-charcoal-400 font-semibold">Komisi Layanan:</div>
                      <div className="font-bold text-charcoal-900 text-sm mt-0.5">{Math.round((s.commissionRate || 0) * 100)}%</div>
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
                      disabled={!isOwner}
                      title={isOwner ? 'Tandai tersedia' : 'Hanya Owner yang dapat mengubah status'}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                      disabled={!isOwner}
                      title={isOwner ? 'Tandai sedang melayani' : 'Hanya Owner yang dapat mengubah status'}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                      disabled={!isOwner}
                      title={isOwner ? 'Tandai libur' : 'Hanya Owner yang dapat mengubah status'}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
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

      {/* Edit Staff Modal — Owner only */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900">Edit Profil Staf Salon</h3>
                <p className="text-[10px] text-charcoal-400">Perubahan langsung tampil di Kasir, Booking, dan Dashboard.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700 p-1"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              {/* Foto Profil */}
              <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center gap-3">
                <StaffAvatar
                  key={editFormData.avatar || 'empty'}
                  staff={{ name: editFormData.name || selectedStaff?.name, avatar: editFormData.avatar }}
                  className="w-16 h-16 rounded-2xl border-2 border-champagne-300 shadow-sm shrink-0"
                  textClassName="text-xl"
                />
                <div className="flex-1 min-w-0">
                  <label className="block font-bold text-charcoal-700 mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-champagne-600" />
                    <span>URL Foto Profil</span>
                  </label>
                  <input
                    type="url"
                    value={editFormData.avatar}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://contoh.com/foto-staf.jpg"
                    className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-xl"
                  />
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <span className="text-[10px] text-charcoal-400 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Kosongkan untuk memakai inisial nama.
                    </span>
                    {editFormData.avatar && (
                      <button
                        type="button"
                        onClick={() => setEditFormData(prev => ({ ...prev, avatar: '' }))}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Nama Profil / Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Jabatan / Role *</label>
                <input
                  type="text"
                  required
                  value={editFormData.role}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Contoh: Senior Barber"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Spesialisasi & Keahlian</label>
                <input
                  type="text"
                  value={editFormData.specialty}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  placeholder="Contoh: Gentlemen Cut, Fade & Beard"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-champagne-600" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="nama@pusalon.co.id"
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Komisi Layanan (%)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={editFormData.commissionRate}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, commissionRate: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Status Kehadiran</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-medium"
                  >
                    <option value="available">Tersedia</option>
                    <option value="busy">Melayani</option>
                    <option value="off">Libur</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[10px] text-blue-800 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Hanya Owner yang dapat menyimpan perubahan profil staf.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-charcoal-500 hover:text-charcoal-700"
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
        </div>,
        document.body
      )}

      {/* Edit Profil Owner Modal — akun sendiri */}
      {isOwnerModalOpen && createPortal(
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900">Edit Profil Saya</h3>
                <p className="text-[10px] text-charcoal-400">
                  Nama dan foto ini tampil di header, dashboard, dan seluruh modul.
                </p>
              </div>
              <button
                onClick={() => setIsOwnerModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700 p-1"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOwner} className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center gap-3">
                <StaffAvatar
                  key={ownerFormData.avatar || 'owner-empty'}
                  staff={{ name: ownerFormData.name || ownerProfile?.name, avatar: ownerFormData.avatar }}
                  className="w-16 h-16 rounded-2xl border-2 border-champagne-300 shadow-sm shrink-0"
                  textClassName="text-xl"
                />
                <div className="flex-1 min-w-0">
                  <label className="block font-bold text-charcoal-700 mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-champagne-600" />
                    <span>URL Foto Profil</span>
                  </label>
                  <input
                    type="url"
                    value={ownerFormData.avatar}
                    onChange={(e) => setOwnerFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://contoh.com/foto-owner.jpg"
                    className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-xl"
                  />
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <span className="text-[10px] text-charcoal-400 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Kosongkan untuk memakai inisial nama.
                    </span>
                    {ownerFormData.avatar && (
                      <button
                        type="button"
                        onClick={() => setOwnerFormData(prev => ({ ...prev, avatar: '' }))}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Nama Profil / Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={ownerFormData.name}
                  onChange={(e) => setOwnerFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Yuni Puspita"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Jabatan / Label Profil</label>
                <input
                  type="text"
                  value={ownerFormData.label}
                  onChange={(e) => setOwnerFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Contoh: Owner / Pemilik"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={ownerFormData.phone}
                    onChange={(e) => setOwnerFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-champagne-600" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    value={ownerFormData.email}
                    onChange={(e) => setOwnerFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="nama@pusalon.co.id"
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Perubahan langsung memperbarui identitas akun Owner di seluruh sistem.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsOwnerModalOpen(false)}
                  className="px-4 py-2 font-semibold text-charcoal-500 hover:text-charcoal-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-xl shadow-gold"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
