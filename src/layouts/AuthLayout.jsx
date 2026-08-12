import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7F8] dark:bg-slate-950 transition-colors duration-200 justify-center items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-5xl my-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
