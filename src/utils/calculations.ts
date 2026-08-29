import { OnboardingData, RiskProfile, RiskQuizAnswers, LoanItem, FinancialGoal } from '../types';
import { NEPALI_MUTUAL_FUNDS } from '../data/nepaliFinancialData';

export function calculateRiskScore(quiz: RiskQuizAnswers): {
  score: number;
  profile: RiskProfile;
  description: string;
  descriptionNp: string;
  recommendedEquityPct: number;
  recommendedDebtPct: number;
} {
  let points = 0;

  // Q1: Reaction to 20% drop
  if (quiz.reactionToDrop === 'sell_all') points += 5;
  else if (quiz.reactionToDrop === 'sell_some') points += 12;
  else if (quiz.reactionToDrop === 'hold') points += 20;
  else if (quiz.reactionToDrop === 'buy_more') points += 28;

  // Q2: Comfort with ±15% swings (1 to 5)
  points += quiz.comfortWithSwings * 5; // 5 to 25

  // Q3: Primary objective
  if (quiz.primaryObjective === 'preserve') points += 5;
  else if (quiz.primaryObjective === 'steady') points += 15;
  else if (quiz.primaryObjective === 'aggressive') points += 25;

  // Q4: Recovery tolerance
  if (quiz.recoveryTolerance === 'lt_1yr') points += 4;
  else if (quiz.recoveryTolerance === 'not_sure') points += 8;
  else if (quiz.recoveryTolerance === '1_to_3yr') points += 12;
  else if (quiz.recoveryTolerance === '3_to_5yr') points += 18;
  else if (quiz.recoveryTolerance === 'gt_5yr') points += 22;

  // Q5: Check frequency
  if (quiz.checkFrequency === 'daily') points += 5;
  else if (quiz.checkFrequency === 'weekly') points += 10;
  else if (quiz.checkFrequency === 'monthly') points += 15;
  else if (quiz.checkFrequency === 'quarterly') points += 20;

  // Max raw points is approx 120 -> normalize to 100
  const normalizedScore = Math.min(100, Math.max(10, Math.round((points / 120) * 100)));

  if (normalizedScore < 40) {
    return {
      score: normalizedScore,
      profile: 'Conservative',
      description: 'Prioritizes safety and capital preservation. Prefers fixed deposits, debentures, and debt mutual funds with low volatility.',
      descriptionNp: 'पुँजी संरक्षण र सुरक्षालाई प्राथमिकता। बैंक मुद्दती, डिबेन्चर र सुरक्षित म्युचुअल फण्ड उपयुक्त।',
      recommendedEquityPct: 20,
      recommendedDebtPct: 80
    };
  } else if (normalizedScore < 70) {
    return {
      score: normalizedScore,
      profile: 'Moderate',
      description: 'Seeks a healthy balance of wealth growth and downside safety through diversified balanced & flexi-cap mutual funds.',
      descriptionNp: 'सन्तुलित लगानी र जोखिम नियन्त्रण। ब्यालेन्स्ड फण्ड र फ्लेक्सी-क्याप एसआईपी उपयुक्त।',
      recommendedEquityPct: 60,
      recommendedDebtPct: 40
    };
  } else {
    return {
      score: normalizedScore,
      profile: 'Aggressive',
      description: 'Focuses on long-term compound capital appreciation through growth-oriented equity mutual funds and blue-chip NEPSE stocks.',
      descriptionNp: 'दीर्घकालीन उच्च प्रतिफल। इक्विटी ग्रोथ म्युचुअल फण्ड र सेयर बजारमा लगानी।',
      recommendedEquityPct: 85,
      recommendedDebtPct: 15
    };
  }
}

