// File: src/App.jsx
import { useState } from 'react';
import { LiveDataProvider } from './context/LiveDataContext';
import { AlertsProvider } from './context/AlertsContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { HistoryPage } from './pages/HistoryPage';
import { AIReportsPage } from './pages/AIReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const PAGES = {
  home: HomePage,
  'live-monitor': LiveMonitorPage,
  history: HistoryPage,
  'ai-reports': AIReportsPage,
  settings: SettingsPage,
};

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const ActivePage = PAGES[activePage] ?? HomePage;

  return (
    <div className="min-h-screen w-full bg-white text-[#111827]">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} active={activePage} onSelect={setActivePage} />
        <main className="min-w-0 flex-1 p-6">
          <ActivePage />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    // LiveDataProvider must wrap AlertsProvider — alerts are derived from
    // live data. Both sit above Header (for the bell) and every page.
    <LiveDataProvider>
      <AlertsProvider>
        <AppShell />
      </AlertsProvider>
    </LiveDataProvider>
  );
}
