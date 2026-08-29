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

  // Expenses with numerical sanitization
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            amount: Number(item.amount) || 0
          }));
        }
      }
    } catch {}
    return INITIAL_EXPENSES;
  });

  // Incomes with numerical sanitization
  const [incomes, setIncomes] = useState<IncomeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCOMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            amount: Number(item.amount) || 0
          }));
        }
      }
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

  const handleAddExpense = (newExp: Omit<ExpenseItem, 'id'>) => {
    const expenseWithId: ExpenseItem = {
      ...newExp,
      amount: Number(newExp.amount) || 0,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };
    
    setExpenses(prev => {
      const updated = [expenseWithId, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Synchronize essential expense changes into onboardingData for unified dashboard calculations
    setOnboardingData(prev => {
      const updatedExpenses = [expenseWithId, ...expenses];
      const essentialsSum = updatedExpenses
        .filter(e => e.isEssential)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      return {
        ...prev,
        monthlyEssentials: essentialsSum > 0 ? essentialsSum : prev.monthlyEssentials
      };
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setOnboardingData(prev => {
      const updatedExpenses = expenses.filter(e => e.id !== id);
      const essentialsSum = updatedExpenses
        .filter(e => e.isEssential)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      return {
        ...prev,
        monthlyEssentials: essentialsSum > 0 ? essentialsSum : prev.monthlyEssentials
      };
    });
  };

  const handleAddIncome = (newInc: Omit<IncomeItem, 'id'>) => {
    const incomeWithId: IncomeItem = {
      ...newInc,
      amount: Number(newInc.amount) || 0,
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };

    setIncomes(prev => {
      const updated = [incomeWithId, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Synchronize total income into onboardingData for unified dashboard calculations
    setOnboardingData(prev => {
      const updatedIncomes = [incomeWithId, ...incomes];
      const totalInc = updatedIncomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      return {
        ...prev,
        monthlyIncome: totalInc > 0 ? totalInc : prev.monthlyIncome
      };
    });
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(prev => {
      const updated = prev.filter(i => i.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setOnboardingData(prev => {
      const updatedIncomes = incomes.filter(i => i.id !== id);
      const totalInc = updatedIncomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      return {
        ...prev,
        monthlyIncome: totalInc > 0 ? totalInc : prev.monthlyIncome
      };
    });
  };

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
    
    // Also sync the primary salary income stream if completedData specifies monthlyIncome
    if (completedData.monthlyIncome) {
      setIncomes(prev => {
        const salaryIdx = prev.findIndex(i => i.source.toLowerCase().includes('salary') || i.source.toLowerCase().includes('primary'));
        if (salaryIdx >= 0) {
          const updated = [...prev];
          updated[salaryIdx] = {
            ...updated[salaryIdx],
            amount: completedData.monthlyIncome
          };
          try {
            localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return prev;
      });
    }

    setCurrentScreen('dashboard');
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'np' : 'en'));
  };

  const handleResetData = () => {
    setOnboardingData(INITIAL_ONBOARDING_STATE);
    setExpenses(INITIAL_EXPENSES);
    setIncomes(INITIAL_INCOMES);
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(INITIAL_ONBOARDING_STATE));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(INITIAL_INCOMES));
    } catch {}
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
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
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