export function calculateEmergencyFundTarget(data: OnboardingData): {
  targetMonths: number;
  targetAmount: number;
  currentEstimatedMonths: number;
  currentEstimatedAmount: number;
  monthsToReach: number;
  isCovered: boolean;
} {
  let targetMonths = 4;
  switch (data.incomeStability) {
    case 'very_stable':
      targetMonths = 3.5;
      break;
    case 'mostly_stable':
      targetMonths = 4.5;
      break;
    case 'variable':
      targetMonths = 6;
      break;
    case 'irregular':
      targetMonths = 7;
      break;
  }

  const essentials = data.monthlyEssentials || 35000;
  const targetAmount = Math.round(targetMonths * essentials);

  let currentEstimatedMonths = 0;
  switch (data.currentEmergencyFund) {
    case 'none':
      currentEstimatedMonths = 0;
      break;
    case 'lt_1_month':
      currentEstimatedMonths = 0.5;
      break;
    case '1_to_3_months':
      currentEstimatedMonths = 2;
      break;
    case '3_to_6_months':
      currentEstimatedMonths = 4.5;
      break;
    case 'gt_6_months':
      currentEstimatedMonths = 6.5;
      break;
  }

  const currentEstimatedAmount = Math.round(currentEstimatedMonths * essentials);
  const gap = Math.max(0, targetAmount - currentEstimatedAmount);
  const monthlyAllocation = Math.max(2000, Math.round(data.comfortableSavingAmount * 0.35));
  const monthsToReach = gap > 0 ? Math.ceil(gap / monthlyAllocation) : 0;

  return {
    targetMonths,
    targetAmount,
    currentEstimatedMonths,
    currentEstimatedAmount,
    monthsToReach,
    isCovered: currentEstimatedAmount >= targetAmount
  };
}

export function calculateSurplus(data: OnboardingData): {
  income: number;
  essentials: number;
  totalEMIs: number;
  surplus: number;
  safeToInvest: number;
} {
  const income = data.monthlyIncome || 60000;
  const essentials = data.monthlyEssentials || 30000;
  const totalEMIs = data.loans.reduce((sum, l) => sum + (Number(l.monthlyEMI) || 0), 0);
  const surplus = Math.max(0, income - essentials - totalEMIs);

  // Safe to invest is the amount from surplus comfortably deployable into wealth building
  const safeToInvest = Math.min(surplus, Math.max(data.comfortableSavingAmount, Math.round(surplus * 0.85)));

  return {
    income,
    essentials,
    totalEMIs,
    surplus,
    safeToInvest
  };
}

