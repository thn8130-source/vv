import { OrderStatus } from '../types';

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount).replace('₫', '').trim() + '₫';
}

export function getStatusInfo(status: OrderStatus): {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ xác nhận',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'processing':
      return {
        label: 'Đang chuẩn bị hàng',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        dotColor: 'bg-blue-500',
      };
    case 'delivering':
      return {
        label: 'Đang giao hàng',
        textColor: 'text-pink-700',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200',
        dotColor: 'bg-pink-500',
      };
    case 'completed':
      return {
        label: 'Giao thành công',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    case 'cancelled':
      return {
        label: 'Đã hủy đơn',
        textColor: 'text-slate-600',
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-300',
        dotColor: 'bg-slate-400',
      };
    default:
      return {
        label: status,
        textColor: 'text-slate-700',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200',
        dotColor: 'bg-slate-400',
      };
  }
}
