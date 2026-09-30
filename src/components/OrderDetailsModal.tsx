import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatVND, getStatusInfo } from '../utils/format';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);

  const getTimelineSteps = () => {
    return [
      {
        id: 'step-1',
        title: 'Đã tiếp nhận đơn hàng',
        desc: `Thời gian đặt: ${order.createdAt}`,
        isCompleted: true,
        isCurrent: order.status === 'pending',
      },
      {
        id: 'step-2',
        title: 'Kho chuẩn bị hàng & đóng gói',
        desc: 'Kiểm tra bao bì hồng Orderly',
        isCompleted: ['processing', 'delivering', 'completed'].includes(order.status),
        isCurrent: order.status === 'processing',
      },
      {
        id: 'step-3',
        title: 'Shipper Orderly đang giao hàng',
        desc: order.shipperName ? `${order.shipperName} · ${order.shipperPhone}` : 'Đang điều phối shipper',
        isCompleted: ['delivering', 'completed'].includes(order.status),
        isCurrent: order.status === 'delivering',
      },
      {
        id: 'step-4',
        title: 'Giao hàng thành công',
        desc: order.deliveryTime ? `Đã giao lúc: ${order.deliveryTime}` : 'Đồng kiểm & thu tiền',
        isCompleted: order.status === 'completed',
        isCurrent: false,
      },
    ];
  };

  const steps = getTimelineSteps();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pink-100 bg-pink-50/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Chi Tiết Đơn Hàng #{order.id}</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}`}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Đặt lúc {order.createdAt}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Tracking Timeline */}
          {order.status !== 'cancelled' ? (
            <div className="bg-pink-50/30 rounded-xl p-4 border border-pink-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-pink-500" />
                <span>Hành Trình Giao Hàng Siêu Tốc</span>
              </h4>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex items-start gap-3 relative">
                    {/* Line connector */}
                    {idx < steps.length - 1 && (
                      <div 
                        className={`absolute left-3 top-6 bottom-0 w-0.5 -mb-4 ${
                          step.isCompleted ? 'bg-pink-500' : 'bg-slate-200'
                        }`} 
                      />
                    )}

                    {/* Step Icon */}
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.isCompleted
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <p className={`text-xs font-bold ${step.isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold">Đơn hàng đã được đánh dấu hủy</p>
                <p className="text-[11px] text-red-600">Lý do: {order.note || 'Theo yêu cầu khách hàng'}</p>
              </div>
            </div>
          )}

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-500" />
                Thông Tin Người Nhận
              </span>
              <p className="font-semibold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> {order.customerPhone}
              </p>
              <p className="text-slate-600 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span>{order.customerAddress}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-pink-500" />
                Thanh Toán & Vận Chuyển
              </span>
              <p className="text-slate-700">
                Phương thức: <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </p>
              <p className="text-slate-700">
                Shipper phụ trách:{' '}
                <span className="font-medium text-pink-600">
                  {order.shipperName || 'Hệ thống tự động gán'}
                </span>
              </p>
              {order.note && (
                <p className="text-slate-500 italic">Ghi chú: "{order.note}"</p>
              )}
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Mặt Hàng Đã Đặt ({order.items.length})
            </h4>
            <div className="border border-pink-100 rounded-xl divide-y divide-pink-50 overflow-hidden">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between text-xs hover:bg-pink-50/20">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-slate-500">
                      {formatVND(item.price)} × <span className="font-mono">{item.quantity}</span>
                    </p>
                  </div>
                  <span className="font-bold font-mono text-slate-900 tabular-nums">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Tạm tính hàng:</span>
                <span className="font-mono tabular-nums">{formatVND(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển siêu tốc:</span>
                <span className="font-mono tabular-nums">{formatVND(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-pink-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Voucher giảm ({order.appliedVoucherCode || 'Khuyến mãi'}):
                  </span>
                  <span className="font-mono tabular-nums">-{formatVND(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-pink-100 pt-2">
                <span>Tổng cộng thanh toán:</span>
                <span className="text-pink-600 font-mono tabular-nums">{formatVND(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions to update status */}
          <div className="border-t border-pink-100 pt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Cập nhật nhanh trạng thái:</span>
            <div className="flex flex-wrap gap-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'processing')}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Xác nhận & Chuẩn bị hàng
                </button>
              )}
              {(order.status === 'pending' || order.status === 'processing') && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'delivering')}
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Bàn giao Shipper đi giao
                </button>
              )}
              {order.status === 'delivering' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'completed')}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Đánh dấu Giao thành công
                </button>
              )}
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'cancelled')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
