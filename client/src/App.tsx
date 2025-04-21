import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { ThemeProvider } from './components/ui/theme-provider.tsx';

import SignUpComponent from './pages/_auth/SignUpForm.tsx';
import SignInComponent from './pages/_auth/SignInForm.tsx';
import ForgotPasswordComponent from './pages/_auth/ForgotPasswordForm.tsx';

import DashboardPageComponent from './pages/_dashboard/DashboardPage.tsx';

import CustomerPageComponent from './pages/_customers/CustomersPage.tsx';

import ContactsPageComponent from './pages/_contacts/ContactsPage.tsx';


const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>

          <Route path="/auth/sign-up" element={<SignUpComponent />} />
          <Route path="/auth/sign-in" element={<SignInComponent />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordComponent />} />

          <Route path="/dashboard" element={<DashboardPageComponent />} />

          <Route path="/customers" element={<CustomerPageComponent />} />

          <Route path="/contacts" element={<ContactsPageComponent />} />


        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
