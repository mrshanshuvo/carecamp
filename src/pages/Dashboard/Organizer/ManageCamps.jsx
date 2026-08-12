import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Pencil,
  Trash2,
  Loader2,
  Sparkles,
  PlusCircle,
  Search,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import CampFormModal from './CampFormModal';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ManageCamps = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [editingCamp, setEditingCamp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['myCamps', user?.email, page, searchTerm],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/organizer/camps?page=${page}&limit=${limit}&search=${searchTerm}`
      );
      return res.data;
    },
  });

  const camps = data?.data || data?.camps || [];
  const totalPages = data?.meta?.totalPages || data?.totalPages || 1;

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Medical Camp?',
      text: 'This action cannot be undone. All registration links for this camp will be removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#495E57',
      confirmButtonText: 'Yes, Delete Camp',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/delete-camp/${id}`);
        if (res.data.deletedCount > 0 || res.data.success) {
          toast.success('Camp deleted successfully');
          refetch();
        }
      } catch {
        toast.error('Failed to delete camp');
      }
    }
  };

  const handleEdit = (camp) => {
    setEditingCamp(camp);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-400">Loading your medical camps...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge className="bg-[#495E57]/10 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] border border-[#495E57]/20 text-[10px] font-bold px-3 py-1 rounded-full w-fit">
            <Sparkles size={12} className="mr-1.5 inline" />
            Organizer Controls
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Manage <span className="text-[#495E57] dark:text-[#F4CE14]">Medical Camps</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit parameters, update schedules, or remove existing medical camps.
          </p>
        </div>

        <Button
          onClick={() => navigate('/dashboard/add-camp')}
          className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2.5 px-4 h-auto rounded-xl flex items-center gap-2 border-none shadow-xs hover:opacity-90 transition cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Add New Camp</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <Input
            type="text"
            placeholder="Search camp by name..."
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

      {/* Camps Table Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Camp Name</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Registration Fee</th>
                <th className="px-5 py-3.5">Attendees</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {camps.length > 0 ? (
                camps.map((camp, idx) => (
                  <tr
                    key={camp._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-slate-400">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            camp.imageURL ||
                            camp.image ||
                            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100'
                          }
                          alt={camp.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {camp.name}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {camp.healthcareProfessional}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>
                          {new Date(camp.dateTime).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{camp.location}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#495E57] dark:text-[#F4CE14]">
                      ${parseFloat(camp.fees || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700 dark:text-slate-300">
                      <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 text-[10px]">
                        {camp.participantCount || 0} Registered
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(camp)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#495E57] hover:text-white dark:hover:bg-[#F4CE14] dark:hover:text-slate-950 transition cursor-pointer border border-slate-200/60 dark:border-slate-700"
                          title="Edit Camp"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(camp._id)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition cursor-pointer border border-rose-200/60 dark:border-rose-900/60"
                          title="Delete Camp"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No medical camps found.
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

      {editingCamp && (
        <CampFormModal
          initialData={editingCamp}
          onClose={() => setEditingCamp(null)}
          onUpdated={() => {
            setEditingCamp(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ManageCamps;
