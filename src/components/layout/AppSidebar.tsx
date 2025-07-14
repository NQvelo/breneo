
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, BookOpen, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      label: 'Branches',
      href: '/jobs'
    },
    {
      icon: BookOpen,
      label: 'Employees',
      href: '/courses'
    },
    {
      icon: Settings,
      label: 'Alerts',
      href: '/alerts'
    }
  ];

  const appItems = [
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings'
    },
    {
      icon: User,
      label: 'Support',
      href: '/support'
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-gray-100">
          <div className="h-8 w-8 rounded-full bg-breneo-blue flex items-center justify-center text-white font-semibold text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="w-[200px] truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" alt="Breneo Logo" className="h-8" />
          </Link>
          <ProfileDropdown />
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
        </nav>
      </div>

      {/* Desktop Sidebar - Full Height */}
      <div className={cn(
        "hidden md:block h-screen fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 flex-col shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold text-gray-900">CashFlow</h1>
                <p className="text-sm text-gray-500">Enterprise</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          {/* Main Section */}
          <div className="px-6 mb-6">
            {!collapsed && <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</h3>}
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={index}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 group",
                      isActive 
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                        : "hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon 
                      size={18} 
                      className={cn(
                        "flex-shrink-0",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )} 
                    />
                    {!collapsed && (
                      <span className="font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* App Section */}
          <div className="px-6">
            {!collapsed && <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">App</h3>}
            <nav className="space-y-1">
              {appItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={index}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 group",
                      isActive 
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                        : "hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon 
                      size={18} 
                      className={cn(
                        "flex-shrink-0",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )} 
                    />
                    {!collapsed && (
                      <span className="font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'ND'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Nodar Dumbadze'}
                </p>
                <p className="text-xs text-gray-500 truncate">Business owner</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'ND'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
