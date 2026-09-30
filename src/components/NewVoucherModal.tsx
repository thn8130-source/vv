import React, { useState } from 'react';
import { X, Tag, Plus, Calendar, DollarSign, Percent } from 'lucide-react';
import { Voucher } from '../types';

interface NewVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVoucher: (voucher: Voucher) => void;
  onShowToast: (message: string) => void;
}

export const NewVoucherModal: React.FC<NewVoucherModalProps> = ({
  isOpen,
  onClose,
  onAddVoucher,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(50000);
  const [minOrderValue, setMinOrderValue] = useState<number>(200000);
  const [maxDiscount, setMaxDiscount] = useState<number>(100000);
  const [endDate, setEndDate] = useState('2026-12-31');
  const [totalLimit, setTotalLimit] = useState<number>(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !title.trim()) {
      onShowToast('Vui lòng nhập mã voucher và tiêu đề!');
      return;
    }

    const newVoucher: Voucher = {
      id: `vouch-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || `Ưu đãi Orderly giảm ${discountType === 'fixed' ? `${discountValue.toLocaleString()}₫` : `${discountValue}%`}`,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
      startDate: new Date().toISOString().split('T')[0],
      endDate,
      usedCount: 0,
      totalLimit: Number(totalLimit),
      isActive: true,
    };

    onAddVoucher(newVoucher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-pink-100 bg-pink-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tạo Mã Voucher Khuyến Mãi</h3>
              <p className="text-xs text-slate-500">Phát hành mã giảm giá thu hút khách hàng Orderly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã Voucher (Code) <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: ORDERLYLOVE"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full text-xs font-mono font-bold uppercase rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loại giảm giá
              </label>
              <div className="flex rounded-lg border border-pink-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`flex-1 py-2 text-xs font-semibold cursor-pointer ${
                    discountType === 'fixed' ? 'bg-pink-500 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  Số tiền (VNĐ)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`flex-1 py-2 text-xs font-semibold cursor-pointer ${
                    discountType === 'percentage' ? 'bg-pink-500 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  Phần trăm (%)
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên / Tiêu đề Voucher <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Giảm 50.000₫ Mừng Khai Trương"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {discountType === 'fixed' ? 'Số tiền giảm (VNĐ)' : 'Mức giảm (%)'}
              </label>
              <input
                type="number"
                required
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 font-mono focus:border-pink-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 font-mono focus:border-pink-500 focus:outline-hidden"
              />
            </div>
          </div>

          {discountType === 'percentage' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giảm tối đa (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 font-mono focus:border-pink-500 focus:outline-hidden"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày hết hạn
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng số lượng phát hành
              </label>
              <input
                type="number"
                min={1}
                value={totalLimit}
                onChange={(e) => setTotalLimit(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 font-mono focus:border-pink-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả chi tiết điều kiện
            </label>
            <input
              type="text"
              placeholder="VD: Áp dụng cho mọi khách hàng thanh toán qua Orderly"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-sm shadow-pink-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Phát Hành Voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
