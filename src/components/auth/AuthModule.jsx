import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import { LOGIN_IMAGE } from '../../data/priceList';

export const AuthModule = () => {
  const { login, loginAs, demoAccounts } = useApp();
  const [email, setEmail] = useState('owner@pusalon.co.id');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = login({ email, password });
      if (!res.success) setError(res.message);
      setLoading(false);
    }, 550);
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.05fr_.95fr] bg-ivory-100">
      {/* Left — visual */}
      <div className="relative hidden lg:block overflow-hidden">
        <img src={LOGIN_IMAGE} alt="PU Salon" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-950/80 via-charcoal-900/65 to-charcoal-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,76,135,.42),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(38,190,130,.34),transparent_45%)]" />

        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-charcoal-950 ring-1 ring-white/25 shadow-lg p-0.5 overflow-hidden">
              <img src="/logo.png" alt="PU Salon & Barbershop" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="font-display text-xl font-bold tracking-tight">PU SALON</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-pink-200">& Barbershop Studio</div>
            </div>
          </div>

          <div className="max-w-md space-y-5">
            <span className="chip bg-charcoal-950/65 text-white border border-white/35 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" /> PU SALON MANAGEMENT SYSTEM
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight">
              Satu Salon,{' '}
              <span className="bg-gradient-to-r from-pink-200 via-pink-100 to-emerald-200 bg-clip-text text-transparent">
                Semua Lebih Teratur.
              </span>
            </h1>
            <p className="text-sm text-white/90 leading-relaxed">
              Semua kebutuhan operasional — janji temu, pelanggan, layanan, kasir, stok, hingga laporan —
              dalam satu sistem yang mudah digunakan.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Star, top: '4.9', bottom: 'Rating pelanggan' },
                { icon: ShieldCheck, top: '100%', bottom: 'Data tersimpan' },
                { icon: Clock, top: '11—21', bottom: 'Jam operasional' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl bg-charcoal-950/60 border border-white/30 backdrop-blur px-3 py-2.5 shadow-lg">
                  <s.icon className="w-4 h-4 text-pink-200 mb-1.5" />
                  <div className="text-base font-bold leading-none">{s.top}</div>
                  <div className="text-[10px] text-white/85 mt-1">{s.bottom}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-white/85">
            <MapPin className="w-3.5 h-3.5" />
            Jl. Boulevard Raya Blok PU No. 12, Kelapa Gading, Jakarta
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-fadeUp">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-charcoal-950 ring-1 ring-charcoal-800 shadow-sm p-0.5 overflow-hidden">
              <img src="/logo.png" alt="PU Salon & Barbershop" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-charcoal-900">PU SALON</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-champagne-600">& Barbershop</div>
            </div>
          </div>

          <div className="surface p-7 sm:p-9">
            <div className="mb-7">
              <h2 className="font-display text-2xl font-bold text-charcoal-900">Masuk ke Sistem</h2>
              <p className="text-xs text-charcoal-500 mt-1.5">
                Gunakan akun salon Anda untuk mengakses dashboard operasional.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">Email</span>
                <div className="relative mt-1.5">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@pusalon.co.id"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-ivory-50 border border-ivory-300 text-sm text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none focus:ring-4 focus:ring-champagne-200/60 focus:border-champagne-300 transition"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">Password</span>
                <div className="relative mt-1.5">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-ivory-50 border border-ivory-300 text-sm text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none focus:ring-4 focus:ring-champagne-200/60 focus:border-champagne-300 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                    aria-label="Tampilkan password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-[11px] font-medium text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-brand w-full py-3 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Memverifikasi…' : 'Masuk ke Dashboard'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-7">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-charcoal-400">
                <span className="h-px flex-1 bg-ivory-300" />
                Akun demo
                <span className="h-px flex-1 bg-ivory-300" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {demoAccounts.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      loginAs(acc.role);
                    }}
                    className="rounded-2xl border border-ivory-300 bg-white/70 hover:border-champagne-300 hover:bg-champagne-50/60 px-3 py-2.5 text-left transition group"
                  >
                    <div className="text-[11px] font-bold text-charcoal-800 group-hover:text-champagne-700">
                      {acc.role === 'owner' ? 'Owner' : acc.role === 'admin' ? 'Admin' : 'Staf'}
                    </div>
                    <div className="text-[10px] text-charcoal-400 truncate">{acc.email.split('@')[0]}</div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-charcoal-400 mt-3 leading-relaxed">
                Semua akun demo memakai password <span className="font-semibold text-charcoal-600">demo123</span>.
              </p>
            </div>
          </div>

          <p className="text-center text-[10px] text-charcoal-400 mt-5">
            PU Salon & Barbershop ERP · © {new Date().getFullYear()} · Data simulasi tersimpan lokal di perangkat Anda
          </p>
        </div>
      </div>
    </div>
  );
};
