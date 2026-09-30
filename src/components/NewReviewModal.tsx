import React, { useState } from 'react';
import { X, Star, MessageSquareQuote, Check } from 'lucide-react';
import { Review } from '../types';
import { AVAILABLE_PRODUCTS } from '../data/mockData';

interface NewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: Review) => void;
  onShowToast: (message: string) => void;
}

export const NewReviewModal: React.FC<NewReviewModalProps> = ({
  isOpen,
  onClose,
  onAddReview,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [productName, setProductName] = useState(AVAILABLE_PRODUCTS[0].name);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !comment.trim()) {
      onShowToast('Vui lòng nhập tên và nhận xét đánh giá!');
      return;
    }

    const initials = customerName
      .trim()
      .split(' ')
      .slice(-2)
      .map((w) => w[0]?.toUpperCase())
      .join('');

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customerName: customerName.trim(),
      customerAvatar: initials || 'KH',
      rating,
      date: 'Hôm nay',
      productName,
      comment: comment.trim(),
      likes: 1,
      isVerifiedPurchase: true,
      reply: {
        author: 'Orderly Customer Care',
        comment: 'Cảm ơn bạn đã tin tưởng mua sắm và dành lời khen cho dịch vụ giao hàng Orderly ❤️ Chúc bạn luôn vui vẻ!',
        date: 'Vừa xong',
      },
    };

    onAddReview(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-pink-100 bg-pink-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Gửi Đánh Giá Trải Nghiệm</h3>
              <p className="text-xs text-slate-500">Đánh giá về chất lượng sản phẩm & tốc độ shipper Orderly</p>
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
          {/* Star selector */}
          <div className="text-center py-2 space-y-2 bg-pink-50/40 rounded-xl p-3 border border-pink-100">
            <label className="block text-xs font-bold text-slate-700">Mức độ hài lòng của bạn</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-pink-500 text-pink-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-pink-600">
              {rating === 5 && 'Tuyệt vời, đóng gói đẹp & shipper rất thân thiện!'}
              {rating === 4 && 'Hài lòng, giao hàng đúng hẹn!'}
              {rating === 3 && 'Bình thường, chất lượng ổn'}
              {rating === 2 && 'Cần cải thiện tốc độ giao'}
              {rating === 1 && 'Chưa hài lòng'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Họ và tên của bạn <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Lan Hương"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sản phẩm bạn đã mua
            </label>
            <select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden bg-white"
            >
              {AVAILABLE_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.name}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nhận xét chi tiết <span className="text-pink-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Chia sẻ trải nghiệm về sản phẩm, đóng gói hộp hồng Orderly, thái độ shipper, thời gian nhận hàng..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs rounded-lg border border-pink-200 p-2.5 focus:border-pink-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-pink-100">
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
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Gửi Đánh Giá Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
