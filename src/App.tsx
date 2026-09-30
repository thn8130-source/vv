/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Order, 
  OrderStatus, 
  Voucher, 
  Review, 
  RevenueDaily, 
  BannerConfig 
} from './types';
import { 
  INITIAL_BANNER_CONFIG, 
  INITIAL_ORDERS, 
  INITIAL_VOUCHERS, 
  INITIAL_REVIEWS, 
  INITIAL_DAILY_REVENUE 
} from './data/mockData';
import { Header } from './components/Header';
import { SalesBannerSection } from './components/SalesBannerSection';
import { OrdersSection } from './components/OrdersSection';
import { RevenueSection } from './components/RevenueSection';
import { VouchersSection } from './components/VouchersSection';
import { ReviewsSection } from './components/ReviewsSection';
import { NewOrderModal } from './components/NewOrderModal';
import { Toast } from './components/Toast';
import { Package, Heart, Phone, MapPin, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'banner' | 'orders' | 'revenue' | 'vouchers' | 'reviews'>('banner');

  // Persistence with localStorage
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(() => {
    const saved = localStorage.getItem('orderly_banner');
    return saved ? JSON.parse(saved) : INITIAL_BANNER_CONFIG;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orderly_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('orderly_vouchers');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('orderly_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [dailyRevenue, setDailyRevenue] = useState<RevenueDaily[]>(() => {
    const saved = localStorage.getItem('orderly_daily_revenue');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_REVENUE;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('orderly_banner', JSON.stringify(bannerConfig));
  }, [bannerConfig]);

  useEffect(() => {
    localStorage.setItem('orderly_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('orderly_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('orderly_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('orderly_daily_revenue', JSON.stringify(dailyRevenue));
  }, [dailyRevenue]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = { ...order, status: newStatus };
          if (newStatus === 'completed' && !order.deliveryTime) {
            const now = new Date();
            updated.deliveryTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            // Add revenue to today's stats if completed
            setDailyRevenue((revPrev) => {
              const lastIdx = revPrev.length - 1;
              if (lastIdx >= 0) {
                const updatedList = [...revPrev];
                updatedList[lastIdx] = {
                  ...updatedList[lastIdx],
                  revenue: updatedList[lastIdx].revenue + order.total,
                  ordersCount: updatedList[lastIdx].ordersCount + 1,
                };
                return updatedList;
              }
              return revPrev;
            });
          }
          return updated;
        }
        return order;
      })
    );

    const statusNames: Record<OrderStatus, string> = {
      pending: 'Chờ xác nhận',
      processing: 'Đang chuẩn bị hàng',
      delivering: 'Bàn giao Shipper đi giao',
      completed: 'Hoàn thành giao hàng',
      cancelled: 'Đã hủy đơn',
    };

    showToast(`Đơn hàng #${orderId} đã chuyển sang: ${statusNames[newStatus]}`);
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Update voucher usage if applied
    if (newOrder.appliedVoucherCode) {
      setVouchers((prev) =>
        prev.map((v) =>
          v.code === newOrder.appliedVoucherCode
            ? { ...v, usedCount: v.usedCount + 1 }
            : v
        )
      );
    }

    showToast(`Tạo thành công đơn hàng #${newOrder.id} cho ${newOrder.customerName}!`);
  };

  const handleAddVoucher = (newVoucher: Voucher) => {
    setVouchers((prev) => [newVoucher, ...prev]);
    showToast(`Đã phát hành thành công mã voucher: ${newVoucher.code}!`);
  };

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    showToast('Cảm ơn bạn! Đánh giá đã được ghi nhận thành công.');
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r))
    );
    showToast('Cảm ơn bạn đã bình chọn đánh giá hữu ích!');
  };

  const handleApplyVoucherToOrder = (code: string) => {
    showToast(`Đã chọn mã ${code}, hãy nhập thông tin người nhận đơn!`);
    setIsNewOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-rose-50/30">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        {activeTab === 'banner' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            <SalesBannerSection
              bannerConfig={bannerConfig}
              setBannerConfig={setBannerConfig}
              onNavigateToOrders={() => setActiveTab('orders')}
              onNavigateToVouchers={() => setActiveTab('vouchers')}
              onShowToast={showToast}
            />

            {/* Quick Live Preview of Store Order & Vouchers within Banner View */}
            <div className="pt-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <span>Hệ Thống Đơn Hàng Đang Xử Lý Gần Đây</span>
                  </h3>
                  <p className="text-xs text-slate-500">Các đơn hàng mới nhất đang được shipper Orderly giao</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                >
                  Xem tất cả {orders.length} đơn →
                </button>
              </div>

              {/* Render recent 3 orders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setActiveTab('orders')}
                    className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs hover:border-pink-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-bold text-pink-600 text-xs">#{order.id}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                        {order.status === 'delivering' ? 'Đang giao' : order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs group-hover:text-pink-600 transition-colors">
                      {order.customerName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{order.customerAddress}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{order.createdAt}</span>
                      <span className="font-mono font-bold text-slate-900">{order.total.toLocaleString()}₫</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Management Section */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-200">
            <OrdersSection
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
            />
          </div>
        )}

        {/* Total Revenue & Analytics Section */}
        {activeTab === 'revenue' && (
          <div className="animate-in fade-in duration-200">
            <RevenueSection
              dailyRevenue={dailyRevenue}
              totalOrdersCount={orders.length}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* Vouchers Section */}
        {activeTab === 'vouchers' && (
          <div className="animate-in fade-in duration-200">
            <VouchersSection
              vouchers={vouchers}
              onAddVoucher={handleAddVoucher}
              onApplyVoucherToOrder={handleApplyVoucherToOrder}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in duration-200">
            <ReviewsSection
              reviews={reviews}
              onAddReview={handleAddReview}
              onLikeReview={handleLikeReview}
              onShowToast={showToast}
            />
          </div>
        )}
      </main>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onAddOrder={handleAddOrder}
        vouchers={vouchers}
        onShowToast={showToast}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Clean Footer */}
      <footer className="mt-16 bg-white border-t border-pink-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white">
              <Package className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight font-['Syne',sans-serif]">Orderly</span>
            <span>· Nền Tảng Giao Vận & Bán Hàng Màu Hồng Thông Minh</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-pink-500" />
              Hotline: 1900 6868
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-pink-500" />
              HN & TP. Hồ Chí Minh
            </span>
            <span>·</span>
            <span>Giao siêu tốc 30 phút</span>
          </div>

          <p className="text-slate-400">
            © 2026 Orderly. Giao tận tay, đồng kiểm khi nhận hàng.
          </p>
        </div>
      </footer>
    </div>
  );
}
