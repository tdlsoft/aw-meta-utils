
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from '@/components/Sidebar';
import DashboardPage from '@/pages/DashboardPage';
import MetaOnboardingPage from '@/pages/MetaOnboardingPage';

const basename = import.meta.env.VITE_BASE || '/';

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <div className="flex">
              <Sidebar />
              <DashboardPage />
            </div>
          }
        />

        <Route
          path="/meta-onboarding"
          element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <MetaOnboardingPage />
              </div>
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

    </Router>
  );
}

export default App;
