import React, { useState } from 'react';
import { PiggyBank, ArrowRight, ShieldCheck, Sparkles, TrendingUp, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: Partial<UserProfile>, skipOnboarding?: boolean) => void;
  language: 'en' | 'np';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, language }) => {
  const isNp = language === 'np';
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        id: 'user-google-1',
        name: 'Binod Shrestha',
        email: 'binod.shrestha@gmail.com',
        isLoggedIn: true,
        hasCompletedOnboarding: false
      }, false);
    }, 400);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        id: 'user-email-1',
        name: name || (email.split('@')[0]) || 'Nepali Investor',
        email: email || 'user@sanchay.np',
        isLoggedIn: true,
        hasCompletedOnboarding: isSignInMode
      }, isSignInMode);
    }, 400);
  };

  const handleInstantDemo = (hasCompleted = false) => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        id: 'demo-binod',
        name: 'Binod Shrestha (काठमाडौँ)',
        email: 'binod@nepalfinance.com',
        isLoggedIn: true,
        hasCompletedOnboarding: hasCompleted
      }, hasCompleted);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Soft Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6C5CE7] text-white shadow-xs mb-3">
            <PiggyBank className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-2">
            Sanchay
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-[#6C5CE7] border border-indigo-100">
              सञ्चय
            </span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 font-medium">
            {isNp 
              ? 'व्यस्त नेपालीहरूको लागि सरल व्यक्तिगत वित्त र एसआईपी योजना' 
              : 'Personal finance & investment planning for busy people in Nepal'}
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-[20px] p-6 sm:p-7 shadow-xs border border-gray-100 relative">
          
          {/* Primary Action: Continue with Google */}
          <div className="space-y-4">
            <button
              id="google-auth-btn"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-xs text-gray-700 font-semibold text-xs transition-all cursor-pointer hover:scale-101"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSignInMode ? 'Sign in with Google' : 'Continue with Google'}</span>
            </button>

            {/* Subtle Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold uppercase text-gray-400">
                {isNp ? 'वा इमेल मार्फत' : 'or with email'}
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {!isSignInMode && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isNp ? 'तपाईंको पूरा नाम' : 'Full Name'}
                  </label>
                  <input
                    id="auth-name-input"
                    type="text"
                    placeholder="e.g. Binod Shrestha"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#6C5CE7] text-xs sm:text-sm outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isNp ? 'इमेल ठेगाना' : 'Email Address'}
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  placeholder="binod@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#6C5CE7] text-xs sm:text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isNp ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#6C5CE7] text-xs sm:text-sm outline-none transition-all"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Primary Indigo Action Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white font-semibold text-xs shadow-xs hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSignInMode ? (isNp ? 'लग-इन गर्नुहोस्' : 'Sign In') : (isNp ? 'खाता खोल्नुहोस्' : 'Create Free Account')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle Sign In / Sign Up Link */}
            <div className="text-center pt-1">
              <button
                id="auth-toggle-mode-btn"
                type="button"
                onClick={() => setIsSignInMode(!isSignInMode)}
                className="text-xs font-medium text-gray-500 hover:text-[#6C5CE7] transition-colors cursor-pointer"
              >
                {isSignInMode ? (
                  <span>{isNp ? 'नयाँ हुनुहुन्छ? ' : "Don't have an account? "} <strong className="text-[#6C5CE7] underline">{isNp ? 'दर्ता गर्नुहोस्' : 'Get Started'}</strong></span>
                ) : (
                  <span>{isNp ? 'पहिल्यै खाता छ? ' : 'Already have an account? '} <strong className="text-[#6C5CE7] underline">{isNp ? 'लग-इन गर्नुहोस्' : 'Sign In'}</strong></span>
                )}
              </button>
            </div>

            {/* Fast Demo Testing Options */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2">
                ⚡ Instant Explore (Demo Profiles)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="auth-demo-onboarding-btn"
                  type="button"
                  onClick={() => handleInstantDemo(false)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6C5CE7] border border-indigo-100 text-center transition-all cursor-pointer"
                >
                  🚀 Test Onboarding
                </button>
                <button
                  id="auth-demo-dashboard-btn"
                  type="button"
                  onClick={() => handleInstantDemo(true)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-center transition-all cursor-pointer"
                >
                  📊 Skip to Dashboard
                </button>
              </div>
            </div>

          </div>

          {/* Privacy & Trust Badge */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% private — tailored for Nepali banks & NEPSE regulations</span>
          </div>

        </div>

      </div>
    </div>
  );
};
