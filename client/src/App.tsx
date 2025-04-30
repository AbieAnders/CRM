import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { ThemeProvider } from './components/ui/theme-provider.tsx';

import SignUpComponent from './pages/_auth/SignUpPage.tsx';
import SignInComponent from './pages/_auth/SignInPage.tsx';
import ResetPasswordComponent from './pages/_auth/ResetPasswordPage.tsx';
import ProtectedRouteComponent from './components/middleware/ProtectedRoute.tsx';

import DashboardPageComponent from './pages/_dashboard/DashboardPage.tsx';

import CustomerPageComponent from './pages/_customers/CustomersPage.tsx';

import ContactsPageComponent from './pages/_contacts/ContactsPage.tsx';

import OrgPageComponent from './pages/_org/OrgPage.tsx';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>

          <Route
            path="/auth/sign-up"
            element={<SignUpComponent />}
          />
          <Route
            path="/auth/sign-in"
            element={<SignInComponent />}
          />
          <Route
            path="/auth/reset-password"
            element={<ResetPasswordComponent />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRouteComponent>
                <DashboardPageComponent />
              </ProtectedRouteComponent>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRouteComponent>
                <CustomerPageComponent />
              </ProtectedRouteComponent>
            }
          />

          <Route
            path="/contacts"
            element={
              <ProtectedRouteComponent>
                <ContactsPageComponent />
              </ProtectedRouteComponent>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRouteComponent>
                <OrgPageComponent />
              </ProtectedRouteComponent>
            } //come back to this later
          />

        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
