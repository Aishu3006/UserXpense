import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import UsersPage from './components/Users/UsersPage.jsx';
import ExpensesPage from './components/Expenses/ExpensePage.jsx';
import AnalyticsPage from './components/Analytics/AnalyticsPage.jsx';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;


