import React from 'react';
import { OnboardingData, ExpenseItem, IncomeItem, ScreenType } from '../types';
import { 
  calculateSurplus, 
  calculateEmergencyFundTarget, 
  calculateRiskScore,
  generateWealthPlan, 
  formatNPR 
} from '../utils/calculations';
import { 
  TrendingUp, 
  Wallet, 
  Receipt, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  CreditCard, 
  PlusCircle, 
  ChevronRight,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardScreenProps {
  onboardingData: OnboardingData;
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
  onNavigate: (screen: ScreenType) => void;
  onOpenAddExpenseModal: () => void;
  onOpenDematGuide: () => void;
  language: 'en' | 'np';
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onboardingData,
  expenses,
  incomes,
  onNavigate,
  onOpenAddExpenseModal,
  onOpenDematGuide,
  language
}) => {
  const isNp = language === 'np';
  const surplusInfo = calculateSurplus(onboardingData);
  const emergencyInfo = calculateEmergencyFundTarget(onboardingData);
  const riskInfo = calculateRiskScore(onboardingData.riskQuiz);
  const wealthPlan = generateWealthPlan(onboardingData);

  const totalSpentThisMonth = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Category emoji mapping for high-density visual clarity
  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'groceries':
      case 'food & groceries':
        return '🛒';
      case 'dining':
      case 'food':
        return '☕';
      case 'rent':
      case 'housing':
        return '🏠';
      case 'transport':
      case 'fuel':
        return '⛽';
      case 'utilities':
      case 'bills':
        return '⚡';
      case 'entertainment':
      case 'shopping':
        return '🛍️';
      case 'emi':
      case 'loan':
        return '💳';
      case 'health':
        return '💊';
      default:
        return '🧾';
    }
  };

  // Circular meter SVG values
  const riskPercent = Math.min(100, Math.max(10, Math.round((riskInfo.score / 15) * 100)));
  const circumference = 2 * Math.PI * 28; // radius = 28
  const strokeDashoffset = circumference - (riskPercent / 100) * circumference;

  const emergencyPercent = Math.min(100, Math.round((emergencyInfo.currentEstimatedMonths / emergencyInfo.targetMonths) * 100));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>{isNp ? 'नमस्ते' : 'Namaste'}, {onboardingData.setup?.primaryBank ? 'Investor' : 'Friend'}</span>
            <span className="text-xl">🙏</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            {isNp 
              ? 'तपाईंको मासिक बचत, आपतकालीन कोष र एसआईपी लगानी स्थिति' 
              : 'Here is your high-density wealth allocation, emergency cushion, and SIP tracker.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="dashboard-add-expense-btn"
            onClick={onOpenAddExpenseModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#6C5CE7]" />
            <span>{isNp ? 'खर्च थप्नुहोस्' : 'Log Expense'}</span>
          </button>

          <button
            id="dashboard-explore-plan-btn"
            onClick={() => onNavigate('wealth-plan')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isNp ? 'सम्पत्ति योजना' : 'View Wealth Plan'}</span>
          </button>
        </div>
      </div>

      {/* Nepal Market Ticker Bar */}
      <div className="p-3.5 rounded-[20px] bg-white border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-gray-900 font-bold">NEPAL FINANCIAL PULSE:</span>
          <span>Commercial Bank FD Avg: <strong className="text-[#6C5CE7]">7.75% - 8.25%</strong></span>
        </div>
        <div className="flex items-center gap-4 text-gray-600 font-medium">
          <span>Top Open-Ended SIP: <strong className="text-emerald-700 font-bold">NIBL Sahabhagita (+14.8% 3Yr)</strong></span>
          <button 
            id="dashboard-market-demat-btn"
            onClick={onOpenDematGuide} 
            className="text-[#6C5CE7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Demat Guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* High Density 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Left Side 3 Columns (Risk Profile, Emergency Cushion, Active Loans) */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Card 1: Risk Profile Card */}
          <div className="bg-white p-5 rounded-[20px] shadow-xs border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Profile</span>
                <span className="text-xs font-bold text-[#6C5CE7] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Score: {riskInfo.score}/15
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="#f3f4f6" 
                      strokeWidth="6" 
                      fill="none" 
                    />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="#6C5CE7" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round" 
                      fill="none" 
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900">{riskPercent}%</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">
                    {riskInfo.profile}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    {isNp ? riskInfo.descriptionNp : riskInfo.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                <span>Equities {riskInfo.recommendedEquityPct}%</span>
                <span>Fixed {100 - riskInfo.recommendedEquityPct}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#6C5CE7] h-full transition-all duration-500" 
                  style={{ width: `${riskInfo.recommendedEquityPct}%` }}
                />
                <div 
                  className="bg-purple-300 h-full transition-all duration-500" 
                  style={{ width: `${100 - riskInfo.recommendedEquityPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Emergency Fund Card */}
          <div className="bg-white p-5 rounded-[20px] shadow-xs border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency Fund</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  emergencyInfo.isCovered ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {emergencyInfo.isCovered ? 'Adequate' : 'Building'}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {formatNPR(emergencyInfo.currentEstimatedMonths * onboardingData.monthlyEssentials)}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  Target: {formatNPR(emergencyInfo.targetAmount)}
                </span>
              </div>

              <div className="w-full bg-gray-100 h-2.5 rounded-full mb-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${emergencyPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-xl text-xs text-gray-600 flex items-center justify-between">
              <span className="font-medium">
                Covers <strong>{emergencyInfo.currentEstimatedMonths}</strong> of <strong>{emergencyInfo.targetMonths} mos</strong> essentials
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          </div>

          {/* Card 3: Active Loans High-Contrast Dark Card */}
          <div className="bg-[#2D3436] p-5 rounded-[20px] shadow-lg text-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Active Loans ({onboardingData.loans.length})
              </span>
              <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded font-bold">
                {onboardingData.loans.some(l => l.interestRate >= 13) ? 'High Priority' : 'Standard'}
              </span>
            </div>

            {onboardingData.loans.length > 0 ? (
              <div className="space-y-2.5">
                {onboardingData.loans.slice(0, 2).map((loan, idx) => {
                  const isHighRate = loan.interestRate >= 13;
                  return (
                    <div 
                      key={loan.id || idx} 
                      className={`p-3 rounded-xl transition-all ${
                        isHighRate 
                          ? 'bg-[#6C5CE7] border border-white/20 shadow-md' 
                          : 'bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex justify-between text-xs font-bold">
                        <span>{loan.name}</span>
                        <span className={isHighRate ? 'text-amber-200' : 'text-gray-300'}>
                          {loan.interestRate}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-white/80 mt-1">
                        <span>EMI: {formatNPR(loan.monthlyEmi)}</span>
                        <span>Bal: {formatNPR(loan.outstandingBalance)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-white/10 rounded-xl text-xs text-gray-300 text-center">
                No high-interest loans recorded. Clean debt profile!
              </div>
            )}

            <button 
              id="dashboard-loans-btn"
              onClick={() => onNavigate('loans')}
              className="w-full py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white transition-all text-center block cursor-pointer"
            >
              View Payoff Strategy
            </button>
          </div>

        </div>

        {/* Right Side 9 Columns (Top 3 Metric Cards + Wealth Allocation & Recent Spends) */}
        <div className="lg:col-span-9 flex flex-col gap-5 sm:gap-6">
          
          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            
            {/* 1. Monthly Income */}
            <div className="bg-white p-5 rounded-[20px] shadow-xs border border-gray-100 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-gray-400 block">Monthly Income</span>
                <span className="text-xl font-bold text-gray-900 block truncate">
                  {formatNPR(onboardingData.monthlyIncome)}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 inline-block mt-0.5">
                  {onboardingData.incomeStability.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* 2. Monthly Expenses & EMIs */}
            <div className="bg-white p-5 rounded-[20px] shadow-xs border border-gray-100 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-gray-400 block">Total Expenses & EMIs</span>
                <span className="text-xl font-bold text-gray-900 block truncate">
                  {formatNPR(onboardingData.monthlyEssentials + surplusInfo.totalEMIs)}
                </span>
                <span className="text-[10px] text-gray-500 font-medium block truncate mt-0.5">
                  Fixed: {formatNPR(onboardingData.monthlyEssentials)} • EMI: {formatNPR(surplusInfo.totalEMIs)}
                </span>
              </div>
            </div>

            {/* 3. HERO: "Safe to Invest" */}
            <div className="bg-[#6C5CE7] p-5 rounded-[20px] shadow-md text-white flex items-center gap-4 relative overflow-hidden">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 z-10">
                <span className="text-xs font-semibold text-indigo-100 block">Safe to Invest</span>
                <span className="text-xl sm:text-2xl font-bold text-white block truncate">
                  {formatNPR(surplusInfo.safeToInvest)}
                </span>
                <span className="text-[10px] text-indigo-100 font-medium block truncate mt-0.5">
                  Monthly surplus ready for allocation
                </span>
              </div>
            </div>

          </div>

          {/* Main 2-Column Density Grid (Wealth Allocation Blueprint + Recent Spends) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 flex-1">
            
            {/* Wealth Plan Allocation Panel */}
            <div className="bg-white p-5 sm:p-6 rounded-[20px] shadow-xs border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Wealth Plan Allocation</h3>
                    <p className="text-xs text-gray-500">Monthly systematic distribution</p>
                  </div>
                  <button
                    id="dashboard-explore-wealth-btn"
                    onClick={() => onNavigate('wealth-plan')}
                    className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  
                  {/* SIP Allocation */}
                  <div 
                    onClick={() => onNavigate('wealth-plan')}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-indigo-50/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#6C5CE7] font-bold text-xs">
                        SIP
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {wealthPlan.sip.recommendedFunds[0]?.name || 'NIBL Sahabhagita'}
                        </h4>
                        <span className="text-[11px] text-gray-500">Equity Mutual Fund • Monthly</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 block">
                        {formatNPR(wealthPlan.sip.allocatedMonthly)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">12-15% CAGR</span>
                    </div>
                  </div>

                  {/* Emergency Buffer */}
                  <div 
                    onClick={() => onNavigate('wealth-plan')}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-emerald-50/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xs">
                        FD/SAV
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Emergency Fund Buffer</h4>
                        <span className="text-[11px] text-gray-500">Liquid Savings • {onboardingData.setup.primaryBank}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 block">
                        {formatNPR(wealthPlan.emergencyFund.allocatedMonthly)}
                      </span>
                      <span className="text-[10px] text-gray-400">Target buffer</span>
                    </div>
                  </div>

                  {/* High Interest Loan Overpay or FD Ladder */}
                  <div 
                    onClick={() => onNavigate(wealthPlan.loanPrepayment.hasHighInterestDebt ? 'loans' : 'wealth-plan')}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-purple-50/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold text-xs">
                        {wealthPlan.loanPrepayment.hasHighInterestDebt ? 'DEBT' : 'FD'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {wealthPlan.loanPrepayment.hasHighInterestDebt ? 'Extra Loan Overpayment' : 'Fixed Deposit Ladder'}
                        </h4>
                        <span className="text-[11px] text-gray-500">
                          {wealthPlan.loanPrepayment.hasHighInterestDebt ? 'Avalanche Acceleration' : 'Guaranteed 8.00% p.a.'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 block">
                        {formatNPR(wealthPlan.loanPrepayment.allocatedMonthly || wealthPlan.fdLadder.allocatedMonthly)}
                      </span>
                      <span className="text-[10px] text-purple-600 font-semibold">
                        {wealthPlan.loanPrepayment.hasHighInterestDebt ? 'Save High Interest' : 'Guaranteed Return'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <button
                id="dashboard-confirm-allocation-btn"
                onClick={() => onNavigate('wealth-plan')}
                className="w-full mt-4 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs shadow-xs transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Monthly Allocation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recent Spends Panel */}
            <div className="bg-white p-5 sm:p-6 rounded-[20px] shadow-xs border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Recent Spends</h3>
                    <p className="text-xs text-gray-500">Logged transactions this month</p>
                  </div>
                  <button 
                    id="dashboard-see-all-expenses-btn"
                    onClick={() => onNavigate('expenses')}
                    className="text-xs text-[#6C5CE7] font-bold hover:underline cursor-pointer"
                  >
                    See All ({expenses.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {expenses.slice(0, 3).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-base shrink-0">
                          {getCategoryEmoji(expense.category)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block leading-tight">{expense.title}</span>
                          <span className="text-[11px] text-gray-400">{expense.category} • {expense.date}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        -{formatNPR(expense.amount)}
                      </span>
                    </div>
                  ))}

                  {expenses.length === 0 && (
                    <div className="py-6 text-center text-xs text-gray-400">
                      No expenses logged yet. Tap below to add your first expense.
                    </div>
                  )}
                </div>
              </div>

              <div 
                id="dashboard-quick-add-btn"
                onClick={onOpenAddExpenseModal}
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-600 font-semibold cursor-pointer transition-all mt-4 flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-[#6C5CE7]" />
                <span>+ Log New Transaction</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
