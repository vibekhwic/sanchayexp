import { MutualFundOption, OnboardingData, ExpenseItem, IncomeItem } from '../types';

export const NEPALI_BANKS = [
  'Nabil Bank',
  'NIC Asia Bank',
  'Global IME Bank',
  'Sanima Bank',
  'Nepal Investment Mega Bank (NIMB)',
  'Standard Chartered Bank Nepal',
  'Everest Bank',
  'Rastriya Banijya Bank (RBB)',
  'Siddhartha Bank',
  'Kumari Bank',
  'NMB Bank',
  'Prime Commercial Bank',
  'Prabhu Bank',
  'Machhapuchchhre Bank',
  'Laxmi Sunrise Bank',
  'Himalayan Bank',
  'Citizens Bank International',
  'Agricultural Development Bank (ADBL)',
  'Muktinath Bikas Bank',
  'Garima Bikas Bank',
  'Local Cooperative (सहकारी)'
];

export const NEPALI_MUTUAL_FUNDS: MutualFundOption[] = [
  {
    name: 'NIBL Sahabhagita Fund',
    fundManager: 'NIMB Ace Capital',
    type: 'Flexi Cap',
    riskCategory: 'Moderate',
    cagr3Yr: 14.8,
    minMonthlySip: 1000,
    expenseRatio: 1.25,
    description: "Nepal's premier open-ended mutual fund with consistent returns across market cycles."
  },
  {
    name: 'Nabil Balanced Fund-3',
    fundManager: 'Nabil Investment Banking',
    type: 'Balanced',
    riskCategory: 'Moderate',
    cagr3Yr: 12.4,
    minMonthlySip: 1000,
    expenseRatio: 1.15,
    description: 'Balanced portfolio allocating 55% to equities and 45% to fixed income/FDs.'
  },
  {
    name: 'NIC Asia Dynamic Debt Fund',
    fundManager: 'NIC Asia Capital',
    type: 'Debt / Fixed Income',
    riskCategory: 'Conservative',
    cagr3Yr: 8.9,
    minMonthlySip: 1000,
    expenseRatio: 0.85,
    description: 'High-safety fund investing in bank fixed deposits and government treasury bonds.'
  },
  {
    name: 'Sanima Large Cap Growth Fund',
    fundManager: 'Sanima Capital',
    type: 'Growth / Equity',
    riskCategory: 'Aggressive',
    cagr3Yr: 16.5,
    minMonthlySip: 1500,
    expenseRatio: 1.4,
    description: 'Targets high-growth blue chip stocks listed on NEPSE for long-term compounding.'
  },
  {
    name: 'Siddhartha Systematic Investment Scheme (SSIS)',
    fundManager: 'Siddhartha Capital',
    type: 'Balanced',
    riskCategory: 'Moderate',
    cagr3Yr: 13.1,
    minMonthlySip: 1000,
    expenseRatio: 1.2,
    description: 'Designed specifically for monthly SIP investors with auto-reinvestment options.'
  },
  {
    name: 'Kumari Sunehalo Yojana',
    fundManager: 'Kumari Capital',
    type: 'Growth / Equity',
    riskCategory: 'Aggressive',
    cagr3Yr: 15.2,
    minMonthlySip: 1000,
    expenseRatio: 1.35,
    description: 'Open-ended equity fund focusing on commercial banks, hydropower, and manufacturing.'
  }
];

export const FINANCIAL_GLOSSARY = [
  {
    term: 'SIP (Systematic Investment Plan)',
    termNp: 'एस.आई.पि. (SIP)',
    tagline: 'Automatic monthly wealth builder',
    explanation: 'Instead of trying to time the Nepali stock market (NEPSE), you automatically invest a fixed amount (e.g. NPR 2,000 to NPR 10,000) every month on salary day into an open-ended mutual fund. When markets drop, you buy more units at discount; when markets rise, your wealth compounds.',
    nepalContext: 'Available directly online via MeroShare or through capital houses like NIMB Ace, Nabil, NIC Asia, Sanima, and Siddhartha Capital.'
  },
  {
    term: 'SWP (Systematic Withdrawal Plan)',
    termNp: 'एस.डब्लु.पि. (SWP)',
    tagline: 'Regular monthly payout from your investments',
    explanation: 'The reverse of SIP. When you have accumulated wealth (or during retirement), you can automatically withdraw a fixed monthly sum while the remaining balance continues to grow.',
    nepalContext: 'Great alternative to bank interest for retirees seeking monthly pension-like income with tax advantages.'
  },
  {
    term: 'FD (Fixed Deposit / मुद्दती निक्षेप)',
    termNp: 'मुद्दती निक्षेप (Fixed Deposit)',
    tagline: 'Guaranteed principal and fixed interest',
    explanation: 'You deposit a lump sum in a Class "A" commercial bank for a fixed period (3 months to 5 years). Your money is 100% insured up to NPR 5 Lakhs by Deposit and Credit Guarantee Fund (DCGF).',
    nepalContext: 'Current commercial bank FD rates in Nepal fluctuate around 6.5% - 8.25% p.a. Essential for short-term emergency funds and capital protection.'
  },
  {
    term: 'Demat & MeroShare',
    termNp: 'डिम्याट र मेरो सेयर',
    tagline: 'Your digital locker and trading portal for shares in Nepal',
    explanation: 'A Demat (Beneficiary Owner ID - BOID) holds your stocks and mutual fund units in digital format. MeroShare is the web/mobile app portal managed by CDSC to apply for IPOs, transfer shares, and track holdings.',
    nepalContext: 'Costs NPR 150/year to maintain. Any bank branch or stockbroker in Nepal can open this for you within 24 hours.'
  },
  {
    term: 'Avalanche vs Snowball Debt Payoff',
    termNp: 'ऋण भुक्तानी रणनीति',
    tagline: 'How to get debt-free the fastest way',
    explanation: 'Avalanche targets loans with the HIGHEST interest rate first (saves the most money in interest). Snowball targets loans with the SMALLEST balance first (gives fast psychological wins).',
    nepalContext: 'In Nepal, cooperative and credit card loans often charge 14-18%, while home loans are 9-11%. Avalanche saves massive amounts on high-rate debts.'
  }
];

