import React, { useState, useEffect } from 'react';
import { ScreenType, UserProfile, OnboardingData, ExpenseItem, IncomeItem } from './types';
import { INITIAL_ONBOARDING_STATE, INITIAL_EXPENSES, INITIAL_INCOMES } from './data/nepaliFinancialData';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DashboardScreen } from './components/DashboardScreen';
import { ExpensesScreen } from './components/ExpensesScreen';
import { WealthPlanScreen } from './components/WealthPlanScreen';
import { LoansScreen } from './components/LoansScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DematGuideModal } from './components/DematGuideModal';

const STORAGE_KEYS = {
  USER: 'sanchay_user_profile',
  ONBOARDING: 'sanchay_onboarding_data',
  EXPENSES: 'sanchay_expenses_list',
  INCOMES: 'sanchay_incomes_list',
  LANG: 'sanchay_language'
};

export default function App() {
  // Load saved user session or default
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: '',
      name: '',
      email: '',
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      language: 'en'
    };
  });

  // Current screen
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    if (!user.isLoggedIn) return 'auth';
    if (!user.hasCompletedOnboarding) return 'onboarding';
    return 'dashboard';
  });

  // Onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ONBOARDING_STATE;
  });

  // Expenses
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EXPENSES;
  });

  // Incomes
  const [incomes, setIncomes] = useState<IncomeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCOMES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INCOMES;
  });

  // Language state
  const [language, setLanguage] = useState<'en' | 'np'>('en');

  // Demat Guide Modal
  const [isDematModalOpen, setIsDematModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(onboardingData));
    } catch {}
  }, [onboardingData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch {}
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
    } catch {}
  }, [incomes]);

  const handleLoginSuccess = (userUpdates: Partial<UserProfile>, skipOnboarding: boolean = false) => {
    const updatedUser: UserProfile = {
      id: userUpdates.id || 'user-1',
      name: userUpdates.name || 'Binod Shrestha',
      email: userUpdates.email || 'binod@nepalfinance.com',
      isLoggedIn: true,
      hasCompletedOnboarding: skipOnboarding,
      language
    };
    setUser(updatedUser);
    if (skipOnboarding) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleOnboardingComplete = (completedData: OnboardingData) => {
    setOnboardingData(completedData);
    setUser(prev => ({
      ...prev,
      hasCompletedOnboarding: true
    }));
    setCurrentScreen('dashboard');
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'np' : 'en'));
  };

  const handleResetData = () => {
    setOnboardingData(INITIAL_ONBOARDING_STATE);
    setExpenses(INITIAL_EXPENSES);
    setIncomes(INITIAL_INCOMES);
    alert('Reset to default sample data for Kathmandu professional profile!');
  };

  // If not logged in, show Auth Screen
  if (currentScreen === 'auth' || !user.isLoggedIn) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        language={language}
      />
    );
  }

  // If in onboarding flow
  if (currentScreen === 'onboarding' && !user.hasCompletedOnboarding) {
    return (
      <OnboardingFlow
        initialData={onboardingData}
        onComplete={handleOnboardingComplete}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-slate-800 flex flex-col font-sans selection:bg-[#6C5CE7] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(scr) => {
          setCurrentScreen(scr);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        hasDemat={onboardingData.setup.hasDemat}
        onOpenDematGuide={() => setIsDematModalOpen(true)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            onboardingData={onboardingData}
            expenses={expenses}
            incomes={incomes}
            onNavigate={(scr) => {
              setCurrentScreen(scr);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAddExpenseModal={() => setCurrentScreen('expenses')}
            onOpenDematGuide={() => setIsDematModalOpen(true)}
            language={language}
          />
        )}

        {currentScreen === 'expenses' && (
          <ExpensesScreen
            expenses={expenses}
            incomes={incomes}
            onAddExpense={(newExp) => setExpenses(prev => [{ ...newExp, id: `exp-${Date.now()}` }, ...prev])}
            onDeleteExpense={(id) => setExpenses(prev => prev.filter(e => e.id !== id))}
            onAddIncome={(newInc) => setIncomes(prev => [{ ...newInc, id: `inc-${Date.now()}` }, ...prev])}
            onDeleteIncome={(id) => setIncomes(prev => prev.filter(i => i.id !== id))}
            language={language}
          />
        )}

        {currentScreen === 'wealth-plan' && (
          <WealthPlanScreen
            onboardingData={onboardingData}
            onOpenDematGuide={() => setIsDematModalOpen(true)}
            language={language}
          />
        )}

        {currentScreen === 'loans' && (
          <LoansScreen
            loans={onboardingData.loans}
            onUpdateLoans={(updated) => setOnboardingData(p => ({ ...p, loans: updated }))}
            language={language}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            user={user}
            onboardingData={onboardingData}
            onUpdateOnboardingData={setOnboardingData}
            onReopenOnboarding={() => {
              setUser(p => ({ ...p, hasCompletedOnboarding: false }));
              setCurrentScreen('onboarding');
            }}
            onOpenDematGuide={() => setIsDematModalOpen(true)}
            onResetData={handleResetData}
            language={language}
            onToggleLanguage={handleToggleLanguage}
          />
        )}

      </main>

      {/* Demat Guide Modal */}
      <DematGuideModal
        isOpen={isDematModalOpen}
        onClose={() => setIsDematModalOpen(false)}
        primaryBank={onboardingData.setup.primaryBank}
        language={language}
      />

    </div>
  );
}
