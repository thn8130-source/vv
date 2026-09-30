import React from 'react';
import { Package, Plus, Sparkles, Tag, TrendingUp, MessageSquareQuote, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  activeTab: 'banner' | 'orders' | 'revenue' | 'vouchers' | 'reviews';
  setActiveTab: (tab: 'banner' | 'orders' | 'revenue' | 'vouchers' | 'reviews') => void;
  ordersCount: number;
  onOpenNewOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  onOpenNewOrder,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element Brand wordmark with pink icon */}
          <button
            onClick={() => setActiveTab('banner')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 bg-clip-text text-transparent font-['Syne',sans-serif]">
                Orderly
              </span>
              <span className="text-[10px] font-medium tracking-wide text-pink-400 uppercase -mt-1">
                Giao Hàng Siêu Tốc
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('banner')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'banner'
                  ? 'bg-pink-50 text-pink-700 font-semibold'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Banner Bán Hàng</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-pink-50 text-pink-700 font-semibold'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-pink-500" />
              <span>Đơn Hàng</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-mono font-bold">
                {ordersCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'revenue'
                  ? 'bg-pink-50 text-pink-700 font-semibold'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-pink-500" />
              <span>Tổng Thu Nhập</span>
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'vouchers'
                  ? 'bg-pink-50 text-pink-700 font-semibold'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <Tag className="w-4 h-4 text-pink-500" />
              <span>Voucher Giảm Giá</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-pink-50 text-pink-700 font-semibold'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4 text-pink-500" />
              <span>Đánh Giá</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-lg shadow-sm shadow-pink-500/25 transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer hover:shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tạo Đơn Hàng</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-pink-100 scrollbar-none gap-1">
          <button
            onClick={() => setActiveTab('banner')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'banner' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600'
            }`}
          >
            Banner
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600'
            }`}
          >
            Đơn Hàng ({ordersCount})
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'revenue' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600'
            }`}
          >
            Thu Nhập
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'vouchers' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600'
            }`}
          >
            Voucher
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'reviews' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600'
            }`}
          >
            Đánh Giá
          </button>
        </div>
      </div>
    </header>
  );
};