export const INITIAL_ONBOARDING_STATE: OnboardingData = {
  monthlyIncomeRange: '60k-100k',
  monthlyIncome: 75000,
  incomeStability: 'very_stable',
  monthlyEssentials: 35000,
  currentEmergencyFund: '1_to_3_months',
  hasHighInterestDebt: true,
  comfortableSavingAmount: 18000,
  deductionStyle: 'automatic',
  goals: [
    {
      id: 'g-1',
      name: 'Emergency Buffer',
      nameNp: 'आपतकालीन कोष',
      icon: 'ShieldCheck',
      timeHorizon: 'lt_1yr',
      preference: 'protect',
      targetAmount: 150000
    },
    {
      id: 'g-2',
      name: 'House Down Payment',
      nameNp: 'घरको बैना रकम',
      icon: 'Home',
      timeHorizon: '5_to_10yr',
      preference: 'growth',
      targetAmount: 2500000
    },
    {
      id: 'g-3',
      name: 'Child Education',
      nameNp: 'छोराछोरीको उच्च शिक्षा',
      icon: 'GraduationCap',
      timeHorizon: '5_to_10yr',
      preference: 'balanced',
      targetAmount: 1200000
    }
  ],
  riskQuiz: {
    reactionToDrop: 'hold',
    comfortWithSwings: 3,
    primaryObjective: 'steady',
    recoveryTolerance: '1_to_3yr',
    checkFrequency: 'monthly'
  },
  knowledge: {
    experience: 'none',
    familiarTerms: ['FD', 'SIP'],
    returnExpectation: '10_15',
    acceptFluctuations: 'somewhat'
  },
  loans: [
    {
      id: 'loan-1',
      name: 'Cooperative Personal Loan',
      type: 'Cooperative Loan',
      bankName: 'Local Cooperative (सहकारी)',
      balance: 140000,
      interestRate: 15.5,
      monthlyEMI: 9800,
      remainingTenureMonths: 16
    },
    {
      id: 'loan-2',
      name: 'Two-Wheeler / Bike Loan',
      type: 'Auto Loan',
      bankName: 'Nabil Bank',
      balance: 95000,
      interestRate: 11.2,
      monthlyEMI: 6200,
      remainingTenureMonths: 18
    }
  ],
  refinancingConsideration: 'no',
  emiReliability: 'never_miss',
  setup: {
    hasDemat: 'no',
    primaryBank: 'NIC Asia Bank',
    preferredLanguage: 'en',
    reminderChannel: 'whatsapp'
  }
};

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Apartment Rent (Kathmandu)',
    amount: 18000,
    category: 'Housing',
    date: '2026-08-01',
    isEssential: true,
    paymentMethod: 'ConnectIPS'
  },
  {
    id: 'exp-2',
    title: 'Bhatbhateni & Local Groceries',
    amount: 9500,
    category: 'Food & Groceries',
    date: '2026-08-05',
    isEssential: true,
    paymentMethod: 'Fonepay QR'
  },
  {
    id: 'exp-3',
    title: 'WorldLink Internet + NEA Electricity',
    amount: 3200,
    category: 'Utilities & Net',
    date: '2026-08-07',
    isEssential: true,
    paymentMethod: 'eSewa'
  },
  {
    id: 'exp-4',
    title: 'Petrol & Sajha Bus / Pathao',
    amount: 4300,
    category: 'Transport',
    date: '2026-08-12',
    isEssential: true,
    paymentMethod: 'Khalti'
  },
  {
    id: 'exp-5',
    title: 'Family Remittance / Support',
    amount: 8000,
    category: 'Family & Remittance',
    date: '2026-08-15',
    isEssential: true,
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'exp-6',
    title: 'Weekend Dining & Momos with friends',
    amount: 3600,
    category: 'Leisure & Dining',
    date: '2026-08-18',
    isEssential: false,
    paymentMethod: 'Fonepay QR'
  }
];

export const INITIAL_INCOMES: IncomeItem[] = [
  {
    id: 'inc-1',
    source: 'Primary Monthly Salary',
    amount: 75000,
    date: '2026-08-01',
    isRecurring: true,
    bank: 'NIC Asia Bank'
  },
  {
    id: 'inc-2',
    source: 'Freelance / Consulting Project',
    amount: 15000,
    date: '2026-08-15',
    isRecurring: false,
    bank: 'Nabil Bank'
  }
];
