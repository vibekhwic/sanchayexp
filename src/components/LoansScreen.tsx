import React, { useState } from 'react';
import { LoanItem, OnboardingData } from '../types';
import { simulateLoanPayoff, formatNPR } from '../utils/calculations';
import { NEPALI_BANKS } from '../data/nepaliFinancialData';
import { 
  CreditCard, 
  TrendingDown, 
  Sparkles, 
  Flame, 
  Snowflake, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle,
  Building2,
  DollarSign
} from 'lucide-react';

interface LoansScreenProps {
  loans: LoanItem[];
  onUpdateLoans: (loans: LoanItem[]) => void;
  language: 'en' | 'np';
}

export const LoansScreen: React.FC<LoansScreenProps> = ({
  loans,
  onUpdateLoans,
  language
}) => {
  const isNp = language === 'np';
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [extraPrepayAmount, setExtraPrepayAmount] = useState<number>(3000);
  const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState<boolean>(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string>(loans[0]?.id || '');

  // New Loan Form State
  const [newLoanName, setNewLoanName] = useState('');
  const [newLoanType, setNewLoanType] = useState<LoanItem['type']>('Personal Loan');
  const [newLoanBank, setNewLoanBank] = useState('Nabil Bank');
  const [newLoanBalance, setNewLoanBalance] = useState('');
  const [newLoanRate, setNewLoanRate] = useState('14.5');
  const [newLoanEMI, setNewLoanEMI] = useState('');
  const [newLoanTenure, setNewLoanTenure] = useState('18');

  const payoffSim = simulateLoanPayoff(loans, extraPrepayAmount);
  const activePlan = strategy === 'avalanche' ? payoffSim.avalanche : payoffSim.snowball;
  const sortedQueue = activePlan.payoffOrder;

  const totalDebtBalance = loans.reduce((sum, l) => sum + l.balance, 0);
  const totalBaseEMI = loans.reduce((sum, l) => sum + l.monthlyEMI, 0);

  const handleAddLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoanName || !newLoanBalance || !newLoanEMI) return;
    const item: LoanItem = {
      id: `loan-${Date.now()}`,
      name: newLoanName,
      type: newLoanType,
      bankName: newLoanBank,
      balance: Number(newLoanBalance),
      interestRate: Number(newLoanRate),
      monthlyEMI: Number(newLoanEMI),
      remainingTenureMonths: Number(newLoanTenure)
    };
    onUpdateLoans([...loans, item]);
    setIsAddLoanModalOpen(false);
    setNewLoanName('');
    setNewLoanBalance('');
    setNewLoanEMI('');
  };

  const handleDeleteLoan = (id: string) => {
    onUpdateLoans(loans.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & Add Loan Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
            Debt Elimination Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            {isNp ? 'ऋण मुक्ति रणनीति (Avalanche vs Snowball)' : 'Loan Payoff & Avalanche Optimizer'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isNp 
              ? 'बढी ब्याज भएको ऋण पहिला तिरेर हजारौँ रुपैयाँ ब्याज बचत गर्नुहोस्' 
              : 'Compare debt strategies live & see how extra overpayment saves interest in Nepal.'}
          </p>
        </div>

        <button
          id="loans-add-btn"
          onClick={() => setIsAddLoanModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#6C5CE7]" />
          <span>{isNp ? 'ऋण थप्नुहोस्' : 'Add Loan'}</span>
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Total Outstanding Debt</span>
          <div className="text-2xl font-bold text-gray-900">
            {formatNPR(totalDebtBalance)}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">{loans.length} Active loans</span>
        </div>

        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Monthly EMI Obligation</span>
          <div className="text-2xl font-bold text-rose-500">
            {formatNPR(totalBaseEMI)}/mo
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Baseline minimum payments</span>
        </div>

        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Time to 100% Debt-Free</span>
          <div className="text-2xl font-bold text-[#6C5CE7]">
            {activePlan.months} Months
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            {payoffSim.monthsSavedWithOverpay > 0 ? `🚀 ${payoffSim.monthsSavedWithOverpay} mos faster with overpay` : 'Standard tenure'}
          </span>
        </div>

        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Total Interest Payable</span>
          <div className="text-2xl font-bold text-gray-900">
            {formatNPR(activePlan.totalInterest)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            Saved {formatNPR(payoffSim.interestSavedWithOverpay)} in interest!
          </span>
        </div>
      </div>

      {/* STRATEGY TOGGLE & OVERPAY INSIGHT CALLOUT */}
      <div className="p-6 rounded-[20px] bg-white border border-gray-100 shadow-xs space-y-4">
        
        {/* Toggle between Avalanche and Snowball */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isNp ? 'रणनीति छान्नुहोस् (Strategy Selector)' : 'Choose Payoff Strategy'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Avalanche saves the most money in interest; Snowball provides quick psychological wins.
            </p>
          </div>

          <div className="flex items-center p-1 bg-gray-100 rounded-full gap-1 self-start sm:self-auto">
            <button
              id="loans-strategy-avalanche-btn"
              onClick={() => setStrategy('avalanche')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                strategy === 'avalanche'
                  ? 'bg-[#6C5CE7] text-white shadow-xs scale-102 font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Avalanche (High Rate First)</span>
            </button>

            <button
              id="loans-strategy-snowball-btn"
              onClick={() => setStrategy('snowball')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                strategy === 'snowball'
                  ? 'bg-[#6C5CE7] text-white shadow-xs scale-102 font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>Snowball (Small Balance First)</span>
            </button>
          </div>
        </div>

        {/* Overpay Impact Simulator Slider */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Simulate Extra Monthly Prepayment (NPR):</span>
            </label>
            <span className="text-xs font-extrabold text-[#6C5CE7]">+{formatNPR(extraPrepayAmount)}/mo</span>
          </div>

          <input
            type="range"
            min="0"
            max="20000"
            step="500"
            value={extraPrepayAmount}
            onChange={(e) => setExtraPrepayAmount(Number(e.target.value))}
            className="w-full accent-[#6C5CE7] cursor-pointer"
          />

          <div className="mt-3 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>
              💡 By adding <strong>+{formatNPR(extraPrepayAmount)}/mo</strong>, you save <strong>{formatNPR(payoffSim.interestSavedWithOverpay)}</strong> in total interest!
            </span>
            <span className="text-[#6C5CE7] font-bold whitespace-nowrap">
              Debt-free {payoffSim.monthsSavedWithOverpay} months earlier
            </span>
          </div>
        </div>

      </div>

      {/* CHARCOAL / DARK HIGH-CONTRAST PANEL (LOAN PAYOFF QUEUE) */}
      <div className="bg-[#2D3436] text-white rounded-[20px] p-6 sm:p-7 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                ACTIVE QUEUE
              </span>
              <h3 className="text-lg font-bold text-white">
                {strategy === 'avalanche' ? 'Avalanche Payoff Hierarchy' : 'Snowball Payoff Hierarchy'}
              </h3>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              The #1 top priority loan receives all extra surplus until paid off. Click any loan to inspect.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-300">
            Strategy: <strong className="text-white capitalize">{strategy}</strong>
          </span>
        </div>

        {/* Loan Queue List */}
        <div className="space-y-3">
          {sortedQueue.map((loan, idx) => {
            const isPriorityOne = idx === 0;
            const isSelected = selectedLoanId === loan.id || (isPriorityOne && !selectedLoanId);

            return (
              <div
                key={loan.id}
                onClick={() => setSelectedLoanId(loan.id)}
                className={`p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#6C5CE7] border-white/20 shadow-md scale-[1.01]'
                    : 'bg-white/10 hover:bg-white/15 border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isPriorityOne 
                        ? 'bg-white text-[#6C5CE7] shadow-xs' 
                        : 'bg-white/15 text-white'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{loan.name}</span>
                        {isPriorityOne && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-amber-950 uppercase">
                            🔥 TARGET NOW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">
                        {loan.bankName} • {loan.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end">
                    <div>
                      <span className="text-[10px] text-gray-300 block">Interest Rate:</span>
                      <span className="text-xs font-bold text-amber-200">{loan.interestRate}% p.a.</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-300 block">Monthly EMI:</span>
                      <span className="text-xs font-bold text-white">{formatNPR(loan.monthlyEMI)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-300 block">Balance:</span>
                      <span className="text-sm font-bold text-white">{formatNPR(loan.balance)}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLoan(loan.id);
                      }}
                      className="text-gray-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Delete Loan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Loan Modal */}
      {isAddLoanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Add Loan / Debt Obligation</h3>

            <form onSubmit={handleAddLoanSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Loan Nickname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIC Asia Bike Loan, Cooperative Loan"
                  value={newLoanName}
                  onChange={(e) => setNewLoanName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Loan Type</label>
                  <select
                    value={newLoanType}
                    onChange={(e) => setNewLoanType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Cooperative Loan">Cooperative Loan</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Auto Loan">Auto Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Bank / Provider</label>
                  <select
                    value={newLoanBank}
                    onChange={(e) => setNewLoanBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
                  >
                    {NEPALI_BANKS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Balance (NPR)</label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={newLoanBalance}
                    onChange={(e) => setNewLoanBalance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Interest %</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="14.5"
                    value={newLoanRate}
                    onChange={(e) => setNewLoanRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-rose-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">EMI (NPR)</label>
                  <input
                    type="number"
                    required
                    placeholder="8500"
                    value={newLoanEMI}
                    onChange={(e) => setNewLoanEMI(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddLoanModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
