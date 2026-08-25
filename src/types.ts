export type ScreenType = 'auth' | 'onboarding' | 'dashboard' | 'expenses' | 'wealth-plan' | 'loans' | 'settings';

export type IncomeStability = 'very_stable' | 'mostly_stable' | 'variable' | 'irregular';
export type EmergencyFundRange = 'none' | 'lt_1_month' | '1_to_3_months' | '3_to_6_months' | 'gt_6_months';
export type DeductionStyle = 'automatic' | 'manual' | 'not_sure';
export type TimeHorizon = 'lt_1yr' | '1_to_3yr' | '3_to_5yr' | '5_to_10yr' | 'gt_10yr';
export type GrowthPreference = 'protect' | 'balanced' | 'growth';
export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  nameNp: string;
  icon: string;
  timeHorizon: TimeHorizon;
  preference: GrowthPreference;
  targetAmount?: number;
}

export interface RiskQuizAnswers {
  reactionToDrop: 'sell_all' | 'sell_some' | 'hold' | 'buy_more';
  comfortWithSwings: number; // 1 to 5
  primaryObjective: 'preserve' | 'steady' | 'aggressive';
  recoveryTolerance: 'lt_1yr' | '1_to_3yr' | '3_to_5yr' | 'gt_5yr' | 'not_sure';
  checkFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

export interface InvestmentKnowledge {
  experience: 'none' | 'mutual_funds' | 'stocks' | 'debentures_ipos';
  familiarTerms: string[];
  returnExpectation: '4_6' | '6_10' | '10_15' | 'gt_15';
  acceptFluctuations: 'no' | 'somewhat' | 'yes';
}

export interface LoanItem {
  id: string;
  name: string;
  type: 'Personal Loan' | 'Credit Card' | 'Auto Loan' | 'Cooperative Loan' | 'Home Loan' | 'Education Loan' | 'Other';
  bankName: string;
  balance: number;
  interestRate: number; // annual percentage
  monthlyEMI: number;
  remainingTenureMonths: number;
}

export interface PracticalSetup {
  hasDemat: 'yes' | 'no' | 'not_sure';
  primaryBank: string;
  preferredLanguage: 'en' | 'np' | 'both';
  reminderChannel: 'email' | 'sms' | 'in_app' | 'whatsapp';
}

export interface OnboardingData {
  // Step A: Core Money Profile
  monthlyIncomeRange: string;
  monthlyIncome: number;
  incomeStability: IncomeStability;
  monthlyEssentials: number;
  currentEmergencyFund: EmergencyFundRange;
  hasHighInterestDebt: boolean;
  comfortableSavingAmount: number;
  deductionStyle: DeductionStyle;

  // Step B: Goals & Horizon
  goals: FinancialGoal[];

  // Step C: Risk Tolerance Quiz
  riskQuiz: RiskQuizAnswers;

  // Step D: Investment Knowledge
  knowledge: InvestmentKnowledge;

  // Step E: Loans
  loans: LoanItem[];
  refinancingConsideration: 'no' | 'considered' | 'done_before';
  emiReliability: 'never_miss' | 'rarely' | 'sometimes' | 'often';

  // Step F: Practical setup
  setup: PracticalSetup;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'Housing' | 'Food & Groceries' | 'Utilities & Net' | 'Transport' | 'Health' | 'Family & Remittance' | 'Leisure & Dining' | 'Education' | 'Other';
  date: string;
  isEssential: boolean;
  paymentMethod: string;
}

export interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  bank: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  language: 'en' | 'np';
}

export interface MutualFundOption {
  name: string;
  fundManager: string;
  type: 'Debt / Fixed Income' | 'Balanced' | 'Growth / Equity' | 'Flexi Cap';
  riskCategory: RiskProfile;
  cagr3Yr: number;
  minMonthlySip: number;
  expenseRatio: number;
  description: string;
}
