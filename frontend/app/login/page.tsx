'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Lock, Smartphone, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-48 h-48 flex items-center justify-center"
            >
              <img 
                alt="Logo" 
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                src="https://lh3.googleusercontent.com/aida/ADBb0ugjGA6xmQjVXdYDsNDJrHUrfQFUIf5G0eJyQ8mRr4paH12aHmHbwdrqvqqTRB2QhX_6mYrtF9x-3bWkZSywNEg0iNEVS5pWC86CTNxWfe4AgetVYoKsF6z2S_n9hBRKHcuQjaNh8wdvxPyGK5EZLpEKF8neWZa9MhNxaRjaDeE9Z0UZZYobE8DG7I8UadUhKyxGDg4uVHD3ws0244BGv03aDjzXXj99Fu9lXjmomfIskoxAgWqL9jNPztBn" 
              />
            </motion.div>
            <h1 className="mt-8 font-display text-4xl tracking-[0.3em] text-on-surface opacity-80 uppercase">
              VAULT
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Ambient City" 
          className="w-full h-full object-cover opacity-30 scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvafXbEiZKiJLgibUzl2r8CcdC4d8ZSdiBExmFpuxyY8RgA-7Ue7RUBg39mFYmo5sD6Mtnw69uJ7u0IFfTehPappe6XRxExxG8KOmg7T0cSFSNWZqK1eQdgc8okqYXIOCMcuWuBgKxAo-9Z8y0ClFqKzQocjAp-zLE4YtT629UtzqBH-I2QqXHd1CkcP2iuf00ymocqihLoxheoNP82H1jDnUPFK-WH1F2hrbw6nxa4jaiDyksKy51NRxpEh6XvlPMMlpm_tbr0qRU" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-surface-container"></div>
      </div>

      {/* Form Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2 }}
        className="relative z-10 w-full max-w-[400px] px-5 pt-10 pb-20"
      >
        <header className="mb-12 text-center">
          <div className="mb-4 inline-block px-4 py-1 glass-card rounded-full border-outline-variant/20">
            <span className="font-tech text-[10px] text-secondary uppercase tracking-widest">Thánh địa kỹ thuật số</span>
          </div>
          <h2 className="font-display text-5xl leading-none text-on-surface uppercase mb-2">ĐĂNG NHẬP</h2>
        </header>

        <form onSubmit={handleLogin} className="glass-card rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-40"></div>
          
          <div className="space-y-4">
            <label className="font-tech text-[10px] text-on-surface-variant block uppercase tracking-widest">Số điện thoại</label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pl-4 text-on-surface-variant">
                <Smartphone size={18} />
                <span className="font-body text-sm ml-2">+84</span>
              </div>
              <input 
                className="w-full bg-white/30 border-0 border-b border-outline-variant py-4 pl-16 pr-4 font-body text-sm text-on-surface placeholder:text-outline-variant focus:ring-0 focus:border-secondary transition-all" 
                placeholder="000 000 000" 
                type="tel" 
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-tech text-[10px] text-on-surface-variant block uppercase tracking-widest">Mật khẩu</label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pl-4 text-on-surface-variant">
                <Lock size={18} />
              </div>
              <input 
                className="w-full bg-white/30 border-0 border-b border-outline-variant py-4 pl-12 pr-4 font-body text-sm text-on-surface placeholder:text-outline-variant focus:ring-0 focus:border-secondary transition-all" 
                placeholder="••••••••" 
                type="password" 
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-16 chrome-effect rounded-full font-tech text-xs text-secondary flex items-center justify-center space-x-3 group relative overflow-hidden active:scale-95 transition-transform"
          >
            <span className="relative z-10 font-bold tracking-[0.2em]">ĐĂNG NHẬP</span>
            <div className="absolute inset-0 holographic-sweep opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </button>

          <div className="flex items-center space-x-4">
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
            <span className="font-tech text-[10px] text-on-surface-variant/40">HOẶC GIAO THỨC</span>
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
          </div>

          <button className="w-full h-14 rounded-2xl glass-card border border-outline-variant/20 hover:bg-white/50 transition-colors flex items-center justify-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="font-tech text-xs text-on-surface uppercase tracking-widest font-bold">GOOGLE Login</span>
          </button>
        </form>

        <footer className="mt-12 text-center space-y-6">
          <p className="font-body text-on-surface-variant text-sm">
            Chưa có tài khoản? <a className="text-secondary font-bold underline underline-offset-4" href="#">ĐĂNG KÝ NGAY</a>
          </p>
          <div className="flex justify-center items-center space-x-6 opacity-40">
            <ShieldCheck size={18} />
            <span className="font-tech text-[10px] tracking-widest">MÃ HÓA 256-BIT</span>
          </div>
        </footer>
      </motion.section>
    </div>
  );
}
