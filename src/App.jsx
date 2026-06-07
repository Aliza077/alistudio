import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardAI from './pages/dashboard/DashboardAI';
import DashboardAccounts from './pages/dashboard/DashboardAccounts';
import DashboardTransactions from './pages/dashboard/DashboardTransactions';
import DashboardReports from './pages/dashboard/DashboardReports';
import DashboardFeedback from './pages/dashboard/DashboardFeedback';
import DashboardInvestments from './pages/dashboard/DashboardInvestments';
import DashboardLoans from './pages/dashboard/DashboardLoans';
import DashboardTaxes from './pages/dashboard/DashboardTaxes';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Cart from './pages/Cart';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />

            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="ai" element={<DashboardAI />} />
              <Route path="accounts" element={<DashboardAccounts />} />
              <Route path="transactions" element={<DashboardTransactions />} />
              <Route path="reports" element={<DashboardReports />} />
              <Route path="feedback" element={<DashboardFeedback />} />
              <Route path="investments" element={<DashboardInvestments />} />
              <Route path="loans" element={<DashboardLoans />} />
              <Route path="taxes" element={<DashboardTaxes />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
