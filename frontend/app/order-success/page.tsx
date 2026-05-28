'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { BadgeCheck, Truck, Trophy } from 'lucide-react';

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-secondary selection:text-white">
      <Header />

      <main className="pt-24 pb-16 px-5 md:px-8 flex flex-col items-center justify-center min-h-screen">
        {/* Background blur orbs */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden opacity-50">
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-24 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-lg md:max-w-2xl flex flex-col items-center text-center">
          {/* Animated Success Icon */}
          <div className="relative mb-12 flex justify-center items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="relative z-10"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <BadgeCheck size={200} className="text-secondary" />
                </div>
                <BadgeCheck size={160} className="text-secondary drop-shadow-[0_0_20px_rgba(0,36,192,0.4)]" strokeWidth={1} />
              </div>
              <div className="absolute inset-0 border-2 border-secondary/20 rounded-full holographic-sweep opacity-40"></div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-display text-5xl md:text-6xl mb-4 tracking-tight uppercase text-on-surface">
              ĐẶT HÀNG THÀNH CÔNG
            </h1>
            <p className="font-tech text-md font-bold text-secondary mb-10 max-w-sm mx-auto">
              Các món đồ công nghệ cao của bạn đang được chuẩn bị.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10"
          >
            <div className="glass-card p-5 rounded-3xl flex flex-col items-start justify-between h-36 border-outline-variant/20 shadow-sm">
              <span className="text-on-surface-variant font-tech text-[10px] uppercase tracking-widest opacity-60">Mã đơn hàng</span>
              <span className="font-tech text-sm font-bold text-on-surface">#VLTSGN-2024001</span>
            </div>
            <div className="glass-card p-5 rounded-3xl flex flex-col items-start justify-between h-36 border-outline-variant/20 shadow-sm">
              <span className="text-on-surface-variant font-tech text-[10px] uppercase tracking-widest opacity-60">Dự kiến giao</span>
              <span className="font-tech text-sm font-bold text-on-surface">2-3 NGÀY</span>
            </div>
            <div className="glass-card p-5 rounded-3xl flex flex-col items-start justify-between h-36 border-outline-variant/20 shadow-sm">
              <span className="text-on-surface-variant font-tech text-[10px] uppercase tracking-widest opacity-60">Địa chỉ giao</span>
              <span className="font-tech text-xs font-bold text-on-surface leading-snug">Hà Nội, Việt Nam</span>
            </div>
            <div className="glass-card p-5 rounded-3xl flex flex-col items-start justify-between h-36 border-l-4 border-secondary shadow-lg">
              <span className="text-on-surface-variant font-tech text-[10px] uppercase tracking-widest opacity-60">Điểm thưởng Vault</span>
              <div className="flex items-center gap-3 w-full justify-between">
                <span className="font-tech text-md font-bold text-secondary">+1,000 VP</span>
                <div className="bg-secondary/10 p-2 rounded-full">
                  <Trophy size={16} className="text-secondary" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
          >
            <button
              onClick={() => router.push('/orders')}
              className="flex-1 h-16 bg-secondary text-white font-tech text-xs font-bold tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 holographic-sweep"
            >
              <Truck size={18} />
              THEO DÕI ĐƠN HÀNG
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 h-16 glass-card border border-outline-variant/30 text-on-surface font-tech text-xs font-bold tracking-[0.2em] rounded-2xl hover:bg-surface-container-high transition-all active:scale-95"
            >
              TIẾP TỤC MUA SẮM
            </button>
          </motion.div>

          <p className="mt-12 font-tech text-[10px] opacity-40 uppercase tracking-widest leading-loose">
            Hóa đơn điện tử đã được gửi đến email đăng ký của bạn.
          </p>
        </div>
      </main>
    </div>
  );
}
