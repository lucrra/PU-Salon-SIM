import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Plus,
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  Play,
  ShoppingBag,
  Filter,
  Search,
  AlertCircle,
  Calendar,
  List
} from 'lucide-react';

export const BookingModule = () => {
  const {
    appointments,
    createAppointment,
    updateAppointmentStatus,
    convertAppointmentToPOS,
    staff,
    services,
    customers,
    checkStaffAvailability,
    checkOperatingHours,
    userRole,
    activeStaffId
  } = useApp();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState(userRole === 'staff' ? activeStaffId : 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Appointment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    staffId: staff[0]?.id || '',
    serviceIds: [services[0]?.id || ''],
    date: new Date().toISOString().slice(0, 10),
    startTime: '13:00',
    type: 'online',
    notes: ''
  });
  const [formError, setFormError] = useState('');

  // Calculate estimated duration & end time
  const selectedServices = services.filter(s => formData.serviceIds.includes(s.id));
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0) || 45;
  const totalAmount = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const calculateEndTime = (startTimeStr, durationMins) => {
    if (!startTimeStr) return '13:45';
    const [h, m] = startTimeStr.split(':').map(Number);
    const endTotalMins = h * 60 + m + durationMins;
    const endH = Math.floor(endTotalMins / 60);
    const endM = endTotalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const calculatedEndTime = calculateEndTime(formData.startTime, totalDuration);

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesStaff = (userRole === 'staff' ? apt.staffId === activeStaffId : (staffFilter === 'all' || apt.staffId === staffFilter));
    const matchesDate = viewMode === 'calendar' ? apt.date === selectedDate : true;

    return matchesSearch && matchesStatus && matchesStaff && matchesDate;
  });

  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    if (custId === 'new') {
      setFormData(prev => ({ ...prev, customerId: '', customerName: '', customerPhone: '' }));
    } else {
      const cust = customers.find(c => c.id === custId);
      if (cust) {
        setFormData(prev => ({
          ...prev,
          customerId: cust.id,
          customerName: cust.name,
          customerPhone: cust.phone
        }));
      }
    }
  };

  const handleServiceToggle = (srvId) => {
    setFormData(prev => {
      const exists = prev.serviceIds.includes(srvId);
      let newIds = exists ? prev.serviceIds.filter(id => id !== srvId) : [...prev.serviceIds, srvId];
      if (newIds.length === 0) newIds = [srvId]; // Minimum 1 service
      return { ...prev, serviceIds: newIds };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.customerName || !formData.customerPhone) {
      setFormError('Nama dan nomor telepon pelanggan wajib diisi.');
      return;
    }

    const assignedStaff = staff.find(s => s.id === formData.staffId);
    const serviceNames = services.filter(s => formData.serviceIds.includes(s.id)).map(s => s.name);

    const result = createAppointment({
      ...formData,
      staffName: assignedStaff ? assignedStaff.name : 'Staff',
      serviceNames,
      totalAmount,
      endTime: calculatedEndTime
    });

    if (result.success) {
      setIsModalOpen(false);
      // Reset form
      setFormData({
        customerId: '',
        customerName: '',
        customerPhone: '',
        staffId: staff[0]?.id || '',
        serviceIds: [services[0]?.id || ''],
        date: new Date().toISOString().slice(0, 10),
        startTime: '13:00',
        type: 'online',
        notes: ''
      });
    } else {
      setFormError(result.message);
    }
  };

  // Calendar view time slots (from 11:00 to 21:00)
  const timeSlots = [
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Cari nama, no HP, atau kode booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:border-champagne-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs text-charcoal-700 font-medium focus:outline-none focus:border-champagne-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu (Pending)</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="in_progress">Sedang Dikerjakan</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          {/* Staff Filter (Hidden if staff role) */}
          {userRole !== 'staff' && (
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs text-charcoal-700 font-medium focus:outline-none focus:border-champagne-500"
            >
              <option value="all">Semua Staf</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
              ))}
            </select>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-ivory-100 p-1 rounded-xl border border-ivory-300">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'calendar' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Kalender</span>
            </button>
          </div>
        </div>

        {/* Create Booking Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Buat Janji Temu Baru</span>
        </button>
      </div>

      {/* Main View: Calendar or List */}
      {viewMode === 'calendar' ? (
        <div className="bg-white p-6 rounded-3xl border border-ivory-300/80 shadow-soft space-y-4">
          {/* Date Picker Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-charcoal-500">Pilih Tanggal:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-ivory-100 border border-ivory-300 rounded-xl text-xs font-bold text-charcoal-800"
              />
            </div>
            <div className="text-xs text-charcoal-500">
              Operasional: <span className="font-semibold text-charcoal-800">Senin 11:00-16:00 | Sel-Min 11:00-21:00</span>
            </div>
          </div>

          {/* Grid of 3 Staff Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {staff.map(stf => {
              const staffApts = filteredAppointments.filter(a => a.staffId === stf.id);
              return (
                <div key={stf.id} className="bg-ivory-50 rounded-2xl p-4 border border-ivory-300/60 space-y-3">
                  <div className="flex items-center gap-3 pb-2 border-b border-ivory-200">
                    <img src={stf.avatar} alt={stf.name} className="w-9 h-9 rounded-xl object-cover border border-champagne-300" />
                    <div>
                      <div className="text-xs font-bold text-charcoal-900">{stf.name}</div>
                      <div className="text-[10px] text-charcoal-500">{stf.role}</div>
                    </div>
                  </div>

                  {/* Appointments in this staff's slot */}
                  <div className="space-y-2 min-h-[300px]">
                    {staffApts.length === 0 ? (
                      <div className="text-center py-12 text-[11px] text-charcoal-400">
                        Tidak ada booking pada tanggal ini.
                      </div>
                    ) : (
                      staffApts.map(apt => (
                        <div key={apt.id} className="p-3 bg-white rounded-xl border border-ivory-300 shadow-sm space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-charcoal-900">{apt.startTime} - {apt.endTime}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              apt.status === 'in_progress' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                              apt.status === 'confirmed' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {apt.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-charcoal-800">{apt.customerName}</div>
                          <div className="text-[10px] text-charcoal-500">{apt.serviceNames.join(', ')}</div>

                          {/* Action Buttons */}
                          <div className="pt-2 flex items-center gap-1 border-t border-ivory-100">
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                className="flex-1 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-[10px] rounded-lg transition-colors"
                              >
                                Konfirmasi
                              </button>
                            )}
                            {apt.status === 'confirmed' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                                className="flex-1 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <Play className="w-2.5 h-2.5" /> Kerjakan
                              </button>
                            )}
                            {(apt.status === 'in_progress' || apt.status === 'confirmed') && userRole !== 'staff' && (
                              <button
                                onClick={() => convertAppointmentToPOS(apt)}
                                className="flex-1 py-1 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <ShoppingBag className="w-2.5 h-2.5" /> Ke POS
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl border border-ivory-300/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory-100/80 border-b border-ivory-300 text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Kode Booking</th>
                  <th className="py-3.5 px-4">Pelanggan</th>
                  <th className="py-3.5 px-4">Layanan & Durasi</th>
                  <th className="py-3.5 px-4">Staf / Stylist</th>
                  <th className="py-3.5 px-4">Jadwal Janji Temu</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi & Integrasi POS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 text-xs">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-charcoal-400 text-xs">
                      Tidak ada janji temu yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-ivory-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-charcoal-800">
                        {apt.code}
                        <div className="text-[10px] text-charcoal-400 font-sans capitalize">{apt.type} Booking</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-charcoal-900">{apt.customerName}</div>
                        <div className="text-[11px] text-charcoal-500">{apt.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-charcoal-800">{apt.serviceNames.join(', ')}</div>
                        <div className="text-[10px] text-charcoal-400">Rp {apt.totalAmount.toLocaleString('id-ID')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-charcoal-900">{apt.staffName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-charcoal-800">{apt.date}</div>
                        <div className="text-[11px] text-charcoal-500">{apt.startTime} - {apt.endTime} WIB</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'in_progress' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                          apt.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                          apt.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg transition-colors"
                              title="Konfirmasi Janji Temu"
                            >
                              Konfirmasi
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                              title="Mulai Pengerjaan"
                            >
                              <Play className="w-3 h-3" /> Mulai
                            </button>
                          )}
                          {apt.status === 'in_progress' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                              title="Tandai Selesai"
                            >
                              <CheckCircle className="w-3 h-3" /> Selesai
                            </button>
                          )}
                          {/* POS Conversion Button */}
                          {userRole !== 'staff' && apt.status !== 'completed' && apt.status !== 'cancelled' && (
                            <button
                              onClick={() => convertAppointmentToPOS(apt)}
                              className="px-3 py-1 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              title="Langsung kirim ke kasir POS untuk pembayaran"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Kasir POS</span>
                            </button>
                          )}
                          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                              className="p-1 text-charcoal-400 hover:text-rose-600 transition-colors"
                              title="Batalkan Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Buat Janji Temu Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-800"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Selection or Input */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">Pilih Pelanggan Terdaftar</label>
                <select
                  value={formData.customerId || 'new'}
                  onChange={handleCustomerSelect}
                  className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs font-medium focus:outline-none focus:border-champagne-500"
                >
                  <option value="new">+ Pelanggan Baru / Walk-In</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone}) - {c.tier}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Nama Pelanggan *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Contoh: Dimas Anggara"
                    className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:border-champagne-500"
                  />
                </div>
              </div>

              {/* Staff Assignment */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">Pilih Staf / Stylist *</label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs font-medium focus:outline-none focus:border-champagne-500"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.role} ({s.specialty})</option>
                  ))}
                </select>
              </div>

              {/* Service Selection (Multi-select) */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Pilih Layanan Salon</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-ivory-50 rounded-xl border border-ivory-300">
                  {services.map(srv => {
                    const isChecked = formData.serviceIds.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleServiceToggle(srv.id)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                          isChecked ? 'bg-champagne-100 border-champagne-400 font-semibold text-champagne-900' : 'bg-white border-ivory-200 text-charcoal-700 hover:bg-ivory-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{srv.name}</span>
                          <span className="text-[10px] text-charcoal-500">{srv.duration}m</span>
                        </div>
                        <div className="text-[11px] text-champagne-800 font-bold">
                          Rp {srv.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date, Time, Type */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs font-medium focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Jam Mulai *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs font-medium focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Jenis Janji</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs font-medium focus:outline-none focus:border-champagne-500"
                  >
                    <option value="online">Online Booking</option>
                    <option value="walk_in">Walk-in Langsung</option>
                  </select>
                </div>
              </div>

              {/* Summary of Duration and Calculation */}
              <div className="p-3 rounded-xl bg-ivory-100/80 border border-ivory-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-charcoal-500">Estimasi Selesai: </span>
                  <span className="font-bold text-charcoal-900">{calculatedEndTime} WIB</span>
                  <span className="text-charcoal-400 text-[10px]"> ({totalDuration} menit)</span>
                </div>
                <div>
                  <span className="text-charcoal-500">Total Biaya: </span>
                  <span className="font-bold text-champagne-800">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Contoh: Minta styling pomade suavecito"
                  className="w-full px-3 py-2 bg-ivory-100/70 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:border-champagne-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-champagne-500 hover:bg-champagne-400 text-charcoal-900 font-bold text-xs rounded-xl shadow-gold transition-all"
                >
                  Simpan Janji Temu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
