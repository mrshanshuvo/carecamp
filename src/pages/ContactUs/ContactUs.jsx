import React, { useRef, useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import useAxios from '../../hooks/useAxios';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageSquare,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CONTACT_INFO = [
  {
    icon: <Mail className="text-[#495E57] dark:text-[#F4CE14]" size={20} />,
    title: 'Email',
    value: 'support@carecamp.com',
    action: 'mailto:support@carecamp.com',
    actionText: 'Send us an email',
  },
  {
    icon: <Phone className="text-[#495E57] dark:text-[#F4CE14]" size={20} />,
    title: 'Phone',
    value: '+880-1234-567890',
    action: 'tel:+8801234567890',
    actionText: 'Call us now',
  },
  {
    icon: <MapPin className="text-[#495E57] dark:text-[#F4CE14]" size={20} />,
    title: 'Address',
    value: '123 Health St, Dhaka, Bangladesh',
    action: 'https://maps.google.com',
    actionText: 'View on map',
    fullWidth: true,
  },
];

const SOCIAL_LINKS = [
  { icon: <Facebook size={18} />, label: 'Facebook', url: '#' },
  { icon: <Twitter size={18} />, label: 'Twitter', url: '#' },
  { icon: <Instagram size={18} />, label: 'Instagram', url: '#' },
  { icon: <Linkedin size={18} />, label: 'LinkedIn', url: '#' },
];

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const sendEmail = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData(form.current);
      const name = formData.get('user_name');
      const email = formData.get('user_email');
      const message = formData.get('message');

      if (!name || !email || !message) {
        toast.error('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      try {
        if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
          await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
        }
        await axiosInstance.post('/contact', {
          name,
          email,
          subject: 'Website Contact Form',
          message,
        });

        toast.success("Message sent successfully! We'll get back to you soon.");
        form.current.reset();
      } catch {
        toast.error('Failed to send message. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY, axiosInstance]
  );

  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs mb-4">
            <MessageSquare size={16} className="text-[#495E57] dark:text-[#F4CE14]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Get in Touch
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
            Contact <span className="text-[#495E57] dark:text-[#F4CE14]">CareCamp Support</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions or feedback? We're here to help and would love to hear from you.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form Card (7 Cols) */}
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8">
            <CardContent className="p-0 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Send us a message
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              <form ref={form} onSubmit={sendEmail} className="space-y-4" noValidate>
                <div className="space-y-1">
                  <label
                    htmlFor="user_name"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    id="user_name"
                    name="user_name"
                    placeholder="John Doe"
                    required
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl h-10"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="user_email"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    id="user_email"
                    name="user_email"
                    placeholder="john@example.com"
                    required
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl h-10"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="How can we help you?"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#495E57]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-3.5 h-auto rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer border-none shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Socials Sidebar (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
              <CardContent className="p-0 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Contact Information
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Reach out to us directly through any of these channels.
                  </p>
                </div>

                <div className="space-y-4">
                  {CONTACT_INFO.map((info, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800"
                    >
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                        {info.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">{info.title}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {info.value}
                        </p>
                        <a
                          href={info.action}
                          target={info.action.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#495E57] dark:text-[#F4CE14] hover:underline inline-block mt-0.5"
                        >
                          {info.actionText} →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Connect With Us
                  </p>
                  <div className="flex gap-2">
                    {SOCIAL_LINKS.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#495E57] hover:text-white dark:hover:bg-[#F4CE14] dark:hover:text-slate-950 transition cursor-pointer"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContactUs);
