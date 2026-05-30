'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../components/Header';
import { ShoppingCart, CheckCircle, Ruler, Info, QrCode, Zap, X, Loader2 } from 'lucide-react';
import { ProductRatingBadge } from '../../components/ProductReviewsSection';
import { fetchProductById, fetchProducts } from '../../lib/product-api';
import { fetchProductReviews } from '../../lib/review-api';
import { mapApiProduct, type DisplayProduct, type ApiProductVariant, type ApiReview, type SizingRecommendation } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { getStoredToken } from '../../lib/auth-client';
import { recommendSize } from '../../lib/sizing-api';
import { updateMyProfile } from '../../lib/profile-api';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

function sortVariantsBySize(variants: ApiProductVariant[]) {
  return [...variants].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.size.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.size.toUpperCase());
    if (ai === -1 && bi === -1) return a.size.localeCompare(b.size);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

const FIT_OPTIONS = [
  { value: 'snug', label: 'Ôm sát', desc: 'Muốn áo bó vừa form' },
  { value: 'regular', label: 'Vừa vặn', desc: 'Form chuẩn, thoải mái' },
  { value: 'loose', label: 'Rộng rãi', desc: 'Phong cách Oversize' },
];

function SizingModal({
  productId,
  onClose,
  onSelectSize,
}: {
  productId: string;
  onClose: () => void;
  onSelectSize: (size: string) => void;
}) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fit, setFit] = useState('regular');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SizingRecommendation | null>(null);
  const [error, setError] = useState('');

  const handleRecommend = async () => {
    if (!height || !weight) { setError('Vui lòng nhập chiều cao và cân nặng'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const rec = await recommendSize({
        height: Number(height),
        weight: Number(weight),
        fitPreference: fit,
        productId,
      });
      setResult(rec);
      // Lưu số đo vào profile nếu đã đăng nhập
      if (getStoredToken()) {
        void updateMyProfile({ height: Number(height), weight: Number(weight), fitPreference: fit }).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gợi ý lúc này');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="chrome-effect w-8 h-8 rounded-lg flex items-center justify-center">
              <Ruler size={16} className="text-secondary" />
            </div>
            <h2 className="font-tech text-sm font-bold uppercase tracking-tight">Vault Sizing Engine</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all">
            <X size={16} />
          </button>
        </div>

        {!result ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1.5">Chiều cao (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm outline-none focus:border-secondary transition-all text-center"
                />
              </div>
              <div>
                <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1.5">Cân nặng (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="65"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm outline-none focus:border-secondary transition-all text-center"
                />
              </div>
            </div>

            <div>
              <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Cảm giác mặc mong muốn</label>
              <div className="grid grid-cols-3 gap-2">
                {FIT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFit(f.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${fit === f.value ? 'border-secondary bg-secondary/5' : 'border-outline-variant/20 hover:border-secondary/40'}`}
                  >
                    <p className={`font-tech text-[10px] font-bold uppercase ${fit === f.value ? 'text-secondary' : 'text-on-surface'}`}>{f.label}</p>
                    <p className="font-body text-[9px] text-on-surface-variant mt-0.5">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="font-tech text-[10px] text-red-500 text-center uppercase tracking-widest">{error}</p>}

            <button
              onClick={() => void handleRecommend()}
              disabled={loading}
              className="w-full h-12 vault-btn-primary rounded-full font-tech text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Ruler size={16} />}
              {loading ? 'Đang phân tích...' : 'Tìm size của tôi'}
            </button>

            <p className="font-tech text-[9px] text-on-surface-variant/50 text-center uppercase tracking-widest">
              Dựa trên dữ liệu từ cộng đồng khách hàng Vault
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Gợi ý của chúng tôi</p>
              {result.recommendedSize ? (
                <>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary/10 border-2 border-secondary flex items-center justify-center mb-3">
                    <span className="font-display text-4xl text-secondary font-bold">{result.recommendedSize}</span>
                  </div>
                  <p className="font-body text-sm text-on-surface leading-relaxed">{result.message}</p>
                  {result.method === 'collaborative' && result.confidence !== null && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <CheckCircle size={14} className="text-secondary" />
                      <span className="font-tech text-[10px] text-secondary uppercase">
                        Phân tích từ {result.sampleCount} khách tương đồng
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="font-body text-sm text-on-surface-variant">{result.message}</p>
              )}
            </div>

            {result.distribution && (
              <div className="space-y-2">
                <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest text-center">Phân bố size của nhóm tương đồng</p>
                {Object.entries(result.distribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([size, pct]) => (
                    <div key={size} className="flex items-center gap-3">
                      <span className="font-tech text-xs font-bold w-8 text-right text-on-surface">{size}</span>
                      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all"
                          style={{ width: `${Math.round(pct * 100)}%` }}
                        />
                      </div>
                      <span className="font-tech text-[10px] text-on-surface-variant w-8">{Math.round(pct * 100)}%</span>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 h-11 border border-outline-variant rounded-full font-tech text-[10px] uppercase tracking-widest hover:border-secondary transition-all"
              >
                Thử lại
              </button>
              {result.recommendedSize && (
                <button
                  onClick={() => { onSelectSize(result.recommendedSize!); onClose(); }}
                  className="flex-1 h-11 vault-btn-primary rounded-full font-tech text-[10px] uppercase tracking-widest"
                >
                  Chọn size {result.recommendedSize}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const [product, setProduct] = useState<DisplayProduct | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [related, setRelated] = useState<DisplayProduct[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSizingModal, setShowSizingModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCart();

  const productId = params.id as string;

  const sortedVariants = useMemo(
    () => (product ? sortVariantsBySize(product.variants) : []),
    [product]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detail, all] = await Promise.all([
          fetchProductById(productId),
          fetchProducts(),
        ]);
        if (!detail) { setError('Không tìm thấy sản phẩm'); return; }
        const mapped = mapApiProduct(detail);
        const variants = sortVariantsBySize(mapped.variants);
        setProduct({ ...mapped, variants });
        setSelectedSize(variants.find((v) => v.stock > 0)?.size || variants[0]?.size || '');
        setRelated(all.filter((p) => String(p.id) !== productId).map(mapApiProduct).slice(0, 4));

        if (detail.reviews?.length) {
          setReviews(detail.reviews);
        } else {
          try {
            const productReviews = await fetchProductReviews(Number(productId));
            setReviews(productReviews);
          } catch {
            setReviews([]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [productId]);

  const selectedVariant = sortedVariants.find((v) => v.size === selectedSize);
  const outOfStock = !product?.inStock || !selectedVariant || selectedVariant.stock <= 0;

  const requireAuth = () => {
    const token = getStoredToken();
    if (!token) { router.push(`/login?redirect=/product/${productId}`); return false; }
    return true;
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant || selectedVariant.stock <= 0) return;
    if (!requireAuth()) return;
    setAdding(true);
    try {
      await addItem(selectedVariant.id, 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể thêm vào giỏ');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant || selectedVariant.stock <= 0) return;
    if (!requireAuth()) return;
    setBuying(true);
    router.push(
      `/checkout?buyNow=1&variantId=${selectedVariant.id}&quantity=1&productId=${productId}`
    );
    setBuying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-tech text-sm text-on-surface-variant">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 px-5 text-center">
          <p className="font-display text-3xl uppercase text-on-surface-variant mb-6">{error || 'Không tìm thấy sản phẩm'}</p>
          <button onClick={() => router.push('/product')} className="font-tech text-xs text-secondary uppercase tracking-widest border-b border-secondary">
            Quay lại danh sách
          </button>
        </main>
      </div>
    );
  }

  const actionButtons = (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => void handleAddToCart()}
          disabled={outOfStock || adding || buying}
          className="flex-1 h-14 border-2 border-secondary text-secondary bg-white rounded-full flex items-center justify-center gap-2 font-tech text-xs font-bold uppercase tracking-[0.15em] hover:bg-secondary/5 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <ShoppingCart size={18} />
          {adding ? 'ĐANG THÊM...' : 'THÊM VÀO GIỎ HÀNG'}
        </button>
        <button
          onClick={() => void handleBuyNow()}
          disabled={outOfStock || adding || buying}
          className="flex-1 h-14 vault-btn-primary rounded-full flex items-center justify-center gap-2 font-tech text-xs font-bold uppercase tracking-[0.15em] active:scale-[0.98] transition-all holographic-sweep disabled:opacity-50"
        >
          <Zap size={18} />
          {buying ? 'ĐANG XỬ LÝ...' : 'MUA NGAY'}
        </button>
      </div>
      {outOfStock && (
        <p className="font-tech text-[10px] text-tertiary uppercase tracking-widest text-center">Hết hàng</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />

      {showSizingModal && (
        <SizingModal
          productId={productId}
          onClose={() => setShowSizingModal(false)}
          onSelectSize={(size) => {
            const v = sortedVariants.find((v) => v.size === size && v.stock > 0);
            if (v) setSelectedSize(size);
          }}
        />
      )}

      <main className="pt-24 max-w-6xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-10 xl:gap-14 items-start">
          {/* Ảnh */}
          <section className="relative w-full max-w-sm mx-auto lg:max-w-none">
            <div className="aspect-4/5 rounded-2xl overflow-hidden bg-surface-container-low">
              <img className="w-full h-full object-cover" src={product.img} alt={product.name} />
            </div>
            <div className="absolute top-3 right-3 glass-card px-3 py-1.5 rounded-full flex items-center gap-2">
              <CheckCircle size={14} className="text-secondary" />
              <span className="font-tech text-[9px] uppercase tracking-widest text-secondary font-bold">Chính hãng</span>
            </div>
          </section>

          {/* Thông tin */}
          <div className="mt-8 lg:mt-0">
            <div className="flex justify-between items-start gap-4 mb-3">
              <h1 className="font-display text-3xl md:text-4xl leading-tight text-on-surface uppercase tracking-tight">{product.name}</h1>
              <span className={`font-tech px-2.5 py-1 rounded text-[10px] font-bold uppercase shrink-0 ${product.inStock ? 'text-secondary bg-secondary/10' : 'text-tertiary bg-tertiary-container'}`}>
                {product.inStock ? 'CÒN HÀNG' : 'HẾT HÀNG'}
              </span>
            </div>

            <p className="font-display text-3xl text-on-surface mb-2">{product.price}</p>
            <div className="mb-6">
              <ProductRatingBadge productId={productId} reviews={reviews} />
            </div>

            {/* Size */}
            <div className="mb-6">
              <h3 className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Kích cỡ</h3>
              <div className="flex flex-wrap gap-2.5">
                {sortedVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedSize(v.size)}
                    disabled={v.stock <= 0}
                    className={`min-w-12 h-11 px-3 border rounded-xl font-tech text-xs transition-all ${selectedSize === v.size ? 'border-2 border-secondary bg-secondary/5 text-secondary font-bold' : 'border-outline-variant text-on-surface'} ${v.stock <= 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
              {selectedVariant && selectedVariant.stock > 0 && (
                <p className="font-tech text-[10px] text-on-surface-variant mt-2 uppercase">Còn {selectedVariant.stock} sản phẩm</p>
              )}
            </div>

            {/* Nút hành động */}
            <div className="mb-6">{actionButtons}</div>

            {/* Sizing Engine CTA */}
            <section className="mb-8">
              <button
                onClick={() => setShowSizingModal(true)}
                className="w-full glass-card p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all group text-left"
              >
                <div className="chrome-effect w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Ruler className="text-secondary" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-tech text-sm font-bold text-on-surface uppercase tracking-tight">VAULT SIZING ENGINE 2026</h3>
                  <p className="font-body text-[11px] text-on-surface-variant mt-0.5">Tìm size chính xác từ dữ liệu cộng đồng. Nhấn để thử →</p>
                </div>
                <Zap size={18} className="text-secondary shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </section>

            <section className="mb-8">
              <h3 className="font-display text-xl uppercase mb-3 flex items-center gap-2">
                Mô tả <Info size={16} className="text-on-surface-variant" />
              </h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{product.desc}</p>
            </section>

            <section className="mb-10">
              <div className="p-5 chrome-effect rounded-2xl border border-white/60 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/50 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <QrCode size={28} className="text-on-surface opacity-30" />
                </div>
                <div>
                  <h4 className="font-tech font-bold text-sm text-on-surface uppercase tracking-tight">Xác nhận chính hãng</h4>
                  <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest">NFC Blockchain Secured</p>
                </div>
              </div>
            </section>

            {related.length > 0 && (
              <section className="pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display text-xl uppercase">Có thể bạn thích</h3>
                  <button onClick={() => router.push('/product')} className="font-tech text-[10px] text-secondary uppercase tracking-widest border-b border-secondary">Xem tất cả</button>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar snap-x">
                  {related.map((p) => (
                    <div key={p.id} onClick={() => router.push(`/product/${p.id}`)} className="shrink-0 w-36 cursor-pointer group snap-start">
                      <div className="aspect-3/4 bg-surface-container-high rounded-xl overflow-hidden mb-2">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <p className="font-tech text-[11px] font-bold text-on-surface uppercase truncate">{p.name}</p>
                      <p className="font-tech text-[11px] text-secondary">{p.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
