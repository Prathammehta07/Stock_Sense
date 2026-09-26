import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import OTPVerification from '../pages/auth/OTPVerification';

import Dashboard from '../pages/dashboard/Dashboard';
import Products from '../pages/products/Products';
import Operations from '../pages/operations/Operations';
import Receipts from '../pages/operations/Receipts';
import Deliveries from '../pages/operations/Deliveries';
import Transfers from '../pages/operations/Transfers';
import Adjustments from '../pages/operations/Adjustments';
import Stock from '../pages/stock/Stock';
import StockLedger from '../pages/stock/StockLedger';
import Warehouses from '../pages/warehouses/Warehouses';
import MoveHistory from '../pages/move-history/MoveHistory';
import Settings from '../pages/settings/Settings';
import Profile from '../pages/profile/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="verify-otp" element={<OTPVerification />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>

      {/* Main Dashboard Protected Routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />

        {/* Operations */}
        <Route path="operations" element={<Operations />} />
        <Route path="operations/receipts" element={<Receipts />} />
        <Route path="operations/receipts/:id" element={<Receipts />} />
        <Route path="operations/deliveries" element={<Deliveries />} />
        <Route path="operations/deliveries/:id" element={<Deliveries />} />
        <Route path="operations/transfers" element={<Transfers />} />
        <Route path="operations/transfers/:id" element={<Transfers />} />
        <Route path="operations/adjustments" element={<Adjustments />} />
        <Route path="operations/adjustments/:id" element={<Adjustments />} />

        {/* Stock & History */}
        <Route path="stock" element={<Stock />} />
        <Route path="stock/ledger" element={<StockLedger />} />
        <Route path="move-history" element={<MoveHistory />} />

        {/* Warehouses */}
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="warehouses/locations" element={<Warehouses />} />

        {/* Settings & Profile */}
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />

        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
