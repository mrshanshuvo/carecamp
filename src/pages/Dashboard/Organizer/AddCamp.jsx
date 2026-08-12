import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  Calendar,
  MapPin,
  User,
  Upload,
  Loader2,
  Sparkles,
  Stethoscope,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddCamp = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setImageUploading(true);

      // Upload image to imgbb
      const formData = new FormData();
      formData.append('image', data.image[0]);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: 'POST',
        body: formData,
      });
      const imgbbData = await imgbbRes.json();

      if (!imgbbData.success) {
        throw new Error('Image upload failed');
      }

      const imageURL = imgbbData.data.display_url;
      setImageUploading(false);

      const campData = {
        name: data.name,
        imageURL,
        fees: parseFloat(data.fees),
        dateTime: data.dateTime,
        location: data.location,
        healthcareProfessional: data.healthcareProfessional,
        participantCount: 0,
        description: data.description || '',
      };

      const response = await axiosSecure.post('/camps', campData);
      if (response.data.campId) {
        Swal.fire({
          icon: 'success',
          title: 'Medical Camp Created!',
          text: 'Your new medical camp has been successfully registered.',
          confirmButtonColor: '#495E57',
          confirmButtonText: 'Go to Manage Camps',
        }).then(() => {
          navigate('/dashboard/manage-camps');
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error.message || 'Something went wrong while creating the camp.',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Page Title Header */}
      <div className="space-y-1">
        <Badge className="bg-[#495E57]/10 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] border border-[#495E57]/20 text-[10px] font-bold px-3 py-1 rounded-full w-fit">
          <Sparkles size={12} className="mr-1.5 inline" />
          Organizer Hub
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Create New <span className="text-[#495E57] dark:text-[#F4CE14]">Medical Camp</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
          Publish a healthcare initiative, set registration parameters, and assign medical
          personnel.
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Camp Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Camp Title / Name *
            </label>
            <div className="relative">
              <Input
                type="text"
                {...register('name', { required: 'Camp name is required' })}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-11 pl-10"
                placeholder="e.g. Free Eye Care & Pediatric Health Drive"
              />
              <Stethoscope size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
            {errors.name && (
              <p className="text-xs font-bold text-rose-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Image Upload Dropzone with Live Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Camp Banner Photo *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <div className="w-24 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {imagePreview ? 'Image Selected' : 'Upload camp promotional image'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports PNG, JPG, or WEBP. Max size 5MB.
                </p>
              </div>
              <label htmlFor="camp-image-file" className="cursor-pointer shrink-0">
                <div className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:opacity-90 transition">
                  <Upload size={14} />
                  <span>{imagePreview ? 'Change Photo' : 'Select Photo'}</span>
                </div>
                <input
                  id="camp-image-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('image', {
                    required: 'Camp photo is required',
                    onChange: handleImageChange,
                  })}
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-xs font-bold text-rose-500 mt-1">{errors.image.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Camp Fees */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Registration Fee (USD) *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  {...register('fees', {
                    required: 'Registration fee is required',
                    min: { value: 0, message: 'Fee cannot be negative' },
                  })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-11 pl-10"
                  placeholder="0.00 (Enter 0 for Free)"
                />
                <DollarSign size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
              {errors.fees && (
                <p className="text-xs font-bold text-rose-500 mt-1">{errors.fees.message}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Date & Start Time *
              </label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  {...register('dateTime', { required: 'Date and time is required' })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-11 pl-10"
                />
                <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
              {errors.dateTime && (
                <p className="text-xs font-bold text-rose-500 mt-1">{errors.dateTime.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Venue Location *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  {...register('location', { required: 'Venue location is required' })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-11 pl-10"
                  placeholder="e.g. Dhanmondi General Hospital, Dhaka"
                />
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
              {errors.location && (
                <p className="text-xs font-bold text-rose-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Healthcare Professional */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Lead Doctor / Specialist *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  {...register('healthcareProfessional', {
                    required: 'Healthcare professional is required',
                  })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl h-11 pl-10"
                  placeholder="e.g. Dr. Ayesha Siddiqua, MBBS, FCPS"
                />
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
              {errors.healthcareProfessional && (
                <p className="text-xs font-bold text-rose-500 mt-1">
                  {errors.healthcareProfessional.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Camp Overview & Details (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#495E57] resize-none"
              placeholder="Outline services provided, special instructions, required documents..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || imageUploading}
            className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3.5 h-auto rounded-xl flex items-center justify-center gap-2 border-none shadow-xs hover:opacity-90 transition cursor-pointer"
          >
            {isSubmitting || imageUploading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Publishing Medical Camp...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Publish Medical Camp</span>
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddCamp;
