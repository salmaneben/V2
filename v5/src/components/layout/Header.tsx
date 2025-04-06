// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the navigation items
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Generator', href: '/generator' },
  { name: 'Documentation', href: '/docs' },
  { name: 'Pricing', href: '/pricing' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300',
        'bg-white border-gray-200',
        scrolled ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'shadow-sm'
      )}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-md bg-indigo-600 flex flex-col items-center justify-center text-white font-bold text-xs leading-none p-1">
                <span>SEO</span>
                <span>PROMPT</span>
              </div>
              <span className="text-lg font-bold text-gray-800">
                SEO Prompt
              </span>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1 mx-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600">
              <Search className="h-5 w-5" />
            </button>
            
            {/* Dashboard Button - Fixed width to prevent layout shifting */}
            <Link 
              to="/dashboard"
              className={cn(
                "inline-flex items-center justify-center rounded-md",
                "bg-indigo-600 text-white font-medium",
                "hover:bg-indigo-700 transition-colors",
                "px-6 py-2 text-sm whitespace-nowrap"
              )}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;