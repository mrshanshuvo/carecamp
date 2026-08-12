import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  Loader2,
  Calendar,
  MapPin,
  User,
  Upload,
  X,
  Stethoscope,
  Image as ImageIcon,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const CampFormModal = ({ initialData, onClose, onUpdated }) => {
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialData.name,
      fees: initialData.fees,
      dateTime: new Date(initialData.dateTime).toISOString().slice(0, 16),
      location: initialData.location,
      healthcareProfessional: initialData.healthcareProfessional,
      description: initialData.description || '',
      image: null,
    },
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData.imageURL || initialData.image || '');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageURL = initialData.imageURL || initialData.image || '';

      if (data.image && data.image.length > 0) {
        setImageUploading(true);
        const formData = new FormData();
        formData.append('image', data.image[0]);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
          method: 'POST',
          body: formData,
        });
        const imgbbData = await imgbbRes.json();

        if (!imgbbData.success) throw new Error('Image upload failed');
        imageURL = imgbbData.data.display_url;
        setImageUploading(false);
      }

      const updatedCamp = {
        name: data.name,
        fees: parseFloat(data.fees),
        dateTime: data.dateTime,
        location: data.location,
        healthcareProfessional: data.healthcareProfessional,
        description: data.description || '',
        image: imageURL,
        imageURL: imageURL,
      };

      const res = await axiosSecure.patch(`/camps/${initialData._id}`, updatedCamp);

      if (res.data?.success || res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Camp Updated Successfully!',
          text: 'Medical camp parameters have been saved.',
          confirmButtonColor: '#495E57',
        });
        onUpdated();
      } else {
        throw new Error(res.data?.message || 'Update failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: error.message || 'Something went wrong while updating camp!',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header Banner */}
        <div className="bg-[#495E57] dark:bg-slate-950 text-white p-5 sm:p-6 flex justify-between items-center shrink-0 border-b border-white/10">
          <div>
            <Badge className="bg-white/10 text-[#F4CE14] border border-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1">
              Edit Camp Parameters
            </Badge>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">{initialData.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 overflow-y-auto"
          noValidate
        >
          {/* Camp Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Camp Title / Name *
            </label>
            <div className="relative">
              <Input
                type="text"
                {...register('name', { required: 'Camp name is required' })}
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10 pl-10"
              />
              <Stethoscope size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
            {errors.name && (
              <p className="text-xs font-bold text-rose-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Image Upload Dropzone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Camp Banner Photo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <div className="w-20 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Update promotional image
                </p>
                <p className="text-[10px] text-slate-400">PNG, JPG, or WEBP. Max 5MB.</p>
              </div>
              <label htmlFor="modal-camp-image" className="cursor-pointer shrink-0">
                <div className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 hover:opacity-90 transition">
                  <Upload size={14} />
                  <span>Change</span>
                </div>
                <input
                  id="modal-camp-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('image', {
                    onChange: handleImageChange,
                  })}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fees */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Registration Fee (USD) *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  {...register('fees', {
                    required: 'Fee is required',
                    min: { value: 0, message: 'Fee must be positive' },
                  })}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10 pl-10"
                />
                <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
              </div>
              {errors.fees && (
                <p className="text-xs font-bold text-rose-500 mt-1">{errors.fees.message}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Date & Time *
              </label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  {...register('dateTime', { required: 'Date and time is required' })}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10 pl-10"
                />
                <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
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
                  {...register('location', { required: 'Location is required' })}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10 pl-10"
                />
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
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
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl h-10 pl-10"
                />
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
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
              Camp Overview (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#495E57] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || imageUploading}
            className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3 h-auto rounded-xl flex items-center justify-center gap-2 border-none shadow-xs hover:opacity-90 transition cursor-pointer"
          >
            {isSubmitting || imageUploading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Save Camp Changes</span>
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CampFormModal;
