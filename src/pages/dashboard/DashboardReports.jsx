import React from 'react';
import { FileText } from 'lucide-react';
import DashboardPage from './DashboardPage';

export default function DashboardReports() {
  return (
    <DashboardPage
      title="Reports"
      subtitle="Financial reports and analytics summaries"
      icon={FileText}
      stats={[
        { value: '8', label: 'Available Reports' },
        { value: 'Mar 2026', label: 'Latest Period' },
        { value: 'PDF', label: 'Export Format' },
      ]}
      items={[
        { title: 'Monthly Income Statement', description: 'Complete breakdown of income sources and deductions for March 2026.', badge: 'Ready', value: 'Download' },
        { title: 'Expense Category Report', description: 'Spending distribution across all categories with month-over-month comparison.', badge: 'Ready', value: 'Download' },
        { title: 'Cash Flow Analysis', description: 'Inflow vs outflow trends with 12-month historical data visualization.', badge: 'Ready', value: 'Download' },
        { title: 'Tax Summary Q1 2026', description: 'Quarterly tax preparation summary with deductible expense totals.', badge: 'Draft', value: 'Preview' },
        { title: 'Investment Performance', description: 'Portfolio returns, asset allocation, and benchmark comparison report.', badge: 'Ready', value: 'Download' },
        { title: 'Annual Financial Review', description: 'Comprehensive year-to-date financial health assessment and projections.', badge: 'Generating', value: '65%' },
      ]}
    />
  );
}
