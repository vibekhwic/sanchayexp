import React, { useState } from 'react';
import { ExpenseItem, IncomeItem } from '../types';
import { formatNPR } from '../utils/calculations';
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

  // New Expense form state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('Food & Groceries');
  const [expIsEssential, setExpIsEssential] = useState(true);
  const [expPaymentMethod, setExpPaymentMethod] = useState('Fonepay QR');

  // New Income form state
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incBank, setIncBank] = useState('NIC Asia Bank');

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const essentialExpense = expenses.filter(e => e.isEssential).reduce((sum, e) => sum + e.amount, 0);
  const discretionaryExpense = totalExpense - essentialExpense;

  // Category totals for Pie Chart
  const categoryMap: Record<string, number> = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat],
    color: CATEGORY_COLORS[cat] || '#6C5CE7'
  }));

  // Trend data comparison
  const barData = [
    { name: 'Income', amount: totalIncome, fill: '#00B894' },
    { name: 'Essentials', amount: essentialExpense, fill: '#6C5CE7' },
    { name: 'Leisure', amount: discretionaryExpense, fill: '#FD79A8' },
    { name: 'Surplus', amount: Math.max(0, netSavings), fill: '#0984E3' }
  ];

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    onAddExpense({
      title: expTitle,
      amount: Number(expAmount),
      category: expCategory,
      date: new Date().toISOString().split('T')[0],
      isEssential: expIsEssential,
      paymentMethod: expPaymentMethod
    });
    setExpTitle('');
    setExpAmount('');
    setIsAddExpenseOpen(false);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incSource || !incAmount) return;
    onAddIncome({
      source: incSource,
      amount: Number(incAmount),
      date: new Date().toISOString().split('T')[0],
      isRecurring: true,
      bank: incBank
    });
    setIncSource('');
    setIncAmount('');
    setIsAddIncomeOpen(false);
  };

  const filteredExpenses = expenses.filter(e => {
    if (activeTab === 'essential') return e.isEssential;
    if (activeTab === 'non_essential') return !e.isEssential;
    return true;
  });

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

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Total Monthly Inflows</span>
          <div className="text-2xl font-bold text-emerald-600">
            {formatNPR(totalIncome)}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">{incomes.length} Active income sources</span>
        </div>

        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Total Expenses Logged</span>
          <div className="text-2xl font-bold text-rose-500">
            {formatNPR(totalExpense)}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Essentials: {formatNPR(essentialExpense)} ({Math.round((essentialExpense / (totalExpense || 1)) * 100)}%)
          </span>
        </div>

        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Net Monthly Surplus</span>
          <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-[#6C5CE7]' : 'text-rose-600'}`}>
            {formatNPR(netSavings)}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Available for SIP & FD laddering</span>
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
            incomes.map(inc => (
              <div key={inc.id} className="py-3 flex items-center justify-between">
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
                  {incomes.length > 1 && (
                    <button
                      onClick={() => onDeleteIncome(inc.id)}
                      className="text-gray-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            filteredExpenses.map(exp => {
              const Icon = CATEGORY_ICONS[exp.category] || MoreHorizontal;
              const color = CATEGORY_COLORS[exp.category] || '#6C5CE7';
              return (
                <div key={exp.id} className="py-3 flex items-center justify-between">
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
                      onClick={() => onDeleteExpense(exp.id)}
                      className="text-gray-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900">Log New Expense</h3>

            <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhatbhateni Grocery, Pathao Ride"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Amount (NPR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Channel</label>
                  <select
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
                <label htmlFor="essential-check" className="text-xs font-semibold text-gray-700">
                  This is an essential living expense
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
                >
                  Save Expense
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
            <h3 className="text-lg font-bold text-gray-900">Add Income Stream</h3>

            <form onSubmit={handleIncomeSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salary, Consulting, Bonus, Dividend"
                  value={incSource}
                  onChange={(e) => setIncSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Amount (NPR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={incAmount}
                  onChange={(e) => setIncAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-emerald-600 outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Receiving Bank</label>
                <input
                  type="text"
                  value={incBank}
                  onChange={(e) => setIncBank(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddIncomeOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
