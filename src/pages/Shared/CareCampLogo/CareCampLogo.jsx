import { NavLink } from 'react-router';

const CareCampLogo = ({ variant = 'dark', showSubtitle = true, size = 'md' }) => {
  const isLight = variant === 'light';

  const textMain = isLight ? 'text-white' : 'text-[#45474B] dark:text-slate-100';
  const subText = isLight ? 'text-white/75' : 'text-[#495E57]/70 dark:text-slate-400';

  const boxBg = 'bg-[#F5F7F8] dark:bg-slate-800';
  const boxBorder = isLight ? 'border-[#F4CE14]/40' : 'border-[#495E57]/15 dark:border-slate-700';

  const boxSize = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-12 h-12' : 'w-11 h-11';
  const imgSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-9 h-9' : 'w-8 h-8';

  return (
    <NavLink to="/" className="flex items-center gap-3 select-none">
      <div
        className={`${boxSize} rounded-xl flex items-center justify-center ${boxBg} border ${boxBorder} shadow-xs`}
      >
        <img src="/care-camp.png" alt="CareCamp Logo" className={`${imgSize} object-contain`} />
      </div>

      <div className="flex flex-col leading-tight text-left">
        <span className={`font-bold text-xl ${textMain}`}>CareCamp</span>

        {showSubtitle && <span className={`text-xs ${subText} tracking-wide`}>Medical Camp</span>}
      </div>
    </NavLink>
  );
};

export default CareCampLogo;
