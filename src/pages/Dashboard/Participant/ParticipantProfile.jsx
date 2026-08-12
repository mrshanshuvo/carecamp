import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  User,
  Loader2,
  Edit,
  X,
  Check,
  Mail,
  Phone,
  MapPin,
  Shield,
  ArrowRight,
  Camera,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ParticipantProfile = () => {
  const { user: authUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = authUser?.email;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photoURL: '',
    phone: '',
    address: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

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
        setFormData((prev) => ({ ...prev, photoURL: data.data.display_url }));
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

  // Validation function
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\+?\d{7,15}$/.test(formData.phone.trim())) errors.phone = 'Invalid phone number';
    return errors;
  };

  // Filter out empty/unchanged fields
  const getCleanUpdates = (currentData, originalData) => {
    const updates = {};
    Object.keys(currentData).forEach((key) => {
      const currentValue = currentData[key]?.trim() || '';
      const originalValue = originalData[key]?.trim() || '';

      if (currentValue !== originalValue && currentValue !== '') {
        updates[key] = currentValue;
      } else if (key === 'address' && currentValue === '' && originalValue !== '') {
        updates[key] = '';
      }
    });

    return updates;
  };

  // Fetch user data with React Query
  const {
    data: profileRes,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}`);
      return res.data;
    },
    enabled: !!email,
  });

  const user = profileRes?.data || profileRes || {};

  useEffect(() => {
    if (user && (user.name || user.email || authUser?.email)) {
      const initialData = {
        name: user.name || authUser?.displayName || '',
        photoURL: user.photoURL || authUser?.photoURL || '',
        phone: user.phone || '',
        address: user.address || '',
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setFormErrors({});
    }
  }, [profileRes, authUser, user]);

  // Mutation to update user
  const updateUserMutation = useMutation({
    mutationFn: async ({ email, updates }) => {
      const cleanUpdates = getCleanUpdates(updates, originalData);
      if (Object.keys(cleanUpdates).length === 0) {
        throw new Error('No changes detected');
      }

      const res = await axiosSecure.put(`/users/${email}`, cleanUpdates);
      return res.data;
    },
    onSuccess: async (updatedUser) => {
      const updatedData = updatedUser?.data || updatedUser;
      queryClient.invalidateQueries(['user', email]);
      setIsEditing(false);

      const newOriginalData = {
        name: updatedData.name || '',
        photoURL: updatedData.photoURL || '',
        phone: updatedData.phone || '',
        address: updatedData.address || '',
      };
      setOriginalData(newOriginalData);
      setFormErrors({});

      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Profile updated successfully.',
        confirmButtonColor: '#495E57',
      });
    },
    onError: async (err) => {
      if (err.message === 'No changes detected') {
        await Swal.fire({
          icon: 'info',
          title: 'No changes',
          text: 'No changes were made to the profile.',
          confirmButtonColor: '#3b82f6',
        });
        setIsEditing(false);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: err.response?.data?.message || err.message || 'Something went wrong.',
          confirmButtonColor: '#d33',
        });
      }
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updates = getCleanUpdates(formData, originalData);
    if (Object.keys(updates).length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'No changes',
        text: 'No changes were made to the profile.',
        confirmButtonColor: '#3b82f6',
      });
      setIsEditing(false);
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save these changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#495E57',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      updateUserMutation.mutate({ email, updates: formData });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(originalData);
    setFormErrors({});
  };

  if (!email)
    return (
      <div className="flex items-center justify-center p-8 min-h-[60vh]">
        <Card className="max-w-md w-full p-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg space-y-4">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Authentication Required
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Please log in to access and manage your medical profile.
          </CardDescription>
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2.5 rounded-xl border-none shadow-xs"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );

  if (isLoading)
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

  const displayName = user.name || authUser?.displayName || 'Participant';
  const displayEmail = user.email || authUser?.email || '';
  const displayPhoto =
    user.photoURL || authUser?.photoURL || 'https://i.ibb.co/5h7FQs6N/unnamed.jpg';

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
                  src={formData.photoURL || displayPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://i.ibb.co/5h7FQs6N/unnamed.jpg';
                  }}
                />
                {isEditing && (
                  <label
                    htmlFor="avatar-file-upload"
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
                  id="avatar-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={!isEditing || uploadingImage}
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
                <span>{user.role || 'Participant'} Account</span>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Status</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                    Active User
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Member Since</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Last Login</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Active Now'}
                  </span>
                </div>
              </div>

              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3 h-auto rounded-xl border-none shadow-xs hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Edit size={16} />
                  <span>Edit Profile Details</span>
                </Button>
              )}
            </div>
          </Card>

          {/* Quick Shortcuts Card */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => navigate('/dashboard/registered-camps')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
              >
                <span>My Registered Camps</span>
                <ArrowRight
                  size={14}
                  className="text-slate-400 group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => navigate('/dashboard/payment-history')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
              >
                <span>Payment History</span>
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
                  Personal & Contact Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEditing
                    ? 'Update your account parameters below.'
                    : 'View your stored contact details.'}
                </p>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
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

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Full Name *
                  </label>
                  {isEditing ? (
                    <>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10"
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-600 font-bold mt-1">{formErrors.name}</p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <User size={14} className="text-slate-400 shrink-0" />
                      <span>{displayName}</span>
                    </div>
                  )}
                </div>

                {/* Email Address (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{displayEmail}</span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Phone Number *
                  </label>
                  {isEditing ? (
                    <>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10"
                        placeholder="+8801700000000"
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-600 font-bold mt-1">{formErrors.phone}</p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>{user.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Account Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Account Role
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 capitalize">
                    <Shield size={14} className="text-slate-400 shrink-0" />
                    <span>{user.role || 'Participant'}</span>
                  </div>
                </div>

                {/* Present Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Present Address
                  </label>
                  {isEditing ? (
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#495E57] resize-none"
                      placeholder="Enter your present address"
                    />
                  ) : (
                    <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>{user.address || 'No address specified'}</span>
                    </div>
                  )}
                </div>

                {/* Profile Photo Upload Control (Editing Mode) */}
                {isEditing && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Profile Avatar Photo
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-200">
                        <img
                          src={formData.photoURL || displayPhoto}
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
                      <label htmlFor="form-file-upload" className="cursor-pointer shrink-0">
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
                          id="form-file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="submit"
                    disabled={updateUserMutation.isLoading}
                    className="flex-1 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3 h-auto rounded-xl flex items-center justify-center gap-2 border-none shadow-xs cursor-pointer"
                  >
                    {updateUserMutation.isLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Check size={16} />
                    )}
                    <span>Save Changes</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updateUserMutation.isLoading}
                    variant="outline"
                    className="flex-1 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs py-3 h-auto rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParticipantProfile;
