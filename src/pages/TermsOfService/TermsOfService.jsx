import React, { useState, useCallback } from 'react';
import {
  ClipboardCheck,
  CreditCard,
  Shield,
  AlertTriangle,
  RefreshCw,
  Mail,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LAST_UPDATED = 'July 30, 2025';

const SECTIONS = [
  {
    id: 'user-responsibilities',
    title: 'User Responsibilities',
    icon: <ClipboardCheck className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">You agree to:</h3>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {[
              'Provide accurate and complete information during registration',
              'Use the platform only for lawful purposes',
              'Not engage in any fraudulent or harmful activities',
              'Comply with all applicable laws and regulations',
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-[#495E57] dark:bg-[#F4CE14] rounded-full mt-1.5 mr-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'registration-payment',
    title: 'Registration & Payment',
    icon: <CreditCard className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Registration',
              items: [
                'Must be 18+ or have guardian consent',
                'Valid email required for verification',
                'Complete profile for camp participation',
              ],
            },
            {
              title: 'Payments',
              items: [
                'Processed securely via Stripe',
                'Fees typically non-refundable',
                'Taxes may apply',
              ],
            },
          ].map((category, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{category.title}</h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#495E57] dark:bg-[#F4CE14] rounded-full mt-1.5 mr-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'account-security',
    title: 'Account Security',
    icon: <Shield className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            Security Responsibilities:
          </h3>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {[
              'Keep your password confidential',
              'Notify us immediately of unauthorized access',
              'Use strong authentication methods',
              'Log out after each session on shared devices',
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-[#495E57] dark:bg-[#F4CE14] rounded-full mt-1.5 mr-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const toggleSection = useCallback(
    (id) => {
      setActiveSection(activeSection === id ? null : id);
    },
    [activeSection]
  );

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <ClipboardCheck size={16} className="text-[#495E57] dark:text-[#F4CE14]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Terms of <span className="text-[#495E57] dark:text-[#F4CE14]">Service</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Table of Contents Navigation */}
          <nav className="w-full lg:w-1/4 lg:sticky lg:top-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-3 shrink-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
              Navigation
            </h2>
            <div className="space-y-1.5">
              {SECTIONS.map(({ id, title, icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                    activeSection === id
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="shrink-0">{icon}</span>
                  <span className="truncate">{title}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Terms Article */}
          <Card className="flex-1 w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
            <CardContent className="p-0 space-y-6">
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Welcome to CareCamp (Medical Camp Management System). By accessing or using our
                platform, you agree to comply with and be bound by these Terms of Service. Please
                read them carefully.
              </p>

              <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                {SECTIONS.map(({ id, title, icon, content }) => (
                  <div key={id} id={id} className="pt-6 first:pt-0 space-y-3">
                    <button
                      onClick={() => toggleSection(id)}
                      className="w-full flex justify-between items-center text-left cursor-pointer group focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] shrink-0">
                          {icon}
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#495E57] dark:group-hover:text-[#F4CE14] transition">
                          {title}
                        </h2>
                      </div>
                      <span className="text-slate-400">
                        {activeSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>

                    {activeSection === id && (
                      <div className="pt-2 pl-11 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Support Callout */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Need legal or terms clarification?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Our support team will answer your questions regarding account terms.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs rounded-xl px-5 py-2.5 h-auto border-none shrink-0"
                >
                  <Link to="/contact">Contact Legal Team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TermsOfService);
