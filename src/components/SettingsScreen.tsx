import React from 'react';
import { OnboardingData, UserProfile } from '../types';
import { 
  Settings, 
  Globe, 
  Bell, 
  User, 
  RotateCcw, 
  Download, 
  Building2, 
  ShieldCheck, 
  ChevronRight,
  CheckCircle2,
  FileSpreadsheet,
  LogOut
} from 'lucide-react';
import { NEPALI_BANKS } from '../data/nepaliFinancialData';

interface SettingsScreenProps {
  user: UserProfile;
  onboardingData: OnboardingData;
  onUpdateOnboardingData: (data: OnboardingData) => void;
  onReopenOnboarding: () => void;
  onOpenDematGuide: () => void;
  onResetData: () => void;
  onLogout: () => void;
  language: 'en' | 'np';
  onToggleLanguage: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onboardingData,
  onUpdateOnboardingData,
  onReopenOnboarding,
  onOpenDematGuide,
  onResetData,
  onLogout,
  language,
  onToggleLanguage
}) => {
  const isNp = language === 'np';

  const handleExportJSON = () => {
    const exportObj = {
      user,
      onboardingData,
      exportDate: new Date().toISOString(),
      appName: 'Sanchay Nepal'
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sanchay_financial_plan_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
          Preferences & Profile
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
          {isNp ? 'सेटिङहरू र प्राथमिकताहरू' : 'Settings & Preferences'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage your notifications, language, bank links, and financial profile.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-indigo-100 text-[#6C5CE7] font-bold text-xl flex items-center justify-center border-2 border-white shadow-xs">
            {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AJ'}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{user.name || 'Abhishek Jha'}</h3>
            <p className="text-xs text-gray-500">{user.email || 'abhishek@sanchay.np'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#6C5CE7] border border-indigo-100">
                Primary Bank: {onboardingData.setup.primaryBank}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Active Member
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            id="settings-reopen-questionnaire-btn"
            onClick={onReopenOnboarding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6C5CE7] border border-indigo-100 text-xs font-bold transition-all hover:scale-102 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isNp ? 'प्रश्नावली सम्पादन' : 'Edit Questionnaire'}</span>
          </button>

          <button
            id="settings-profile-logout-btn"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all hover:scale-102 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isNp ? 'लगआउट' : 'Log Out'}</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Language & Regional Localization */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="text-base font-bold text-gray-900">
              {isNp ? 'भाषा र मुद्रा (Language & Currency)' : 'Language & Currency'}
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">App Language</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="settings-lang-en-btn"
                  onClick={onToggleLanguage}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    language === 'en'
                      ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  id="settings-lang-np-btn"
                  onClick={onToggleLanguage}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    language === 'np'
                      ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🇳🇵 नेपाली (Nepali)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Display Currency</label>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-800 flex items-center justify-between">
                <span>Nepali Rupee (NPR - रू)</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Standard Default</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-gray-900">
              {isNp ? 'मासिक अनुस्मारक (Reminders)' : 'Alerts & Reminders'}
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notification Channel</label>
              <div className="grid grid-cols-2 gap-2">
                {['whatsapp', 'email', 'sms', 'in_app'].map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => onUpdateOnboardingData({
                      ...onboardingData,
                      setup: { ...onboardingData.setup, reminderChannel: ch as any }
                    })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center capitalize ${
                      onboardingData.setup.reminderChannel === ch
                        ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {ch === 'whatsapp' ? '💬 WhatsApp' : ch === 'email' ? '📧 Email' : ch === 'sms' ? '📱 SMS' : '🔔 In-App'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
              Auto-reminder scheduled on salary day (1st of English month or 1st of Nepali Bikram Sambat month).
            </div>
          </div>
        </div>

        {/* Demat & MeroShare Status Manager */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-gray-900">
              Demat & MeroShare Status
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">Do you have an active Demat (BOID)?</span>
                <span className="text-gray-500">Current status: {onboardingData.setup.hasDemat.toUpperCase()}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onUpdateOnboardingData({
                    ...onboardingData,
                    setup: { ...onboardingData.setup, hasDemat: 'yes' }
                  })}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                    onboardingData.setup.hasDemat === 'yes' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => onUpdateOnboardingData({
                    ...onboardingData,
                    setup: { ...onboardingData.setup, hasDemat: 'no' }
                  })}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                    onboardingData.setup.hasDemat === 'no' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-600'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <button
              id="settings-demat-guide-btn"
              onClick={onOpenDematGuide}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>View Step-by-Step Demat Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Data & Backup Actions */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="text-base font-bold text-gray-900">
              Data & Export
            </h3>
          </div>

          <div className="space-y-2.5">
            <button
              id="settings-export-json-btn"
              onClick={handleExportJSON}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6C5CE7] border border-indigo-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Sanchay Financial Plan (.JSON)</span>
            </button>

            <button
              id="settings-reset-data-btn"
              onClick={onResetData}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Sample Nepali Profile Data</span>
            </button>
          </div>
        </div>

      </div>

      {/* Account Security & Session Management Section */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                {isNp ? 'खाता तथा सत्र व्यवस्थापन (Account & Session)' : 'Account & Active Session'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isNp 
                ? `तपाईं ${user.email || user.name || 'लगइन प्रयोगकर्ता'} को रूपमा लगइन हुनुहुन्छ। आवश्यकता अनुसार लगआउट गर्न सक्नुहुन्छ।` 
                : `Signed in as ${user.email || user.name || 'Verified Nepali Investor'}. Log out to end session or switch accounts.`}
            </p>
          </div>
        </div>

        <button
          id="settings-logout-btn"
          onClick={onLogout}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:scale-102 transition-all cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>{isNp ? 'सञ्चय नेपालबाट लगआउट' : 'Log Out of Sanchay Nepal'}</span>
        </button>
      </div>

    </div>
  );
};
