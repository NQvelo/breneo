
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, BookOpen, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export function AppSidebar({ collapsed, toggleSidebar }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: Briefcase,
      label: 'Job Offers',
      href: '/jobs'
    },
    {
      icon: BookOpen,
      label: 'Courses',
      href: '/courses'
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" alt="Breneo Logo" className="h-8" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-breneo-blue flex items-center justify-center text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2">
          <nav className="flex justify-around items-center">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all",
                    "hover:bg-breneo-blue/10",
                    isActive ? "bg-breneo-blue/10 text-breneo-blue" : "text-gray-600"
                  )}
                >
                  <item.icon size={20} className={cn(
                    "transition-colors",
                    isActive ? "text-breneo-blue" : "text-gray-600"
                  )} />
                  <span className={cn(
                    "text-xs font-medium",
                    isActive ? "text-breneo-blue" : "text-gray-600"
                  )}>
                    {item.label === 'Job Offers' ? 'Jobs' : item.label}
                  </span>
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all hover:bg-red-50 text-gray-600"
            >
              <LogOut size={20} />
              <span className="text-xs font-medium">Sign Out</span>
            </button>
          </nav>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className={cn(
      "h-screen fixed top-4 left-4 bottom-4 z-40 bg-breneo-navy text-white transition-all duration-300 flex flex-col rounded-[20px]",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white rounded-t-[20px]">
        <div className="flex items-center">
          {!collapsed && (
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" alt="Breneo Logo" className="h-10" />
            </Link>
          )}
          {collapsed && (
            <img 
              src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" 
              alt="Breneo Logo" 
              className="h-10 w-10" 
              style={{
                objectFit: 'cover',
                objectPosition: 'left'
              }} 
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 bg-white">
        <nav className="space-y-2 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-md transition-all text-black",
                  "hover:bg-breneo-blue/10 hover:text-breneo-blue",
                  isActive ? "bg-breneo-blue/20 text-breneo-blue font-medium" : ""
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-breneo-blue" : "text-black"
                )} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 bg-white rounded-b-[20px]">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
          <div className="h-8 w-8 rounded-full bg-breneo-blue flex items-center justify-center text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-black truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-black hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
}
