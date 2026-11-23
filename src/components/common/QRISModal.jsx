import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, X, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

export const QRISModal = ({ total, onSuccess, onCancel }) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes timer
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-luxury border border-ivory-300 p-6 space-y-4 animate-in fade-in zoom-in-95 text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
            <QrCode className="w-4 h-4 text-purple-600" />
            <span>QRIS Standar Pembayaran Nasional</span>
          </div>
          <button onClick={onCancel} className="text-charcoal-400 hover:text-charcoal-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Merchant & Amount */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">PU SALON & BARBERSHOP</div>
          <div className="text-2xl font-serif font-bold text-charcoal-900">
            Rp {total.toLocaleString('id-ID')}
          </div>
          <p className="text-[10px] text-charcoal-400">NMID: ID1020038849202 • Kelapa Gading</p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-purple-300 inline-block shadow-inner">
          <div className="w-52 h-52 bg-white flex flex-col items-center justify-center relative rounded-xl overflow-hidden">
            {/* Visual QR Pattern */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Corner squares */}
              <rect x="10" y="10" width="40" height="40" fill="#1C1B1F" rx="4" />
              <rect x="20" y="20" width="20" height="20" fill="#FFFFFF" />
              <rect x="25" y="25" width="10" height="10" fill="#1C1B1F" />

              <rect x="150" y="10" width="40" height="40" fill="#1C1B1F" rx="4" />
              <rect x="160" y="20" width="20" height="20" fill="#FFFFFF" />
              <rect x="165" y="25" width="10" height="10" fill="#1C1B1F" />

              <rect x="10" y="150" width="40" height="40" fill="#1C1B1F" rx="4" />
              <rect x="20" y="160" width="20" height="20" fill="#FFFFFF" />
              <rect x="25" y="165" width="10" height="10" fill="#1C1B1F" />

              {/* Data Blocks */}
              <rect x="60" y="20" width="15" height="15" fill="#1C1B1F" />
              <rect x="85" y="15" width="10" height="20" fill="#1C1B1F" />
              <rect x="105" y="25" width="20" height="10" fill="#1C1B1F" />
              <rect x="135" y="15" width="10" height="15" fill="#1C1B1F" />

              <rect x="20" y="60" width="15" height="20" fill="#1C1B1F" />
              <rect x="40" y="90" width="10" height="20" fill="#1C1B1F" />
              <rect x="15" y="120" width="25" height="15" fill="#1C1B1F" />

              <rect x="65" y="65" width="70" height="70" fill="#8B5CF6" rx="10" />
              <rect x="80" y="80" width="40" height="40" fill="#FFFFFF" rx="6" />

              <rect x="145" y="60" width="20" height="15" fill="#1C1B1F" />
              <rect x="170" y="85" width="15" height="25" fill="#1C1B1F" />
              <rect x="150" y="120" width="30" height="15" fill="#1C1B1F" />

              <rect x="60" y="145" width="15" height="20" fill="#1C1B1F" />
              <rect x="85" y="160" width="25" height="15" fill="#1C1B1F" />
              <rect x="120" y="145" width="20" height="15" fill="#1C1B1F" />
              <rect x="150" y="165" width="20" height="20" fill="#1C1B1F" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-2 py-1 bg-white rounded-lg shadow-md font-bold text-[10px] text-purple-900 border border-purple-200">
                QRIS PU
              </div>
            </div>
          </div>
        </div>

        {/* Expiry & Apps */}
        <div className="space-y-1">
          <div className="text-xs text-charcoal-500 flex items-center justify-center gap-1">
            <span>Berlaku dalam: </span>
            <span className="font-mono font-bold text-rose-600">{formatTime(secondsLeft)}</span>
          </div>
          <div className="text-[10px] text-charcoal-400">
            Dukung semua e-wallet & m-banking: BCA, GoPay, OVO, Dana, ShopeePay, Livin' Mandiri.
          </div>
        </div>

        {/* Simulate Instant Verification Button */}
        <div className="space-y-2 pt-2 border-t border-ivory-200">
          <button
            onClick={handleSimulatePayment}
            disabled={isVerifying}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            {isVerifying ? (
              <span className="animate-pulse">Memverifikasi Pembayaran...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasi Pembayaran Berhasil</span>
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 text-xs font-semibold text-charcoal-400 hover:text-charcoal-700"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
