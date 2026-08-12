import React from 'react';
import {
  BookOpen,
  Users,
  ClipboardList,
  LayoutDashboard,
  CreditCard,
  BarChart2,
  Bell,
  Smartphone,
  Code,
  Globe,
  Github,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: <ClipboardList className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Camp Management',
    description: 'Create, edit, and manage medical camps with comprehensive tools',
  },
  {
    icon: <CreditCard className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Secure Payments',
    description: 'Stripe integration for safe and reliable transactions',
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Participant Analytics',
    description: 'Dynamic charts and insights for better decision making',
  },
  {
    icon: <Bell className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Real-time Updates',
    description: 'Instant notifications for all critical actions',
  },
  {
    icon: <Smartphone className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Responsive Design',
    description: 'Optimized for all devices from mobile to desktop',
  },
  {
    icon: <LayoutDashboard className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Role-based Dashboards',
    description: 'Custom interfaces for organizers and participants',
  },
];

const LINKS = [
  {
    icon: <Globe className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Live Website',
    url: 'https://mcms-auth.firebaseapp.com/',
  },
  {
    icon: <Github className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Client Repository',
    url: 'https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-mrshanshuvo',
  },
  {
    icon: <Github className="w-5 h-5 text-[#495E57] dark:text-[#F4CE14]" />,
    title: 'Server Repository',
    url: 'https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-mrshanshuvo',
  },
];

const Docs = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Overview & Architecture Card */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-8">
          <CardContent className="p-0 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                CareCamp is a full-featured MERN stack platform that simplifies the organization and
                participation of medical camps across Bangladesh. It provides role-based dashboards,
                real-time updates, secure Stripe payments, and a modern accessible user interface.
              </p>
            </div>

            {/* Features Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURES.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-2"
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Repositories & Useful Links */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Useful Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LINKS.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {link.title}
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-[#495E57] dark:text-[#F4CE14] group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Support Callout */}
            <div className="p-6 rounded-2xl bg-[#495E57]/10 dark:bg-slate-800/40 border border-[#495E57]/20 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <HelpCircle size={24} className="text-[#495E57] dark:text-[#F4CE14] shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Need Developer Assistance?
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Get in touch with our team for integration or support queries.
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs rounded-xl px-5 py-2 h-auto border-none"
              >
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(Docs);
