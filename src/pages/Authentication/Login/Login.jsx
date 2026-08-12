import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxios';

import CareCampLogo from '../../Shared/CareCampLogo/CareCampLogo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle, signInUser, createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const axiosInstance = useAxios();

  const updateLastLogin = async (email) => {
    if (!email) return;
    try {
      await axiosInstance.patch(`/users/${email}`, {
        last_login: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating last_login:', error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let user = null;
      try {
        const userCredential = await signInUser(data.email, data.password);
        user = userCredential.user;
      } catch (fbError) {
        // Handle demo account auto-creation if not yet registered in Firebase
        if (
          (data.email === 'organizer@carecamp.com' || data.email === 'participant@carecamp.com') &&
          (fbError.code === 'auth/invalid-credential' || fbError.code === 'auth/user-not-found')
        ) {
          const isOrganizer = data.email.startsWith('organizer');
          const demoName = isOrganizer ? 'Dr. Sarah Connor' : 'John Doe';
          const regRes = await createUser(data.email, data.password);
          user = regRes.user;

          try {
            await updateUserProfile(demoName, '');
          } catch {
            // Profile update fallback
          }

          await axiosInstance.post('/users', {
            name: demoName,
            email: data.email,
            photoURL: '',
            imageURL: '',
            role: isOrganizer ? 'organizer' : 'participant',
            created_at: new Date().toISOString(),
          });
        } else {
          // Native backend JWT auth fallback
          try {
            const backendRes = await axiosInstance.post('/auth/login', {
              email: data.email,
              password: data.password,
            });
            if (backendRes.data?.success && backendRes.data?.data?.token) {
              localStorage.setItem('token', backendRes.data.data.token);
              toast.success(`Welcome back, ${backendRes.data.data.user?.name || 'User'}!`);
              navigate(from, { replace: true });
              return;
            }
          } catch {
            // Ignore backend fallback error and throw primary auth error
          }
          throw fbError;
        }
      }

      toast.success(`Welcome back, ${user?.displayName || data.email.split('@')[0]}!`);
      await updateLastLogin(user?.email);
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (error.code === 'auth/invalid-credential'
          ? 'Invalid email or password. Please check your credentials or register.'
          : error.code === 'auth/too-many-requests'
            ? 'Too many failed attempts. Please try again later.'
            : 'Login failed. Please check your credentials.');

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const userData = {
        name: user.displayName || 'Google User',
        email: user.email,
        photoURL: user.photoURL || '',
        imageURL: user.photoURL || '',
        role: 'participant',
        created_at: new Date().toISOString(),
      };

      try {
        await axiosInstance.post('/users', userData);
        toast.success(`Welcome, ${user.displayName || 'User'}! Account created.`);
      } catch (err) {
        const status = err.response?.status;
        if (status === 409 || status === 400) {
          await updateLastLogin(user?.email);
        } else {
          console.error('Error saving user:', err);
        }
      }

      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage =
        error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in was cancelled. Please try again.'
          : 'Google sign-in failed. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-0">
      {/* Left Visual Brand Banner (5 Cols) */}
      <div className="lg:col-span-5 bg-[#495E57] dark:bg-slate-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#495E57] dark:from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 space-y-4">
          <Badge className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Stethoscope size={14} className="text-[#F4CE14]" />
            <span>CareCamp Management System</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Empowering Healthcare Accessibility Across Communities
          </h2>
        </div>

        <div className="relative z-10 space-y-4 pt-8">
          <div className="space-y-2 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#F4CE14] shrink-0" />
              <span>Certified Healthcare Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#F4CE14] shrink-0" />
              <span>Real-Time Camp Registration & Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#F4CE14] shrink-0" />
              <span>256-Bit SSL Encrypted Transactions</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Trusted by 10,000+ Participants</span>
            <span className="font-bold text-[#F4CE14]">v4.0</span>
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
              to="/register"
              className="text-xs font-bold text-[#495E57] dark:text-[#F4CE14] hover:underline"
            >
              Sign up free →
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Sign in to CareCamp
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
              Enter your account details below to access your dashboard
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400">Demo Login:</span>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'participant@carecamp.com');
                setValue('password', 'Password123!');
                toast.success('Demo Participant credentials filled!');
              }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#495E57] hover:text-white dark:hover:bg-[#F4CE14] dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg transition cursor-pointer border border-slate-200/60 dark:border-slate-700"
            >
              Participant
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'organizer@carecamp.com');
                setValue('password', 'Password123!');
                toast.success('Demo Organizer credentials filled!');
              }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#495E57] hover:text-white dark:hover:bg-[#F4CE14] dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg transition cursor-pointer border border-slate-200/60 dark:border-slate-700"
            >
              Organizer
            </button>
          </div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs py-3 h-auto rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Connecting Google...</span>
            </>
          ) : (
            <>
              <FcGoogle size={18} />
              <span>Continue with Google</span>
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-bold">
            <span className="px-3 bg-white dark:bg-slate-900 text-slate-400">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <Input
                type="email"
                id="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className="pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl h-10"
                placeholder="you@example.com"
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 font-bold mt-1">{errors.email.message}</p>
            )}
          </div>

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
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="pl-10 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl h-10"
                placeholder="Enter your password"
                disabled={isLoading || isGoogleLoading}
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
              <p className="text-xs text-red-600 font-bold mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3.5 h-auto rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer border-none shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign in to Dashboard'
            )}
          </Button>
        </form>

        <p className="text-center text-[11px] text-slate-400">
          By signing in, you agree to our{' '}
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

export default Login;
