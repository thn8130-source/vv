export type OrderStatus = 'pending' | 'processing' | 'delivering' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'COD' | 'Momo' | 'Banking' | 'CreditCard';
  status: OrderStatus;
  createdAt: string;
  deliveryTime?: string;
  shipperName?: string;
  shipperPhone?: string;
  note?: string;
  appliedVoucherCode?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g., 15 for 15% or 50000 for 50,000 VND
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usedCount: number;
  totalLimit: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number; // 1-5
  date: string;
  productName: string;
  orderId?: string;
  comment: string;
  likes: number;
  isVerifiedPurchase: boolean;
  reply?: {
    author: string;
    comment: string;
    date: string;
  };
}

export interface RevenueDaily {
  date: string;
  dayName: string;
  revenue: number;
  ordersCount: number;
}

export interface BannerConfig {
  tagline: string;
  title: string;
  highlightText: string;
  subtitle: string;
  ctaText: string;
  voucherCode: string;
  discountBadge: string;
  deliveryPromise: string;
  pinkTone: 'hot-pink' | 'rose-blush' | 'sakura';
}
