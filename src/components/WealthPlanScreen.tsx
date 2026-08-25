import React, { useState } from 'react';
import { OnboardingData, MutualFundOption } from '../types';
import { 
  generateWealthPlan, 
  calculateCompoundGrowth, 
  formatNPR 
} from '../utils/calculations';
import { NEPALI_MUTUAL_FUNDS, FINANCIAL_GLOSSARY } from '../data/nepaliFinancialData';
import { 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Sparkles, 
  Building2, 
  ArrowRight,
  Calculator,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip 
} from 'recharts';

interface WealthPlanScreenProps {
  onboardingData: OnboardingData;
  onOpenDematGuide: () => void;
  language: 'en' | 'np';
}

export const WealthPlanScreen: React.FC<WealthPlanScreenProps> = ({
  onboardingData,
  onOpenDematGuide,
  language
}) => {
  const isNp = language === 'np';
  const wealthPlan = generateWealthPlan(onboardingData);

  // Interactive growth simulator controls
  const [customSipAmount, setCustomSipAmount] = useState<number>(wealthPlan.sip.allocatedMonthly || 10000);
  const [customReturnPct, setCustomReturnPct] = useState<number>(wealthPlan.sip.expectedCagr || 12.5);
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);

  const growthData = calculateCompoundGrowth(customSipAmount, customReturnPct, 10);
  const final10YrTotal = growthData[growthData.length - 1]?.total || 0;
  const final10YrInvested = growthData[growthData.length - 1]?.invested || 0;
  const final10YrGain = growthData[growthData.length - 1]?.returns || 0;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
            Personalized Strategy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            {isNp ? 'तपाईंको स्वचालित सम्पत्ति योजना' : 'Automated Wealth & SIP Blueprint'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isNp 
              ? `तपाईंको ${wealthPlan.sip.riskProfile} प्रोफाइल अनुसार नेपालका खुलामुखी म्युचुअल फण्ड र बैंक मुद्दती बाँडफाँड`
              : `Optimized for your ${wealthPlan.sip.riskProfile} risk profile, income stability, and short/long term goals.`}
          </p>
        </div>

        <button
          id="wealth-demat-guide-btn"
          onClick={onOpenDematGuide}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-xs hover:scale-102 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>{isNp ? 'डिम्याट र मेरो सेयर गाइड' : 'Demat Setup Guide'}</span>
        </button>
      </div>

      {/* 4 COLOR-CODED ALLOCATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: 🟢 Emergency Fund Card (Green) */}
        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              1. Emergency Buffer
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-xs text-gray-400 font-semibold">Monthly Allocation:</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNPR(wealthPlan.emergencyFund.allocatedMonthly)}
              <span className="text-xs font-medium text-gray-400">/mo</span>
            </div>
            <div className="mt-2 text-xs text-emerald-800 bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-100">
              Target: <strong>{formatNPR(wealthPlan.emergencyFund.targetAmount)}</strong> ({wealthPlan.emergencyFund.targetMonths} mo essentials)
            </div>
          </div>

          <div className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
            {wealthPlan.emergencyFund.isCovered ? '✅ Fund fully covered!' : '📈 Building your 3-6 month security cushion'}
          </div>
        </div>

        {/* Card 2: 🟣 Systematic Investment Plan (SIP) Card (Indigo) */}
        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />
              2. Monthly SIP
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#6C5CE7] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-xs text-gray-400 font-semibold">Monthly Allocation:</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNPR(wealthPlan.sip.allocatedMonthly)}
              <span className="text-xs font-medium text-gray-400">/mo</span>
            </div>
            <div className="mt-2 text-xs text-indigo-900 bg-indigo-50/90 p-2.5 rounded-xl border border-indigo-100">
              Matched Fund: <strong>{wealthPlan.sip.recommendedFunds[0]?.name || 'NIBL Sahabhagita'}</strong> (~{wealthPlan.sip.expectedCagr}% CAGR)
            </div>
          </div>

          <div className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100 flex items-center justify-between">
            <span>Profile: <strong>{wealthPlan.sip.riskProfile}</strong></span>
            <span className="text-[#6C5CE7] font-bold">Auto-debit</span>
          </div>
        </div>

        {/* Card 3: 🔵 Fixed Deposit (FD) Ladder Card (Purple/Cyan) */}
        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              3. FD Ladder
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-xs text-gray-400 font-semibold">Monthly Allocation:</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNPR(wealthPlan.fdLadder.allocatedMonthly)}
              <span className="text-xs font-medium text-gray-400">/mo</span>
            </div>
            <div className="mt-2 text-xs text-purple-900 bg-purple-50/90 p-2.5 rounded-xl border border-purple-100">
              Bank: <strong>{onboardingData.setup.primaryBank || 'NIC Asia'}</strong> (3m, 6m, 1yr ladders at 7.5%-8.0%)
            </div>
          </div>

          <div className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
            Guaranteed capital lock for short goals
          </div>
        </div>

        {/* Card 4: 🟡 Loan Extra Payment Card (Amber) */}
        <div className="p-5 rounded-[20px] bg-white border border-gray-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              4. Loan Prepay
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-xs text-gray-400 font-semibold">Monthly Extra Pay:</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNPR(wealthPlan.loanPrepayment.allocatedMonthly)}
              <span className="text-xs font-medium text-gray-400">/mo</span>
            </div>
            <div className="mt-2 text-xs text-amber-900 bg-amber-50/90 p-2.5 rounded-xl border border-amber-100">
              {wealthPlan.loanPrepayment.hasHighInterestDebt && wealthPlan.loanPrepayment.targetLoan
                ? `Priority: ${wealthPlan.loanPrepayment.targetLoan.name} (${wealthPlan.loanPrepayment.targetLoan.interestRate}%)`
                : 'Zero high debt! 100% available for wealth compounding.'}
            </div>
          </div>

          <div className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
            {wealthPlan.loanPrepayment.hasHighInterestDebt ? 'Avalanche speedup' : 'Debt-free zone'}
          </div>
        </div>

      </div>

      {/* 10-YEAR PROJECTED COMPOUND GROWTH SIMULATOR */}
      <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-gray-100 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6C5CE7] flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {isNp ? '१० वर्षे एसआईपी चक्रवृद्धी वृद्धि सिमुलेटर' : '10-Year Interactive SIP Growth Simulator'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Adjust your monthly investment and estimated returns to see the exponential power of compounding in Nepal.
            </p>
          </div>

          {/* Computed 10-Year Result Highlights */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 block">Total Invested:</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">{formatNPR(final10YrInvested)}</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-[11px] font-semibold text-indigo-700 block">Estimated Gain:</span>
              <span className="text-xs sm:text-sm font-bold text-[#6C5CE7]">+{formatNPR(final10YrGain)}</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-[11px] font-semibold text-gray-900 block">Final Wealth:</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-600">{formatNPR(final10YrTotal)}</span>
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-700">Monthly SIP Amount (NPR)</label>
              <span className="text-xs font-bold text-[#6C5CE7]">{formatNPR(customSipAmount)}/mo</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={customSipAmount}
              onChange={(e) => setCustomSipAmount(Number(e.target.value))}
              className="w-full accent-[#6C5CE7] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>रू १,०००</span>
              <span>रू २५,०००</span>
              <span>रू ५०,०००</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-700">Expected Annual Return (% CAGR)</label>
              <span className="text-xs font-bold text-[#6C5CE7]">{customReturnPct.toFixed(1)}% p.a.</span>
            </div>
            <input
              type="range"
              min="6"
              max="20"
              step="0.5"
              value={customReturnPct}
              onChange={(e) => setCustomReturnPct(Number(e.target.value))}
              className="w-full accent-[#6C5CE7] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>6% (FD)</span>
              <span>12% (Balanced SIP)</span>
              <span>20% (High Growth)</span>
            </div>
          </div>
        </div>

        {/* 10-Year Growth Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="investedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B894" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00B894" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `रू${(v/100000).toFixed(1)}L`} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                formatter={(val: any, name: any) => [formatNPR(Number(val)), name === 'total' ? 'Total Portfolio' : name === 'invested' ? 'Principal Invested' : 'Returns']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#6C5CE7" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColor)" name="total" />
              <Area type="monotone" dataKey="invested" stroke="#00B894" strokeWidth={2} fillOpacity={1} fill="url(#investedColor)" name="invested" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP NEPALI MUTUAL FUNDS DIRECTORY */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isNp ? 'नेपालका प्रमुख खुलामुखी म्युचुअल फण्डहरू' : 'Top Open-Ended Mutual Funds in Nepal'}
            </h3>
            <p className="text-xs text-gray-500">
              Regulated by SEBON and CDSC for systematic monthly investment
            </p>
          </div>
          <span className="text-xs font-bold text-[#6C5CE7] bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            SEBON Approved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold border-y border-gray-100">
              <tr>
                <th className="py-3 px-3">Fund Scheme</th>
                <th className="py-3 px-3">Manager</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">3-Yr CAGR</th>
                <th className="py-3 px-3">Min SIP</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {NEPALI_MUTUAL_FUNDS.map(fund => (
                <tr key={fund.name} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-gray-900">{fund.name}</div>
                    <div className="text-[10px] text-gray-400">{fund.description}</div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">{fund.fundManager}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      fund.riskCategory === 'Aggressive' ? 'bg-rose-50 text-rose-700' :
                      fund.riskCategory === 'Moderate' ? 'bg-indigo-50 text-indigo-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {fund.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-emerald-600">+{fund.cagr3Yr}%</td>
                  <td className="py-3.5 px-3 font-semibold">{formatNPR(fund.minMonthlySip)}/mo</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={onOpenDematGuide}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#6C5CE7] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Invest via MeroShare
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPANDABLE "WHAT IS SIP/SWP/FD/DEMAT?" ACCORDION SECTION */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#6C5CE7]" />
            <span>{isNp ? 'वित्तीय ज्ञान: SIP, SWP, FD र डिम्याट के हुन्?' : 'Financial Knowledge Hub: What is SIP, SWP, FD & Demat?'}</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Essential concepts explained simply for busy professionals in Nepal.
          </p>
        </div>

        <div className="space-y-2.5">
          {FINANCIAL_GLOSSARY.map(item => {
            const isExpanded = expandedGlossary === item.term;
            return (
              <div 
                key={item.term}
                className="border border-gray-100 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedGlossary(isExpanded ? null : item.term)}
                  className="w-full p-3.5 text-left bg-gray-50/60 hover:bg-gray-100/80 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <span className="text-sm font-bold text-gray-900">{item.term}</span>
                    <span className="text-xs text-gray-500 block mt-0.5 font-medium">{item.tagline}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white space-y-2.5 text-xs text-gray-700 border-t border-gray-100">
                    <p className="leading-relaxed">{item.explanation}</p>
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900">
                      <strong>🇳🇵 Nepal Context:</strong> {item.nepalContext}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
