import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, AlertCircle, CheckCircle, CreditCard, X } from 'lucide-react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PaymentDialog = ({ open, onClose, camp, registration, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) return;

    try {
      const response = await axiosSecure.post('/create-payment-intent', {
        amount: camp.fees,
        campId: camp._id,
      });

      const clientSecret = response.data.data?.clientSecret ?? response.data.clientSecret;

      // Handle free camp
      if (!clientSecret) {
        await axiosSecure.post('/payments', {
          campId: camp._id,
          registrationId: registration._id,
          transactionId: `FREE_PAYMENT_${Date.now()}`,
          amount: 0,
          paymentMethod: 'FREE',
        });

        setPaymentIntent({ status: 'succeeded', id: 'FREE_PAYMENT' });
        onPaymentSuccess();
        setIsProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentIntent(paymentIntent);
        await axiosSecure.post('/payments', {
          campId: camp._id,
          registrationId: registration._id,
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
        });
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  if (paymentIntent?.status === 'succeeded') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Payment Successful!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thank you for completing your medical camp registration payment.
          </p>
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all">
              TxID: {paymentIntent.id}
            </p>
          </div>
          <Button
            onClick={onClose}
            className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2.5 rounded-xl border-none"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#495E57] dark:bg-slate-950 p-6 text-white flex items-center justify-between">
          <div>
            <Badge className="bg-white/15 text-white border border-white/20 text-[10px] font-bold mb-1">
              Secure Stripe Checkout
            </Badge>
            <h3 className="text-base font-bold truncate max-w-[280px]">{camp?.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Total Amount Due:
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ${camp?.fees}
            </span>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '14px',
                      color: '#0f172a',
                      '::placeholder': {
                        color: '#94a3b8',
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 font-bold text-xs py-2.5 h-auto rounded-xl border-slate-200 dark:border-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="flex-1 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2.5 h-auto rounded-xl border-none cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="animate-spin" size={14} />
                    <span>Processing...</span>
                  </span>
                ) : (
                  `Pay $${camp?.fees}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;
