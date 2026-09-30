import React, { useState } from 'react';
import { 
  Tag, 
  Copy, 
  Check, 
  Plus, 
  Clock, 
  Sparkles, 
  Percent, 
  Gift, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Voucher } from '../types';
import { formatVND } from '../utils/format';
import { NewVoucherModal } from './NewVoucherModal';

interface VouchersSectionProps {
  vouchers: Voucher[];
  onAddVoucher: (newVoucher: Voucher) => void;
  onApplyVoucherToOrder: (voucherCode: string) => void;
  onShowToast: (message: string) => void;
}

export const VouchersSection: React.FC<VouchersSectionProps> = ({
  vouchers,
  onAddVoucher,
  onApplyVoucherToOrder,
  onShowToast,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'used'>('all');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onShowToast(`Đã sao chép mã voucher ${code}!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (filterTab === 'active') return v.isActive;
    if (filterTab === 'used') return v.usedCount >= v.totalLimit;
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Kho Voucher & Khuyến Mãi Orderly</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-mono font-bold">
              {vouchers.length} mã
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sao chép mã voucher giảm giá, miễn phí vận chuyển siêu tốc cho khách hàng
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tạo Voucher Mới</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-pink-100 shadow-xs max-w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filterTab === 'all' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          Tất Cả ({vouchers.length})
        </button>
        <button
          onClick={() => setFilterTab('active')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filterTab === 'active' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          Đang Hoạt Động ({vouchers.filter((v) => v.isActive).length})
        </button>
      </div>

      {/* Vouchers Grid Styled as Cute Pink Coupons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVouchers.map((voucher) => {
          const isCopied = copiedCode === voucher.code;
          const usagePercent = Math.min(100, Math.round((voucher.usedCount / voucher.totalLimit) * 100));

          return (
            <div
              key={voucher.id}
              className="bg-white rounded-2xl border border-pink-200/80 shadow-xs overflow-hidden flex flex-col sm:flex-row relative group hover:shadow-md hover:border-pink-300 transition-all duration-200"
            >
              {/* Left Ticket Stub (Pink Accent) */}
              <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white p-5 flex flex-col justify-between items-center sm:w-36 shrink-0 relative">
                {/* Perforated semi-circle cutout on border */}
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-50/40 z-10 border-l border-pink-200/80" />

                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  {voucher.discountType === 'percentage' ? (
                    <Percent className="w-5 h-5 text-white" />
                  ) : (
                    <Gift className="w-5 h-5 text-white" />
                  )}
                </div>

                <div className="text-center my-3 sm:my-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block">
                    Giảm Đến
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight block">
                    {voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : formatVND(voucher.discountValue)}
                  </span>
                </div>

                <span className="text-[10px] text-pink-100 font-mono">
                  {voucher.discountType === 'percentage' && voucher.maxDiscount ? `Tối đa ${formatVND(voucher.maxDiscount)}` : 'Giảm trực tiếp'}
                </span>
              </div>

              {/* Right Ticket Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{voucher.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shrink-0">
                      Có hiệu lực
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{voucher.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Đơn tối thiểu: <span className="font-mono font-semibold text-slate-700">{formatVND(voucher.minOrderValue)}</span>
                  </p>
                </div>

                {/* Progress bar of usage */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Đã dùng: {voucher.usedCount}/{voucher.totalLimit}</span>
                    <span className="font-mono">{usagePercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-pink-100 overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all duration-300"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                {/* Voucher Code & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dashed border-pink-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-lg tracking-wider">
                      {voucher.code}
                    </span>
                    <button
                      onClick={() => handleCopy(voucher.code)}
                      className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                      title="Sao chép mã"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> HSD: {voucher.endDate}
                    </span>
                    <button
                      onClick={() => onApplyVoucherToOrder(voucher.code)}
                      className="px-3 py-1 bg-pink-50 hover:bg-pink-500 hover:text-white text-pink-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Dùng Ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Voucher Modal */}
      <NewVoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddVoucher={onAddVoucher}
        onShowToast={onShowToast}
      />
    </section>
  );
};
