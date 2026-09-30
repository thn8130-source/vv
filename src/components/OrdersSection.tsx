import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ShoppingBag, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Eye, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatVND, getStatusInfo } from '../utils/format';
import { OrderDetailsModal } from './OrderDetailsModal';

interface OrdersSectionProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenNewOrder: () => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  onUpdateStatus,
  onOpenNewOrder,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.customerAddress.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  // Counts for each tab
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      delivering: orders.filter((o) => o.status === 'delivering').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  const filterTabs = [
    { id: 'all', label: 'Tất cả đơn', count: counts.all },
    { id: 'pending', label: 'Chờ xác nhận', count: counts.pending },
    { id: 'processing', label: 'Đang chuẩn bị', count: counts.processing },
    { id: 'delivering', label: 'Đang giao hàng', count: counts.delivering },
    { id: 'completed', label: 'Đã hoàn thành', count: counts.completed },
    { id: 'cancelled', label: 'Đã hủy', count: counts.cancelled },
  ];

  return (
    <section className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Quản Lý Đơn Hàng Orderly</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-mono font-bold">
              {orders.length} đơn
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi trạng thái giao vận theo thời gian thực và quản lý đơn hàng
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="px-4 py-2.5 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tạo Đơn Hàng Mới</span>
        </button>
      </div>

      {/* Mini Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Chờ Xử Lý</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {counts.pending + counts.processing}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Đang Trên Đường Giao</span>
            <Truck className="w-4 h-4 text-pink-500" />
          </div>
          <p className="text-xl font-bold font-mono text-pink-600 mt-2 tabular-nums">
            {counts.delivering}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Giao Thành Công</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {counts.completed}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Tổng Giá Trị Đơn</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-bold font-mono text-slate-900 mt-2 tabular-nums truncate">
            {formatVND(orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0))}
          </p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn (#ORD), tên khách hàng, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-hidden bg-pink-50/20"
            />
          </div>

          <div className="text-xs text-slate-500">
            Hiển thị <span className="font-bold text-slate-800">{filteredOrders.length}</span> / {orders.length} đơn
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-pink-500 text-white font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeFilter === tab.id ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table & Cards */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc bấm nút "Tạo Đơn Hàng Mới" để thêm đơn vận hành mới.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50/50 border-b border-pink-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-4">Mã Đơn / Thời Gian</th>
                  <th className="p-4">Khách Hàng & Địa Chỉ</th>
                  <th className="p-4">Sản Phẩm</th>
                  <th className="p-4">Thanh Toán</th>
                  <th className="p-4">Tổng Tiền</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 text-xs">
                {filteredOrders.map((order) => {
                  const status = getStatusInfo(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-pink-50/20 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4 align-top">
                        <span className="font-mono font-extrabold text-pink-600 text-xs block">
                          #{order.id}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {order.createdAt}
                        </span>
                        {order.appliedVoucherCode && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 font-mono border border-pink-200">
                            Voucher: {order.appliedVoucherCode}
                          </span>
                        )}
                      </td>

                      <td className="p-4 align-top max-w-[220px]">
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5" title={order.customerAddress}>
                          {order.customerAddress}
                        </p>
                      </td>

                      <td className="p-4 align-top max-w-[240px]">
                        <p className="text-slate-800 font-medium">
                          {order.items[0]?.name}
                          {order.items.length > 1 && (
                            <span className="text-pink-600 font-semibold text-[11px]">
                              {' '}+{order.items.length - 1} món khác
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Số lượng: {order.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm
                        </p>
                      </td>

                      <td className="p-4 align-top">
                        <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {order.paymentMethod}
                        </span>
                        {order.shipperName && (
                          <p className="text-[10px] text-pink-600 mt-1 truncate max-w-[120px]">
                            Shipper: {order.shipperName.split('(')[0]}
                          </p>
                        )}
                      </td>

                      <td className="p-4 align-top">
                        <span className="font-mono font-bold text-slate-900 text-sm tabular-nums block">
                          {formatVND(order.total)}
                        </span>
                        {order.discount > 0 && (
                          <span className="text-[10px] text-pink-600 font-mono block">
                            (Giảm {formatVND(order.discount)})
                          </span>
                        )}
                      </td>

                      <td className="p-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${status.bgColor} ${status.textColor} ${status.borderColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                          <span>{status.label}</span>
                        </span>
                      </td>

                      <td className="p-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết đơn & lộ trình shipper"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick progress action */}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'processing')}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[11px] font-semibold cursor-pointer"
                            >
                              Nhận đơn
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'delivering')}
                              className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-md text-[11px] font-semibold cursor-pointer"
                            >
                              Giao hàng
                            </button>
                          )}
                          {order.status === 'delivering' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'completed')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md text-[11px] font-semibold cursor-pointer"
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(id, st) => {
            onUpdateStatus(id, st);
            setSelectedOrder((prev) => (prev ? { ...prev, status: st } : null));
          }}
        />
      )}
    </section>
  );
};
