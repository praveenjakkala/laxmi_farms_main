'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Upload, Send, X, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface ReviewFormProps {
    productId: string;
    productName: string;
    onClose: () => void;
    onReviewSubmitted?: () => void;
}

export function ReviewForm({ productId, productName, onClose, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const supabase = createClient();

    const handleSubmit = async () => {
        if (rating === 0) { alert('Please select a rating.'); return; }
        if (!content.trim()) { alert('Please write a review.'); return; }

        setSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { alert('Please login to write a review.'); setSubmitting(false); return; }

        const { error } = await supabase.from('reviews').upsert({
            user_id: user.id,
            product_id: productId,
            rating,
            title: title.trim() || null,
            content: content.trim(),
            is_approved: true,
        }, { onConflict: 'user_id,product_id' });

        if (error) {
            alert('Failed to submit review. Please try again.');
        } else {
            setSubmitted(true);
            onReviewSubmitted?.();
            setTimeout(onClose, 2000);
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="text-center p-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-primary-600 mb-2">Thank you!</h3>
                <p className="text-warm-500">Your review has been submitted.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-primary-600">Review: {productName}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-warm-100">
                    <X className="w-5 h-5 text-warm-500" />
                </button>
            </div>

            {/* Star Rating */}
            <div>
                <p className="text-sm font-medium text-warm-700 mb-2">Your Rating *</p>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`w-8 h-8 transition-colors ${star <= (hovered || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-warm-200'}`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-warm-500 self-center">
                        {rating > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating] : 'Select rating'}
                    </span>
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Review Title</label>
                <input
                    className="input-field"
                    placeholder="Summarize your experience"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={80}
                />
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Your Review *</label>
                <textarea
                    className="input-field resize-none"
                    rows={4}
                    placeholder="Share your experience with this product..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    maxLength={500}
                />
                <p className="text-xs text-warm-400 mt-1 text-right">{content.length}/500</p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full btn-primary disabled:opacity-50"
            >
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Submit Review
                    </span>
                )}
            </button>
        </div>
    );
}

interface ReviewCardProps {
    review: {
        id: string;
        rating: number;
        title?: string | null;
        content: string;
        is_verified_purchase: boolean;
        created_at: string;
        user_profile?: { full_name?: string | null } | null;
    };
}

export function ReviewCard({ review }: ReviewCardProps) {
    const name = review.user_profile?.full_name || 'Anonymous';
    const initial = name[0].toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {initial}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-warm-900 text-sm">{name}</p>
                            {review.is_verified_purchase && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                </span>
                            )}
                        </div>
                        <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-warm-200'}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <p className="text-xs text-warm-400 shrink-0">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
            </div>

            {review.title && (
                <p className="font-semibold text-warm-800 text-sm mt-3">{review.title}</p>
            )}
            <p className="text-sm text-warm-600 mt-2 leading-relaxed">{review.content}</p>
        </motion.div>
    );
}

interface ReviewsListProps {
    productId: string;
    productName: string;
}

export default function ReviewsSection({ productId, productName }: ReviewsListProps) {
    const [reviews, setReviews] = useState<ReviewCardProps['review'][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
    const supabase = createClient();

    const fetchReviews = async () => {
        let query = supabase
            .from('reviews')
            .select('*, user_profile:user_profiles(full_name)')
            .eq('product_id', productId)
            .eq('is_approved', true);

        if (sortBy === 'highest') query = query.order('rating', { ascending: false });
        else if (sortBy === 'lowest') query = query.order('rating', { ascending: true });
        else query = query.order('created_at', { ascending: false });

        const { data } = await query;
        setReviews(data || []);
        setIsLoading(false);
    };

    useState(() => { fetchReviews(); }); // eslint-disable-line react-hooks/exhaustive-deps

    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: reviews.filter(rv => rv.rating === r).length,
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-heading font-bold text-primary-600">Customer Reviews</h3>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-warm-200'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-warm-700">{avgRating.toFixed(1)}</span>
                            <span className="text-sm text-warm-400">({reviews.length} reviews)</span>
                        </div>
                    )}
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2.5">
                    <Upload className="w-4 h-4 mr-1" /> Write a Review
                </button>
            </div>

            {/* Rating Breakdown */}
            {reviews.length > 0 && (
                <div className="bg-warm-50 rounded-2xl p-4 space-y-2">
                    {ratingCounts.map(({ rating, count }) => (
                        <div key={rating} className="flex items-center gap-2">
                            <span className="text-xs font-medium text-warm-600 w-4">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 h-2 bg-warm-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full transition-all"
                                    style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                                />
                            </div>
                            <span className="text-xs text-warm-400 w-5">{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Sort */}
            {reviews.length > 1 && (
                <div className="flex gap-2">
                    {[{ key: 'newest', label: 'Newest' }, { key: 'highest', label: '↑ Rating' }, { key: 'lowest', label: '↓ Rating' }].map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => { setSortBy(opt.key as 'newest' | 'highest' | 'lowest'); fetchReviews(); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sortBy === opt.key ? 'bg-primary-600 text-white' : 'bg-white text-warm-600 border border-warm-200 hover:border-primary-300'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Reviews */}
            {isLoading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}</div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-warm-100">
                    <Star className="w-12 h-12 text-warm-200 mx-auto mb-3" />
                    <p className="text-warm-500 mb-4">No reviews yet. Be the first!</p>
                    <button onClick={() => setShowForm(true)} className="btn-secondary text-sm">Write Review</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                </div>
            )}

            {/* Review Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                    >
                        <ReviewForm
                            productId={productId}
                            productName={productName}
                            onClose={() => setShowForm(false)}
                            onReviewSubmitted={fetchReviews}
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
}
