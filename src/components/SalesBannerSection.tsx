import React, { useState } from 'react';
import { 
  Package, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Copy, 
  Check, 
  Sliders, 
  ArrowRight, 
  RotateCcw,
  Zap,
  Gift
} from 'lucide-react';
import { BannerConfig } from '../types';

interface SalesBannerSectionProps {
  bannerConfig: BannerConfig;
  setBannerConfig: React.Dispatch<React.SetStateAction<BannerConfig>>;
  onNavigateToOrders: () => void;
  onNavigateToVouchers: () => void;
  onShowToast: (message: string) => void;
}

export const SalesBannerSection: React.FC<SalesBannerSectionProps> = ({
  bannerConfig,
  setBannerConfig,
  onNavigateToOrders,
  onNavigateToVouchers,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bannerConfig.voucherCode);
    setCopied(true);
    onShowToast(`Đã sao chép mã ưu đãi ${bannerConfig.voucherCode}!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeBackground = () => {
    switch (bannerConfig.pinkTone) {
      case 'hot-pink':
        return 'from-pink-600 via-rose-500 to-fuchsia-600 text-white';
      case 'sakura':
        return 'from-rose-100 via-pink-100 to-rose-200 text-slate-800';
      case 'rose-blush':
      default:
        return 'from-rose-500 via-pink-500 to-rose-600 text-white';
    }
  };

  const isLightMode = bannerConfig.pinkTone === 'sakura';

  return (
    <section className="space-y-6">
      {/* Main Pink Sales Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getThemeBackground()} shadow-xl shadow-pink-500/15 border border-pink-200/40 transition-all duration-300`}>
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-pink-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
          {/* Left Column: Slogan, Pink Logo, Promotional Badges & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Lockup with Pink Logo & Tagline */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Pink Logo Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-pink-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white">
                  <Package className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="font-extrabold text-sm tracking-tight text-pink-600 font-['Syne',sans-serif]">
                  Orderly
                </span>
                <span className="text-slate-300 text-xs">|</span>
                <span className="text-xs font-semibold text-rose-500">Official Store</span>
              </div>

              {/* Tagline */}
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full ${
                isLightMode ? 'bg-pink-200/80 text-pink-800' : 'bg-white/20 text-white backdrop-blur-xs'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{bannerConfig.tagline}</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {bannerConfig.title}{' '}
                <span className={`block mt-1 sm:inline sm:mt-0 font-extrabold ${
                  isLightMode
                    ? 'text-pink-600 drop-shadow-xs'
                    : 'text-yellow-300 drop-shadow-xs'
                }`}>
                  {bannerConfig.highlightText}
                </span>
              </h1>
              <p className={`text-base sm:text-lg max-w-xl font-normal leading-relaxed ${
                isLightMode ? 'text-slate-700' : 'text-pink-50'
              }`}>
                {bannerConfig.subtitle}
              </p>
            </div>

            {/* Interactive Voucher Code Box */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-white/95 text-slate-800 px-4 py-2.5 rounded-xl shadow-md border border-pink-200">
                <Gift className="w-4 h-4 text-pink-500 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-500 block">Mã giảm giá đơn hàng:</span>
                  <span className="font-mono font-extrabold text-pink-600 text-base tracking-wider">
                    {bannerConfig.voucherCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="ml-2 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sao chép mã"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              {/* Delivery Guarantee Pill */}
              <div className={`hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                isLightMode ? 'bg-pink-200/60 text-pink-900' : 'bg-black/15 text-pink-100 backdrop-blur-xs'
              }`}>
                <ShieldCheck className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>{bannerConfig.deliveryPromise}</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToOrders}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-white text-pink-600 hover:bg-pink-50 shadow-md shadow-black/10 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>Xem & Đặt Đơn Hàng</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateToVouchers}
                className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isLightMode
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
                }`}
              >
                <span>Kho Voucher</span>
              </button>

              <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className={`p-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isLightMode
                    ? 'bg-pink-200/70 text-pink-900 hover:bg-pink-200'
                    : 'bg-black/20 text-white hover:bg-black/30'
                }`}
                title="Tùy biến nội dung Banner"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Tùy Biến Banner</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Courier & Packages Delivery Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Courier Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-pink-100 group">
                <img
                  src="/src/assets/images/orderly_courier_hero_1790735593195.jpg"
                  alt="Người giao hàng Orderly và đơn hàng màu hồng"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge overlay on image */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-pink-100 flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                  </span>
                  <span className="text-xs font-bold text-pink-700">Shipper Orderly Đang Giao</span>
                </div>

                {/* Secondary Mini Float Card: Electric Delivery Bike */}
                <div className="absolute -bottom-2 right-2 bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-pink-100 flex items-center gap-2.5 max-w-[200px]">
                  <img
                    src="/src/assets/images/orderly_delivery_bike_1790735606229.jpg"
                    alt="Phương tiện giao hàng Orderly"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-pink-200 shrink-0"
                  />
                  <div className="text-[11px] leading-tight text-slate-800">
                    <span className="font-bold text-pink-600 block">30 Phút</span>
                    <span className="text-slate-500 text-[10px]">Giao hỏa tốc nội thành</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Banner Customizer Panel (Drawer toggle) */}
      {showCustomizer && (
        <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-sm transition-all duration-200 space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-slate-900 text-base">Trình Tùy Biến Banner Bán Hàng Orderly</h3>
            </div>
            <button
              onClick={() => {
                setBannerConfig({
                  tagline: 'ƯU ĐÃI ĐỘC QUYỀN HÔM NAY',
                  title: 'Giao Hàng Siêu Tốc Trong 30 Phút',
                  highlightText: 'Giảm Đến 50%',
                  subtitle: 'Hệ thống vận hành đơn hàng thông minh Orderly - Giao tận tay, đồng kiểm khi nhận hàng!',
                  ctaText: 'Khám Phá Ưu Đãi Ngay',
                  voucherCode: 'ORDERLYPINK',
                  discountBadge: 'VOUCHER -50.000₫',
                  deliveryPromise: 'Cam kết giao đúng hẹn hoặc hoàn 100% phí ship',
                  pinkTone: 'rose-blush',
                });
                onShowToast('Đã khôi phục cài đặt banner mặc định');
              }}
              className="text-xs text-slate-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tông màu hồng chủ đạo
              </label>
              <select
                value={bannerConfig.pinkTone}
                onChange={(e) => setBannerConfig({ ...bannerConfig, pinkTone: e.target.value as any })}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden bg-pink-50/30"
              >
                <option value="rose-blush">Hồng Đào Quý Phái (Rose Blush)</option>
                <option value="hot-pink">Hồng Đậm Rực Rỡ (Hot Pink Neon)</option>
                <option value="sakura">Hồng Pastel Sakura (Nhẹ Nhàng)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tiêu đề Banner
              </label>
              <input
                type="text"
                value={bannerConfig.title}
                onChange={(e) => setBannerConfig({ ...bannerConfig, title: e.target.value })}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
                placeholder="VD: Giao Hàng Siêu Tốc Trong 30 Phút"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Điểm nhấn khuyến mãi
              </label>
              <input
                type="text"
                value={bannerConfig.highlightText}
                onChange={(e) => setBannerConfig({ ...bannerConfig, highlightText: e.target.value })}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden font-bold text-pink-600"
                placeholder="VD: Giảm Đến 50%"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Mã Voucher hiển thị trên Banner
              </label>
              <input
                type="text"
                value={bannerConfig.voucherCode}
                onChange={(e) => setBannerConfig({ ...bannerConfig, voucherCode: e.target.value.toUpperCase() })}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden font-mono font-bold text-pink-600 uppercase"
                placeholder="VD: ORDERLYPINK"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Khẩu hiệu phụ (Tagline)
              </label>
              <input
                type="text"
                value={bannerConfig.tagline}
                onChange={(e) => setBannerConfig({ ...bannerConfig, tagline: e.target.value })}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
                placeholder="VD: ƯU ĐÃI ĐỘC QUYỀN HÔM NAY"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Cam kết giao hàng
              </label>
              <input
                type="text"
                value={bannerConfig.deliveryPromise}
                onChange={(e) => setBannerConfig({ ...bannerConfig, deliveryPromise: e.target.value })}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
                placeholder="VD: Cam kết giao đúng hẹn"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4 Feature Value Pillars of Orderly */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Giao Tốc Hành 30'</h4>
            <p className="text-[11px] text-slate-500">Nội thành HN & TP.HCM</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Đồng Kiểm Khi Nhận</h4>
            <p className="text-[11px] text-slate-500">Mở hộp kiểm tra trước</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Freeship Đơn Từ 200k</h4>
            <p className="text-[11px] text-slate-500">Tài trợ vận chuyển Orderly</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Chuẩn Giờ 100%</h4>
            <p className="text-[11px] text-slate-500">Đền bù 50k nếu giao trễ</p>
          </div>
        </div>
      </div>
    </section>
  );
};
