'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { Ruler, Star, Lock, Heart, Users } from 'lucide-react';
import { fetchProducts } from './lib/product-api';
import { mapApiProduct, type DisplayProduct } from './lib/types';

const communityPosts = [
  {
    id: 1,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0K87KeV3JI8Mrd0YQEKAYR3Y_wCcwIvcH1pb-_2Z5lxc1MZXQyublodoVcOGxq3w320kDFuT164pzq2pvk2kv6DYYLlpfvDFBNssItnRd7WtKi8SGx0AYDmpU1SoKRvP-pVbUKDziwYgikiaDsPM1ABTdhZGJkS8p6-PVMWIfFbpx4qReXzftpU-iXYZW-_iTZ_G0xgatR_cmKqBF9CUtipPOLDI2SkIfGQicO3UxLr3LCSPVG0GEhr3J3Z4EV4kB34c8iwd9TY-e',
    likes: '1.2k'
  },
  {
    id: 2,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9tZG5QFKLNqZxlRw4YbUxDF8riQDNIDwiOe4AnZluRelwGzr5erh7sigSJCEVfBmtQS28HNJnSoCAx8C9jIeSuu8GdKgB20eRiWAnPxjZmsybnC8Da68WpUa2h8fCPFqYvOvYzOUeGPt0LuBbjTjMwNGeWD3nNErFGka2OugecaT7AIXkL-vv8sti5q6P84sRei8X6Rfo82iok_sa3gaLH5QWTapP8WnPv_a9ykHrsSU9PH5GT-RJdnoV9aTad_0QqlUbPNHY39Zz',
    likes: '850'
  },
  {
    id: 3,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARsbRr8jOHsmXsQs2c7ASX1yGBSPFumUKNDDQjVuVtvU31A0fQgXqV-IQEIQrILhBV6h8LVRe5jWf7GJ-ikOjHQDFw7A42myZOaHl9tH4iffIw1wGsVP3PRQLvrdGzjwnMk6dXohyReUwvjAvTfjzdmjOPGkycZBs2tf2i2yfc6ZdHl_tmS87X4xDHR6_VmNm4MFG1Yc2JAZ-snuNJeY1EAKT1Vy-4nUXXbzzvDhH3adv1B9ZwINPVU2F4rbcu_gbCRRRIyUWNzI0m',
    likes: '2.4k'
  },
  {
    id: 4,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhPQmyf7IshNddW1HDbPtW8dEuFZLOpAwLI1x7n6ZP1eMAcUadR_u0TWJ4U1WpNlTCBh1-QeDadPywVrltPq2K-a6hAp9F4_jCsH1haaHFWJjbwXC-h_dk8nDdW8YzJ-kHIqDSeNy1XXiLOwv5TD6j55_OJrXMvphUfCnflQ3bMEEflbErOpUMq0dBl0NlK4TH7Tz-zGhlTLTanyuUhK_dTS8WGcuoGKweW2HM1qKuzxxlmjZwXB9QHFnpu81B2vV_5GtG0gegpQLU',
    likes: '3.1k'
  },
];

