import React from 'react';
import { CreditCard } from 'lucide-react';
import DashboardPage from './DashboardPage';

export default function DashboardAccounts() {
  return (
    <DashboardPage
      title="Accounts"
      subtitle="Manage your linked bank accounts and payment methods"
      icon={CreditCard}
      stats={[
        { value: '4', label: 'Linked Accounts' },
        { value: '$142,890', label: 'Total Balance', change: '+5.1%', positive: true },
        { value: '2', label: 'Credit Cards', change: 'Active', positive: true },
      ]}
      items={[
        { title: 'Primary Checking', description: 'Chase Bank •••• 4821', badge: 'Default', value: '$45,230.00' },
        { title: 'Savings Account', description: 'Chase Bank •••• 7734', badge: 'High Yield', value: '$78,450.00' },
        { title: 'Business Account', description: 'Wells Fargo •••• 2290', badge: 'Business', value: '$19,210.00' },
        { title: 'Visa Platinum', description: '•••• 0224 — Expires 08/27', badge: 'Credit', value: '$2,340 / $15,000' },
        { title: 'Mastercard Gold', description: '•••• 4432 — Expires 12/26', badge: 'Credit', value: '$890 / $10,000' },
        { title: 'PayPal Wallet', description: 'Linked for online purchases', badge: 'Digital', value: '$1,200.00' },
      ]}
    />
  );
}
