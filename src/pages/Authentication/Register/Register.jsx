import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Upload,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxios';

import CareCampLogo from '../../Shared/CareCampLogo/CareCampLogo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const axiosInstance = useAxios();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setImageURL(data.data.display_url);
        toast.success('Profile picture uploaded successfully!');
      } else {
        toast.error('Image upload failed. Please try again.');
      }
    } catch {
      toast.error('Error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await createUser(data.email, data.password);

      await updateUserProfile(data.name, imageURL || '');

      const userData = {
        name: data.name,
        email: data.email,
        photoURL: imageURL || '',
        imageURL: imageURL || '',
        role: 'participant',
        created_at: new Date().toISOString(),
      };

      await axiosInstance.post('/users', userData);

      toast.success(`Account created successfully! Welcome, ${data.name}!`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-0">
      {/* Left Visual Brand Banner (5 Cols) */}
      <div className="lg:col-span-5 bg-[#495E57] dark:bg-slate-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#495E57] dark:from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 space-y-4">
          <Badge className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <HeartHandshake size={14} className="text-[#F4CE14]" />
            <span>Join Our Healthcare Community</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Register Today & Access Free Medical Camps & Care
          </h2>
        </div>

        <div className="relative z-10 space-y-4 pt-8">
          <div className="space-y-2 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#F4CE14] shrink-0" />
              <span>Instant Camp Registration & Spot Reservation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#F4CE14] shrink-0" />
              <span>Personalized Medical History & Feedback Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#F4CE14] shrink-0" />
              <span>Verified Doctors & Specialist Consultants</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Free Registration</span>
            <span className="font-bold text-[#F4CE14]">CareCamp Account</span>
          </div>
        </div>
      </div>

      {/* Right Form Container (7 Cols) */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
        {/* Header & Logo */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <CareCampLogo />
            <Link
              state={{ from }}
              to="/login"
              className="text-xs font-bold text-[#495E57] dark:text-[#F4CE14] hover:underline"
            >
              Sign in instead →
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Create an Account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
              Fill in your information to complete registration
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            {/* Left Column: Profile Picture Upload (4 cols) */}
            <div className="sm:col-span-4 flex flex-col space-y-1">
              <label
                htmlFor="image"
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Profile Picture
              </label>
              <label className="flex-1 flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative overflow-hidden group p-4">
                {uploadingImage ? (
                  <div className="flex flex-col items-center justify-center text-[#495E57] dark:text-[#F4CE14]">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-[11px] font-bold">Uploading...</span>
                  </div>
                ) : imageURL ? (
                  <>
                    <img
                      src={imageURL}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white p-2 text-center">
                      <Upload size={20} className="mb-1" />
                      <span className="text-[11px] font-bold">Change Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                    <div className="w-10 h-10 bg-white dark:bg-slate-950 shadow-xs border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300">
                      <Upload size={18} className="text-[#495E57] dark:text-[#F4CE14]" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Upload Photo
                    </span>
                    <span className="text-[9px] mt-0.5 text-slate-400">Optional</span>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* Right Column: 3 Input Fields (8 cols) */}
            <div className="sm:col-span-8 space-y-3">
              {/* Name Field */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <Input
                    type="text"
                    id="name"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'At least 2 characters' },
                    })}
                    className="pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl h-9"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-600 font-bold mt-0.5">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className="pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl h-9"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-600 font-bold mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="pl-10 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl h-9"
                    placeholder="At least 6 characters"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-600 font-bold mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || uploadingImage}
            className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3.5 h-auto rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer border-none shadow-xs mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account Now'
            )}
          </Button>
        </form>

        <p className="text-center text-[11px] text-slate-400">
          By registering, you agree to CareCamp's{' '}
          <Link
            to="/terms"
            className="text-[#495E57] dark:text-[#F4CE14] font-bold hover:underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="text-[#495E57] dark:text-[#F4CE14] font-bold hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </Card>
  );
};

export default Register;
