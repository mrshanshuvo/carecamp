import React from 'react';
import {
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  Stethoscope,
  ArrowRight,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ParticipantDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Available Camps',
      description: 'Browse & register for upcoming medical camps',
      icon: <Stethoscope className="text-[#495E57] dark:text-[#F4CE14]" size={22} />,
      action: () => navigate('/available-camps'),
    },
    {
      title: 'My Registrations',
      description: 'View your registered camps & appointment status',
      icon: <CalendarCheck className="text-[#495E57] dark:text-[#F4CE14]" size={22} />,
      action: () => navigate('/dashboard/registered-camps'),
    },
    {
      title: 'Analytics',
      description: 'Access your payment insights & participation records',
      icon: <Activity className="text-[#495E57] dark:text-[#F4CE14]" size={22} />,
      action: () => navigate('/dashboard/analytics'),
    },
    {
      title: 'Feedback',
      description: 'Share your experience & rating with our team',
      icon: <ClipboardList className="text-[#495E57] dark:text-[#F4CE14]" size={22} />,
      action: () => navigate('/feedback'),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
        Welcome to Your <span className="text-[#F4CE14]">Health Portal</span>
      </h1>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            onClick={action.action}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#495E57] dark:hover:border-[#F4CE14] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group rounded-2xl"
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-400 dark:text-slate-600 group-hover:text-[#495E57] dark:group-hover:text-[#F4CE14] group-hover:translate-x-1 transition-all"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#495E57] dark:group-hover:text-[#F4CE14] transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Medical Camps Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="text-[#495E57] dark:text-[#F4CE14]" size={20} />
            Upcoming Medical Camps
          </CardTitle>
          <Button
            variant="ghost"
            onClick={() => navigate('/available-camps')}
            className="text-xs font-bold text-[#495E57] dark:text-[#F4CE14] hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore All Camps →
          </Button>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
            <Stethoscope size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Ready to Join a Camp?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Find free and specialized medical camps hosted by certified healthcare organizers
              across Bangladesh.
            </p>
          </div>
          <Button
            onClick={() => navigate('/available-camps')}
            className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-6 py-2.5 h-auto rounded-xl hover:opacity-90 transition border-none shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Available Camps</span>
            <ArrowRight size={14} />
          </Button>
        </CardContent>
      </Card>

      {/* Health Summary & Quick Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2 border-b border-slate-100 dark:border-slate-800">
            <HeartPulse className="text-[#495E57] dark:text-[#F4CE14]" size={20} />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Health Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Account Status</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                Active
              </Badge>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Blood Group</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Not Specified
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Allergies</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                None Recorded
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2 border-b border-slate-100 dark:border-slate-800">
            <ClipboardList className="text-[#495E57] dark:text-[#F4CE14]" size={20} />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Portal Logged In</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Session active and verified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2 border-b border-slate-100 dark:border-slate-800">
            <Stethoscope className="text-[#495E57] dark:text-[#F4CE14]" size={20} />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quick Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            <button
              onClick={() => navigate('/dashboard/participant-profile')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
            >
              <span>Update Profile Info</span>
              <ChevronRight
                size={14}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => navigate('/dashboard/registered-camps')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
            >
              <span>View My Registrations</span>
              <ChevronRight
                size={14}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => navigate('/feedback')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
            >
              <span>Submit Platform Feedback</span>
              <ChevronRight
                size={14}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
