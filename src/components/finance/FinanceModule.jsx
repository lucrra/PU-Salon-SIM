import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  PieChart
} from 'lucide-react';

export const FinanceModule = () => {
  const {
    financialRecords,
    addFinancialRecord,
    transactions,
    userRole
  } = useApp();

  const [dateFilter, setDateFilter] = useState('month'); // 'today' | 'week' | 'month' | 'all'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Utilitas & Operasional',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Transfer Bank'
  });

  // Date Filtering
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = todayStr.slice(0, 7);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filteredRecords = financialRecords.filter(rec => {
    let matchesDate = true;
    if (dateFilter === 'today') matchesDate = rec.date === todayStr;
    else if (dateFilter === 'week') matchesDate = new Date(rec.date) >= sevenDaysAgo;
    else if (dateFilter === 'month') matchesDate = rec.date.startsWith(currentMonthStr);

    const matchesType = typeFilter === 'all' || rec.type === typeFilter;
    return matchesDate && matchesType;
  });

  // Totals
  const totalIncome = filteredRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = filteredRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const netProfit = totalIncome - totalExpense;

  // Categories Breakdown
  const expenseByCategory = filteredRecords
    .filter(r => r.type === 'expense')
    .reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {});

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;

    addFinancialRecord({
      ...formData,
      amount: Number(formData.amount)
    });

    setIsModalOpen(false);
    setFormData({
      type: 'expense',
      category: 'Utilitas & Operasional',
      description: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'Transfer Bank'
    });
  };

  // Export CSV Report
  const exportToCSV = () => {
    const headers = ['ID,Tanggal,Jenis,Kategori,Deskripsi,Metode Pembayaran,Jumlah (Rp)'];
    const rows = filteredRecords.map(r => 
      `"${r.id}","${r.date}","${r.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}","${r.category}","${r.description.replace(/"/g, '""')}","${r.paymentMethod || '-'}","${r.amount}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_PU_Salon_${dateFilter}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Total Pemasukan</div>
            <div className="text-2xl font-serif font-bold text-emerald-600 mt-1">
              Rp {totalIncome.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">Dari transaksi kasir & jasa salon</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Total Beban & Pengeluaran</div>
            <div className="text-2xl font-serif font-bold text-rose-600 mt-1">
              Rp {totalExpense.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">Restock PO, utilitas & operasional</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Laba Bersih (Net Profit)</div>
            <div className={`text-2xl font-serif font-bold mt-1 ${netProfit >= 0 ? 'text-champagne-800' : 'text-rose-600'}`}>
              Rp {netProfit.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">
              Margin Laba: {totalIncome > 0 ? `${Math.round((netProfit / totalIncome) * 100)}%` : '0%'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
            <Coins className="w-6 h-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Controls & Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-ivory-300/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Filter */}
          <div className="flex items-center bg-ivory-100 p-1 rounded-2xl border border-ivory-300">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateFilter === 'today' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateFilter === 'week' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateFilter === 'month' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateFilter === 'all' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl text-xs font-semibold text-charcoal-700"
          >
            <option value="all">Semua Arus Kas</option>
            <option value="income">Hanya Pemasukan</option>
            <option value="expense">Hanya Pengeluaran</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 font-bold text-xs rounded-xl border border-ivory-300 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-charcoal-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-champagne-400" />
            <span>Catat Kas Keluar / Masuk</span>
          </button>
        </div>
      </div>

      {/* Main Grid: General Ledger Table + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ledger Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-ivory-300/80 shadow-soft overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-charcoal-900">Jurnal Kas & Pembukuan Transaksi</h3>
            <span className="text-xs text-charcoal-400">{filteredRecords.length} Catatan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory-100/80 border-b border-ivory-300 text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Jenis & Kategori</th>
                  <th className="py-3 px-3">Deskripsi Transaksi</th>
                  <th className="py-3 px-3">Metode</th>
                  <th className="py-3 px-3 text-right">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 text-xs">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-charcoal-400">
                      Tidak ada catatan keuangan pada periode ini.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-ivory-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono text-[11px] text-charcoal-600 whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mb-0.5 ${
                          rec.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rec.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                        <div className="font-semibold text-charcoal-800 text-[11px]">{rec.category}</div>
                      </td>
                      <td className="py-3 px-3 text-charcoal-700 font-medium max-w-xs truncate">
                        {rec.description}
                      </td>
                      <td className="py-3 px-3 text-charcoal-500 text-[11px]">
                        {rec.paymentMethod || 'Tunai'}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                        rec.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {rec.type === 'income' ? '+' : '-'} Rp {rec.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Breakdown by Category (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-ivory-300/80 shadow-soft p-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-champagne-600" />
            <span>Rincian Beban Pengeluaran</span>
          </h3>

          <div className="space-y-3 pt-2">
            {Object.keys(expenseByCategory).length === 0 ? (
              <div className="text-center py-10 text-xs text-charcoal-400">
                Belum ada pengeluaran pada periode ini.
              </div>
            ) : (
              Object.entries(expenseByCategory).map(([cat, amount]) => {
                const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                      <span>{cat}</span>
                      <span className="font-bold text-charcoal-900">Rp {amount.toLocaleString('id-ID')} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 bg-ivory-50 rounded-2xl border border-ivory-200 text-xs text-charcoal-600 space-y-1 mt-4">
            <div className="font-bold text-charcoal-800">Kebijakan Finansial PU Salon:</div>
            <p className="text-[11px] leading-relaxed">
              Semua penjualan kasir (POS) Tunai dan QRIS secara otomatis dicatat ke dalam jurnal kas. Biaya restock barang terhubung langsung ke modul penerimaan PO.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Financial Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-charcoal-900">Catat Jurnal Kas Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'Lain-lain' }))}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-ivory-100 text-charcoal-600'
                    }`}
                  >
                    Pemasukan (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: 'Utilitas & Operasional' }))}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.type === 'expense' ? 'bg-rose-600 text-white' : 'bg-ivory-100 text-charcoal-600'
                    }`}
                  >
                    Pengeluaran (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-medium focus:outline-none"
                >
                  {formData.type === 'expense' ? (
                    <>
                      <option value="Utilitas & Operasional">Utilitas & Operasional (Listrik, Air, Wifi)</option>
                      <option value="Restock Bahan & Produk">Restock Bahan & Produk</option>
                      <option value="Gaji & Komisi Staf">Gaji & Komisi Staf</option>
                      <option value="Sewa Tempat">Sewa Tempat Salon</option>
                      <option value="Pemeliharaan Alat Salon">Pemeliharaan & Kebersihan</option>
                      <option value="Marketing & Promosi">Marketing & Promosi</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </>
                  ) : (
                    <>
                      <option value="POS Sales">Penjualan Jasa/Produk</option>
                      <option value="Sponsor / Event">Sponsor / Event Kerjasama</option>
                      <option value="Lain-lain">Pemasukan Lain-lain</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Deskripsi Transaksi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tagihan Listrik PLN Salon..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Jumlah Nominal (Rp) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Metode Pembayaran</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-xl font-medium"
                >
                  <option value="Transfer Bank">Transfer Bank (BCA / Mandiri)</option>
                  <option value="Tunai">Uang Tunai Kas Kecil</option>
                  <option value="Auto Debit">Auto Debit / Tagihan Berkala</option>
                  <option value="QRIS">QRIS</option>
                </select>
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
                  className="px-5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold rounded-xl"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
