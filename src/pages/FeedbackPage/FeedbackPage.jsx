import { Star, User, MessageSquare, Search, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import { useState, useMemo, useCallback } from 'react';

import useAxios from '../../hooks/useAxios';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FeedbackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [ratingFilter, setRatingFilter] = useState(searchParams.get('rating') || 'all');
  const axiosInstance = useAxios();

  const {
    data: feedbackRes = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['allFeedback'],
    queryFn: async () => {
      const res = await axiosInstance.get('/feedback');
      return res.data;
    },
  });

  const feedbacks = useMemo(
    () => feedbackRes?.data || (Array.isArray(feedbackRes) ? feedbackRes : []),
    [feedbackRes]
  );

  const stats = useMemo(() => {
    const total = feedbacks.length;
    const average = total > 0 ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / total : 0;

    const distribution = [0, 0, 0, 0, 0];
    feedbacks.forEach((feedback) => {
      if (feedback.rating >= 1 && feedback.rating <= 5) {
        distribution[feedback.rating - 1]++;
      }
    });

    return { total, average, distribution };
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const matchesSearch =
        searchTerm === '' ||
        feedback.participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedback?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating = ratingFilter === 'all' || feedback.rating === parseInt(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [feedbacks, searchTerm, ratingFilter]);

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set('search', value);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handleRatingFilter = useCallback(
    (rating) => {
      setRatingFilter(rating);
      const newParams = new URLSearchParams(searchParams);
      if (rating !== 'all') {
        newParams.set('rating', rating);
      } else {
        newParams.delete('rating');
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-600 mb-2">Failed to load feedback</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
            Please try again later or check your network connection.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs rounded-xl"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <MessageSquare size={16} className="text-[#495E57] dark:text-[#F4CE14]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Community Reviews & Ratings
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Participant <span className="text-[#495E57] dark:text-[#F4CE14]">Feedback</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Read transparent reviews and experiences shared by attendees across Bangladesh.
          </p>
        </div>

        {/* Rating Breakdown Overview */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-0 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Average Rating Box */}
            <div className="md:col-span-4 text-center md:border-r border-slate-100 dark:border-slate-800 md:pr-8 space-y-2">
              <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-slate-100">
                {isLoading ? '...' : stats.average.toFixed(1)}
                <span className="text-2xl text-slate-400 font-normal">/5</span>
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(stats.average)
                        ? 'fill-[#F4CE14] text-[#F4CE14]'
                        : 'text-slate-200 dark:text-slate-800'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isLoading ? 'Calculating...' : `Based on ${stats.total} verified reviews`}
              </p>
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-8 space-y-2.5">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-12 shrink-0 font-bold text-slate-700 dark:text-slate-300">
                    <span>{rating}</span>
                    <Star className="h-3.5 w-3.5 fill-[#F4CE14] text-[#F4CE14]" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    {!isLoading && stats.total > 0 && (
                      <div
                        className="h-full bg-[#495E57] dark:bg-[#F4CE14] rounded-full transition-all duration-500"
                        style={{
                          width: `${(stats.distribution[rating - 1] / stats.total) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                    {isLoading ? '-' : stats.distribution[rating - 1]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search by participant name, camp, or feedback..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-[#495E57]"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={18} className="text-slate-400" />
            <select
              value={ratingFilter}
              onChange={(e) => handleRatingFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#495E57] cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>
          </div>
        </div>

        {/* Feedback Cards Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading reviews...</div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No feedback found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFeedbacks.map((feedback) => (
              <Card
                key={feedback._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
              >
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        {feedback.participantPhotoURL ? (
                          <img
                            src={feedback.participantPhotoURL}
                            alt={feedback.participantName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={18} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {feedback.participantName || 'Anonymous Participant'}
                        </h4>
                        <p className="text-xs text-[#495E57] dark:text-[#F4CE14] font-medium">
                          {feedback.campName}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="secondary"
                      className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1 rounded-full"
                    >
                      {feedback.rating} ★
                    </Badge>
                  </div>

                  {feedback.feedback && (
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                      "{feedback.feedback}"
                    </p>
                  )}
                </CardContent>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span>
                    {new Date(feedback.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