const lookbookImages = [
  {
    id: 1,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwwgg1t09h6y7S3SdIPte_KZTY1PXaCrNmCwpypKmckdTrz-1qz1BrjZ1Nlu27gu6JbIh92em9jsbXWBhiMdj3w88DFSxdxWNAR8LlOUPlER5hyqkzBFsKJqTCDCvTDKM-neyCcdQdkyWpk5lW95zgA7Se8C6ZAIM1LduyC8dYWNjiXWB7-3M7678fiCB9_vv7C5zZ6o8lzouC5eNpBtf5Fm8rEwe5ZoDthREKusiz0TOkemuaVMRtkaOmOdkK5wKYC0wZBuEfkAfd',
    aspect: 'aspect-4/5'
  },
  {
    id: 2,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpByNjEAi_vlAG0F29Ukxyn17W6LKdszdfIDseHKUl-ElQKPLQ81PVU01WCGyVd8scJuWY27fnViajOVzCUQQ_N328UvrBBQ67XJnvQSvzTVPkj7MPDKh7vmsiyVbvKUzBZ95oZbtQQ8oCcUhTfxu9xVNJlDDtPm4xV3PYscoscfDDZhZz18j48qoseZyYnQyB80SZ5VKtH10R69i-STqGsi7lNVmNM94QAjpaUfDfcF9QdSRLVZZxw_e7qZBKgG86oyq3jrafmgGg',
    aspect: 'aspect-square'
  },
  {
    id: 3,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9gDsbDQQyDbc6c0CjqYnFH0agh6ewXQAA8TVoWoh9KyHNMPOOlEDMpPwERiv3D2DxlxTksJSstvbd6eQafOmKqsEp1AdFSYo4lPiY5EO2qkxt2f4XPU8tEOFfr3CgiYkvKwBcrXlaumy4UkSgISz9aHC1pnZo0VNZBPQj7kgRQXx1XmxcLz7RngVv-y6WE9Y56Bp1WUoiRmScElb4Vj54F7P32QeGymRYs_lKiPrt9e6l29e3Vj-D0TIIG4jvcLRENSHj6xaNJFc_',
    aspect: 'aspect-2/3'
  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<DisplayProduct[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.map(mapApiProduct).slice(0, 8));
      } catch {
        setProducts([]);
      }
    };
    void load();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-end pb-24 overflow-hidden">
        {/* Banner as background */}
        <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
          <img
            alt="Vault Banner"
            className="w-full h-full object-contain object-center opacity-90"
            src="/images/banner.png"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20"></div>
        </div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 px-5 md:px-10 lg:px-16 max-w-7xl w-full mx-auto flex flex-wrap gap-2 mb-6"
        >
          {['Cotton 250 GSM', 'Size Thông Minh', 'Số Lượng Có Hạn'].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="glass-card px-4 py-1.5 rounded-full font-tech text-[10px] text-white uppercase tracking-widest bg-white/20"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Title + Description */}
        <div className="relative z-10 px-5 md:px-10 lg:px-16 max-w-7xl w-full mx-auto overflow-hidden mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[64px] md:text-[88px] lg:text-[110px] xl:text-[128px] leading-[0.9] text-white uppercase"
          >
            Định Hình<br />Bản Sắc
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="font-body text-lg text-white/70 max-w-70 md:max-w-md mt-4 leading-snug"
          >
            Thời trang đường phố dành cho những tâm hồn khác biệt. Được thiết kế từ trung tâm của Vault.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="relative z-10 px-5 md:px-10 lg:px-16 max-w-7xl w-full mx-auto flex gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('bo-suu-tap-moi')}
            className="bg-secondary text-white px-8 py-4 rounded-lg font-tech text-xs uppercase tracking-widest shadow-xl flex-1 md:flex-none md:min-w-45 hover:opacity-90 transition-all"
          >
            Sắm Ngay
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('van-hoa-vault')}
            className="bg-white/15 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-lg font-tech text-xs uppercase tracking-widest flex-1 md:flex-none md:min-w-45 transition-all hover:bg-white/25"
          >
            Văn Hóa
          </motion.button>
        </motion.div>
      </section>

      {/* New Collection */}
      <section id="bo-suu-tap-moi" className="py-16 overflow-hidden scroll-mt-20">
        <div className="px-5 md:px-10 lg:px-16 max-w-7xl mx-auto flex justify-between items-end mb-8">
          <div>
            <h3 className="font-display text-4xl md:text-5xl text-on-surface mb-2 uppercase">BỘ SƯU TẬP MỚI</h3>
            <div className="h-1 w-12 bg-secondary"></div>
          </div>
          <p
            onClick={() => router.push('/product')}
            className="font-tech text-[10px] text-on-surface-variant mb-1 cursor-pointer hover:text-secondary transition-colors"
          >
            XEM TẤT CẢ ({products.length})
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex overflow-x-auto gap-5 px-5 pb-8 no-scrollbar snap-x snap-mandatory">
          {products.map(p => (
            <ProductCard key={p.id} product={p} layout="carousel" onClick={() => router.push(`/product/${p.id}`)} />
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-10 lg:px-16 max-w-7xl mx-auto pb-8">
          {products.map(p => (
            <ProductCard key={p.id} product={p} layout="carousel" onClick={() => router.push(`/product/${p.id}`)} />
          ))}
        </div>
      </section>

      {/* Editorial / Tuyên Ngôn Section */}
      <section className="bg-surface-container-low py-20 px-5 md:px-10 lg:px-16 relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-tech text-[10px] text-secondary uppercase tracking-[0.3em] block mb-8"
          >
            TUYÊN NGÔN 001
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-on-background mb-10 leading-[0.9] italic uppercase"
          >
            VAULT KHÔNG RA ĐỜI ĐỂ CHẠY THEO XU HƯỚNG.
          </motion.h3>

          <div className="relative mb-12">
            <motion.img
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="w-full aspect-video object-cover rounded-sm grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfse9L-5b11PeUMQYO0iceL6_xXa-8r4Eu81WiEvIHiOT-N0xqOrRSR_6_R3Z0WX9GDUfUU5tLhhlqOqyQqBWOByFuVmb88h2yctDmRscUNxthU5maHeaaSuR7d8eA1mS50Z9X0HnOkLBrK8OlwCAy4_vdIZA8AZrxvjgQgXzfNdi0JWcb3sAbpn0itMZI55rXKtRhwxTLexUYksH19wb4jWxRXS8EmtJUucEesh1ol8hrKpLm2QPAs1NMdLjr5h8UxRPNWtC0cW6e"
              alt="Vault Editorial"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 backdrop-blur-3xl rounded-full pointer-events-none"></div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-base md:text-lg text-on-surface-variant mb-6 leading-relaxed"
          >
            <span className="text-5xl font-display mr-3 float-left leading-none">C</span>
            húng tôi tạo ra những bộ trang phục đóng vai trò như lớp giáp cho những người khám phá đô thị hiện đại. Mỗi đường kim mũi chỉ là một quyết định có tính toán, mỗi phom dáng là một tuyên bố về ý chí. Vault là một không gian được tuyển chọn, nơi sự đổi mới dệt may công nghệ cao gặp gỡ năng lượng thô sơ của đường phố.
          </motion.p>

          <div className="flex justify-end">
            <button
              onClick={() => router.push('/profile')}
              className="font-tech text-xs text-on-background uppercase border-b-2 border-secondary pb-1 tracking-tighter hover:text-secondary transition-colors"
            >
              Đọc Về Triết Lý
            </button>
          </div>
        </div>
      </section>

      {/* Sizing Section */}
      <section className="py-16 px-5 md:px-10 lg:px-16 bg-background">
        <div className="max-w-2xl mx-auto glass-card p-8 md:p-12 rounded-3xl border border-secondary/10 flex flex-col items-center text-center holographic-sweep">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
            <Ruler size={32} className="text-secondary" />
          </div>
          <h3 className="font-display text-4xl md:text-5xl text-on-surface mb-4 uppercase">VAULT SIZING ENGINE 2026</h3>
          <p className="font-body text-sm text-on-surface-variant mb-8 max-w-xs md:max-w-sm">
            Hệ thống gợi ý kích cỡ dựa trên phản hồi thực tế. Thuật toán của chúng tôi so sánh chi tiết thông số để tìm ra độ vừa vặn hoàn hảo nhất.
          </p>
          <div className="w-full max-w-sm aspect-2/1 bg-surface-container rounded-2xl flex items-center justify-center relative overflow-hidden mb-8">
            <div className="absolute inset-0 flex items-center justify-around opacity-20">
              {[1, 2, 3].map(i => <div key={i} className="h-24 w-0.5 bg-secondary"></div>)}
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-tech text-[10px] text-secondary uppercase tracking-widest">Đang Phân Tích Thông Số...</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.5s]"></div>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/review')}
            className="chrome-effect w-full max-w-sm py-4 rounded-xl font-tech text-xs text-on-surface uppercase tracking-widest font-bold hover:shadow-lg transition-shadow"
          >
            Tìm Size Của Bạn
          </button>
        </div>
      </section>

      {/* CLB Vault - Membership Section */}
      <section className="py-20 px-5 md:px-10 lg:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="font-display text-4xl md:text-5xl text-on-surface uppercase mb-2">CÂU LẠC BỘ VAULT</h3>
            <div className="h-1 w-12 bg-secondary"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ELITE Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-on-surface p-8 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-secondary/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <span className="font-tech text-[10px] text-secondary tracking-[0.5em] uppercase">ELITE</span>
                  <Star size={20} className="text-white" />
                </div>
                <div className="mb-8">
                  <p className="font-body text-sm text-surface-dim opacity-70 mb-3">Trạng Thái Thành Viên</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-3/4 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <h4 className="font-display text-[40px] text-white leading-none">CẤP ĐỘ 03</h4>
                  <button className="glass-card text-white px-4 py-2 rounded-full font-tech text-[10px] uppercase hover:bg-white/20 transition-colors">
                    Chi Tiết
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/20 blur-3xl rounded-full pointer-events-none"></div>
            </motion.div>

            {/* CORE Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-surface-container p-8 rounded-3xl border border-outline-variant relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <span className="font-tech text-[10px] text-on-surface-variant tracking-[0.5em] uppercase">CORE</span>
                  <Lock size={20} className="text-on-surface-variant" />
                </div>
                <p className="font-body text-sm text-on-surface-variant mb-8 leading-relaxed">
                  Mở khóa các sản phẩm độc quyền và tích lũy <span className="text-secondary font-bold">&apos;Vault Credits&apos;</span> qua mỗi đơn hàng. Ưu tiên truy cập các bộ sưu tập giới hạn trước khi ra mắt.
                </p>
                <button
                  onClick={() => router.push('/profile')}
                  className="bg-on-surface text-white w-full py-4 rounded-xl font-tech text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Gia Nhập Hội
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lookbook SS.24 Section */}
      <section className="py-20">
        <div className="px-5 md:px-10 lg:px-16 max-w-7xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display text-5xl md:text-6xl lg:text-7xl text-on-background uppercase leading-none">
              LOOKBOOK<br />SS.24
            </h3>
          </motion.div>
        </div>

        {/* Mobile: staggered 2-col grid */}
        <div className="md:hidden grid grid-cols-2 gap-2 px-2">
          <div className="col-span-1 space-y-2">
            <div className="aspect-4/5 overflow-hidden rounded-sm">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={lookbookImages[0].img}
                alt="Lookbook 1"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-sm">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={lookbookImages[1].img}
                alt="Lookbook 2"
              />
            </div>
          </div>
          <div className="col-span-1 pt-8">
            <div className="aspect-2/3 overflow-hidden rounded-sm">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={lookbookImages[2].img}
                alt="Lookbook 3"
              />
            </div>
          </div>
        </div>

        {/* Desktop: 3-col masonry-style */}
        <div className="hidden md:grid grid-cols-3 gap-3 px-10 lg:px-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="aspect-4/5 overflow-hidden rounded-sm">
              <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src={lookbookImages[0].img} alt="Lookbook 1" />
            </div>
            <div className="aspect-square overflow-hidden rounded-sm">
              <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src={lookbookImages[1].img} alt="Lookbook 2" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="pt-12"
          >
            <div className="aspect-2/3 overflow-hidden rounded-sm">
              <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src={lookbookImages[2].img} alt="Lookbook 3" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3 pt-6"
          >
            <div className="aspect-square overflow-hidden rounded-sm">
              <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src={lookbookImages[1].img} alt="Lookbook 4" />
            </div>
            <div className="aspect-4/5 overflow-hidden rounded-sm">
              <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src={lookbookImages[0].img} alt="Lookbook 5" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Văn Hóa Vault - Community UGC Section */}
      <section id="van-hoa-vault" className="py-20 bg-surface-container-highest/30 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-5 md:px-10 lg:px-16 text-center mb-10"
        >
          <h3 className="font-display text-4xl md:text-5xl text-on-background uppercase mb-2">VĂN HÓA VAULT</h3>
          <p className="font-body text-sm text-on-surface-variant italic">#VaultOnTheStreets</p>
        </motion.div>

        {/* Horizontal scroll feed */}
        <div className="flex overflow-x-auto gap-2 px-2 pb-10 no-scrollbar snap-x snap-mandatory">
          {communityPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="min-w-40 md:min-w-50 aspect-9/16 bg-surface rounded-lg overflow-hidden relative group snap-center shrink-0"
            >
              <img
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                src={post.img}
                alt={`Community post ${post.id}`}
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <Heart size={12} className="text-white fill-white" />
                <span className="text-white text-[10px] font-bold">{post.likes}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-5 md:px-10 lg:px-16 max-w-lg mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 border-2 border-on-surface font-tech text-xs uppercase tracking-widest hover:bg-on-surface hover:text-white transition-colors flex items-center justify-center gap-3"
          >
            <Users size={16} />
            Gia Nhập Cộng Đồng
          </motion.button>
        </div>
      </section>

    </div>
  );
}
