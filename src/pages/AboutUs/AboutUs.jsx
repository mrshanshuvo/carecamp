import React, { useMemo } from 'react';
import {
  HeartPulse,
  Stethoscope,
  Users,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  Building2,
} from 'lucide-react';
import { Link } from 'react-router';

const FEATURES = [
  {
    icon: <CalendarCheck className="w-7 h-7 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Camp Management',
    description: 'Efficiently organize and schedule medical camps with our comprehensive tools.',
  },
  {
    icon: <Users className="w-7 h-7 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Participant Engagement',
    description: 'Connect with communities and maximize participation through our platform.',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Secure Registration',
    description: 'Protected sign-up process with verified medical professional participation.',
  },
  {
    icon: <Stethoscope className="w-7 h-7 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Healthcare Access',
    description: 'Bridge the gap between healthcare providers and underserved communities.',
  },
];

const STATS = [
  { number: '250+', label: 'Camps Organized', icon: Building2 },
  { number: '5,000+', label: 'Participants Served', icon: Users },
  { number: '100+', label: 'Healthcare Partners', icon: Award },
  { number: '24/7', label: 'Support Available', icon: Clock },
];

const AboutUs = () => {
  const MainContent = useMemo(
    () => (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="grid md:grid-cols-2">
          {/* Text Content */}
          <div className="p-8 sm:p-10 lg:p-12 space-y-6">
            <p className="text-lg sm:text-xl font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              CareCamp is a comprehensive platform designed to streamline the planning, management,
              and participation of medical camps. It empowers organizers to efficiently coordinate
              events while providing participants with an intuitive interface to discover and join
              camps that matter.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              With real-time updates, secure registration, transparent payment tracking, and
              actionable feedback, CareCamp ensures every medical camp runs smoothly, maximizes
              impact, and fosters a healthier community.
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base border-l-4 border-[#495E57] dark:border-[#F4CE14] pl-4 py-1">
              Our mission is to bridge the gap between healthcare providers and communities in need
              by leveraging technology that is simple, reliable, and accessible to all.
            </p>

            <div className="pt-4">
              <Link
                to="/available-camps"
                className="inline-flex items-center px-6 py-3.5 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold rounded-2xl shadow-md hover:opacity-90 transition-all duration-200 group text-sm cursor-pointer"
                aria-label="Explore available medical camps"
              >
                <span>Explore Available Camps</span>
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-8 sm:p-10 lg:p-12 border-t md:border-t-0 md:border-l border-slate-200/80 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#495E57] dark:text-[#F4CE14]" />
              <span>Key Features</span>
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              role="list"
              aria-label="Key features"
            >
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-200 group"
                  role="listitem"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-200 shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  const StatsSection = useMemo(
    () => (
      <div
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        role="region"
        aria-label="Platform statistics"
      >
        {STATS.map((stat, index) => {
          const IconComp = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 text-center hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#495E57]/10 dark:bg-[#F4CE14]/10 flex items-center justify-center text-[#495E57] dark:text-[#F4CE14]">
                <IconComp size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {stat.number}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    ),
    []
  );

  return (
    <div
      className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200"
      role="main"
      aria-label="About CareCamp"
    >
      <div className="max-w-6xl mx-auto">
        {MainContent}
        {StatsSection}
      </div>
    </div>
  );
};

export default React.memo(AboutUs);
