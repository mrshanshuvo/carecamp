import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Calendar,
  Users,
  User,
  ChevronRight,
  CheckCircle,
  Loader2,
  Shield,
  Stethoscope,
  Tag,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../hooks/useUserRole';
import Swal from 'sweetalert2';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const fetchCampById = async (campId, axiosInstance) => {
  const res = await axiosInstance.get(`/camps/${campId}`);
  return res.data.data?.camp || res.data.camp;
};

const checkRegistrationStatus = async (campId, axiosSecure) => {
  const res = await axiosSecure.get(`/registrations/check`, {
    params: { campId },
  });
  return res.data.data?.registered ?? res.data.registered;
};

const CampDetails = () => {
  const { campId } = useParams();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    participantName: user?.displayName || '',
    participantEmail: user?.email || '',
    age: '',
    phoneNumber: '',
    gender: '',
    emergencyContact: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Fetch camp details
  const {
    data: camp,
    isLoading,
    isError,
    error,
    refetch: refetchCamp,
  } = useQuery({
    queryKey: ['camp', campId],
    queryFn: () => fetchCampById(campId, axiosInstance),
    staleTime: 5 * 60 * 1000,
    enabled: !!campId,
  });

  const { role, roleLoading, error: roleError } = useUserRole();

  // Check registration status
  const { data: isAlreadyRegistered = false, refetch: refetchRegistration } = useQuery({
    queryKey: ['registrationStatus', campId, user?.email],
    queryFn: () => checkRegistrationStatus(campId, axiosSecure),
    enabled: !!user && !!campId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recommended camps ("You May Also Like")
  const { data: recommendedRes = [] } = useQuery({
    queryKey: ['recommendedCamps'],
    queryFn: async () => {
      const res = await axiosInstance.get('/camps?sort=participantCount');
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const recommendedCamps = useMemo(
    () => recommendedRes.filter((c) => c._id !== campId).slice(0, 6),
    [recommendedRes, campId]
  );

  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7F8] dark:bg-slate-950">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-600 mb-2">Failed to load camp details</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
            {error?.message || 'Please try again later'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs rounded-xl"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (roleError) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md w-full">
          <p className="text-red-600 font-bold text-sm">Failed to load user role.</p>
        </div>
      </div>
    );
  }

  const isOrganizer = role === 'organizer';

  const openModal = () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'You must be logged in!',
        text: 'Please log in to register for the camp.',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#495E57',
        cancelButtonColor: '#E53E3E',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }

    setJoinError('');
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.age || !formData.phoneNumber || !formData.gender || !formData.emergencyContact) {
      setJoinError('Please fill all required fields.');
      return;
    }

    setFormSubmitting(true);
    setJoinError('');

    try {
      await axiosSecure.post('/registrations', {
        campId,
        participantName: formData.participantName,
        participantEmail: formData.participantEmail,
        age: formData.age,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
      });

      await axiosSecure.patch(`/camps/${campId}/increment`, {});

      setJoinSuccess(true);
      setModalOpen(false);
      await refetchRegistration();
      refetchCamp();
    } catch (err) {
      console.error('Registration Error:', err.response?.data || err.message);
      if (err.response?.status === 404) {
        setJoinError('Camp not found - please refresh and try again');
      } else {
        setJoinError(err.response?.data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const targetCapacity = camp.targetCapacity || 250;
  const progressPct = Math.min((camp.participantCount / targetCapacity) * 100, 100);

  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Badge */}
        <div className="flex justify-between items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <Stethoscope size={16} className="text-[#495E57] dark:text-[#F4CE14]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Healthcare Event Details
            </span>
          </div>

          <Badge
            variant="secondary"
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs"
          >
            <Users size={14} className="text-[#495E57] dark:text-[#F4CE14]" />
            <span>{camp.participantCount} Attended</span>
          </Badge>
        </div>

        {/* Registration Success Alert */}
        {(joinSuccess || isAlreadyRegistered) && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
            <div>
              <p className="text-emerald-900 dark:text-emerald-200 font-bold text-sm">
                You are registered for this camp!
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 text-xs">
                Your spot has been reserved. Check your dashboard for updates.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Hero Image & Overview */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Cover Card */}
            <div className="relative h-72 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              {camp.imageURL || camp.image ? (
                <img
                  src={camp.imageURL || camp.image}
                  alt={camp.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🏥</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Specialist Tag */}
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-extrabold px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 shadow-xs"
                >
                  <Tag size={13} className="text-[#495E57] dark:text-[#F4CE14]" />
                  <span>{camp.healthcareProfessional || 'General Healthcare'}</span>
                </Badge>
              </div>

              {/* Fee Pill */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 text-sm font-black px-4 py-1.5 rounded-full shadow-xs border-none flex items-center gap-1">
                  <FaBangladeshiTakaSign size={12} />
                  <span>{camp.fees > 0 ? Number(camp.fees).toFixed(0) : 'Free'}</span>
                </Badge>
              </div>
            </div>

            {/* Camp Header Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {camp.name}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#495E57] dark:text-[#F4CE14] mt-2 flex items-center gap-2">
                <User size={18} />
                <span>Lead Specialist: {camp.healthcareProfessional}</span>
              </p>
            </div>

            {/* Detailed Overview Card */}
            <Card className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ChevronRight size={20} className="text-[#495E57] dark:text-[#F4CE14]" />
                <span>Camp Overview & Services</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {camp.description ||
                  'Join our certified medical camp offering free health consultations, diagnostic screenings, and personalized care from top-tier medical specialists.'}
              </p>
            </Card>
          </div>

          {/* Right Column - Booking & Event Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <Card className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              {/* Fee Section */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Registration Fee
                </span>
                <div className="flex items-baseline gap-1 text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <FaBangladeshiTakaSign size={24} className="text-[#495E57] dark:text-[#F4CE14]" />
                  <span>{camp.fees > 0 ? Number(camp.fees).toFixed(0) : 'Free'}</span>
                </div>
              </div>

              {/* Event Metrics List */}
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      Date & Time
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {new Date(camp.dateTime).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      Location
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {camp.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      Specialist Doctor
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {camp.healthcareProfessional}
                    </span>
                  </div>
                </div>

                {/* Attendance Gauge */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-[#495E57] dark:text-[#F4CE14]" />
                      <span>{camp.participantCount} Registered</span>
                    </span>
                    <span className="font-mono">{progressPct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#495E57] to-[#F4CE14] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  onClick={openModal}
                  disabled={isOrganizer || joinSuccess || isAlreadyRegistered || formSubmitting}
                  className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3.5 h-auto rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer shadow-xs disabled:opacity-50 border-none"
                >
                  {isOrganizer ? (
                    <>
                      <Shield size={18} />
                      <span>You are an Organizer</span>
                    </>
                  ) : joinSuccess || isAlreadyRegistered ? (
                    <>
                      <CheckCircle size={18} />
                      <span>Already Registered</span>
                    </>
                  ) : formSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Register for Camp Now</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* You May Also Like Section (Horizontal Left to Right Scroll) */}
        {recommendedCamps.length > 0 && (
          <div className="pt-10 space-y-5 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  You May Also Like
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Explore other medical camps and healthcare events
                </p>
              </div>

              <Link
                to="/available-camps"
                className="text-xs font-bold text-[#495E57] dark:text-[#F4CE14] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Horizontal Scrollable Row (Left to Right) */}
            <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar">
              {recommendedCamps.map((recCamp) => (
                <Card
                  key={recCamp._id}
                  className="w-[260px] sm:w-[300px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group snap-start p-0 shrink-0"
                >
                  {/* Card Image Header */}
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={
                        recCamp.imageURL ||
                        recCamp.image ||
                        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80'
                      }
                      alt={recCamp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Fee Pill */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs border-none flex items-center gap-1">
                        <FaBangladeshiTakaSign size={10} />
                        <span>{recCamp.fees > 0 ? Number(recCamp.fees).toFixed(0) : 'Free'}</span>
                      </Badge>
                    </div>

                    {/* Camp Name Overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-base font-bold text-white leading-tight drop-shadow-xs line-clamp-1">
                        {recCamp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Details */}
                  <CardContent className="p-4 flex-1 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#495E57] dark:text-[#F4CE14] shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {recCamp.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#495E57] dark:text-[#F4CE14] shrink-0" />
                      <span className="truncate">{recCamp.healthcareProfessional}</span>
                    </div>
                  </CardContent>

                  {/* Action Link */}
                  <CardFooter className="p-4 pt-0">
                    <Button
                      asChild
                      className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2.5 h-auto rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition cursor-pointer border-none shadow-xs"
                    >
                      <Link to={`/camp-details/${recCamp._id}`}>
                        <span>View Details</span>
                        <ChevronRight size={14} />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Join Medical Camp
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Complete your information to register for this event.
            </DialogDescription>
          </DialogHeader>

          {/* Readonly Summary Box */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Camp:</strong> {camp.name}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Fee:</strong>{' '}
              {camp.fees > 0 ? `৳${Number(camp.fees).toFixed(0)}` : 'Free'}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Location:</strong>{' '}
              {camp.location}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="participantName"
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Participant Name *
              </label>
              <Input
                type="text"
                id="participantName"
                name="participantName"
                value={formData.participantName}
                onChange={handleInputChange}
                required
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="participantEmail"
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Participant Email *
              </label>
              <Input
                type="email"
                id="participantEmail"
                name="participantEmail"
                value={formData.participantEmail}
                onChange={handleInputChange}
                required
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="age"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Age *
                </label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="gender"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#495E57]"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="phoneNumber"
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Phone Number *
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                pattern="^\+?\d{7,15}$"
                placeholder="+8801xxxxxxxxx"
                required
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="emergencyContact"
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Emergency Contact *
              </label>
              <Input
                type="tel"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                pattern="^\+?\d{7,15}$"
                placeholder="+8801xxxxxxxxx"
                required
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl"
              />
            </div>

            {joinError && <p className="text-red-600 text-xs font-bold">{joinError}</p>}

            <Button
              type="submit"
              disabled={formSubmitting}
              className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3 h-auto rounded-xl hover:opacity-90 transition cursor-pointer border-none"
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  <span>Registering...</span>
                </>
              ) : (
                'Confirm & Register'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampDetails;
