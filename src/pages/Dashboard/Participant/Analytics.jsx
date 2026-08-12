import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { Calendar, Loader2, AlertCircle, BarChart3, TrendingUp, Award } from 'lucide-react';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: analyticsData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['participantAnalytics', user?.uid],
    queryFn: async () => {
      const res = await axiosSecure.get(`/analytics/${user.uid}`);
      return res.data?.data || [];
    },
    enabled: !!user?.uid,
  });

  const chartData = analyticsData.map((camp) => ({
    name: camp.campName || 'Unnamed Camp',
    fees: camp.fees || 0,
    date: camp.date ? new Date(camp.date).toLocaleDateString() : 'N/A',
    status: camp.status || 'Pending',
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">{label}</h3>
          <div className="space-y-1 text-slate-600 dark:text-slate-300">
            <p className="flex items-center">
              <FaBangladeshiTakaSign
                className="mr-2 text-[#495E57] dark:text-[#F4CE14]"
                size={14}
              />
              <span className="font-medium mr-1">Fees:</span> ৳{data.fees}
            </p>
            <p className="flex items-center">
              <Calendar className="mr-2 text-slate-400" size={14} />
              <span className="font-medium mr-1">Date:</span> {data.date}
            </p>
            <p className="flex items-center">
              <span className="mr-2">📌</span>
              <span className="font-medium mr-1">Status:</span> {data.status}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const FreeLabel = (props) => {
    const { x, y, width, value } = props;

    if (value !== 0) return null;

    return (
      <text
        x={x + width / 2}
        y={y - 6}
        textAnchor="middle"
        fill="#10b981"
        fontSize={10}
        fontWeight="700"
      >
        FREE
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Loading Analytics Data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400">
            Error Loading Analytics
          </CardTitle>
          <CardDescription className="text-xs text-red-700 dark:text-red-300">
            {error.message || 'Please try again later'}
          </CardDescription>
        </Card>
      </div>
    );
  }

  if (!analyticsData.length) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <BarChart3 className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No Analytics Data Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Your camp participation and payment charts will automatically appear here once you
              register for camps.
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = '/available-camps')}
            className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-5 py-2.5 h-auto rounded-xl inline-flex items-center gap-2 cursor-pointer"
          >
            Browse Available Camps
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#495E57] dark:bg-slate-900 text-white p-6 sm:p-8 border border-white/10 dark:border-slate-800 shadow-xl">
        <div className="relative z-10 space-y-3">
          <Badge className="bg-white/15 dark:bg-slate-800 text-white dark:text-[#F4CE14] border border-white/20 px-3 py-1 text-xs font-bold rounded-full">
            Participation Insights
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Medical Camp <span className="text-[#F4CE14]">Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-300 max-w-xl leading-relaxed">
            Visualize your medical camp fees, confirmation records, and overall event statistics.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#495E57]/10 dark:bg-[#F4CE14]/10 text-[#495E57] dark:text-[#F4CE14] border border-[#495E57]/20 dark:border-[#F4CE14]/20">
            <FaBangladeshiTakaSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Fees Paid
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1">
              <span>৳</span>
              <span>{chartData.reduce((sum, camp) => sum + (camp.fees || 0), 0).toFixed(2)}</span>
            </h3>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#495E57]/10 dark:bg-[#F4CE14]/10 text-[#495E57] dark:text-[#F4CE14] border border-[#495E57]/20 dark:border-[#F4CE14]/20">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Camps Registered
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {chartData.length}
            </h3>
          </div>
        </Card>
      </div>

      {/* Main Bar Chart Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <CardHeader className="p-0 pb-4 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="text-[#495E57] dark:text-[#F4CE14]" size={20} />
            Camp Fee Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Individual camp registration costs and fee distributions
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-[380px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="name" tick={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(73, 94, 87, 0.08)' }} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: 12, fontSize: '12px' }}
                />
                <Bar
                  dataKey="fees"
                  name="Camp Fees (৳)"
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                  label={<FreeLabel />}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#495E57" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