export function generateWealthPlan(data: OnboardingData) {
  const { surplus, safeToInvest } = calculateSurplus(data);
  const emergencyInfo = calculateEmergencyFundTarget(data);
  const riskInfo = calculateRiskScore(data.riskQuiz);

  let emergencyFundAlloc = 0;
  let loanPrepayAlloc = 0;
  let sipAlloc = 0;
  let fdLadderAlloc = 0;

  const budgetPool = safeToInvest > 0 ? safeToInvest : Math.max(5000, data.comfortableSavingAmount);

  // Priority 1: High Interest Loans (>12%)
  const highInterestLoans = data.loans.filter(l => l.interestRate >= 12);
  const hasHighInterestDebt = highInterestLoans.length > 0;

  if (hasHighInterestDebt) {
    loanPrepayAlloc = Math.round(budgetPool * 0.35 / 500) * 500;
  }

  // Priority 2: Emergency fund buffer if not covered
  if (!emergencyInfo.isCovered) {
    const efRatio = hasHighInterestDebt ? 0.30 : 0.40;
    emergencyFundAlloc = Math.round((budgetPool * efRatio) / 500) * 500;
  }

  // Remainder split between SIP and FD ladder
  const remainingBudget = Math.max(0, budgetPool - emergencyFundAlloc - loanPrepayAlloc);

  // Check short term goals
  const hasShortTermGoals = data.goals.some(g => g.timeHorizon === 'lt_1yr' || g.timeHorizon === '1_to_3yr');

  if (hasShortTermGoals) {
    fdLadderAlloc = Math.round((remainingBudget * 0.3) / 500) * 500;
    sipAlloc = remainingBudget - fdLadderAlloc;
  } else {
    sipAlloc = remainingBudget;
    fdLadderAlloc = 0;
  }

  // Ensure SIP gets at least a realistic chunk if available
  if (sipAlloc < 1000 && budgetPool >= 2000) {
    sipAlloc = 1000;
  }

  const matchedFunds = NEPALI_MUTUAL_FUNDS.filter(f => {
    if (riskInfo.profile === 'Conservative') return f.riskCategory === 'Conservative' || f.type.includes('Debt');
    if (riskInfo.profile === 'Moderate') return f.riskCategory === 'Moderate' || f.type.includes('Balanced') || f.type.includes('Flexi');
    return f.riskCategory === 'Aggressive' || f.type.includes('Growth');
  });

  return {
    budgetPool,
    surplus,
    emergencyFund: {
      allocatedMonthly: emergencyFundAlloc,
      targetAmount: emergencyInfo.targetAmount,
      currentAmount: emergencyInfo.currentEstimatedAmount,
      targetMonths: emergencyInfo.targetMonths,
      currentMonths: emergencyInfo.currentEstimatedMonths,
      isCovered: emergencyInfo.isCovered
    },
    loanPrepayment: {
      allocatedMonthly: loanPrepayAlloc,
      hasHighInterestDebt,
      targetLoan: highInterestLoans.sort((a, b) => b.interestRate - a.interestRate)[0] || data.loans[0] || null
    },
    sip: {
      allocatedMonthly: sipAlloc,
      riskProfile: riskInfo.profile,
      riskScore: riskInfo.score,
      recommendedFunds: matchedFunds.length > 0 ? matchedFunds : NEPALI_MUTUAL_FUNDS.slice(0, 2),
      expectedCagr: riskInfo.profile === 'Aggressive' ? 14.5 : riskInfo.profile === 'Moderate' ? 12.0 : 8.5
    },
    fdLadder: {
      allocatedMonthly: fdLadderAlloc,
      recommendedBank: data.setup?.primaryBank || 'NIC Asia Bank',
      rates: [
        { tenure: '3 Months', rate: '6.50% p.a.', purpose: 'Quick Liquidity' },
        { tenure: '6 Months', rate: '7.25% p.a.', purpose: 'Emergency Tier' },
        { tenure: '1 Year', rate: '8.00% p.a.', purpose: 'Capital Lock' }
      ]
    }
  };
}

export function simulateLoanPayoff(loans: LoanItem[], extraMonthlyPayment: number = 0) {
  if (!loans || loans.length === 0) {
    return {
      avalanche: { months: 0, totalInterest: 0, payoffOrder: [] as LoanItem[] },
      snowball: { months: 0, totalInterest: 0, payoffOrder: [] as LoanItem[] },
      interestSavedWithOverpay: 0,
      monthsSavedWithOverpay: 0
    };
  }

  // Avalanche order (highest interest rate first)
  const avalancheOrder = [...loans].sort((a, b) => b.interestRate - a.interestRate);
  // Snowball order (smallest balance first)
  const snowballOrder = [...loans].sort((a, b) => a.balance - b.balance);

  // Baseline standard payoff without extra
  const baselineStats = calculateAmortization(avalancheOrder, 0);
  const avalancheStats = calculateAmortization(avalancheOrder, extraMonthlyPayment);
  const snowballStats = calculateAmortization(snowballOrder, extraMonthlyPayment);

  const interestSaved = Math.max(0, baselineStats.totalInterest - avalancheStats.totalInterest);
  const monthsSaved = Math.max(0, baselineStats.months - avalancheStats.months);

  return {
    baseline: baselineStats,
    avalanche: { ...avalancheStats, payoffOrder: avalancheOrder },
    snowball: { ...snowballStats, payoffOrder: snowballOrder },
    interestSavedWithOverpay: Math.round(interestSaved),
    monthsSavedWithOverpay: monthsSaved
  };
}

