// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import HeadlineAnalyzer from './pages/HeadlineAnalyzer';
import DocumentViewer from './pages/DocumentViewer';
import ContentCreator from './pages/ContentCreator';
import ApiSettings from './pages/ApiSettings';
import MetaTitleGenerator from './pages/MetaTitleGenerator';
import MetaDescriptionGenerator from './pages/MetaDescriptionGenerator';
import BlogContentGeneratorPage from './pages/BlogContentGenerator';
import './App.css';
import { ToastProvider } from './components/ui/toast';


// Layout wrapper component
const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [sidebarState, setSidebarState] = useState('collapsed'); // 'collapsed', 'expanded', or 'closed'
  
  // Monitor sidebar state changes using MutationObserver
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="fixed left-0"]');
      if (sidebar) {
        const sidebarClasses = sidebar.className;
        if (sidebarClasses.includes('w-[96px]')) {
          setSidebarState('collapsed');
        } else if (sidebarClasses.includes('w-64')) {
          setSidebarState('expanded');
        }
      }
    };
    
    const observer = new MutationObserver(checkSidebarState);
    const sidebar = document.querySelector('[class*="fixed left-0"]');
    
    if (sidebar) {
      observer.observe(sidebar, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
      
      // Initial check
      checkSidebarState();
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isHomePage && <Sidebar />}
      
      <main 
        className={`flex-1 transition-all duration-300 ${
          !isHomePage ? (sidebarState === 'collapsed' ? 'ml-[96px]' : sidebarState === 'expanded' ? 'ml-64' : 'ml-0') : ''
        }`}
        data-sidebar-state={sidebarState}
      >
        {isHomePage && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard sidebarState={sidebarState} />} />
          <Route path="/generator" element={<Generator sidebarState={sidebarState} />} />
          <Route path="/headline-analyzer" element={<HeadlineAnalyzer sidebarState={sidebarState} />} />
          <Route path="/document/:id" element={<DocumentViewer />} />
          <Route path="/content-creator" element={<ContentCreator sidebarState={sidebarState} />} />
          <Route path="/docs" element={<div className="p-8">Documentation Page</div>} />
          <Route path="/settings" element={<div className="p-8">Settings Page</div>} />
          <Route path="/api-settings" element={<ApiSettings sidebarState={sidebarState} />} />
          <Route path="/meta-title-generator" element={<MetaTitleGenerator sidebarState={sidebarState} />} />
          <Route path="/meta-description-generator" element={<MetaDescriptionGenerator sidebarState={sidebarState} />} />
          <Route path="/blog-content-generator" element={<BlogContentGeneratorPage sidebarState={sidebarState} />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </Router>
  );
};

export default App;