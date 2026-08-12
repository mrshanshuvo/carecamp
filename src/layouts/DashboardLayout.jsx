import { Outlet } from 'react-router';
import Sidebar from '../pages/Dashboard/Sidebar';
import DashboardTopbar from '../pages/Dashboard/DashboardTopbar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F5F7F8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <DashboardTopbar />
        <main className="flex-1 bg-[#F5F7F8] dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
