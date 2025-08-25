import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Layout
import Layout from '@/components/organisms/Layout';

// Pages
import Dashboard from '@/components/pages/Dashboard';
import Analytics from '@/components/pages/Analytics';
import Campaigns from '@/components/pages/Campaigns';
import Content from '@/components/pages/Content';
import CreativeStudio from '@/components/pages/CreativeStudio';
import SEOPanel from '@/components/pages/SEOPanel';
import Accounts from '@/components/pages/Accounts';
import Settings from '@/components/pages/Settings';
import Reports from '@/components/pages/Reports';
import ABTesting from '@/components/pages/ABTesting';
import CompetitorIntel from '@/components/pages/CompetitorIntel';

// UI Components
import Error from '@/components/ui/Error';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
<Route path="campaigns" element={<Campaigns />} />
            <Route path="content" element={<Content />} />
            <Route path="creative-studio" element={<CreativeStudio />} />
            <Route path="seo-panel" element={<SEOPanel />} />
            <Route path="accounts" element={<Accounts />} />
<Route path="settings" element={<Settings />} />
<Route path="reports" element={<Reports />} />
<Route path="ab-testing" element={<ABTesting />} />
<Route path="competitor-intel" element={<CompetitorIntel />} />
<Route path="*" element={<Error message="Page not found" />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;