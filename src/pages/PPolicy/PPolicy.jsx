import React, { useState, useCallback } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  CreditCard,
  Server,
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
    id: 'info-collection',
    title: 'Information We Collect',
    icon: <UserIcon className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] mt-1 shrink-0">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Personal Information
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              Name, email address, phone number, profile image, and other contact details.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] mt-1 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Registration Data
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              Medical camp registration details, payment information, and participation history.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#495E57] dark:text-[#F4CE14] mt-1 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Usage Data</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              Browser type, IP address, pages visited, and other analytics to improve our services.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'info-use',
    title: 'How We Use Your Information',
    icon: <Shield className="w-5 h-5" />,
    content: (
      <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
        {[
          {
            title: 'Service Delivery:',
            description: 'Manage your camp registrations and provide access to platform features.',
          },
          {
            title: 'Communication:',
            description: 'Send important updates about your registrations and platform changes.',
          },
          {
            title: 'Improvements:',
            description:
              'Analyze usage patterns to enhance user experience and develop new features.',
          },
          {
            title: 'Security:',
            description: 'Monitor for fraudulent activity and protect our services.',
          },
        ].map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="w-2 h-2 bg-[#495E57] dark:bg-[#F4CE14] rounded-full mt-1.5 mr-3 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-slate-100">{item.title}</strong>{' '}
              {item.description}
            </div>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'data-protection',
    title: 'Data Protection',
    icon: <Lock className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
        <p>
          We implement industry-standard security measures including encryption, access controls,
          and regular security audits to protect your information.
        </p>
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Security Measures:</h3>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {[
              'SSL/TLS encryption for all data transmissions',
              'Regular security vulnerability scanning',
              'Strict access controls and authentication protocols',
              'Secure data storage with encryption at rest',
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

const PPolicy = () => {
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
        {/* 2-Column TOC & Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Table of Contents Sidebar */}
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

          {/* Main Privacy Article */}
          <Card className="flex-1 w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
            <CardContent className="p-0 space-y-6">
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Your privacy is important to us at CareCamp (Medical Camp Management System). This
                Privacy Policy explains how we collect, use, and protect your personal information
                when you use our platform.
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
                    Still have questions about your privacy?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Our support team is available 24/7 to help resolve your concerns.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs rounded-xl px-5 py-2.5 h-auto border-none shrink-0"
                >
                  <Link to="/contact">Contact Privacy Team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PPolicy);
