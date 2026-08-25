import React from 'react';
import { ScreenType, UserProfile } from '../types';
import { 
  PiggyBank, 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
  hasDemat: 'yes' | 'no' | 'not_sure';
  onOpenDematGuide: () => void;
  language: 'en' | 'np';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  user,
  hasDemat,
  onOpenDematGuide,
  language,
  onToggleLanguage
}) => {
  const isNp = language === 'np';

  const navItems: { id: ScreenType; label: string; labelNp: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', labelNp: 'ड्यासबोर्ड', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses & Budget', labelNp: 'खर्च र बजेट', icon: Receipt },
    { id: 'wealth-plan', label: 'Wealth Plan (SIP & FD)', labelNp: 'सम्पत्ति योजना', icon: TrendingUp },
    { id: 'loans', label: 'Loan Payoff', labelNp: 'ऋण मुक्ति', icon: CreditCard },
    { id: 'settings', label: 'Settings & Guides', labelNp: 'सेटिङहरू', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & App Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 bg-[#6C5CE7] rounded-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-[#6C5CE7] transition-colors">
                Sanchay
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-[#6C5CE7] border border-indigo-100 hidden sm:inline">
                {isNp ? 'सञ्चय' : 'Nepal'}
              </span>
            </div>
          </div>

          {/* Pill-Shaped Segmented Desktop Navigation */}
          <nav className="hidden md:flex items-center bg-gray-100 p-1 rounded-full gap-1">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-5 lg:px-6 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#6C5CE7] text-white shadow-xs scale-102 font-semibold'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <span>{isNp ? item.labelNp : item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Items: Demat Status, Language Switcher, User Avatar */}
          <div className="flex items-center gap-3">
            
            {/* Demat Status Quick Badge */}
            <button
              id="nav-demat-badge-btn"
              onClick={onOpenDematGuide}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                hasDemat === 'yes'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click for Demat & MeroShare Guide"
            >
              {hasDemat === 'yes' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Demat Ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isNp ? 'डिम्याट आवश्यक' : 'Demat Setup'}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <button
              id="nav-lang-toggle-btn"
              onClick={onToggleLanguage}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
              title="Toggle English / नेपाली"
            >
              {isNp ? '🇳🇵 NP' : '🇬🇧 EN'}
            </button>

            {/* User Greeting & Avatar Badge */}
            <div 
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-gray-400 font-medium leading-none">{isNp ? 'नमस्ते,' : 'Namaste,'}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight group-hover:text-[#6C5CE7] transition-colors">{user.name || 'Abhishek Jha'}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 border-2 border-white shadow-xs flex items-center justify-center text-[#6C5CE7] font-bold text-xs sm:text-sm group-hover:scale-105 transition-transform">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AJ'}
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Row (Segmented horizontal scroll) */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 no-scrollbar border-t border-gray-100">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#6C5CE7] text-white shadow-xs font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{isNp ? item.labelNp : item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
