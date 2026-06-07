import React from 'react';
import { Receipt } from 'lucide-react';
import DashboardPage from './DashboardPage';

export default function DashboardTaxes() {
  return (
    <DashboardPage
      title="Taxes"
      subtitle="Tax documents, deductions, and filing status"
      icon={Receipt}
      stats={[
        { value: '$4,820', label: 'Est. Tax Liability' },
        { value: '$2,340', label: 'Deductions Found', change: '+$420', positive: true },
        { value: '18', label: 'Documents' },
      ]}
      items={[
        { title: 'W-2 — Employment Income', description: 'Annual salary and withholdings from primary employer', badge: 'Received', value: '$72,000' },
        { title: '1099 — Freelance Income', description: 'Contract work and side project payments', badge: 'Received', value: '$8,400' },
        { title: 'Mortgage Interest Deduction', description: 'Deductible home mortgage interest for tax year 2026', badge: 'Deduction', value: '$4,200' },
        { title: 'Charitable Contributions', description: 'Verified donations to registered nonprofits', badge: 'Deduction', value: '$1,850' },
        { title: 'Business Expenses', description: 'Home office, software, and equipment deductions', badge: 'Deduction', value: '$3,120' },
        { title: 'Filing Status', description: 'Federal return preparation in progress — estimated refund', badge: 'In Progress', value: '$1,240 refund' },
      ]}
    />
  );
}
