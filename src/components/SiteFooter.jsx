import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, PackageSearch, KeyRound, Wallet, XCircle, RotateCcw,
  CreditCard, MapPinned, UserRound
} from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', className: 'pay-cod' },
  { id: 'visa', label: 'VISA', className: 'pay-visa' },
  { id: 'mastercard', label: 'mastercard', className: 'pay-mc' },
  { id: 'easypaisa', label: 'easypaisa', className: 'pay-easy' },
  { id: 'jazzcash', label: 'JazzCash', className: 'pay-jazz' },
  { id: 'nayapay', label: 'NayaPay', className: 'pay-naya' },
  { id: 'sadapay', label: 'SadaPay', className: 'pay-sada' },
  { id: 'unionpay', label: 'UnionPay', className: 'pay-union' },
  { id: 'hbl', label: 'HBL Bank', className: 'pay-hbl' },
];

export const HELP_TOOLS = [
  { id: 'track', label: 'Track My Order', icon: PackageSearch, path: '/help-center?tool=track' },
  { id: 'reset', label: 'Reset Password', icon: KeyRound, path: '/login' },
  { id: 'wallet', label: 'Ali Studio Wallet', icon: Wallet, path: '/help-center?tool=wallet' },
  { id: 'cancel', label: 'Cancel My Order', icon: XCircle, path: '/help-center?tool=cancel' },
  { id: 'return', label: 'Return My Order', icon: RotateCcw, path: '/help-center?tool=return' },
  { id: 'payment', label: 'My Payment Options', icon: CreditCard, path: '/help-center?tool=payment' },
  { id: 'address', label: 'Change Delivery Address', icon: MapPinned, path: '/cart' },
  { id: 'profile', label: 'My Profile', icon: UserRound, path: '/help-center?tool=profile' },
];

export default function SiteFooter({ compact = false }) {
  return (
    <footer className={`site-footer ${compact ? 'site-footer-compact' : ''}`}>
      <div className="site-footer-inner">
        <div className="site-footer-payments-row">
          <div className="site-footer-payments">
            <h4 className="site-footer-heading">Payment Methods</h4>
            <div className="payment-methods-grid">
              {PAYMENT_METHODS.map((m) => (
                <div key={m.id} className={`payment-method-chip ${m.className}`}>
                  {m.label}
                </div>
              ))}
            </div>
          </div>
          <div className="site-footer-verified">
            <h4 className="site-footer-heading">Verified by</h4>
            <div className="payment-method-chip pay-pci">PCI DSS Compliant</div>
          </div>
        </div>

        <div className="site-footer-help-row">
          <Link to="/help-center" className="site-footer-help-btn">
            <HelpCircle size={16} />
            Help Center
          </Link>
          <div className="site-footer-help-tools">
            {HELP_TOOLS.map((tool) => (
              <Link key={tool.id} to={tool.path} className="site-footer-tool-link" title={tool.label}>
                <tool.icon size={14} />
                <span>{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>&copy; {new Date().getFullYear()} Ali Studio. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
