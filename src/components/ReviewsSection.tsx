import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  MessageSquareQuote, 
  Plus, 
  Filter,
  ShieldCheck,
  CornerDownRight
} from 'lucide-react';
import { Review } from '../types';
import { NewReviewModal } from './NewReviewModal';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
  onLikeReview: (reviewId: string) => void;
  onShowToast: (message: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
  onLikeReview,
  onShowToast,
}) => {
  const [selectedStar, setSelectedStar] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const filteredReviews = reviews.filter((r) => {
    if (selectedStar === 'all') return true;
    return r.rating === selectedStar;
  });

  const starCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Đánh Giá & Nhận Xét Từ Khách Hàng</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-mono font-bold">
              {reviews.length} đánh giá
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phản hồi thực tế từ khách hàng đã đặt hàng & trải nghiệm giao hàng Orderly
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Viết Đánh Giá Mới</span>
        </button>
      </div>

      {/* Ratings Aggregate Overview Card */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left score highlight */}
          <div className="md:col-span-4 text-center md:text-left md:border-r md:border-pink-100 md:pr-6 space-y-2">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-pink-600 font-mono tracking-tight">
                {averageRating}
              </span>
              <span className="text-slate-400 font-medium text-lg">/ 5.0</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-1 text-pink-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-pink-500 text-pink-500" />
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Dựa trên <span className="font-bold text-slate-800 font-mono">1.450+ lượt đánh giá</span> đã xác thực mua hàng
            </p>
          </div>

          {/* Right Rating Distribution Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars as keyof typeof starCounts];
              const percent = Math.round((count / (reviews.length || 1)) * 100);

              return (
                <button
                  key={stars}
                  onClick={() => setSelectedStar(selectedStar === stars ? 'all' : stars)}
                  className={`w-full flex items-center gap-3 text-xs p-1 rounded-lg transition-colors cursor-pointer group text-left ${
                    selectedStar === stars ? 'bg-pink-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="w-12 font-semibold text-slate-700 flex items-center gap-1">
                    {stars} <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-400 inline" />
                  </span>

                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedStar === stars ? 'bg-pink-600' : 'bg-pink-400 group-hover:bg-pink-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-12 text-right font-mono text-slate-500 group-hover:text-slate-800">
                    {count} ({percent}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Chips by Star */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedStar('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            selectedStar === 'all'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'bg-white border border-pink-100 text-slate-600 hover:text-pink-600'
          }`}
        >
          Tất Cả ({reviews.length})
        </button>

        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setSelectedStar(star)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
              selectedStar === star
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white border border-pink-100 text-slate-600 hover:text-pink-600'
            }`}
          >
            <span>{star} Sao</span>
            <span className="text-[10px] font-mono opacity-80">({starCounts[star as keyof typeof starCounts]})</span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-pink-100">
            <p className="text-xs text-slate-500">Chưa có đánh giá nào cho mức lọc này.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-pink-100 p-5 shadow-xs space-y-3 hover:border-pink-200 transition-colors"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {review.customerAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{review.customerName}</h4>
                      {review.isVerifiedPurchase && (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Đã mua qua Orderly</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex text-pink-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= review.rating ? 'fill-pink-500 text-pink-500' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 ml-1">· {review.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onLikeReview(review.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-pink-600 text-xs px-2.5 py-1 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer"
                  title="Đánh giá này hữu ích"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">{review.likes}</span>
                </button>
              </div>

              {/* Purchased Product Tag */}
              <div className="text-[11px] text-slate-600 bg-pink-50/50 px-2.5 py-1 rounded-lg border border-pink-100/60 inline-block">
                Sản phẩm: <span className="font-semibold text-slate-800">{review.productName}</span>
              </div>

              {/* Review Comment */}
              <p className="text-xs text-slate-700 leading-relaxed">{review.comment}</p>

              {/* Official Store Response */}
              {review.reply && (
                <div className="bg-pink-50/40 rounded-xl p-3 border-l-2 border-pink-400 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-pink-700">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>{review.reply.author}</span>
                    <span className="text-[10px] text-slate-400 font-normal">· {review.reply.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-5">{review.reply.comment}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Review Modal */}
      <NewReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddReview={onAddReview}
        onShowToast={onShowToast}
      />
    </section>
  );
};
