import React, { useState, useMemo } from 'react';
import { ExpenseItem, IncomeItem } from '../types';
import { formatNPR } from '../utils/calculations';
import { NEPALI_BANKS } from '../data/nepaliFinancialData';
import { 
  Plus, 
  Trash2, 
  Receipt, 
  Wallet, 
  PieChart as PieIcon, 
  TrendingUp, 
  Filter, 
  CheckCircle2, 
  Home, 
  ShoppingBag, 
  Wifi, 
  Car, 
  HeartPulse, 
  Users, 
  Coffee, 
  GraduationCap, 
  MoreHorizontal,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface ExpensesScreenProps {
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  language: 'en' | 'np';
}

const CATEGORY_COLORS: Record<string, string> = {
  'Housing': '#6C5CE7',
  'Food & Groceries': '#00B894',
  'Utilities & Net': '#0984E3',
  'Transport': '#FDCB6E',
  'Health': '#E17055',
  'Family & Remittance': '#E84393',
  'Leisure & Dining': '#FD79A8',
  'Education': '#A29BFE',
  'Other': '#B2BEC3'
};

const CATEGORY_ICONS: Record<string, any> = {
  'Housing': Home,
  'Food & Groceries': ShoppingBag,
  'Utilities & Net': Wifi,
  'Transport': Car,
  'Health': HeartPulse,
  'Family & Remittance': Users,
  'Leisure & Dining': Coffee,
  'Education': GraduationCap,
  'Other': MoreHorizontal
};

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  expenses,
  incomes,
  onAddExpense,
  onDeleteExpense,
  onAddIncome,
  onDeleteIncome,
  language
}) => {
  const isNp = language === 'np';
  const [activeTab, setActiveTab] = useState<'all' | 'essential' | 'non_essential' | 'incomes'>('all');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // New Expense form state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('Food & Groceries');
  const [expIsEssential, setExpIsEssential] = useState(true);
  const [expPaymentMethod, setExpPaymentMethod] = useState('Fonepay QR');
  const [expError, setExpError] = useState<string | null>(null);

  // New Income form state
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incBank, setIncBank] = useState('NIC Asia Bank');
  const [incError, setIncError] = useState<string | null>(null);

  // Helper to parse localized, formatted, or Nepali numbers (e.g. "1,500", "१५००", "Rs 2000")
  const parseAmount = (val: string): number => {
    if (!val) return 0;
    const nepaliDigits: Record<string, string> = {
      '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
      '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    };
    let normalized = String(val).trim();
    for (const [nep, eng] of Object.entries(nepaliDigits)) {
      normalized = normalized.split(nep).join(eng);
    }
    const cleaned = normalized.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Immediate recomputation from props with numerical coercion safety
  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  }, [incomes]);

  const netSavings = totalIncome - totalExpense;

  const essentialExpense = useMemo(() => {
    return expenses
      .filter(e => e.isEssential)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const discretionaryExpense = Math.max(0, totalExpense - essentialExpense);

  // Category totals for Pie Chart
  const pieData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    expenses.forEach(e => {
      const amt = Number(e.amount) || 0;
      categoryMap[e.category] = (categoryMap[e.category] || 0) + amt;
    });

    return Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat],
      color: CATEGORY_COLORS[cat] || '#6C5CE7'
    }));
  }, [expenses]);

  // Trend data comparison
  const barData = useMemo(() => [
    { name: isNp ? 'आम्दानी' : 'Income', amount: totalIncome, fill: '#00B894' },
    { name: isNp ? 'अनिवार्य' : 'Essentials', amount: essentialExpense, fill: '#6C5CE7' },
    { name: isNp ? 'मनोरञ्जन' : 'Leisure', amount: discretionaryExpense, fill: '#FD79A8' },
    { name: isNp ? 'बचत' : 'Surplus', amount: Math.max(0, netSavings), fill: '#0984E3' }
  ], [totalIncome, essentialExpense, discretionaryExpense, netSavings, isNp]);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExpError(null);
    const title = expTitle.trim();
    const amount = parseAmount(expAmount);

    if (!title) {
      setExpError(isNp ? 'कृपया खर्चको शीर्षक लेख्नुहोस्।' : 'Please enter an expense title.');
      return;
    }
    if (amount <= 0) {
      setExpError(isNp ? 'कृपया शून्य भन्दा बढी रकम प्रविष्ट गर्नुहोस्।' : 'Please enter a valid amount greater than 0.');
      return;
    }

    onAddExpense({
      title,
      amount,
      category: expCategory,
      date: new Date().toISOString().split('T')[0],
      isEssential: expIsEssential,
      paymentMethod: expPaymentMethod
    });

    setExpTitle('');
    setExpAmount('');
    setExpError(null);
    setIsAddExpenseOpen(false);
    setActiveTab('all'); // Switch to all expenses so the newly added entry is immediately visible
    setLastActionMessage(isNp ? `खर्च "रू ${amount.toLocaleString('en-IN')}" सफलतापूर्वक सुरक्षित गरियो!` : `Expense "${title}" (NPR ${amount.toLocaleString('en-IN')}) saved successfully!`);
    setTimeout(() => setLastActionMessage(null), 4000);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIncError(null);
    const source = incSource.trim();
    const amount = parseAmount(incAmount);

    if (!source) {
      setIncError(isNp ? 'कृपया आम्दानीको स्रोत लेख्नुहोस्।' : 'Please enter an income source name.');
      return;
    }
    if (amount <= 0) {
      setIncError(isNp ? 'कृपया शून्य भन्दा बढी रकम प्रविष्ट गर्नुहोस्।' : 'Please enter a valid amount greater than 0.');
      return;
    }

    onAddIncome({
      source,
      amount,
      date: new Date().toISOString().split('T')[0],
      isRecurring: true,
      bank: incBank.trim() || 'NIC Asia Bank'
    });

    setIncSource('');
    setIncAmount('');
    setIncError(null);
    setIsAddIncomeOpen(false);
    setActiveTab('incomes'); // Switch to inflows tab so the newly added stream is immediately visible
    setLastActionMessage(isNp ? `आम्दानी स्रोत "रू ${amount.toLocaleString('en-IN')}" थपियो!` : `Income stream "${source}" (NPR ${amount.toLocaleString('en-IN')}) added successfully!`);
    setTimeout(() => setLastActionMessage(null), 4000);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (activeTab === 'essential') return e.isEssential;
      if (activeTab === 'non_essential') return !e.isEssential;
      return true;
    });
  }, [expenses, activeTab]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
            Cashflow Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            {isNp ? 'आय र खर्च व्यवस्थापन' : 'Income & Expenses'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isNp ? 'नेपालको स्थानीय भुक्तानी (Fonepay, ConnectIPS, eSewa) सहितको बजेट' : 'Track categorized Nepali expenses & analyze your monthly surplus.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-add-income-btn"
            onClick={() => setIsAddIncomeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 shadow-xs hover:scale-102 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>{isNp ? 'आम्दानी थप्नुहोस्' : 'Add Income'}</span>
          </button>

          <button
            id="open-add-expense-btn"
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isNp ? 'खर्च प्रविष्टि' : 'Add Expense'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {lastActionMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div id="card-total-inflows" className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">Total Monthly Inflows</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 tracking-tight">
            {formatNPR(totalIncome)}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {incomes.length} {incomes.length === 1 ? 'income stream' : 'income streams'} active
          </span>
        </div>

        <div id="card-total-expenses" className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">Total Expenses Logged</span>
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          </div>
          <div className="text-2xl font-bold text-rose-500 tracking-tight">
            {formatNPR(totalExpense)}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Essentials: {formatNPR(essentialExpense)} ({totalExpense > 0 ? Math.round((essentialExpense / totalExpense) * 100) : 0}%)
          </span>
        </div>

        <div id="card-net-surplus" className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">Net Monthly Surplus</span>
            <span className={`w-2 h-2 rounded-full ${netSavings >= 0 ? 'bg-[#6C5CE7]' : 'bg-rose-600'}`}></span>
          </div>
          <div className={`text-2xl font-bold tracking-tight ${netSavings >= 0 ? 'text-[#6C5CE7]' : 'text-rose-600'}`}>
            {formatNPR(netSavings)}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {netSavings >= 0 ? 'Available for SIP & wealth building' : 'Deficit: expenses exceed inflows'}
          </span>
        </div>
      </div>

      {/* Charts Section: Category Donut & Cashflow Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Category Breakdown Donut */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              {isNp ? 'खर्चको विधागत बाँडफाँड' : 'Expense Breakdown by Category'}
            </h3>
            <span className="text-xs font-bold text-[#6C5CE7] bg-indigo-50 px-2 py-0.5 rounded-full">{expenses.length} Records</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any) => [formatNPR(Number(value)), 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Color-coded tags */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-medium text-gray-700">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
                <strong className="text-gray-900">{formatNPR(item.value)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Cashflow Structure Bar Chart */}
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              {isNp ? 'मासिक बजेट संरचना (५०/३०/२० नियम)' : 'Monthly Cashflow & 50/30/20 Rule'}
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Healthy Flow</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(val) => `रू${val/1000}k`} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  formatter={(value: any) => [formatNPR(Number(value)), 'NPR']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
            💡 <strong>Smart Sanchay Tip:</strong> Your essential living cost is <strong>{Math.round((essentialExpense / (totalIncome || 1)) * 100)}%</strong> of income, leaving ample room for SIP compounding.
          </div>
        </div>

      </div>

      {/* Transaction List with Filter Tabs */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-base font-bold text-gray-900">
            {isNp ? 'विस्तृत खर्च र आम्दानी सूची' : 'Detailed Transactions'}
          </h3>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-gray-100 text-xs self-start sm:self-auto">
            <button
              id="filter-tab-all"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({expenses.length})
            </button>
            <button
              id="filter-tab-essentials"
              onClick={() => setActiveTab('essential')}
              className={`px-3.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                activeTab === 'essential' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Essentials
            </button>
            <button
              id="filter-tab-discretionary"
              onClick={() => setActiveTab('non_essential')}
              className={`px-3.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                activeTab === 'non_essential' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Discretionary
            </button>
            <button
              id="filter-tab-incomes"
              onClick={() => setActiveTab('incomes')}
              className={`px-3.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                activeTab === 'incomes' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inflows ({incomes.length})
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-gray-100">
          {activeTab === 'incomes' ? (
            incomes.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-3">
                <p className="text-xs">{isNp ? 'कुनै आम्दानी दर्ता गरिएको छैन।' : 'No income streams logged yet.'}</p>
                <button
                  onClick={() => setIsAddIncomeOpen(true)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  + {isNp ? 'पहिलो आम्दानी थप्नुहोस्' : 'Add First Income Stream'}
                </button>
              </div>
            ) : (
              incomes.map(inc => (
                <div key={inc.id} className="py-3 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">{inc.source}</div>
                      <div className="text-[11px] text-gray-500">{inc.bank} • {inc.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-bold text-emerald-600">+{formatNPR(inc.amount)}</span>
                    <button
                      onClick={() => {
                        onDeleteIncome(inc.id);
                        setLastActionMessage(isNp ? `आम्दानी हटाइयो` : `Income "${inc.source}" removed.`);
                        setTimeout(() => setLastActionMessage(null), 3000);
                      }}
                      title="Remove income stream"
                      className="text-gray-400 hover:text-rose-500 p-1.5 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            filteredExpenses.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-3">
                <p className="text-xs">
                  {isNp ? 'यस विधामा कुनै खर्च भेटिएन।' : 'No expenses recorded in this category.'}
                </p>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-50 text-[#6C5CE7] text-xs font-bold hover:bg-indigo-100 transition-all cursor-pointer"
                >
                  + {isNp ? 'खर्च थप्नुहोस्' : 'Log an Expense'}
                </button>
              </div>
            ) : (
              filteredExpenses.map(exp => {
                const Icon = CATEGORY_ICONS[exp.category] || MoreHorizontal;
                const color = CATEGORY_COLORS[exp.category] || '#6C5CE7';
                return (
                  <div key={exp.id} className="py-3 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                          <span>{exp.title}</span>
                          {exp.isEssential ? (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                              Essential
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-pink-50 text-pink-600">
                              Leisure
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {exp.category} • Paid via {exp.paymentMethod} • {exp.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">-{formatNPR(exp.amount)}</span>
                      <button
                        onClick={() => {
                          onDeleteExpense(exp.id);
                          setLastActionMessage(isNp ? `खर्च हटाइयो` : `Expense "${exp.title}" removed.`);
                          setTimeout(() => setLastActionMessage(null), 3000);
                        }}
                        title="Delete expense entry"
                        className="text-gray-400 hover:text-rose-500 p-1.5 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {isNp ? 'नयाँ खर्च प्रविष्टि' : 'Log New Expense'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddExpenseOpen(false);
                  setExpError(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {expError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {expError}
              </div>
            )}

            <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isNp ? 'खर्चको शीर्षक' : 'Expense Title'}
                </label>
                <input
                  id="expense-title-input"
                  type="text"
                  required
                  placeholder="e.g. Bhatbhateni Grocery, Pathao Ride"
                  value={expTitle}
                  onChange={(e) => {
                    setExpTitle(e.target.value);
                    if (expError) setExpError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isNp ? 'रकम (रू NPR)' : 'Amount (NPR)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    रू
                  </span>
                  <input
                    id="expense-amount-input"
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 1,500"
                    value={expAmount}
                    onChange={(e) => {
                      setExpAmount(e.target.value);
                      if (expError) setExpError(null);
                    }}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 outline-none focus:border-[#6C5CE7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isNp ? 'विधा' : 'Category'}
                  </label>
                  <select
                    id="expense-category-select"
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
                  >
                    <option value="Food & Groceries">Food & Groceries</option>
                    <option value="Housing">Housing / Rent</option>
                    <option value="Utilities & Net">Utilities & Net</option>
                    <option value="Transport">Transport / Fuel</option>
                    <option value="Health">Health & Pharmacy</option>
                    <option value="Family & Remittance">Family Support</option>
                    <option value="Leisure & Dining">Leisure & Dining</option>
                    <option value="Education">Education & Courses</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isNp ? 'भुक्तानी माध्यम' : 'Payment Channel'}
                  </label>
                  <select
                    id="expense-payment-select"
                    value={expPaymentMethod}
                    onChange={(e) => setExpPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
                  >
                    <option value="Fonepay QR">Fonepay QR</option>
                    <option value="ConnectIPS">ConnectIPS</option>
                    <option value="eSewa">eSewa</option>
                    <option value="Khalti">Khalti</option>
                    <option value="Bank Card / ATM">Bank Card</option>
                    <option value="Cash (नगद)">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="essential-check"
                  checked={expIsEssential}
                  onChange={(e) => setExpIsEssential(e.target.checked)}
                  className="rounded text-[#6C5CE7] focus:ring-[#6C5CE7]"
                />
                <label htmlFor="essential-check" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  {isNp ? 'यो अनिवार्य आधारभूत खर्च हो' : 'This is an essential living expense'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  id="cancel-expense-btn"
                  type="button"
                  onClick={() => {
                    setIsAddExpenseOpen(false);
                    setExpError(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  {isNp ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>
                <button
                  id="save-expense-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
                >
                  {isNp ? 'खर्च सुरक्षित गर्नुहोस्' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {isAddIncomeOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {isNp ? 'नयाँ आम्दानी स्रोत थप्नुहोस्' : 'Add Income Stream'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddIncomeOpen(false);
                  setIncError(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {incError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {incError}
              </div>
            )}

            <form onSubmit={handleIncomeSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isNp ? 'आम्दानीको स्रोत' : 'Source Name'}
                </label>
                <input
                  id="income-source-input"
                  type="text"
                  required
                  placeholder="e.g. Salary, Consulting, Rental, Dividend"
                  value={incSource}
                  onChange={(e) => {
                    setIncSource(e.target.value);
                    if (incError) setIncError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isNp ? 'मासिक रकम (रू NPR)' : 'Monthly Amount (NPR)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    रू
                  </span>
                  <input
                    id="income-amount-input"
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 50,000"
                    value={incAmount}
                    onChange={(e) => {
                      setIncAmount(e.target.value);
                      if (incError) setIncError(null);
                    }}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-emerald-600 outline-none focus:border-[#6C5CE7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isNp ? 'प्राप्त हुने बैंक' : 'Receiving Bank'}
                </label>
                <select
                  id="income-bank-select"
                  value={incBank}
                  onChange={(e) => setIncBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none focus:border-[#6C5CE7]"
                >
                  {NEPALI_BANKS.map(bankName => (
                    <option key={bankName} value={bankName}>
                      {bankName}
                    </option>
                  ))}
                  <option value="eSewa / Digital Wallet">eSewa / Digital Wallet</option>
                  <option value="Cash / Other">Cash / Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  id="cancel-income-btn"
                  type="button"
                  onClick={() => {
                    setIsAddIncomeOpen(false);
                    setIncError(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  {isNp ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>
                <button
                  id="save-income-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
                >
                  {isNp ? 'आम्दानी सुरक्षित गर्नुहोस्' : 'Add Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
