// src/components/layout/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Home, Settings, FileCode, ChevronLeft, ChevronRight, Type, Key, Image, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    handleResize(); // Initialize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only show sidebar on non-homepage routes
  if (location.pathname === '/') {
    return null;
  }

  // Define the main navigation with Dashboard always showing
  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ];

  // Create a variable for the current tool being used (if any)
  let currentTool = null;
  
  // Determine which tool is currently being used based on the path
  if (location.pathname === '/generator') {
    currentTool = { name: 'Generator', href: '/generator', icon: FileCode };
  } else if (location.pathname === '/headline-analyzer') {
    currentTool = { name: 'Headline Analyzer', href: '/headline-analyzer', icon: Type };
  } else if (location.pathname === '/content-creator') {
    currentTool = { name: 'Content Creator', href: '/content-creator', icon: FileText };
  } else if (location.pathname === '/image-api-test') {
    currentTool = { name: 'Image API Test', href: '/image-api-test', icon: Image };
  } else if (location.pathname === '/meta-title-generator') {
    currentTool = { name: 'Meta Title Generator', href: '/meta-title-generator', icon: Type };
  } else if (location.pathname === '/meta-description-generator') {
    currentTool = { name: 'Meta Description Generator', href: '/meta-description-generator', icon: FileText };
  } else if (location.pathname === '/blog-content-generator') {
    currentTool = { name: 'Blog Content Generator', href: '/blog-content-generator', icon: Edit3 };
  }
  // Add more tools as they are deployed with more else if statements

  // Combine main navigation with the current tool (if any)
  const finalMainNavigation = [...mainNavigation];
  if (currentTool) {
    finalMainNavigation.push(currentTool);
  }

  // Help section stays the same, but add API Settings and Image API Test
  const helpNavigation = [
    { name: 'Documentation', href: '/docs', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'API Settings', href: '/api-settings', icon: Key },
  ];

  // Group the navigation sections
  const navigation = [
    { 
      title: 'MAIN',
      items: finalMainNavigation
    },
    {
      title: 'HELP',
      items: helpNavigation
    }
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 transition-all duration-300 flex flex-col z-40 shadow-sm",
        isCollapsed ? "w-[96px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center justify-center py-5 border-b border-gray-100",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <Link to="/dashboard" className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex flex-col items-center justify-center text-white font-bold text-xs leading-tight shadow-md">
            <span>SEO</span>
            <span>PROMPT</span>
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold text-gray-800 tracking-tight">Dashboard</span>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 z-10 rounded-full border-2 border-gray-200 bg-white shadow-md hover:bg-gray-50 hidden md:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </Button>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col items-center pt-5 space-y-4 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {navigation.map((group) => (
          <div key={group.title} className="w-full">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "relative flex flex-col items-center justify-center mx-auto w-16 h-16 rounded-md transition-all duration-200",
                      "hover:bg-indigo-50 group",
                      isActive 
                        ? "bg-indigo-50 text-indigo-600" 
                        : "text-gray-600 hover:text-indigo-600",
                      !isCollapsed && "w-full h-12 flex-row justify-start px-4"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon 
                      className={cn(
                        "h-6 w-6 transition-colors duration-200",
                        !isCollapsed && "mr-3",
                        isActive 
                          ? "text-indigo-600" 
                          : "text-gray-500 group-hover:text-indigo-600"
                      )} 
                    />
                    {isCollapsed ? (
                      <span className="text-xs mt-1 text-center">{item.name}</span>
                    ) : (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;