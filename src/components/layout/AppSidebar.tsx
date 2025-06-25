
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface AppSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export function AppSidebar({ collapsed, toggleSidebar }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
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

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <nav className="flex justify-around items-center py-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 mx-1",
                  "hover:bg-breneo-blue/10 active:bg-breneo-blue/20",
                  isActive 
                    ? "bg-breneo-blue/10 text-breneo-blue" 
                    : "text-gray-600 hover:text-breneo-blue"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-colors duration-200 mb-1",
                    isActive ? "text-breneo-blue" : "group-hover:text-breneo-blue"
                  )} 
                />
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200 text-center",
                  isActive ? "text-breneo-blue" : "group-hover:text-breneo-blue"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 mx-1 text-gray-600 hover:text-red-500 hover:bg-red-50 active:bg-red-100"
          >
            <LogOut size={20} className="mb-1" />
            <span className="text-xs font-medium text-center">Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:block h-screen fixed top-0 left-0 bottom-0 z-40 bg-breneo-navy text-white transition-all duration-300 flex-col rounded-r-[0px]",
        collapsed ? "w-24" : "w-80"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-white/10 bg-white">
          <div className="flex items-center">
            {!collapsed && (
              <Link to="/" className="flex items-center space-x-2">
                <img src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" alt="Breneo Logo" className="h-12" />
              </Link>
            )}
            {collapsed && (
              <img 
                src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" 
                alt="Breneo Logo" 
                className="h-12 w-12" 
                style={{
                  objectFit: 'cover',
                  objectPosition: 'left'
                }} 
              />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-8 bg-white">
          <nav className="space-y-2 px-4">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-4 rounded-md transition-all duration-200 text-black group",
                    "hover:bg-breneo-blue/10 hover:text-breneo-blue active:bg-breneo-blue/20",
                    isActive 
                      ? "bg-breneo-blue text-white shadow-md" 
                      : "hover:shadow-sm"
                  )}
                >
                  <item.icon 
                    size={22} 
                    className={cn(
                      "transition-colors duration-200",
                      isActive 
                        ? "text-white" 
                        : "text-black group-hover:text-breneo-blue"
                    )} 
                  />
                  {!collapsed && (
                    <span className={cn(
                      "font-medium transition-colors duration-200 text-lg",
                      isActive 
                        ? "text-white" 
                        : "group-hover:text-breneo-blue"
                    )}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 bg-white">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-4")}>
            <div className="h-10 w-10 rounded-full bg-breneo-blue flex items-center justify-center text-white font-semibold">
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
              className="w-full mt-3 text-black hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
