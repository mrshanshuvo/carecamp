import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Download,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../../components/Common/SEO';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#495E57', '#F4CE14', '#0284c7', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

const OrganizerAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const [downloadingRegs, setDownloadingRegs] = useState(false);
  const [downloadingPayments, setDownloadingPayments] = useState(false);

  const { data: overviewRes, isLoading } = useQuery({
    queryKey: ['organizerOverview'],
    queryFn: async () => {
      const res = await axiosSecure.get('/analytics/overview');
      return res.data;
    },
  });

  const summary = overviewRes?.data?.summary || {};
  const monthlyRevenue = overviewRes?.data?.monthlyRevenue || [];
  const campsBreakdown = overviewRes?.data?.campsBreakdown || [];

  const formattedChartData = monthlyRevenue.map((item) => ({
    name: `${item.year}-${String(item.month).padStart(2, '0')}`,
    revenue: item.revenue,
    transactions: item.transactions,
  }));

  const pieChartData = campsBreakdown.map((camp) => ({
    name: camp.campName,
    value: camp.participantCount || 0,
  }));

  const handleDownloadRegistrationsCSV = async () => {
    try {
      setDownloadingRegs(true);
      const res = await axiosSecure.get('/analytics/export/registrations', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'registrations.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Registrations CSV downloaded!');
    } catch {
      toast.error('Failed to export registrations CSV');
    } finally {
      setDownloadingRegs(false);
    }
  };

  const handleDownloadPaymentsCSV = async () => {
    try {
      setDownloadingPayments(true);
      const res = await axiosSecure.get('/analytics/export/payments', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payments.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Payments CSV downloaded!');
    } catch {
      toast.error('Failed to export payments CSV');
    } finally {
      setDownloadingPayments(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs font-bold text-slate-400 animate-pulse">
        Loading analytics dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <SEO
        title="Organizer Analytics"
        description="View camp performance, revenue metrics, and export data."
      />
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Badge className="bg-[#495E57]/10 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] border border-[#495E57]/20 text-[10px] font-bold px-3 py-1 rounded-full w-fit">
            <Sparkles size={12} className="mr-1.5 inline" />
            Executive Reports
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Organizer <span className="text-[#495E57] dark:text-[#F4CE14]">Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track revenue growth, participant enrollment distributions, and download data reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleDownloadRegistrationsCSV}
            disabled={downloadingRegs}
            className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs h-9 px-3.5 rounded-xl flex items-center gap-2 border-none shadow-xs hover:opacity-90 transition cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>{downloadingRegs ? 'Exporting...' : 'Export Registrations CSV'}</span>
          </Button>

          <Button
            type="button"
            onClick={handleDownloadPaymentsCSV}
            disabled={downloadingPayments}
            variant="outline"
            className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs h-9 px-3.5 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <span>{downloadingPayments ? 'Exporting...' : 'Export Payments CSV'}</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Total Camps
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {summary.totalCamps || 0}
            </h3>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Total Registrations
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {summary.totalRegistrations || 0}
            </h3>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Confirmed Payments
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {summary.paidCount || 0}
            </h3>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
            <DollarSign size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ${summary.totalRevenue || 0}
            </h3>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#495E57] dark:text-[#F4CE14]" />
            Monthly Revenue Trends
          </h3>
          {formattedChartData.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              No completed payment transactions yet to render chart.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#495E57" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Camp Participant Pie Chart */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Users size={16} className="text-[#495E57] dark:text-[#F4CE14]" />
            Participant Distribution by Camp
          </h3>
          {pieChartData.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              No camp breakdown data available.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name.substring(0, 12)}... (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Camps Breakdown Table */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Camps Performance Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-3.5">Camp Name</th>
                <th className="px-6 py-3.5">Camp Fees</th>
                <th className="px-6 py-3.5">Participants Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {campsBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-slate-400 font-bold">
                    No camps found
                  </td>
                </tr>
              ) : (
                campsBreakdown.map((camp) => (
                  <tr
                    key={camp.campId}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      {camp.campName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                      ${camp.fees}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                      {camp.participantCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrganizerAnalytics;
