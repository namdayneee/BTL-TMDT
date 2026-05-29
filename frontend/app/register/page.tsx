'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { registerWithPassword } from '../lib/auth-client';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithPassword(email, password);
      setSuccessMessage('Đăng ký thành công, đang chuyển sang trang đăng nhập...');
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-background">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-40 h-40 flex items-center justify-center"
            >
              <img
                alt="Logo"
                className="w-full h-full object-contain"
                src="/images/logo.png"
              />
            </motion.div>
            <h1 className="mt-8 font-display text-4xl tracking-[0.3em] text-on-surface opacity-80 uppercase">
              VAULT
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          alt="Ambient City"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvafXbEiZKiJLgibUzl2r8CcdC4d8ZSdiBExmFpuxyY8RgA-7Ue7RUBg39mFYmo5sD6Mtnw69uJ7u0IFfTehPappe6XRxExxG8KOmg7T0cSFSNWZqK1eQdgc8okqYXIOCMcuWuBgKxAo-9Z8y0ClFqKzQocjAp-zLE4YtT629UtzqBH-I2QqXHd1CkcP2iuf00ymocqihLoxheoNP82H1jDnUPFK-WH1F2hrbw6nxa4jaiDyksKy51NRxpEh6XvlPMMlpm_tbr0qRU"
        />
        <div className="absolute inset-0 bg-linear-to-br from-on-surface/80 via-on-surface/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-between p-14 h-full">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 shrink-0">
              <img src="/images/logo.png" alt="" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-5xl tracking-[0.3em] text-surface uppercase">VAULT</span>
          </div>
          <div>
            <h2 className="font-display text-[56px] leading-[0.9] text-surface uppercase mb-6">
              Tham Gia<br />Cộng Đồng
            </h2>
            <p className="font-body text-sm text-surface/60 max-w-xs leading-relaxed">
              Tạo tài khoản để lưu đơn hàng, theo dõi trạng thái vận chuyển và nhận ưu đãi dành riêng cho thành viên Vault.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-5 py-10 lg:px-0">
        <div className="lg:hidden absolute inset-0 z-0">
          <img
            alt="Ambient City"
            className="w-full h-full object-cover opacity-30 scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvafXbEiZKiJLgibUzl2r8CcdC4d8ZSdiBExmFpuxyY8RgA-7Ue7RUBg39mFYmo5sD6Mtnw69uJ7u0IFfTehPappe6XRxExxG8KOmg7T0cSFSNWZqK1eQdgc8okqYXIOCMcuWuBgKxAo-9Z8y0ClFqKzQocjAp-zLE4YtT629UtzqBH-I2QqXHd1CkcP2iuf00ymocqihLoxheoNP82H1jDnUPFK-WH1F2hrbw6nxa4jaiDyksKy51NRxpEh6XvlPMMlpm_tbr0qRU"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-surface-container"></div>
        </div>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 w-full max-w-100 lg:max-w-110"
        >
          <header className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-white border border-outline-variant/20 flex items-center justify-center p-1.5">
                <img src="/images/logo.png" alt="" className="w-full h-full object-contain" />
              </div>
              <span className="font-display text-2xl tracking-[0.2em] text-on-surface uppercase">VAULT</span>
            </div>
            <h2 className="font-display text-5xl leading-none text-on-surface uppercase mb-2">ĐĂNG KÝ</h2>
          </header>

          <form onSubmit={handleRegister} className="glass-card rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-secondary to-transparent opacity-40"></div>

            <div className="space-y-4">
              <label className="font-tech text-[10px] text-on-surface-variant block uppercase tracking-widest">Email</label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pl-4 text-on-surface-variant">
                  <Mail size={18} />
                </div>
                <input
                  className="w-full bg-white/30 border-0 border-b border-outline-variant py-4 pl-12 pr-4 font-body text-sm text-on-surface placeholder:text-outline-variant focus:ring-0 focus:border-secondary transition-all outline-none"
                  placeholder="email@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="w-full bg-white/30 border-0 border-b border-outline-variant py-4 pl-12 pr-4 font-body text-sm text-on-surface placeholder:text-outline-variant focus:ring-0 focus:border-secondary transition-all outline-none"
                  placeholder="Tối thiểu 6 ký tự"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-tech text-[10px] text-on-surface-variant block uppercase tracking-widest">Xác nhận mật khẩu</label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pl-4 text-on-surface-variant">
                  <Lock size={18} />
                </div>
                <input
                  className="w-full bg-white/30 border-0 border-b border-outline-variant py-4 pl-12 pr-4 font-body text-sm text-on-surface placeholder:text-outline-variant focus:ring-0 focus:border-secondary transition-all outline-none"
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {errorMessage && <p className="font-body text-sm text-red-600">{errorMessage}</p>}
            {successMessage && <p className="font-body text-sm text-green-600">{successMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 chrome-effect rounded-full font-tech text-xs text-secondary flex items-center justify-center space-x-3 group relative overflow-hidden active:scale-95 transition-transform"
            >
              <span className="relative z-10 font-bold tracking-[0.2em]">
                {isSubmitting ? 'ĐANG TẠO TÀI KHOẢN...' : 'ĐĂNG KÝ'}
              </span>
              <div className="absolute inset-0 holographic-sweep opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </button>
          </form>

          <footer className="mt-10 text-center space-y-5">
            <p className="font-body text-on-surface-variant text-sm">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-secondary font-bold underline underline-offset-4 cursor-pointer"
              >
                ĐĂNG NHẬP NGAY
              </button>
            </p>
          </footer>
        </motion.section>
      </div>
    </div>
  );
}
