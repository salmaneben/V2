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
import ArticleGeneratorPage from './pages/ArticleGenerator';
import PromptGeneratorPage from './pages/PromptGenerator'; // Import the new PromptGenerator page
import './App.css';
import { ToastProvider } from './components/ui/toast';

// Layout wrapper component
const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [sidebarState, setSidebarState] = useState(() => {
    // Get saved state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true' ? 'collapsed' : 'expanded';
  });
  
  // Monitor sidebar state changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sidebarCollapsed') {
        setSidebarState(e.newValue === 'true' ? 'collapsed' : 'expanded');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Check changes from sidebar component directly
  useEffect(() => {
    const checkSidebarState = () => {
      const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      setSidebarState(isCollapsed ? 'collapsed' : 'expanded');
    };
    
    // Run initially and when sidebar might change
    checkSidebarState();
    window.addEventListener('resize', checkSidebarState);
    
    return () => {
      window.removeEventListener('resize', checkSidebarState);
    };
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isHomePage && <Sidebar />}
      
      <main 
        className={`flex-1 transition-all duration-300 ${
          !isHomePage ? (
            sidebarState === 'collapsed' ? 'ml-[96px]' : 
            sidebarState === 'expanded' ? 'ml-64' : 'ml-0'
          ) : ''
        } md:pt-0 pt-16`} // Added top padding for mobile
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
          <Route path="/article-generator" element={<ArticleGeneratorPage sidebarState={sidebarState} />} />
          {/* Add the new Prompt Generator route */}
          <Route path="/prompt-generator" element={<PromptGeneratorPage sidebarState={sidebarState} />} />
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