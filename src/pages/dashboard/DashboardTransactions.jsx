import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import DashboardPage from './DashboardPage';

export default function DashboardTransactions() {
  return (
    <DashboardPage
      title="Transactions"
      subtitle="View and filter all your financial transactions"
      icon={ArrowLeftRight}
      stats={[
        { value: '156', label: 'This Month', change: '+12', positive: true },
        { value: '$8,420', label: 'Total Spent', change: '-3.2%', positive: false },
        { value: '$12,800', label: 'Total Income', change: '+8.5%', positive: true },
      ]}
      items={[
        { title: 'PlayStation Store', description: '31 Mar, 3:20 PM • Entertainment', badge: 'Expense', value: '-$19.99' },
        { title: 'Netflix Subscription', description: '29 Mar, 5:11 PM • Subscriptions', badge: 'Recurring', value: '-$30.00' },
        { title: 'Airbnb Booking', description: '29 Mar, 1:20 PM • Travel', badge: 'Expense', value: '-$300.00' },
        { title: 'Freelance Payment — Tommy C.', description: '27 Mar, 2:31 PM • Income', badge: 'Income', value: '+$27.00' },
        { title: 'Apple App Store', description: '27 Mar, 11:04 AM • Software', badge: 'Expense', value: '-$10.00' },
        { title: 'Salary Deposit', description: '25 Mar, 9:00 AM • Payroll', badge: 'Income', value: '+$4,500.00' },
        { title: 'Grocery — Whole Foods', description: '24 Mar, 6:45 PM • Groceries', badge: 'Expense', value: '-$142.30' },
        { title: 'Electric Bill', description: '22 Mar, 10:00 AM • Utilities', badge: 'Recurring', value: '-$89.50' },
      ]}
    />
  );
}
