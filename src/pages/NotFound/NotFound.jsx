import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="text-center space-y-6 max-w-md w-full p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h1 className="text-8xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          4<span className="text-[#495E57] dark:text-[#F4CE14]">0</span>4
        </h1>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Button
            asChild
            className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-6 py-3 h-auto rounded-2xl flex items-center gap-2 hover:opacity-90 transition cursor-pointer border-none shadow-xs"
          >
            <Link to="/">
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
