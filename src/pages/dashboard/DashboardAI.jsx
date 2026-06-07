import React from 'react';
import { Brain } from 'lucide-react';
import DashboardPage from './DashboardPage';

export default function DashboardAI() {
  return (
    <DashboardPage
      title="Ali AI"
      subtitle="Predictive financial intelligence powered by machine learning"
      icon={Brain}
      stats={[
        { value: '94%', label: 'Prediction Accuracy', change: '+3.2%', positive: true },
        { value: '12', label: 'Active Models', change: '+2', positive: true },
        { value: '$8.4K', label: 'Savings Identified', change: 'This month', positive: true },
      ]}
      items={[
        { title: 'Spending Pattern Analysis', description: 'AI detected unusual spending in Entertainment category — 23% above average.', badge: 'Alert', value: 'Review' },
        { title: 'Investment Recommendation', description: 'Move $5,000 to high-yield savings for 4.2% annual return based on your cash flow.', badge: 'Suggestion', value: '+$210/yr' },
        { title: 'Budget Forecast', description: 'Projected monthly expenses: $4,280 based on last 6 months of transaction data.', badge: 'Forecast', value: 'Q2 2026' },
        { title: 'Fraud Detection', description: 'All recent transactions verified. No suspicious activity detected in the last 30 days.', badge: 'Secure', value: '0 flags' },
        { title: 'Tax Optimization', description: 'Estimated tax savings of $1,200 available through retirement contribution adjustments.', badge: 'Opportunity', value: '$1,200' },
        { title: 'Cash Flow Prediction', description: 'Positive cash flow expected for next 3 months with 87% confidence interval.', badge: 'Trend', value: '+$2,400' },
      ]}
    />
  );
}
