import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, ShoppingCart, User, MapPin, Phone, CreditCard } from 'lucide-react';
import { Order, OrderItem, Voucher } from '../types';
import { AVAILABLE_PRODUCTS } from '../data/mockData';
import { formatVND } from '../utils/format';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newOrder: Order) => void;
  vouchers: Voucher[];
  onShowToast: (message: string) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onAddOrder,
  vouchers,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Momo' | 'Banking' | 'CreditCard'>('COD');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([
    { id: AVAILABLE_PRODUCTS[0].id, name: AVAILABLE_PRODUCTS[0].name, price: AVAILABLE_PRODUCTS[0].price, quantity: 1 },
  ]);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 300000 ? 0 : 25000;

  // Calculate discount
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'fixed') {
      discount = appliedVoucher.discountValue;
    } else {
      discount = Math.min((subtotal * appliedVoucher.discountValue) / 100, appliedVoucher.maxDiscount || Infinity);
    }
  }
  const total = Math.max(0, subtotal + shippingFee - discount);

  const handleAddItem = (productId: string) => {
    const product = AVAILABLE_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existingIndex = selectedItems.findIndex((item) => item.id === productId);
    if (existingIndex > -1) {
      const updated = [...selectedItems];
      updated[existingIndex].quantity += 1;
      setSelectedItems(updated);
    } else {
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
    } else {
      const updated = [...selectedItems];
      updated[index].quantity = quantity;
      setSelectedItems(updated);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleApplyVoucher = (codeToApply?: string) => {
    const code = (codeToApply || voucherCodeInput).trim().toUpperCase();
    const found = vouchers.find((v) => v.code === code && v.isActive);

    if (!found) {
      onShowToast('Mã voucher không tồn tại hoặc đã hết hạn!');
      return;
    }

    if (subtotal < found.minOrderValue) {
      onShowToast(`Đơn hàng phải từ ${formatVND(found.minOrderValue)} để áp dụng mã này!`);
      return;
    }

    setAppliedVoucher(found);
    setVoucherCodeInput(found.code);
    onShowToast(`Đã áp dụng thành công mã ${found.code}!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      onShowToast('Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ giao hàng!');
      return;
    }

    if (selectedItems.length === 0) {
      onShowToast('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone,
      customerAddress,
      items: selectedItems,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      status: 'pending',
      createdAt,
      note: note.trim() || undefined,
      appliedVoucherCode: appliedVoucher ? appliedVoucher.code : undefined,
      shipperName: 'Đang xếp shipper Orderly',
    };

    onAddOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-pink-100 bg-pink-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tạo Đơn Hàng Mới</h3>
              <p className="text-xs text-slate-500">Khách đặt qua hotline hoặc cửa hàng Orderly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-pink-500" />
              <span>Thông Tin Khách Hàng</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tên người nhận <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Lê Thuỳ Chi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Số điện thoại <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs rounded-lg border border-pink-200 p-2.5 pl-8 focus:border-pink-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Địa chỉ giao hàng <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs rounded-lg border border-pink-200 p-2.5 pl-8 focus:border-pink-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Ghi chú đơn hàng</label>
              <input
                type="text"
                placeholder="VD: Giao trước 17h, gọi trước khi giao"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Product Items Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-pink-500" />
                <span>Chọn Mặt Hàng ({selectedItems.length})</span>
              </h4>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItem(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="text-xs border border-pink-200 rounded-lg p-1.5 bg-pink-50/50 text-pink-700 font-medium focus:outline-hidden"
                >
                  <option value="" disabled>+ Chọn thêm sản phẩm</option>
                  {AVAILABLE_PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} ({formatVND(prod.price)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Items List */}
            <div className="border border-pink-100 rounded-xl divide-y divide-pink-50 max-h-48 overflow-y-auto">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-pink-50/20">
                  <div className="flex-1 mr-3">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-slate-500 font-mono">{formatVND(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 bg-pink-50 text-pink-700 hover:bg-pink-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-slate-800">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 bg-pink-50 text-pink-700 hover:bg-pink-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono font-bold text-slate-900 tabular-nums w-20 text-right">
                      {formatVND(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voucher & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-pink-500" />
                Áp Dụng Mã Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="VD: ORDERLYPINK"
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  className="flex-1 text-xs uppercase font-mono font-bold rounded-lg border border-pink-200 p-2 focus:border-pink-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleApplyVoucher()}
                  className="px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>

              {/* Quick voucher pill suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {vouchers.slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleApplyVoucher(v.code)}
                    className="text-[10px] px-2 py-0.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-md font-mono border border-pink-200 cursor-pointer"
                  >
                    {v.code}
                  </button>
                ))}
              </div>

              {appliedVoucher && (
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  ✓ Đã áp voucher: {appliedVoucher.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-pink-500" />
                Hình Thức Thanh Toán
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
              >
                <option value="COD">Tiền mặt khi nhận hàng (COD)</option>
                <option value="Momo">Ví điện tử MoMo</option>
                <option value="Banking">Chuyển khoản Ngân hàng (QR 24/7)</option>
                <option value="CreditCard">Thẻ tín dụng / Ghi nợ (Visa/Master)</option>
              </select>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="bg-pink-50/40 p-4 rounded-xl space-y-1.5 text-xs border border-pink-100">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính hàng:</span>
              <span className="font-mono tabular-nums">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span className="font-mono tabular-nums">
                {shippingFee === 0 ? <span className="text-emerald-600 font-semibold">Miễn phí ship</span> : formatVND(shippingFee)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-pink-600 font-semibold">
                <span>Voucher giảm giá:</span>
                <span className="font-mono tabular-nums">-{formatVND(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-pink-200/60 pt-2">
              <span>Tổng thanh toán:</span>
              <span className="text-pink-600 font-mono text-base tabular-nums">{formatVND(total)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-sm shadow-pink-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Xác Nhận Tạo Đơn Hàng</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