function calculateAmortization(sortedLoans: LoanItem[], extraMonthly: number) {
  let balances = sortedLoans.map(l => ({ ...l, currentBal: l.balance }));
  let totalInterest = 0;
  let month = 0;
  const maxMonths = 360; // 30 years safety cap

  let totalEmis = sortedLoans.reduce((sum, l) => sum + l.monthlyEMI, 0);

  while (balances.some(l => l.currentBal > 0) && month < maxMonths) {
    month++;
    let rolledOverExtra = extraMonthly;

    for (let i = 0; i < balances.length; i++) {
      const loan = balances[i];
      if (loan.currentBal <= 0) continue;

      const monthlyRate = (loan.interestRate / 100) / 12;
      const interestForMonth = loan.currentBal * monthlyRate;
      totalInterest += interestForMonth;

      let payment = loan.monthlyEMI;
      // Add extra to the primary focus loan
      if (i === balances.findIndex(l => l.currentBal > 0)) {
        payment += rolledOverExtra;
      }

      const principalPaid = Math.max(0, payment - interestForMonth);
      if (principalPaid >= loan.currentBal) {
        rolledOverExtra += (payment - (loan.currentBal + interestForMonth));
        loan.currentBal = 0;
      } else {
        loan.currentBal -= principalPaid;
      }
    }
  }

  return {
    months: month,
    totalInterest: Math.round(totalInterest),
    monthlyPaymentTotal: totalEmis + extraMonthly
  };
}

/**
 * Automatically calculates monthly EMI from Principal, Annual Interest Rate (%) and Tenure (Months).
 * Standard reducing balance formula: EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]
 */
export function calculateLoanEMI(principal: number, annualRatePct: number, tenureMonths: number): number {
  const p = Number(principal);
  const rPct = Number(annualRatePct);
  const n = Number(tenureMonths);

  if (!p || p <= 0 || !n || n <= 0) return 0;
  if (!rPct || rPct <= 0) {
    return Math.round(p / n);
  }

  const i = (rPct / 100) / 12;
  const factor = Math.pow(1 + i, n);
  if (!isFinite(factor) || factor <= 1) {
    return Math.round(p / n);
  }

  const emi = (p * i * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Automatically calculates Annual Interest Rate (%) from Principal, Monthly EMI, and Tenure (Months).
 * Solves the annuity present value equation using fast-converging binary search.
 */
export function calculateLoanInterestRate(principal: number, monthlyEMI: number, tenureMonths: number): number {
  const p = Number(principal);
  const emi = Number(monthlyEMI);
  const n = Number(tenureMonths);

  if (!p || p <= 0 || !emi || emi <= 0 || !n || n <= 0) {
    return 0;
  }

  // If total payment is less than or equal to principal, interest is 0%
  if (emi * n <= p) {
    return 0;
  }

  let low = 0.00001; // ~0.012% annual
  let high = 1.0;    // 1200% annual

  for (let iter = 0; iter < 50; iter++) {
    const mid = (low + high) / 2;
    // PV = emi * [1 - (1 + mid)^(-n)] / mid
    const pv = (emi * (1 - Math.pow(1 + mid, -n))) / mid;
    if (pv > p) {
      // PV is too high => discount rate is too low
      low = mid;
    } else {
      high = mid;
    }
  }

  const mid = (low + high) / 2;
  const annualPct = mid * 12 * 100;
  return Number(annualPct.toFixed(2));
}

export function calculateCompoundGrowth(monthlySIP: number, annualRatePct: number, years: number = 10) {
  const r = (annualRatePct / 100) / 12;
  const data = [];
  let cumulativeInvested = 0;
  let totalWealth = 0;

  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    cumulativeInvested = monthlySIP * months;
    
    // Future value of a monthly annuity formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    if (r > 0) {
      totalWealth = monthlySIP * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    } else {
      totalWealth = cumulativeInvested;
    }

    const estimatedGain = Math.max(0, totalWealth - cumulativeInvested);

    data.push({
      year: `Yr ${year}`,
      invested: Math.round(cumulativeInvested),
      returns: Math.round(estimatedGain),
      total: Math.round(totalWealth)
    });
  }

  return data;
}

export function formatNPR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return 'रू 0';
  return 'रू ' + Number(val).toLocaleString('en-IN');
}
