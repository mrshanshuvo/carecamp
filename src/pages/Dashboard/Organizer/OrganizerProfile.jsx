import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  User,
  Mail,
  Briefcase,
  Edit,
  Save,
  X,
  Loader2,
  Phone,
  MapPin,
  Shield,
  ArrowRight,
  Camera,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const OrganizerProfile = () => {
  const { user: authUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const photoURLWatch = watch('photoURL');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const dataForm = new FormData();
    dataForm.append('image', file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: dataForm,
      });
      const data = await res.json();

      if (data.success) {
        setValue('photoURL', data.data.display_url);
        toast.success('Avatar uploaded successfully!');
      } else {
        toast.error('Image upload failed.');
      }
    } catch {
      toast.error('Error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const {
    data: profileRes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['organizerProfile', authUser?.email],
    enabled: !!authUser?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${authUser.email}`);
      return res.data;
    },
  });

  const profile = profileRes?.data || profileRes || {};
  const displayName = profile.name || authUser?.displayName || 'Organizer';
  const displayEmail = profile.email || authUser?.email || '';
  const displayPhoto =
    profile.photoURL || authUser?.photoURL || 'https://i.ibb.co/5h7FQs6N/unnamed.jpg';

  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.put(`/users/${authUser.email}`, {
        name: updatedData.name,
        photoURL: updatedData.photoURL,
        phone: updatedData.phone,
        address: updatedData.address,
      }),
    onSuccess: () => {
      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully',
        icon: 'success',
        confirmButtonColor: '#495E57',
      });
      queryClient.invalidateQueries(['organizerProfile', authUser.email]);
      setEditing(false);
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    },
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading || isSubmitting)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading Profile...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center p-8 min-h-[60vh]">
        <Card className="max-w-md w-full p-6 text-center bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-3xl shadow-lg space-y-4">
          <CardTitle className="text-lg font-bold text-red-600 dark:text-red-400">
            Failed to Load Profile
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            {error.message || 'Unknown error occurred'}
          </CardDescription>
          <Button
            onClick={() => window.location.reload()}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar & Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden text-center">
            <div className="bg-[#495E57]/10 dark:bg-slate-950 p-6 pt-8 border-b border-slate-100 dark:border-slate-800/80 relative">
              <div className="relative mx-auto w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-800 group">
                <img
                  src={photoURLWatch || displayPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://i.ibb.co/5h7FQs6N/unnamed.jpg';
                  }}
                />
                {editing && (
                  <label
                    htmlFor="organizer-avatar-file-upload"
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
                  >
                    {uploadingImage ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Camera size={20} />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">
                          Change
                        </span>
                      </>
                    )}
                  </label>
                )}
                <input
                  id="organizer-avatar-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={!editing || uploadingImage}
                />
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {displayName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 truncate">
                  <Mail size={12} className="text-[#495E57] dark:text-[#F4CE14] shrink-0" />
                  <span className="truncate">{displayEmail}</span>
                </p>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                <Shield size={12} />
                <span>{profile.role || 'Organizer'} Account</span>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Status</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                    Verified Organizer
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Role Type</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                    {profile.role || 'Organizer'}
                  </span>
                </div>
              </div>

              {!editing && (
                <Button
                  onClick={() => setEditing(true)}
                  className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3 h-auto rounded-xl border-none shadow-xs hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Edit size={16} />
                  <span>Edit Profile Details</span>
                </Button>
              )}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Organizer Tools
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => navigate('/dashboard/add-camp')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
              >
                <span>Add New Medical Camp</span>
                <ArrowRight
                  size={14}
                  className="text-slate-400 group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => navigate('/dashboard/manage-camps')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
              >
                <span>Manage Camps</span>
                <ArrowRight
                  size={14}
                  className="text-slate-400 group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => navigate('/dashboard/manage-registered-camps')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
              >
                <span>Camp Registrations</span>
                <ArrowRight
                  size={14}
                  className="text-slate-400 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Editable Details Form (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <User size={18} className="text-[#495E57] dark:text-[#F4CE14]" />
                  Organizer Details & Contact Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {editing
                    ? 'Update your organization information below.'
                    : 'View your stored administrative details.'}
                </p>
              </div>

              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  variant="outline"
                  className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs h-9 px-3 rounded-xl cursor-pointer"
                >
                  <Edit size={14} className="mr-1.5" />
                  Edit
                </Button>
              ) : (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Editing Active
                </Badge>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {!editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <User size={14} className="text-slate-400 shrink-0" />
                      <span>{displayName}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{displayEmail}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>{profile.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Role
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 capitalize">
                      <Briefcase size={14} className="text-slate-400 shrink-0" />
                      <span>{profile.role || 'Organizer'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Organization Address
                    </label>
                    <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>{profile.address || 'No address specified'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <Input
                        {...register('name', { required: 'Full name is required' })}
                        defaultValue={displayName}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600 font-bold mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Profile Avatar Photo
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-200">
                          <img
                            src={photoURLWatch || displayPhoto}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://i.ibb.co/5h7FQs6N/unnamed.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Upload profile image from your device
                          </p>
                          <p className="text-[10px] text-slate-400">
                            PNG, JPG, or WEBP formats supported.
                          </p>
                        </div>
                        <label
                          htmlFor="organizer-form-file-upload"
                          className="cursor-pointer shrink-0"
                        >
                          <div className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:opacity-90 transition">
                            {uploadingImage ? (
                              <>
                                <Loader2 className="animate-spin" size={14} />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                <span>Choose Image</span>
                              </>
                            )}
                          </div>
                          <input
                            id="organizer-form-file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Phone Number
                      </label>
                      <Input
                        {...register('phone')}
                        defaultValue={profile.phone || ''}
                        type="tel"
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10"
                        placeholder="+8801700000000"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Organization Address
                      </label>
                      <textarea
                        {...register('address')}
                        defaultValue={profile.address || ''}
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#495E57] resize-none"
                        placeholder="Enter organization address"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      type="submit"
                      disabled={isSubmitting || updateMutation.isLoading}
                      className="flex-1 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3 h-auto rounded-xl flex items-center justify-center gap-2 border-none shadow-xs cursor-pointer"
                    >
                      {isSubmitting || updateMutation.isLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Save size={16} />
                      )}
                      <span>Save Changes</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset(profile);
                        setEditing(false);
                      }}
                      variant="outline"
                      className="flex-1 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs py-3 h-auto rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;
