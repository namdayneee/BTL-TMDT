import { formatVND } from './utils';

export type ApiProductVariant = {
  id: number;
  productId: number;
  size: string;
  stock: number;
};

export type ApiReview = {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  content: string;
  height: number | null;
  weight: number | null;
  fitFeeling: string | null;
  purchasedSize: string | null;
  createdAt: string;
};

export type UserProfile = {
  id?: number;
  userId?: number;
  fullName?: string | null;
  phone?: string | null;
  address?: string | null;
  height?: number | null;
  weight?: number | null;
  fitPreference?: string | null;
};

export type SizingRecommendation = {
  method: 'collaborative' | 'rule_based' | 'none';
  recommendedSize: string | null;
  confidence: number | null;
  distribution: Record<string, number> | null;
  sampleCount: number;
  message: string;
};

export type PromoValidation = {
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  discountAmount: number;
  message: string;
};

export type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail: string | null;
  createdAt: string;
  variants: ApiProductVariant[];
  reviews?: ApiReview[];
};

export type ApiVariant = {
  id: number;
  productId: number;
  size: string;
  stock: number;
  product: ApiProduct;
};

export type ApiCartItem = {
  id: number;
  cartId: number;
  variantId: number;
  quantity: number;
};

export type ApiCart = {
  id: number;
  userId: number;
  createdAt: string;
  items: ApiCartItem[];
} | null;

export type EnrichedCartItem = {
  id: number;
  variantId: number;
  quantity: number;
  size: string;
  name: string;
  price: number;
  img: string;
  stock: number;
};

export type ApiOrderItem = {
  id: number;
  orderId: number;
  variantId: number;
  quantity: number;
  price: number;
};

export type ApiOrder = {
  id: number;
  userId: number;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  paymentMethod: string | null;
  paymentStatus: string;
  promoCode: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  items: ApiOrderItem[];
};

export type DisplayProduct = {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceNum: number;
  img: string;
  badges: string[];
  inStock: boolean;
  variants: ApiProductVariant[];
};

export function mapApiProduct(p: ApiProduct): DisplayProduct {
  const inStock = p.variants.some((v) => v.stock > 0);
  const isNew =
    Date.now() - new Date(p.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

  return {
    id: String(p.id),
    name: p.name,
    desc: p.description,
    price: formatVND(p.price),
    priceNum: p.price,
    img: p.thumbnail || '/images/products/pro1.png',
    badges: isNew ? ['MỚI'] : [],
    inStock,
    variants: p.variants,
  };
}
