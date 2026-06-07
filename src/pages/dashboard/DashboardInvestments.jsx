import React from 'react';
import { TrendingUp } from 'lucide-react';
import DashboardPage from './DashboardPage';

export default function DashboardInvestments() {
  return (
    <DashboardPage
      title="Investments"
      subtitle="Track your portfolio performance and asset allocation"
      icon={TrendingUp}
      stats={[
        { value: '$67,340', label: 'Portfolio Value', change: '+12.4%', positive: true },
        { value: '$4,280', label: 'YTD Returns', change: '+6.8%', positive: true },
        { value: '6', label: 'Holdings' },
      ]}
      items={[
        { title: 'S&P 500 Index Fund', description: 'Vanguard VOO — Large cap US equities', badge: 'ETF', value: '$28,500 (+14.2%)' },
        { title: 'Tech Growth Fund', description: 'ARK Innovation ETF — High growth technology', badge: 'ETF', value: '$12,800 (+22.1%)' },
        { title: 'Real Estate REIT', description: 'Vanguard Real Estate — Commercial properties', badge: 'REIT', value: '$9,200 (+5.3%)' },
        { title: 'Bond Portfolio', description: 'iShares Core Bond — Fixed income stability', badge: 'Bond', value: '$8,400 (+2.1%)' },
        { title: 'Crypto Holdings', description: 'Bitcoin & Ethereum — Digital assets', badge: 'Crypto', value: '$5,240 (+18.7%)' },
        { title: 'International Fund', description: 'FTSE Developed Markets — Global diversification', badge: 'ETF', value: '$3,200 (+7.9%)' },
      ]}
    />
  );
}
