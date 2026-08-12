import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Loader2,
  CalendarCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import CampCard from './CampCard';
import CampTable from './CampTable';
import PaymentDialog from './PaymentDialog';
import FeedbackModal from './FeedbackModal';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const RegisteredCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [paymentCamp, setPaymentCamp] = useState(null);
  const [paymentRegistration, setPaymentRegistration] = useState(null);
  const [feedbackCampId, setFeedbackCampId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // Fetch registered camps
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['registeredCamps', user?.email, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/camps-with-registrations/${user.email}?page=${currentPage}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const camps = data?.results || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Cancel registration mutation
  const { mutate: cancelRegistration, isPending: isCancelling } = useMutation({
    mutationFn: async (campId) => {
      const res = await axiosSecure.delete(`/cancel-registration/${campId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Registration cancelled successfully');
      queryClient.invalidateQueries(['registeredCamps']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    },
  });

  // Submit feedback mutation
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } = useMutation({
    mutationFn: async ({ campId, rating, feedback, images }) => {
      const res = await axiosSecure.post('/feedback', {
        campId,
        rating,
        feedback,
        images: images || [],
        name: user.displayName,
        photoURL: user.photoURL,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Feedback submitted successfully!');
      queryClient.invalidateQueries(['registeredCamps']);
      setFeedbackCampId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    },
  });

  const handlePaymentSuccess = () => {
    refetch();
    toast.success('Payment completed successfully!');
    setPaymentCamp(null);
    setPaymentRegistration(null);
  };

  const getPaginationRange = () => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Loading Registered Camps...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400">
            Error Loading Registered Camps
          </CardTitle>
          <CardDescription className="text-xs text-red-700 dark:text-red-300">
            {error.message || 'Please try again later'}
          </CardDescription>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 text-white font-bold text-xs px-4 py-2 h-auto rounded-xl inline-flex items-center gap-1.5"
          >
            <span>Retry</span>
            <ArrowRight size={14} />
          </Button>
        </Card>
      </div>
    );
  }

  if (camps.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <CalendarCheck className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No Registered Camps Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Your registered medical camps will appear here once you sign up.
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = '/available-camps')}
            className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-5 py-2.5 h-auto rounded-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Available Camps</span>
            <ArrowRight size={14} />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#495E57] dark:bg-slate-900 text-white p-6 sm:p-8 border border-white/10 dark:border-slate-800 shadow-xl">
        <div className="relative z-10 space-y-3">
          <Badge className="bg-white/15 dark:bg-slate-800 text-white dark:text-[#F4CE14] border border-white/20 px-3 py-1 text-xs font-bold rounded-full">
            Participant Portal
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            My Registered <span className="text-[#F4CE14]">Camps</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-300 max-w-xl leading-relaxed">
            Manage your upcoming medical camp registrations, complete fee payments, and submit
            experience feedback.
          </p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden space-y-4">
        {camps.map((camp) => (
          <div
            key={camp._id}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 overflow-hidden"
          >
            <CampCard
              camp={camp}
              onPay={() => {
                setPaymentCamp(camp);
                setPaymentRegistration(camp.participants[0]);
              }}
              onCancel={cancelRegistration}
              onFeedback={() => {
                if (!camp.hasFeedback) {
                  setFeedbackCampId(camp._id);
                } else {
                  toast.error('You already submitted feedback for this camp');
                }
              }}
              feedbackDisabled={camp.hasFeedback}
              isCancelling={isCancelling}
            />
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <CampTable
          camps={camps}
          onPay={(camp) => {
            setPaymentCamp(camp);
            setPaymentRegistration(camp.participants[0]);
          }}
          onCancel={cancelRegistration}
          onFeedback={(camp) => {
            if (!camp.hasFeedback) {
              setFeedbackCampId(camp._id);
            } else {
              toast.error('You already submitted feedback for this camp');
            }
          }}
          isCancelling={isCancelling}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-9 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800"
          >
            First
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="h-9 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800 gap-1"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </Button>

          {getPaginationRange().map((pageNum) => (
            <Button
              key={pageNum}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 p-0 text-xs font-bold rounded-xl cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 border-none'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {pageNum}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-9 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800 gap-1"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-9 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800"
          >
            Last
          </Button>
        </div>
      )}

      {/* Payment Dialog */}
      <Elements stripe={stripePromise}>
        <PaymentDialog
          open={!!paymentCamp}
          onClose={() => {
            setPaymentCamp(null);
            setPaymentRegistration(null);
          }}
          camp={paymentCamp}
          registration={paymentRegistration}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Elements>

      {/* Feedback Modal */}
      {feedbackCampId && (
        <FeedbackModal
          campId={feedbackCampId}
          onClose={() => setFeedbackCampId(null)}
          onSubmit={submitFeedback}
          isSubmitting={isSubmittingFeedback}
        />
      )}
    </div>
  );
};

export default RegisteredCamps;
