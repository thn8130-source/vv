import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Calendar, 
  ShoppingBag, 
  CheckCircle2, 
  PieChart, 
  Download,
  CreditCard,
  Wallet
} from 'lucide-react';
import { RevenueDaily } from '../types';
import { formatVND } from '../utils/format';

interface RevenueSectionProps {
  dailyRevenue: RevenueDaily[];
  totalOrdersCount: number;
  onShowToast: (message: string) => void;
}

export const RevenueSection: React.FC<RevenueSectionProps> = ({
  dailyRevenue,
  totalOrdersCount,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState<'7days' | 'month' | 'quarter'>('7days');
  const [hoveredDay, setHoveredDay] = useState<RevenueDaily | null>(null);

  // Total calculation from daily data
  const total7DaysRevenue = dailyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const total7DaysOrders = dailyRevenue.reduce((sum, item) => sum + item.ordersCount, 0);
  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue));
  const avgOrderValue = Math.round(total7DaysRevenue / total7DaysOrders);

  // Lifetime metrics
  const totalLifetimeRevenue = 158420000;
  const estimatedProfit = 52278000;

  const handleExportReport = () => {
    onShowToast('Đang kết xuất báo cáo doanh thu & hóa đơn Orderly (.xlsx)...');
    setTimeout(() => {
      onShowToast('Báo cáo doanh thu đã tải xuống thành công!');
    }, 1200);
  };

  return (
    <section className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Báo Cáo Tổng Thu Nhập & Doanh Số</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu dòng tiền bán hàng, lợi nhuận và hiệu suất giao vận Orderly
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex bg-white p-1 rounded-xl border border-pink-100 shadow-xs">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                timeRange === '7days' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              7 Ngày Qua
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                timeRange === 'month' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              Tháng Này
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                timeRange === 'quarter' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              Quý Này
            </button>
          </div>

          <button
            onClick={handleExportReport}
            className="p-2.5 bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 rounded-xl border border-pink-100 shadow-xs transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Xuất báo cáo doanh thu"
          >
            <Download className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">Xuất File</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng Thu Nhập Tích Lũy</span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
              {formatVND(totalLifetimeRevenue)}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% so với tháng trước</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-400" />
        </div>

        {/* Card 2: Today's Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Doanh Thu Hôm Nay</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-pink-600 font-mono tabular-nums tracking-tight">
              {formatVND(dailyRevenue[dailyRevenue.length - 1]?.revenue || 7680000)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Đạt <span className="font-bold text-slate-800 font-mono">{dailyRevenue[dailyRevenue.length - 1]?.ordersCount} đơn hàng</span> trong ngày
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500" />
        </div>

        {/* Card 3: Estimated Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Lợi Nhuận Ròng Ước Tính</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums tracking-tight">
              {formatVND(estimatedProfit)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Biên lợi nhuận đạt <span className="font-bold font-mono">33.0%</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
        </div>

        {/* Card 4: Average Order Value & Delivery Success */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Giá Trị Đơn Trung Bình (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
              {formatVND(avgOrderValue)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Tỷ lệ giao hàng thành công: <span className="font-bold text-pink-600 font-mono">98.2%</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-pink-500" />
        </div>
      </div>

      {/* Main Chart Section: 7-Day Revenue Trend */}
      <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-50 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Biểu Đồ Doanh Thu & Số Lượng Đơn 7 Ngày Gần Nhất</h3>
            <p className="text-xs text-slate-500">
              Tổng thu tuần qua: <span className="font-bold font-mono text-pink-600">{formatVND(total7DaysRevenue)}</span> ({total7DaysOrders} đơn)
            </p>
          </div>
          {hoveredDay && (
            <div className="text-xs bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-lg text-slate-800">
              <span className="font-semibold text-pink-700">{hoveredDay.dayName} ({hoveredDay.date}): </span>
              <span className="font-mono font-bold text-slate-900">{formatVND(hoveredDay.revenue)}</span>
              <span className="text-slate-500"> · {hoveredDay.ordersCount} đơn</span>
            </div>
          )}
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56">
            {dailyRevenue.map((item, index) => {
              const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
              const isToday = index === dailyRevenue.length - 1;

              return (
                <div
                  key={item.date}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredDay(item)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Tooltip on hover */}
                  <span className="text-[10px] font-mono font-bold text-slate-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatVND(item.revenue)}
                  </span>

                  {/* The bar */}
                  <div className="w-full max-w-[42px] bg-pink-50 rounded-t-xl relative flex items-end h-full overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 relative ${
                        isToday
                          ? 'bg-gradient-to-t from-pink-600 to-rose-400 shadow-md shadow-pink-500/30'
                          : 'bg-gradient-to-t from-pink-400 to-pink-300 group-hover:from-pink-500 group-hover:to-rose-400'
                      }`}
                    >
                      <div className="absolute top-1 left-0 right-0 text-center">
                        <span className="text-[9px] font-mono text-white/90 font-bold hidden sm:inline">
                          {item.ordersCount}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Day label */}
                  <span className={`text-xs mt-2 font-medium ${isToday ? 'font-bold text-pink-600' : 'text-slate-600'}`}>
                    {item.dayName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary breakdown: Payment Breakdown & Best-selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-pink-500" />
            <span>Cơ Cấu Thu Nhập Theo Phương Thức</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-pink-500" />
                  Tiền mặt khi giao hàng (COD)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">42% (66.536.000₫)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-rose-500" />
                  Ví Điện Tử MoMo
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">28% (44.357.000₫)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                  Chuyển Khoản Ngân Hàng (QR 24/7)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">22% (34.852.000₫)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                  Thẻ Tín Dụng Quốc Tế (Visa/Master)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">8% (12.675.000₫)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Products by Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-pink-500" />
            <span>Sản Phẩm Đóng Góp Doanh Thu Cao Nhất</span>
          </h3>

          <div className="divide-y divide-pink-50 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Tai Nghe Không Dây Pink Bass TWS Pro</p>
                <p className="text-slate-400 text-[11px]">Đã bán 86 đơn · Giá 620.000₫</p>
              </div>
              <span className="font-mono font-bold text-pink-600 text-sm tabular-nums">
                53.320.000₫
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Hộp Quà Mỹ Phẩm Pink Glow Luxury</p>
                <p className="text-slate-400 text-[11px]">Đã bán 95 đơn · Giá 450.000₫</p>
              </div>
              <span className="font-mono font-bold text-pink-600 text-sm tabular-nums">
                42.750.000₫
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Set Trà Hoa Hồng Dưỡng Nhan Hữu Cơ</p>
                <p className="text-slate-400 text-[11px]">Đã bán 110 đơn · Giá 240.000₫</p>
              </div>
              <span className="font-mono font-bold text-pink-600 text-sm tabular-nums">
                26.400.000₫
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Bình Giữ Nhiệt Pastel Sakura 500ml</p>
                <p className="text-slate-400 text-[11px]">Đã bán 132 đơn · Giá 180.000₫</p>
              </div>
              <span className="font-mono font-bold text-pink-600 text-sm tabular-nums">
                23.760.000₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
