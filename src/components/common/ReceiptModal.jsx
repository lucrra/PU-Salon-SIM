import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, CheckCircle, Share2, Sparkles, Scissors } from 'lucide-react';

export const ReceiptModal = () => {
  const { activeReceipt, setActiveReceipt, salonProfile } = useApp();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const copyWhatsAppText = () => {
    const text = `*PU SALON & BARBERSHOP*\n` +
      `No. Nota: ${activeReceipt.invoiceNo}\n` +
      `Tanggal: ${new Date(activeReceipt.date).toLocaleString('id-ID')}\n` +
      `Pelanggan: ${activeReceipt.customerName}\n` +
      `Stylist: ${activeReceipt.staffName}\n\n` +
      `*RINCIAN ITEM:*\n` +
      activeReceipt.items.map(i => `- ${i.name} (${i.qty}x) = Rp ${i.subtotal.toLocaleString('id-ID')}`).join('\n') +
      `\n\nSubtotal: Rp ${activeReceipt.subtotal.toLocaleString('id-ID')}\n` +
      (activeReceipt.discount > 0 ? `Diskon (${activeReceipt.discountReason}): -Rp ${activeReceipt.discount.toLocaleString('id-ID')}\n` : '') +
      `*TOTAL: Rp ${activeReceipt.total.toLocaleString('id-ID')}*\n` +
      `Metode Bayar: ${activeReceipt.paymentMethod.toUpperCase()} (LUNAS)\n` +
      (activeReceipt.customerId ? `Poin CRM: +${activeReceipt.pointsEarned || 0} poin${activeReceipt.tierUpgraded ? ` (Naik ke ${activeReceipt.tierAfter})` : ''}\n` : '') +
      `\nTerima kasih atas kunjungan Anda di PU Salon & Barbershop!`;

    navigator.clipboard.writeText(text);
    alert('Teks nota pembayaran telah disalin ke clipboard! Siap dikirim ke WhatsApp pelanggan.');
  };

  return (
    <div className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4 max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Action Header */}
        <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Transaksi Sukses</span>
          </div>
          <button onClick={() => setActiveReceipt(null)} className="text-charcoal-400 hover:text-charcoal-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt (80mm) */}
        <div id="printable-receipt" className="p-4 bg-ivory-50 rounded-2xl border border-ivory-300 font-mono text-xs space-y-3">
          {/* Brand Header */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 font-serif font-bold text-sm text-charcoal-900 tracking-wider">
              <Scissors className="w-3.5 h-3.5" />
              <span>PU SALON & BARBERSHOP</span>
            </div>
            <p className="text-[10px] text-charcoal-500">{salonProfile.address}</p>
            <p className="text-[10px] text-charcoal-500">WA: {salonProfile.phone}</p>
          </div>

          <div className="border-b border-dashed border-charcoal-300 my-2"></div>

          {/* Invoice Info */}
          <div className="text-[11px] space-y-0.5 text-charcoal-700">
            <div className="flex justify-between">
              <span>No. Nota:</span>
              <span className="font-bold">{activeReceipt.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{new Date(activeReceipt.date).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span className="font-bold">{activeReceipt.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Staf / Stylist:</span>
              <span>{activeReceipt.staffName}</span>
            </div>
          </div>

          <div className="border-b border-dashed border-charcoal-300 my-2"></div>

          {/* Itemized list */}
          <div className="space-y-1.5 text-[11px]">
            {activeReceipt.items.map((item, idx) => (
              <div key={idx}>
                <div className="font-bold text-charcoal-800">{item.name}</div>
                <div className="flex justify-between text-charcoal-600 pl-2">
                  <span>{item.qty} x Rp {item.price.toLocaleString('id-ID')}</span>
                  <span className="font-semibold">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-b border-dashed border-charcoal-300 my-2"></div>

          {/* Totals */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal:</span>
              <span>Rp {activeReceipt.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {activeReceipt.discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Diskon ({activeReceipt.discountReason || 'Promo'}):</span>
                <span>-Rp {activeReceipt.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold text-charcoal-900 pt-1 border-t border-charcoal-300">
              <span>TOTAL AKHIR:</span>
              <span>Rp {activeReceipt.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-charcoal-600 pt-0.5">
              <span>Metode Pembayaran:</span>
              <span className="font-bold uppercase">{activeReceipt.paymentMethod} (LUNAS)</span>
            </div>
            {activeReceipt.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-charcoal-600">
                  <span>Tunai Diterima:</span>
                  <span>Rp {activeReceipt.cashGiven.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Kembalian:</span>
                  <span className="font-bold text-emerald-700">Rp {activeReceipt.change.toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </div>

          {activeReceipt.customerId && (
            <>
              <div className="border-b border-dashed border-charcoal-300 my-2"></div>
              <div className="text-[10px] space-y-0.5">
                <div className="flex justify-between font-bold text-charcoal-800">
                  <span>Poin CRM Diperoleh:</span>
                  <span>+{activeReceipt.pointsEarned || 0} poin</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Status Member:</span>
                  <span className="font-bold">{activeReceipt.tierAfter || activeReceipt.tierBefore}</span>
                </div>
                {activeReceipt.tierUpgraded && (
                  <div className="text-center font-bold text-champagne-700 pt-1">
                    Selamat! Tier naik ke {activeReceipt.tierAfter}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="border-b border-dashed border-charcoal-300 my-2"></div>

          {/* Footer note */}
          <div className="text-center space-y-1 text-[10px] text-charcoal-500 pt-1">
            <p className="font-bold text-charcoal-700">Terima Kasih Atas Kunjungan Anda!</p>
            <p>Wi-Fi: PUSalon_Guest / Sandi: pusalon2026</p>
            <p>Instagram: @pusalon.barbershop</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-champagne-400" />
              <span>Cetak Struk</span>
            </button>
            <button
              onClick={copyWhatsAppText}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Kirim ke WA</span>
            </button>
          </div>

          <button
            onClick={() => setActiveReceipt(null)}
            className="w-full py-2 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
