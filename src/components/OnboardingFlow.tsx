import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  OnboardingData, 
  IncomeStability, 
  EmergencyFundRange, 
  DeductionStyle, 
  TimeHorizon, 
  GrowthPreference,
  FinancialGoal,
  LoanItem
} from '../types';
import { NEPALI_BANKS, FINANCIAL_GLOSSARY } from '../data/nepaliFinancialData';
import { calculateRiskScore, calculateEmergencyFundTarget, calculateSurplus, generateWealthPlan, formatNPR } from '../utils/calculations';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  PiggyBank,
  Check
} from 'lucide-react';

interface OnboardingFlowProps {
  initialData: OnboardingData;
  onComplete: (data: OnboardingData) => void;
  language: 'en' | 'np';
}

const AVAILABLE_GOALS: { id: string; name: string; nameNp: string; icon: string }[] = [
  { id: 'g_emergency', name: 'Emergency Fund', nameNp: 'आपतकालीन कोष', icon: '🛡️' },
  { id: 'g_education', name: "Child's Education", nameNp: 'छोराछोरीको शिक्षा', icon: '🎓' },
  { id: 'g_house', name: 'House Down Payment', nameNp: 'घरको बैना रकम', icon: '🏡' },
  { id: 'g_retirement', name: 'Retirement Wealth', nameNp: 'निवृत्तिभरण कोष', icon: '🌴' },
  { id: 'g_travel', name: 'Dream Vacation / Travel', nameNp: 'विदेश भ्रमण', icon: '✈️' },
  { id: 'g_business', name: 'Business Capital', nameNp: 'व्यापार सुरु गर्न', icon: '💼' },
  { id: 'g_other', name: 'Vehicle / Wedding / Other', nameNp: 'गाडी / विवाह / अन्य', icon: '✨' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ initialData, onComplete, language }) => {
  const isNp = language === 'np';
  const [data, setData] = useState<OnboardingData>(initialData);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeGlossaryTooltip, setActiveGlossaryTooltip] = useState<string | null>(null);

  // Steps definition: Step A to F and Summary
  // If high-interest debt is false, we skip Step E (Loans)
  const steps = [
    { key: 'profile', label: isNp ? 'आय र खर्च' : 'Money Profile', stepLetter: 'A' },
    { key: 'goals', label: isNp ? 'लक्ष्यहरू' : 'Goals & Horizon', stepLetter: 'B' },
    { key: 'risk', label: isNp ? 'जोखिम मूल्याङ्कन' : 'Risk Tolerance', stepLetter: 'C' },
    { key: 'knowledge', label: isNp ? 'लगानी ज्ञान' : 'Investing Knowledge', stepLetter: 'D' },
    ...(data.hasHighInterestDebt ? [{ key: 'loans', label: isNp ? 'ऋण विवरण' : 'Loan Details', stepLetter: 'E' }] : []),
    { key: 'setup', label: isNp ? 'खाता र बैंक' : 'Practical Setup', stepLetter: data.hasHighInterestDebt ? 'F' : 'E' },
    { key: 'summary', label: isNp ? 'तपाईंको योजना' : 'Personal Plan', stepLetter: '★' }
  ];

  const currentStep = steps[activeStepIndex] || steps[0];
  const isSummaryStep = currentStep.key === 'summary';

  // Live calculations
  const riskResult = calculateRiskScore(data.riskQuiz);
  const emergencyInfo = calculateEmergencyFundTarget(data);
  const surplusInfo = calculateSurplus(data);
  const wealthPlan = generateWealthPlan(data);

  // Confetti trigger when reaching summary
  useEffect(() => {
    if (isSummaryStep) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback if canvas context is restricted
      }
    }
  }, [isSummaryStep]);

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to toggle a goal
  const handleToggleGoal = (goalId: string, name: string, nameNp: string, icon: string) => {
    const existing = data.goals.find(g => g.id === goalId);
    if (existing) {
      setData(prev => ({
        ...prev,
        goals: prev.goals.filter(g => g.id !== goalId)
      }));
    } else {
      const newGoal: FinancialGoal = {
        id: goalId,
        name,
        nameNp,
        icon,
        timeHorizon: '3_to_5yr',
        preference: 'balanced'
      };
      setData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal]
      }));
    }
  };

  // Helper for loan management
  const handleAddLoan = () => {
    const newLoan: LoanItem = {
      id: `loan-${Date.now()}`,
      name: 'Personal Loan',
      type: 'Personal Loan',
      bankName: 'Nabil Bank',
      balance: 100000,
      interestRate: 14.0,
      monthlyEMI: 7500,
      remainingTenureMonths: 15
    };
    setData(prev => ({
      ...prev,
      loans: [...prev.loans, newLoan]
    }));
  };

  const handleRemoveLoan = (loanId: string) => {
    setData(prev => ({
      ...prev,
      loans: prev.loans.filter(l => l.id !== loanId)
    }));
  };

  const handleUpdateLoan = (loanId: string, updates: Partial<LoanItem>) => {
    setData(prev => ({
      ...prev,
      loans: prev.loans.map(l => l.id === loanId ? { ...l, ...updates } : l)
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Header & Segmented Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
                Step {currentStep.stepLetter} of {steps.length - 1}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                {currentStep.label}
              </h1>
            </div>

            {/* Live Risk Badge in header when on or past Step C */}
            {activeStepIndex >= 2 && !isSummaryStep && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-xs">
                <span className="text-[11px] font-medium text-gray-500">Risk Profile:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  riskResult.profile === 'Aggressive' 
                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                    : riskResult.profile === 'Moderate'
                    ? 'bg-indigo-50 text-[#6C5CE7] border border-indigo-100'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {riskResult.profile} ({riskResult.score}/100)
                </span>
              </div>
            )}
          </div>

          {/* Segmented Progress Bar */}
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5">
            {steps.map((step, idx) => (
              <div
                key={step.key}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx <= activeStepIndex ? 'bg-[#6C5CE7]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Step Card */}
        <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-xs border border-gray-100 transition-all duration-200">
          
          {/* ================= STEP A: CORE MONEY PROFILE ================= */}
          {currentStep.key === 'profile' && (
            <div className="space-y-6">
              
              {/* Monthly Income */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '१. मासिक आम्दानी (कर पछिको खुद बचत/तलब)' : '1. Monthly Income (After Tax)'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2.5">
                  {[
                    { label: '<30k', val: 25000, range: '<30k' },
                    { label: '30k-60k', val: 45000, range: '30k-60k' },
                    { label: '60k-100k', val: 75000, range: '60k-100k' },
                    { label: '100k-200k', val: 140000, range: '100k-200k' },
                    { label: '200k+', val: 250000, range: '200k+' },
                  ].map(opt => (
                    <button
                      key={opt.range}
                      type="button"
                      id={`income-opt-${opt.range}`}
                      onClick={() => setData(p => ({ ...p, monthlyIncomeRange: opt.range, monthlyIncome: opt.val }))}
                      className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-semibold chip-interactive border text-center ${
                        data.monthlyIncomeRange === opt.range
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">{isNp ? 'वा यकिन रकम:' : 'Or exact NPR:'}</span>
                  <input
                    id="exact-income-input"
                    type="number"
                    value={data.monthlyIncome}
                    onChange={(e) => setData(p => ({ ...p, monthlyIncome: Number(e.target.value) || 0 }))}
                    className="w-36 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 focus:border-[#6C5CE7] outline-none"
                  />
                  <span className="text-xs font-bold text-slate-600">({formatNPR(data.monthlyIncome)}/mo)</span>
                </div>
              </div>

              {/* Income Stability */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '२. आम्दानीको स्थायित्व' : '2. Income Stability'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'very_stable', label: 'Very Stable (Salary)', labelNp: 'धेरै स्थिर (स्थायी तलब)' },
                    { id: 'mostly_stable', label: 'Mostly Stable', labelNp: 'प्रायः स्थिर' },
                    { id: 'variable', label: 'Variable (Business)', labelNp: 'परिवर्तनशील (व्यवसाय)' },
                    { id: 'irregular', label: 'Irregular / Freelance', labelNp: 'अनियमित (फ्रिल्यान्स)' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`stability-opt-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, incomeStability: opt.id as IncomeStability }))}
                      className={`py-3 px-3 rounded-xl text-xs font-semibold chip-interactive border text-center ${
                        data.incomeStability === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isNp ? opt.labelNp : opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Essential Expenses */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-900">
                    {isNp ? '३. मासिक अनिवार्य खर्चहरू (घरभाडा, खाना, बिजुली, यातायात)' : '3. Monthly Essential Expenses (Rent, Food, Utilities)'}
                  </label>
                  <span className="text-xs font-bold text-indigo-600">{formatNPR(data.monthlyEssentials)}</span>
                </div>
                <input
                  id="essentials-input"
                  type="number"
                  step="1000"
                  value={data.monthlyEssentials}
                  onChange={(e) => setData(p => ({ ...p, monthlyEssentials: Number(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-indigo-100 text-sm font-medium outline-none"
                />
                <p className="mt-1 text-xs text-slate-600">
                  {isNp ? 'यसले तपाईंको आपतकालीन कोषको आकार निर्धारण गर्दछ।' : 'Used to calculate your ideal 3-6 month emergency fund buffer.'}
                </p>
              </div>

              {/* Current Emergency Fund */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '४. हालको आपतकालीन बचत (बैंक वा मुद्दतीमा)' : '4. Current Emergency Fund Ready in Bank'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'none', label: 'None (० महिना)' },
                    { id: 'lt_1_month', label: '<1 Month' },
                    { id: '1_to_3_months', label: '1-3 Months' },
                    { id: '3_to_6_months', label: '3-6 Months' },
                    { id: 'gt_6_months', label: '6+ Months' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`efund-opt-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, currentEmergencyFund: opt.id as EmergencyFundRange }))}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold chip-interactive border text-center ${
                        data.currentEmergencyFund === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* High-Interest Debt Toggle */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    {isNp ? '५. उच्च ब्याजको ऋण छ? (व्यक्तिगत, क्रेडिट कार्ड, सहकारी)' : '5. Do you have high-interest debt? (Loan/Cooperative/Credit Card)'}
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {isNp ? 'ऋण भएको खण्डमा हामी ऋण तिर्ने रणनीति बनाउनेछौं।' : 'We will build an avalanche/snowball payoff plan for you.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="debt-toggle-no"
                    onClick={() => setData(p => ({ ...p, hasHighInterestDebt: false }))}
                    className={`px-4 py-2 rounded-xl text-xs font-bold chip-interactive border ${
                      !data.hasHighInterestDebt 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    id="debt-toggle-yes"
                    onClick={() => setData(p => ({ ...p, hasHighInterestDebt: true }))}
                    className={`px-4 py-2 rounded-xl text-xs font-bold chip-interactive border ${
                      data.hasHighInterestDebt 
                        ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]' 
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>

              {/* Comfortable Monthly Saving Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-900">
                    {isNp ? '६. प्रति महिना बचत/लगानी गर्न सहज लाग्ने रकम' : '6. Comfortable Monthly Amount to Save/Invest'}
                  </label>
                  <span className="text-sm font-bold text-[#6C5CE7]">{formatNPR(data.comfortableSavingAmount)}/mo</span>
                </div>
                <input
                  id="saving-slider"
                  type="range"
                  min="2000"
                  max="100000"
                  step="1000"
                  value={data.comfortableSavingAmount}
                  onChange={(e) => setData(p => ({ ...p, comfortableSavingAmount: Number(e.target.value) }))}
                  className="w-full accent-[#6C5CE7] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600 font-medium mt-1">
                  <span>रू २,०००</span>
                  <span>रू २५,०००</span>
                  <span>रू ५०,०००</span>
                  <span>रू १,००,०००+</span>
                </div>
              </div>

              {/* Deduction Style */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '७. बचत गर्ने शैली' : '7. Preferred Deduction Style'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'automatic', label: 'Automatic (Salary Day)', labelNp: 'स्वचालित (तलब आउनासाथ)', desc: 'Auto-SIP deducted from bank account' },
                    { id: 'manual', label: 'Manual Transfer', labelNp: 'म्यानुअल ट्रान्सफर', desc: 'I will transfer myself via ConnectIPS/eSewa' },
                    { id: 'not_sure', label: 'Not Sure Yet', labelNp: 'अहिले थाहा छैन', desc: 'Guide me on what works best' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`deduct-opt-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, deductionStyle: opt.id as DeductionStyle }))}
                      className={`p-3 rounded-xl text-left chip-interactive border ${
                        data.deductionStyle === opt.id
                          ? 'bg-indigo-50/70 text-[#6C5CE7] border-[#6C5CE7] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{isNp ? opt.labelNp : opt.label}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP B: GOALS & TIME HORIZON ================= */}
          {currentStep.key === 'goals' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  {isNp ? 'तपाईंका मुख्य वित्तीय लक्ष्यहरू रोज्नुहोस् (बहु-चयन)' : 'Select your top financial goals (Choose all that apply)'}
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  {isNp ? 'प्रत्येक लक्ष्यको लागि हामी उपयुक्त समय अवधि र प्रतिफल तय गर्नेछौं।' : 'We will map appropriate investment instruments (SIP vs FD) for each goal.'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_GOALS.map(g => {
                    const isSelected = data.goals.some(item => item.id === g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        id={`goal-chip-${g.id}`}
                        onClick={() => handleToggleGoal(g.id, g.name, g.nameNp, g.icon)}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left chip-interactive ${
                          isSelected
                            ? 'bg-indigo-50/80 border-[#6C5CE7] text-slate-900 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{g.icon}</span>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-bold">{isNp ? g.nameNp : g.name}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                          isSelected ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Detail Configurators */}
              {data.goals.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Configure Selected Goals ({data.goals.length})
                  </h4>

                  {data.goals.map((g, idx) => (
                    <div key={g.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{g.icon}</span> {isNp ? g.nameNp : g.name}
                        </span>
                        <span className="text-[11px] font-semibold text-indigo-600 uppercase">Goal #{idx + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Time Horizon */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Time Horizon (समय सीमा)</label>
                          <select
                            value={g.timeHorizon}
                            onChange={(e) => {
                              const val = e.target.value as TimeHorizon;
                              setData(p => ({
                                ...p,
                                goals: p.goals.map(item => item.id === g.id ? { ...item, timeHorizon: val } : item)
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                          >
                            <option value="lt_1yr">&lt; 1 Year (Short term / FD)</option>
                            <option value="1_to_3yr">1 - 3 Years</option>
                            <option value="3_to_5yr">3 - 5 Years (Medium term)</option>
                            <option value="5_to_10yr">5 - 10 Years (SIP Compounding)</option>
                            <option value="gt_10yr">10+ Years (Long term wealth)</option>
                          </select>
                        </div>

                        {/* Preference */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Growth vs Protection</label>
                          <select
                            value={g.preference}
                            onChange={(e) => {
                              const val = e.target.value as GrowthPreference;
                              setData(p => ({
                                ...p,
                                goals: p.goals.map(item => item.id === g.id ? { ...item, preference: val } : item)
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                          >
                            <option value="protect">Protect Capital (Fixed return)</option>
                            <option value="balanced">Balanced (Steady growth + safety)</option>
                            <option value="growth">Maximize Growth (Higher equity)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP C: RISK TOLERANCE QUIZ ================= */}
          {currentStep.key === 'risk' && (
            <div className="space-y-6">
              
              {/* Live Risk Meter Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {riskResult.score}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-indigo-700">Live Risk Calculation:</div>
                    <div className="text-sm font-bold text-slate-900">
                      {riskResult.profile} Investor Profile
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 text-right">
                  {isNp ? riskResult.descriptionNp : riskResult.description}
                </div>
              </div>

              {/* Q1: Reaction to 20% drop */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  1. यदि तपाईंको लगानी एक महिनामा २०% ले घट्यो भने के गर्नुहुन्छ?
                  <span className="block text-xs font-normal text-slate-600">(Reaction to a 20% market dip in a month)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sell_all', label: 'Sell Immediately', labelNp: 'तुरुन्तै सबै बेच्छु' },
                    { id: 'sell_some', label: 'Sell Some (डराएर)', labelNp: 'केही बेच्छु' },
                    { id: 'hold', label: 'Hold & Wait', labelNp: 'पर्ख र हेर (Hold)' },
                    { id: 'buy_more', label: 'Buy More on Dip', labelNp: 'थप खरिद गर्छु (सस्तोमा)' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`quiz-drop-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, riskQuiz: { ...p.riskQuiz, reactionToDrop: opt.id as any } }))}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold chip-interactive border text-center ${
                        data.riskQuiz.reactionToDrop === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Comfort with ±15% swings */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  2. वार्षिक ±१५% सम्म उतार-चढाव सहन कत्तिको सहज लाग्छ?
                  <span className="block text-xs font-normal text-slate-600">(Comfort with ±15% annual value fluctuations: 1 = Panic, 5 = Very Comfortable)</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      id={`quiz-comfort-${num}`}
                      onClick={() => setData(p => ({ ...p, riskQuiz: { ...p.riskQuiz, comfortWithSwings: num } }))}
                      className={`py-3 rounded-xl text-sm font-bold chip-interactive border text-center ${
                        data.riskQuiz.comfortWithSwings === num
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {num} {num === 1 ? '😟' : num === 5 ? '😎' : ''}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 px-1 mt-1">
                  <span>१ (अति असहज)</span>
                  <span>३ (मध्यम)</span>
                  <span>५ (पूर्ण सहज)</span>
                </div>
              </div>

              {/* Q3: Primary Objective */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  3. तपाईंको प्राथमिक लगानी उद्देश्य के हो?
                  <span className="block text-xs font-normal text-slate-600">(Primary investment objective)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'preserve', label: 'Preserve Capital', desc: 'No loss risk, fixed interest (FD/Debentures)' },
                    { id: 'steady', label: 'Steady Growth', desc: 'Beat inflation with balanced mutual funds' },
                    { id: 'aggressive', label: 'Aggressive Growth', desc: 'Maximize high long-term wealth via equity' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`quiz-obj-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, riskQuiz: { ...p.riskQuiz, primaryObjective: opt.id as any } }))}
                      className={`p-3 rounded-xl text-left chip-interactive border ${
                        data.riskQuiz.primaryObjective === opt.id
                          ? 'bg-indigo-50/80 text-[#6C5CE7] border-[#6C5CE7] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Recovery tolerance */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  4. यदि बजार घटेमा कति समय पर्खन सक्नुहुन्छ?
                  <span className="block text-xs font-normal text-slate-600">(Time willing to give for portfolio to recover)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'lt_1yr', label: '< 1 Year' },
                    { id: '1_to_3yr', label: '1 - 3 Years' },
                    { id: '3_to_5yr', label: '3 - 5 Years' },
                    { id: 'gt_5yr', label: '5+ Years' },
                    { id: 'not_sure', label: 'Not Sure' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`quiz-recov-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, riskQuiz: { ...p.riskQuiz, recoveryTolerance: opt.id as any } }))}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold chip-interactive border text-center ${
                        data.riskQuiz.recoveryTolerance === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: Checking frequency */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  5. तपाईं कति पटक आफ्नो सेयर/म्युचुअल फण्डको भाउ हेर्न रुचाउनुहुन्छ?
                  <span className="block text-xs font-normal text-slate-600">(How often will you check portfolio value?)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'daily', label: 'Daily (दैनिक)' },
                    { id: 'weekly', label: 'Weekly (हप्तामा)' },
                    { id: 'monthly', label: 'Monthly (मासिक)' },
                    { id: 'quarterly', label: 'Quarterly or Less' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`quiz-freq-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, riskQuiz: { ...p.riskQuiz, checkFrequency: opt.id as any } }))}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold chip-interactive border text-center ${
                        data.riskQuiz.checkFrequency === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP D: INVESTMENT KNOWLEDGE ================= */}
          {currentStep.key === 'knowledge' && (
            <div className="space-y-6">
              
              {/* Prior Experience */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '१. पहिले लगानी गरेको अनुभव छ?' : '1. Prior Investing Experience'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'No (पहिलो पटक)', labelNp: 'छैन (शुरुवात)' },
                    { id: 'mutual_funds', label: 'Mutual Funds', labelNp: 'म्युचुअल फण्ड' },
                    { id: 'stocks', label: 'Direct Stocks (NEPSE)', labelNp: 'सेयर बजार (नेप्से)' },
                    { id: 'debentures_ipos', label: 'IPOs / Debentures', labelNp: 'आईपीओ / डिबेन्चर' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`exp-opt-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, knowledge: { ...p.knowledge, experience: opt.id as any } }))}
                      className={`py-3 px-3 rounded-xl text-xs font-semibold chip-interactive border text-center ${
                        data.knowledge.experience === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isNp ? opt.labelNp : opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Familiar Terms with Tooltips */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  {isNp ? '२. यी शब्दावलीहरूसँग परिचित हुनुहुन्छ? (क्लिक गरेर अर्थ हेर्नुहोस्)' : '2. Which of these financial terms are you familiar with?'}
                </label>
                <p className="text-xs text-slate-600 mb-2.5">
                  Tap any term to view an educational explanation tailored for Nepal.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['SIP', 'SWP', 'FD', 'Government bonds', 'None of these'].map(term => {
                    const isSelected = data.knowledge.familiarTerms.includes(term);
                    return (
                      <div key={term} className="relative group">
                        <button
                          type="button"
                          id={`term-chip-${term}`}
                          onClick={() => {
                            if (term === 'None of these') {
                              setData(p => ({ ...p, knowledge: { ...p.knowledge, familiarTerms: ['None of these'] } }));
                            } else {
                              const updated = isSelected
                                ? data.knowledge.familiarTerms.filter(t => t !== term)
                                : [...data.knowledge.familiarTerms.filter(t => t !== 'None of these'), term];
                              setData(p => ({ ...p, knowledge: { ...p.knowledge, familiarTerms: updated } }));
                            }
                            setActiveGlossaryTooltip(term);
                          }}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold chip-interactive border flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50/90 text-[#6C5CE7] border-[#6C5CE7] shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span>{term}</span>
                          <HelpCircle className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Educational Tooltip Box */}
                {activeGlossaryTooltip && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 animate-fadeIn">
                    <Info className="w-4 h-4 text-[#6C5CE7] flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-slate-900 block mb-0.5">
                        {FINANCIAL_GLOSSARY.find(g => g.term.includes(activeGlossaryTooltip))?.term || activeGlossaryTooltip}:
                      </strong>
                      <p className="text-slate-700">
                        {FINANCIAL_GLOSSARY.find(g => g.term.includes(activeGlossaryTooltip))?.explanation || 'A powerful wealth building vehicle for regular savings in Nepal.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Comfortable Return Expectation */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '३. कति प्रतिशत वार्षिक प्रतिफलको अपेक्षा गर्नुहुन्छ?' : '3. What annual return expectation feels comfortable?'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '4_6', label: '4 - 6% (Low risk)', desc: 'Savings / Treasury bills' },
                    { id: '6_10', label: '6 - 10% (Fixed Deposits)', desc: 'Bank FD & Debt funds' },
                    { id: '10_15', label: '10 - 15% (Balanced SIP)', desc: 'Mutual funds & compounding' },
                    { id: 'gt_15', label: '15%+ (High Growth)', desc: 'Equity & NEPSE stocks' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`ret-opt-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, knowledge: { ...p.knowledge, returnExpectation: opt.id as any } }))}
                      className={`p-3 rounded-xl text-left chip-interactive border ${
                        data.knowledge.returnExpectation === opt.id
                          ? 'bg-indigo-50/80 text-[#6C5CE7] border-[#6C5CE7] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Value Fluctuations for Higher Gain */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '४. दीर्घकालीन उच्च प्रतिफलको लागि बजारको उतार-चढाव स्वीकार्य छ?' : '4. Are you okay with short-term price fluctuations for higher long-term compounding?'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'no', label: 'No (सुरक्षा मात्र)', desc: 'Keep in FD / Debt only' },
                    { id: 'somewhat', label: 'Somewhat (मध्यम)', desc: 'Balanced SIP allocation' },
                    { id: 'yes', label: 'Yes (तयार छु)', desc: 'Growth equity focus' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`fluc-opt-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, knowledge: { ...p.knowledge, acceptFluctuations: opt.id as any } }))}
                      className={`p-3 rounded-xl text-left chip-interactive border ${
                        data.knowledge.acceptFluctuations === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[11px] opacity-90 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP E: LOAN DETAILS (IF HIGH-INTEREST DEBT = YES) ================= */}
          {currentStep.key === 'loans' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {isNp ? 'ऋण र दायित्वहरू थप्नुहोस्' : 'Your Outstanding Loans & Liabilities'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Enter your loans so Sanchay can calculate the Avalanche vs Snowball debt payoff order.
                  </p>
                </div>
                <button
                  type="button"
                  id="add-loan-btn"
                  onClick={handleAddLoan}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6C5CE7] border border-indigo-200 text-xs font-bold chip-interactive"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Loan</span>
                </button>
              </div>

              {/* Loan Cards List */}
              <div className="space-y-3">
                {data.loans.map((loan, idx) => (
                  <div key={loan.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase">
                        Loan #{idx + 1} ({loan.type})
                      </span>
                      {data.loans.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLoan(loan.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Loan Type</label>
                        <select
                          value={loan.type}
                          onChange={(e) => handleUpdateLoan(loan.id, { type: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 outline-none"
                        >
                          <option value="Personal Loan">Personal Loan (व्यक्तिगत)</option>
                          <option value="Credit Card">Credit Card Debt</option>
                          <option value="Cooperative Loan">Cooperative Loan (सहकारी ऋण)</option>
                          <option value="Auto Loan">Auto / Bike Loan</option>
                          <option value="Home Loan">Home Loan (घर कर्जा)</option>
                          <option value="Other">Other Liability</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bank / Institution</label>
                        <select
                          value={loan.bankName}
                          onChange={(e) => handleUpdateLoan(loan.id, { bankName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 outline-none"
                        >
                          {NEPALI_BANKS.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Outstanding Balance (NPR)</label>
                        <input
                          type="number"
                          value={loan.balance}
                          onChange={(e) => handleUpdateLoan(loan.id, { balance: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Interest Rate (% p.a.)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={loan.interestRate}
                          onChange={(e) => handleUpdateLoan(loan.id, { interestRate: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-rose-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Monthly EMI (NPR)</label>
                        <input
                          type="number"
                          value={loan.monthlyEMI}
                          onChange={(e) => handleUpdateLoan(loan.id, { monthlyEMI: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Remaining Tenure (Months)</label>
                        <input
                          type="number"
                          value={loan.remainingTenureMonths}
                          onChange={(e) => handleUpdateLoan(loan.id, { remainingTenureMonths: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Refinancing & Reliability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Have you considered refinancing to lower rates?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'no', label: 'No' },
                      { id: 'considered', label: 'Considered' },
                      { id: 'done_before', label: 'Done Before' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setData(p => ({ ...p, refinancingConsideration: opt.id as any }))}
                        className={`py-2 px-2 rounded-lg text-xs font-semibold chip-interactive border text-center ${
                          data.refinancingConsideration === opt.id
                            ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    EMI Payment Reliability
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'never_miss', label: 'Never Miss' },
                      { id: 'rarely', label: 'Rarely' },
                      { id: 'sometimes', label: 'Sometimes' },
                      { id: 'often', label: 'Often Late' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setData(p => ({ ...p, emiReliability: opt.id as any }))}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold chip-interactive border text-center ${
                          data.emiReliability === opt.id
                            ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP F: PRACTICAL SETUP ================= */}
          {currentStep.key === 'setup' && (
            <div className="space-y-6">
              
              {/* Demat & MeroShare Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '१. तपाईंसँग डिम्याट (Demat / BOID) र मेरो सेयर (MeroShare) खाता छ?' : '1. Do you have a Demat / BOID & MeroShare account?'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'yes', label: 'Yes (पहिल्यै छ)', desc: 'Ready to invest in SIP & IPOs' },
                    { id: 'no', label: 'No (छैन)', desc: 'We will give you a 1-day setup guide' },
                    { id: 'not_sure', label: 'Not Sure', desc: 'Need help checking with bank' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`demat-opt-${opt.id}`}
                      onClick={() => setData(p => ({ ...p, setup: { ...p.setup, hasDemat: opt.id as any } }))}
                      className={`p-3 rounded-xl text-left chip-interactive border ${
                        data.setup.hasDemat === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[11px] opacity-90 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Bank */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  {isNp ? '२. तलब वा मुख्य बचत खाता कुन बैंकमा छ?' : '2. Primary Bank for Savings / Fixed Deposits'}
                </label>
                <select
                  value={data.setup.primaryBank}
                  onChange={(e) => setData(p => ({ ...p, setup: { ...p.setup, primaryBank: e.target.value } }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-[#6C5CE7]"
                >
                  {NEPALI_BANKS.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '३. भाषा प्राथमिकता' : '3. Preferred Language'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'np', label: 'नेपाली (Nepali)' },
                    { id: 'both', label: 'Both / Mixed' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setData(p => ({ ...p, setup: { ...p.setup, preferredLanguage: opt.id as any } }))}
                      className={`py-2.5 rounded-xl text-xs font-bold chip-interactive border text-center ${
                        data.setup.preferredLanguage === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder Channel */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {isNp ? '४. मासिक एसआईपी र बजेट अनुस्मारक' : '4. Monthly Wealth & SIP Reminder Channel'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'whatsapp', label: '💬 WhatsApp' },
                    { id: 'email', label: '📧 Email' },
                    { id: 'sms', label: '📱 SMS' },
                    { id: 'in_app', label: '🔔 In-App Only' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setData(p => ({ ...p, setup: { ...p.setup, reminderChannel: opt.id as any } }))}
                      className={`py-3 rounded-xl text-xs font-semibold chip-interactive border text-center ${
                        data.setup.reminderChannel === opt.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= FINAL COMPUTED SUMMARY SCREEN ================= */}
          {currentStep.key === 'summary' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900">
                  {isNp ? 'तपाईंको व्यक्तिगत सम्पत्ति योजना तयार भयो!' : 'Your Personalized Wealth Plan is Ready!'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
                  Computed live based on your income of {formatNPR(data.monthlyIncome)}, {riskResult.profile} risk profile, and financial obligations.
                </p>
              </div>

              {/* 3 Core Highlight Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Emergency Fund Status */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      1. Emergency Buffer
                    </span>
                    <div className="text-lg font-extrabold text-emerald-950">
                      {emergencyInfo.currentEstimatedMonths} / {emergencyInfo.targetMonths} Months
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">
                      Target: {formatNPR(emergencyInfo.targetAmount)} in {data.setup.primaryBank} liquid FD.
                    </p>
                  </div>
                  <div className="mt-3 w-full bg-emerald-200/80 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (emergencyInfo.currentEstimatedMonths / emergencyInfo.targetMonths) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Suggested Monthly SIP */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                      2. Recommended SIP
                    </span>
                    <div className="text-lg font-extrabold text-indigo-950">
                      {formatNPR(wealthPlan.sip.allocatedMonthly)}/mo
                    </div>
                    <p className="text-xs text-indigo-700 mt-1">
                      {riskResult.profile} Match: <strong>{wealthPlan.sip.recommendedFunds[0]?.name || 'NIBL Sahabhagita'}</strong>
                    </p>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>~{wealthPlan.sip.expectedCagr}% historical CAGR</span>
                  </div>
                </div>

                {/* 3. Priority Loan / Debt Target */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      3. Debt Strategy
                    </span>
                    <div className="text-lg font-extrabold text-amber-950">
                      {wealthPlan.loanPrepayment.hasHighInterestDebt ? 'Avalanche Payoff' : 'Zero High-Debt'}
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      {wealthPlan.loanPrepayment.hasHighInterestDebt && wealthPlan.loanPrepayment.targetLoan
                        ? `Target highest rate first: ${wealthPlan.loanPrepayment.targetLoan.name} (${wealthPlan.loanPrepayment.targetLoan.interestRate}%)`
                        : 'Great job! You have full freedom to channel surplus to SIP & FD.'}
                    </p>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold text-amber-800">
                    {wealthPlan.loanPrepayment.allocatedMonthly > 0 ? `+${formatNPR(wealthPlan.loanPrepayment.allocatedMonthly)}/mo extra prepay` : 'Optimal allocation'}
                  </div>
                </div>

              </div>

              {/* Safe to Invest Hero Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-950/20">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                    Safe to Invest Every Month
                  </span>
                  <div className="text-3xl font-extrabold font-display tracking-tight text-white">
                    {formatNPR(surplusInfo.safeToInvest)}
                  </div>
                  <p className="text-xs text-slate-300">
                    Net monthly surplus after essentials ({formatNPR(surplusInfo.essentials)}) and EMIs ({formatNPR(surplusInfo.totalEMIs)}).
                  </p>
                </div>

                <button
                  id="onboarding-finish-btn"
                  type="button"
                  onClick={() => onComplete(data)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white font-bold text-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isNp ? 'ड्यासबोर्डमा जानुहोस्' : 'Go to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Navigation Controls: Back & Continue */}
          {!isSummaryStep && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                id="onboarding-back-btn"
                onClick={handleBack}
                disabled={activeStepIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeStepIndex === 0 
                    ? 'opacity-40 cursor-not-allowed text-slate-400' 
                    : 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isNp ? 'पछाडि' : 'Back'}</span>
              </button>

              <button
                type="button"
                id="onboarding-next-btn"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] active:bg-[#5040b8] text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>
                  {activeStepIndex === steps.length - 2 
                    ? (isNp ? 'योजना हेर्नुहोस्' : 'Generate My Wealth Plan') 
                    : (isNp ? 'अगाडि बढ्नुहोस्' : 'Continue')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
