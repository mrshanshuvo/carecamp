import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, X, Search, Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SEO from '../../../components/Common/SEO';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ManageRegistrations = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['manageRegistrations', page, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/registrations/organizer?page=${page}&limit=${limit}&search=${searchTerm}`
      );
      return res.data;
    },
  });

  const registrations = data?.data || data?.registrations || [];
  const totalPages = data?.meta?.totalPages || data?.totalPages || 1;

  const handleConfirmationChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Confirmed' ? 'Pending' : 'Confirmed';
    try {
      const res = await axiosSecure.patch(`/registrations/${id}/confirmation`, {
        confirmationStatus: newStatus,
      });
      if (res.data.success) {
        toast.success(`Registration status set to ${newStatus}`);
        refetch();
      }
    } catch {
      toast.error('Failed to update confirmation status');
    }
  };

  const handleCancelRegistration = async (id) => {
    try {
      const res = await axiosSecure.delete(`/registrations/${id}`);
      if (res.data.success) {
        toast.success('Registration cancelled successfully');
        refetch();
      }
    } catch {
      toast.error('Failed to cancel registration');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-400">Loading registrations list...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <SEO
        title="Manage Registrations"
        description="Review participant camp registrations and confirmation statuses."
      />

      {/* Header */}
      <div className="space-y-1">
        <Badge className="bg-[#495E57]/10 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] border border-[#495E57]/20 text-[10px] font-bold px-3 py-1 rounded-full w-fit">
          <Sparkles size={12} className="mr-1.5 inline" />
          Registration Operations
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Manage <span className="text-[#495E57] dark:text-[#F4CE14]">Registrations</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Review participant signups, track payment status, and toggle confirmation states.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by participant name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10"
          />
        </div>
        <p className="text-xs font-bold text-slate-400">
          Showing Page {page} of {totalPages}
        </p>
      </Card>

      {/* Registrations Table Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Participant</th>
                <th className="px-5 py-3.5">Camp Details</th>
                <th className="px-5 py-3.5">Camp Fee</th>
                <th className="px-5 py-3.5">Payment Status</th>
                <th className="px-5 py-3.5">Confirmation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {registrations.length > 0 ? (
                registrations.map((reg, idx) => (
                  <tr
                    key={reg._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-slate-400">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#495E57]/10 text-[#495E57] dark:text-[#F4CE14] flex items-center justify-center font-black text-xs shrink-0">
                          {reg.participantName?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {reg.participantName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {reg.participantEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">
                      <p className="font-bold line-clamp-1">{reg.campName}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#495E57] dark:text-[#F4CE14]">
                      ${parseFloat(reg.campFees || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        className={`text-[10px] font-bold px-2.5 py-0.5 border ${
                          reg.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {reg.paymentStatus || 'Unpaid'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        className={`text-[10px] font-bold px-2.5 py-0.5 border ${
                          reg.confirmationStatus === 'Confirmed'
                            ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {reg.confirmationStatus || 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleConfirmationChange(reg._id, reg.confirmationStatus)}
                          variant="outline"
                          className="h-7 text-[11px] font-bold px-2.5 rounded-xl border-slate-200 dark:border-slate-800 cursor-pointer"
                        >
                          <Check size={13} className="mr-1 text-emerald-600" />
                          <span>
                            {reg.confirmationStatus === 'Confirmed' ? 'Pending' : 'Confirm'}
                          </span>
                        </Button>
                        <button
                          onClick={() => handleCancelRegistration(reg._id)}
                          className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition cursor-pointer border border-rose-200/60 dark:border-rose-900/60"
                          title="Cancel Registration"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No participant registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              variant="outline"
              className="text-xs h-8 px-3 rounded-xl cursor-pointer"
            >
              <ChevronLeft size={14} className="mr-1" />
              Previous
            </Button>
            <span className="text-xs font-bold text-slate-500">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              variant="outline"
              className="text-xs h-8 px-3 rounded-xl cursor-pointer"
            >
              Next
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManageRegistrations;
