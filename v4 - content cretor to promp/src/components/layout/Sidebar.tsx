// src/components/layout/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Home, Settings, FileCode, ChevronLeft, ChevronRight, Type, Key, Image, Edit3, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      if (newIsMobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

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

  // Combine main navigation with the current tool (if any)
  const finalMainNavigation = [...mainNavigation];
  if (currentTool) {
    finalMainNavigation.push(currentTool);
  }

  // Help section stays the same
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
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg rounded-lg h-10 w-10 transition-all duration-200"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300 mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "h-screen fixed left-0 top-0 bottom-0 flex flex-col z-40 sidebar-container",
          "transition-all duration-300 ease-in-out",
          "bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900",
          "border-r border-indigo-700",
          isCollapsed ? "w-[96px]" : "w-64",
          isMobile ? (
            isMobileOpen ? "translate-x-0 shadow-2xl mobile-sidebar" : "-translate-x-full"
          ) : "translate-x-0 shadow-xl"
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none animated-pattern">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
            </pattern>
            <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>

        {/* Logo */}
        <div className={cn(
          "flex items-center justify-center py-6 border-b border-indigo-700/50",
          isCollapsed ? "px-2" : "px-6"
        )}>
          <Link to="/dashboard" className="flex items-center justify-center group sidebar-logo">
            <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center text-indigo-900 font-bold text-xs shadow-lg group-hover:scale-105 transition-all duration-200">
              <span className="text-lg">SEO</span>
            </div>
            <span 
              className={cn(
                "ml-3 text-lg font-semibold text-white tracking-tight",
                "transition-all duration-200",
                isCollapsed ? "opacity-0 absolute" : "opacity-100 group-hover:translate-x-1"
              )}
            >
              SEO Prompt
            </span>
          </Link>
        </div>

        {/* Premium Toggle Button */}
        <div className="absolute -right-5 top-20 z-20 hidden md:block">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "toggle-button relative rounded-full w-10 h-10",
              "bg-gradient-to-r from-indigo-500 to-indigo-600",
              "text-white hover:text-white",
              "border-2 border-indigo-200",
              "shadow-[0_0_15px_rgba(79,70,229,0.4)]",
              "hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]",
              "transition-all duration-300 ease-out",
              "flex items-center justify-center",
              "group overflow-hidden",
              isCollapsed ? "" : "open"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {/* Background pulse effect */}
            <div className="absolute inset-0 bg-indigo-400/20 rounded-full pulse-effect"></div>
            
            {/* Inner circle */}
            <div className={cn(
              "absolute inset-1.5 rounded-full",
              "bg-indigo-600 group-hover:bg-indigo-700",
              "transition-all duration-300",
              "flex items-center justify-center"
            )}>
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
            
            {/* Tooltip on hover */}
            <div className={cn(
              "absolute left-full ml-2 px-2 py-1",
              "bg-indigo-900 text-white text-xs font-medium",
              "rounded-md whitespace-nowrap",
              "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
              "transition-all duration-300 pointer-events-none",
              "shadow-lg"
            )}>
              {isCollapsed ? "Expand menu" : "Collapse menu"}
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-indigo-900 rotate-45"></div>
            </div>
          </Button>
        </div>

        {/* Navigation Items */}
        <div 
          className={cn(
            "flex-1 flex flex-col pt-5 space-y-1 overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent px-3 custom-scrollbar"
          )}
        >
          {navigation.map((group) => (
            <div key={group.title} className="w-full mb-6">
              {!isCollapsed && (
                <h3 className={cn(
                  "px-3 text-xs font-medium text-indigo-300 mb-3 uppercase tracking-wider section-title"
                )}>
                  {group.title}
                </h3>
              )}
              
              <nav className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "group flex items-center transition-all duration-200 rounded-lg sidebar-nav-item",
                        isCollapsed ? "flex-col py-4 px-2" : "py-3 px-3",
                        isActive ? (
                          "bg-indigo-700/50 backdrop-blur-sm text-white shadow-lg nav-item-active"
                        ) : (
                          "text-indigo-100 hover:bg-indigo-700/30 hover:text-white"
                        ),
                        "relative overflow-hidden"
                      )}
                      title={item.name}
                    >
                      {/* Background Glow for Active Item */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 pointer-events-none" />
                      )}
                      
                      {/* Icon */}
                      <div className={cn(
                        "flex items-center justify-center transition-transform duration-200 sidebar-icon",
                        isCollapsed ? "mb-2" : "mr-3",
                        isActive ? "text-white" : "text-indigo-300 group-hover:text-white",
                        "group-hover:scale-110"
                      )}>
                        <Icon className={cn(
                          "transition-colors",
                          isCollapsed ? "h-6 w-6" : "h-5 w-5"
                        )} />
                      </div>
                      
                      {/* Text */}
                      <span 
                        className={cn(
                          isCollapsed ? "text-xs text-center" : "text-sm font-medium",
                          "transition-all duration-200",
                          isActive && !isCollapsed ? "translate-x-1" : ""
                        )}
                      >
                        {item.name}
                      </span>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className={cn(
                          "absolute active-indicator",
                          isCollapsed ? (
                            "right-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-white rounded-l-full"
                          ) : (
                            "left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-white rounded-r-full"
                          ),
                          "shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        )}/>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        
        {/* Status Bar */}
        <div className="border-t border-indigo-700/50 mt-auto py-4 px-3 bg-indigo-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 status-indicator">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
              <div className="text-xs font-medium text-indigo-200">
                {isCollapsed ? "" : "System Online"}
              </div>
            </div>
            {!isCollapsed && (
              <div className="text-xs text-indigo-300">v1.2.0</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;