import React from 'react';
import { Landmark } from 'lucide-react';
import DashboardPage from './DashboardPage';

export default function DashboardLoans() {
  return (
    <DashboardPage
      title="Loans"
      subtitle="Monitor active loans, payments, and credit status"
      icon={Landmark}
      stats={[
        { value: '$24,500', label: 'Total Outstanding' },
        { value: '2', label: 'Active Loans' },
        { value: '742', label: 'Credit Score', change: '+12 pts', positive: true },
      ]}
      items={[
        { title: 'Home Mortgage', description: 'Fixed rate 3.5% — Monthly payment $1,850', badge: 'Active', value: '$18,200 remaining' },
        { title: 'Auto Loan', description: 'Toyota Camry 2024 — Rate 4.2%', badge: 'Active', value: '$6,300 remaining' },
        { title: 'Next Payment Due', description: 'Mortgage payment due April 1, 2026', badge: 'Upcoming', value: '$1,850' },
        { title: 'Payment History', description: '24 consecutive on-time payments — Excellent standing', badge: 'On Track', value: '100%' },
        { title: 'Refinance Opportunity', description: 'Current rates 0.8% lower than your mortgage rate', badge: 'Save', value: '~$180/mo' },
        { title: 'Pre-Approval Status', description: 'Personal line of credit pre-approved up to $25,000', badge: 'Available', value: '$25,000' },
      ]}
    />
  );
}
