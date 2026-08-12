import { useState, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import SEO from '../../components/Common/SEO';
import CampCardSkeleton from '../../components/Common/CampCardSkeleton';
import { Link } from 'react-router';
import {
  MapPin,
  Calendar,
  Users,
  User,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tag,
} from 'lucide-react';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

const SORT_OPTIONS = [
  { value: 'participantCount', label: 'Most Popular' },
  { value: 'campFeesAsc', label: 'Price: Low to High' },
  { value: 'campFeesDesc', label: 'Price: High to Low' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'dateAsc', label: 'Date: Earliest' },
  { value: 'dateDesc', label: 'Date: Latest' },
];

const fetchCamps = async ({ queryKey, axiosInstance }) => {
  const [_key, { page, search, sort }] = queryKey;
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);

  const res = await axiosInstance.get(`/camps?${params.toString()}`);
  return res.data;
};

const AvailableCamps = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('participantCount');

  const axiosInstance = useAxios();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['camps', { page, search, sort }],
    queryFn: ({ queryKey }) => fetchCamps({ queryKey, axiosInstance }),
    keepPreviousData: true,
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const camps = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const getFallbackImage = () => {
    return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80';
  };

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sort)?.label || 'Sort';

  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-6 px-4 transition-colors duration-200">
      <SEO title="Available Camps" description="Explore upcoming medical camps near you." />
      <div className="max-w-7xl mx-auto">
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search camps by name, location or specialist..."
              value={search}
              onChange={handleSearchChange}
              className="h-10 w-full pl-10 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-[#495E57]"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 min-w-[190px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 px-4 cursor-pointer"
                >
                  <span>{currentSortLabel}</span>
                  <ChevronDown size={14} className="text-slate-400 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="w-[190px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md p-1"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className="text-xs font-medium cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        {isError ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-6 rounded-3xl text-center">
            <h3 className="text-base font-bold text-red-800 dark:text-red-300 mb-1">
              Failed to load medical camps
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400">{error.message}</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <CampCardSkeleton key={index} />
            ))}
          </div>
        ) : camps.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No medical camps found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keywords or sorting criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {camps.map((camp) => {
                const targetCapacity = camp.targetCapacity || 250;
                const progressPct = Math.min((camp.participantCount / targetCapacity) * 100, 100);

                return (
                  <Card
                    key={camp._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group p-0"
                  >
                    {/* Image Header with Price & Specialist Badge */}
                    <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={camp.imageURL || camp.image || getFallbackImage()}
                        alt={camp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = getFallbackImage();
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Specialist Tag Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-[11px] font-extrabold px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-800 flex items-center gap-1 shadow-xs"
                        >
                          <Tag size={12} className="text-[#495E57] dark:text-[#F4CE14]" />
                          <span>{camp.healthcareProfessional || 'General Medical'}</span>
                        </Badge>
                      </div>

                      {/* Fee Pill Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-xs flex items-center gap-1 border-none">
                          <FaBangladeshiTakaSign size={11} />
                          <span>{camp.fees > 0 ? Number(camp.fees).toFixed(0) : 'Free'}</span>
                        </Badge>
                      </div>

                      {/* Camp Name Overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <h2 className="text-lg font-bold text-white leading-tight drop-shadow-xs line-clamp-1">
                          {camp.name}
                        </h2>
                      </div>
                    </div>

                    {/* Card Content Details */}
                    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={15}
                            className="text-[#495E57] dark:text-[#F4CE14] shrink-0"
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {camp.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar
                            size={15}
                            className="text-[#495E57] dark:text-[#F4CE14] shrink-0"
                          />
                          <span>
                            {new Date(camp.dateTime).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User size={15} className="text-[#495E57] dark:text-[#F4CE14] shrink-0" />
                          <span className="truncate">{camp.healthcareProfessional}</span>
                        </div>

                        {/* Attendance Progress Gauge */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            <span className="flex items-center gap-1">
                              <Users size={13} className="text-[#495E57] dark:text-[#F4CE14]" />
                              <span>{camp.participantCount} Attended</span>
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
                    </CardContent>

                    {/* Card Footer Button */}
                    <CardFooter className="p-6 pt-0">
                      <Button
                        asChild
                        className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer shadow-xs group/btn h-auto border-none"
                      >
                        <Link to={`/camp-details/${camp._id}`}>
                          <span>View Camp Details</span>
                          <ArrowRight
                            size={14}
                            className="group-hover/btn:translate-x-1 transition-transform"
                          />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="outline"
                  onClick={() => setPage((old) => Math.max(old - 1, 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition cursor-pointer p-0 ${
                        page === pageNum
                          ? 'bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 shadow-xs border-none'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
                  disabled={page === totalPages || totalPages === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(AvailableCamps);
