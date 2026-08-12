import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  Receipt,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const statusStyles = {
  completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  refunded: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
};

const CampInfo = ({ campId }) => {
  const axiosInstance = useAxios();
  const { data: camp, isLoading } = useQuery({
    queryKey: ['camp', campId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/camps/${campId}`);
      return res.data.data?.camp || res.data.camp;
    },
    enabled: !!campId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!camp) return <span className="text-xs text-slate-400">Unknown Camp</span>;

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
        <img
          src={camp.imageURL || '/default-camp.png'}
          alt={camp.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-camp.png';
          }}
        />
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
          {camp.name}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{camp.location}</p>
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 5;

  const { data, isLoading, error } = useQuery({
    queryKey: ['payments', user?.email, page, searchTerm, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const payments = data?.data || [];
  const pagination = data?.meta || data?.pagination || {};

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const getStatusBadge = (status) => {
    const statusKey = status?.toLowerCase() || 'unknown';
    return (
      <Badge
        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
          statusStyles[statusKey] ||
          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
        }`}
      >
        {statusKey === 'completed' && <CheckCircle size={12} />}
        {statusKey === 'pending' && <Clock size={12} />}
        {statusKey === 'failed' && <AlertCircle size={12} />}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3 min-h-[60vh]">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Loading Payment History...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400">
            Error Loading Payment History
          </CardTitle>
          <CardDescription className="text-xs text-red-700 dark:text-red-300">
            {error.message || 'Please try again later'}
          </CardDescription>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white font-bold text-xs px-4 py-2 h-auto rounded-xl"
          >
            Refresh Page
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Table Card */}
      <Card className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#495E57] dark:bg-slate-950 p-6 text-white space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <Badge className="bg-white/15 dark:bg-slate-800 text-white dark:text-[#F4CE14] border border-white/20 text-[10px] font-bold px-3 py-0.5 rounded-full">
                Financial Transactions
              </Badge>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <Receipt className="text-[#F4CE14]" size={22} />
                Payment Records
              </h1>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-9 bg-white/10 dark:bg-slate-900 border-white/20 dark:border-slate-800 text-white placeholder:text-slate-300 text-xs rounded-xl h-9 min-w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-white/20 dark:border-slate-800 bg-white/10 dark:bg-slate-900 text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="text-slate-900">
                  All Statuses
                </option>
                <option value="completed" className="text-slate-900">
                  Completed
                </option>
                <option value="pending" className="text-slate-900">
                  Pending
                </option>
                <option value="failed" className="text-slate-900">
                  Failed
                </option>
                <option value="refunded" className="text-slate-900">
                  Refunded
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {payments.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <CreditCard className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                No Transactions Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Your payment history will automatically appear here once you register for medical
                camps.
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = '/available-camps')}
              className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-5 py-2.5 h-auto rounded-xl inline-flex items-center gap-2"
            >
              <span>Browse Camps</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Camp</th>
                  <th className="px-6 py-3.5">Payment Date</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Method</th>
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <CampInfo campId={payment.campId} />
                    </td>
                    <td className="px-6 py-4">
                      {payment.paymentDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400 shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {format(new Date(payment.paymentDate), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      ${(payment.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-semibold text-slate-600 dark:text-slate-400">
                        {payment.paymentMethod || 'Stripe'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {payment.transactionId?.slice(0, 8)}...
                      {payment.transactionId?.slice(-4)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer & Pagination */}
        {payments.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="h-8 text-xs font-bold rounded-lg border-slate-200 dark:border-slate-800"
              >
                First
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="h-8 text-xs font-bold rounded-lg border-slate-200 dark:border-slate-800 gap-1"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </Button>
              <span className="px-3 text-slate-600 dark:text-slate-400 font-medium">
                Page{' '}
                <strong className="text-slate-900 dark:text-slate-100">
                  {pagination.page || page}
                </strong>{' '}
                of{' '}
                <strong className="text-slate-900 dark:text-slate-100">
                  {pagination.totalPages || 1}
                </strong>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                disabled={page === (pagination.totalPages || 1)}
                className="h-8 text-xs font-bold rounded-lg border-slate-200 dark:border-slate-800 gap-1"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(pagination.totalPages || 1)}
                disabled={page === (pagination.totalPages || 1)}
                className="h-8 text-xs font-bold rounded-lg border-slate-200 dark:border-slate-800"
              >
                Last
              </Button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{pagination.totalItems || payments.length} transactions total</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentHistory;
