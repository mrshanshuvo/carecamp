import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { MapPin, Calendar, Users, User, ArrowRight, Stethoscope, Star } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import useAxios from '../../../hooks/useAxios';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PopularCampsSection = () => {
  const axios = useAxios();

  const {
    data: camps = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['camps'],
    queryFn: async () => {
      const res = await axios.get('/camps');
      return res.data?.data || res.data?.camps || res.data || [];
    },
    staleTime: 60_000,
  });

  // Sort camps by participantCount descending and take top 6
  const popularCamps = [...camps]
    .sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0))
    .slice(0, 6);

  // Fallback image URL
  const getFallbackImage = (campName) => {
    const placeholderUrl = `https://placehold.co/400x300/495E57/F4CE14/png?text=${encodeURIComponent(
      campName
    )}`;
    return placeholderUrl;
  };

  if (isError) {
    return (
      <section className="bg-[#F5F7F8] dark:bg-slate-950 py-16 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">Error Loading Camps</h3>
            <p className="break-words">{error?.message || 'Something went wrong.'}</p>

            <Button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              variant="destructive"
              className="mt-4 rounded-xl cursor-pointer"
            >
              {isFetching ? 'Retrying...' : 'Try Again'}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F5F7F8] dark:bg-slate-950 py-16 sm:py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Minimalist Header Line like Success Stories */}
        <div className="flex items-end justify-between pb-3 mb-10 border-b border-slate-300/70 dark:border-slate-800">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <Stethoscope size={20} className="text-[#F4CE14]" aria-hidden="true" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#495E57] dark:text-slate-100">
              Popular Medical Camps
            </span>
          </div>

          <div className="flex items-center gap-4 pb-1">
            <Link
              to="/available-camps"
              className="text-xs sm:text-sm font-semibold text-[#495E57] dark:text-[#F4CE14] hover:underline flex items-center gap-1.5 group"
            >
              <span>View All Camps</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card
                key={index}
                className="border border-[#495E57]/10 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm p-0"
              >
                <Skeleton height={200} className="w-full dark:bg-slate-800" />
                <div className="p-5">
                  <Skeleton count={1} height={30} className="mb-3 dark:bg-slate-800" />
                  <Skeleton count={5} height={15} className="mb-2 dark:bg-slate-800" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCamps.map((camp) => (
                <Card
                  key={camp._id}
                  className="bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group relative p-0"
                >
                  {/* Card Media Header */}
                  <div className="relative w-full h-52 overflow-hidden bg-slate-950">
                    <img
                      src={camp.imageURL || camp.image || getFallbackImage(camp.name)}
                      alt={camp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = getFallbackImage(camp.name);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <Badge className="bg-white/90 dark:bg-slate-950/80 text-[#495E57] dark:text-[#F4CE14] backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
                        <Star size={12} fill="currentColor" className="text-[#F4CE14]" />
                        Popular Camp
                      </Badge>

                      <Badge
                        variant="outline"
                        className="bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/20 dark:border-slate-800 shadow-sm font-mono"
                      >
                        <FaBangladeshiTakaSign
                          size={11}
                          className="text-[#495E57] dark:text-[#F4CE14]"
                        />
                        <span>{camp.fees ? camp.fees.toFixed(2) : '0.00'}</span>
                      </Badge>
                    </div>

                    {/* Bottom Title Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[#F4CE14] transition-colors truncate">
                        {camp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content & Metrics */}
                  <CardContent className="p-5 sm:p-6 space-y-4 flex-1">
                    {/* Doctor / Professional Tag */}
                    <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-lg bg-[#495E57]/10 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] flex items-center justify-center flex-shrink-0">
                        <User size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-slate-400 font-medium leading-none">
                          Lead Specialist
                        </p>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                          {camp.healthcareProfessional || 'Medical Expert'}
                        </p>
                      </div>
                    </div>

                    {/* Location & Date Row */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <MapPin
                          size={14}
                          className="text-[#495E57] dark:text-[#F4CE14] flex-shrink-0"
                        />
                        <span className="truncate">{camp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Calendar
                          size={14}
                          className="text-[#495E57] dark:text-[#F4CE14] flex-shrink-0"
                        />
                        <span className="truncate">
                          {new Date(camp.dateTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Attendance Progress */}
                    <div className="pt-1">
                      <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <Users size={13} className="text-[#495E57] dark:text-[#F4CE14]" />
                          <span>Attendance</span>
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {camp.participantCount || 0} Registered
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#495E57] to-[#F4CE14] h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(((camp.participantCount || 0) / 500) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  {/* Interactive Action Button */}
                  <CardFooter className="p-5 pt-0">
                    <Button
                      asChild
                      className="w-full bg-[#495E57] hover:bg-[#3d4f49] dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center transition-all duration-200 text-sm shadow-sm group-hover:shadow-md cursor-pointer"
                    >
                      <Link to={`/camp-details/${camp._id}`}>
                        <span>View Details</span>
                        <ArrowRight
                          size={15}
                          className="ml-1.5 text-[#F4CE14] group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(PopularCampsSection);
