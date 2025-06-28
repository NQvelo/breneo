
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

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-gray-50">
          <div className="h-10 w-10 rounded-full bg-[#1BABE5] flex items-center justify-center text-white font-semibold text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-gray-100" align="end">
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" alt="Breneo Logo" className="h-8" />
          </Link>
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <nav className="flex justify-around items-center py-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1 mx-1",
                  "hover:bg-[#1BABE5]/10 active:bg-[#1BABE5]/20",
                  isActive 
                    ? "bg-[#1BABE5]/10 text-[#1BABE5]" 
                    : "text-gray-600 hover:text-[#1BABE5]"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-colors duration-200 mb-1",
                    isActive ? "text-[#1BABE5]" : "group-hover:text-[#1BABE5]"
                  )} 
                />
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200 text-center",
                  isActive ? "text-[#1BABE5]" : "group-hover:text-[#1BABE5]"
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
        "hidden md:block h-screen fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-gray-100 transition-all duration-300 flex-col",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center justify-between w-full">
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
            {!collapsed && <ProfileDropdown />}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-2 px-3">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-700 group relative",
                    "hover:bg-[#1BABE5]/8 hover:text-[#1BABE5]",
                    "active:scale-[0.98]",
                    isActive 
                      ? "bg-[#1BABE5]/12 text-[#1BABE5] font-medium" 
                      : ""
                  )}
                >
                  <item.icon 
                    size={20} 
                    className={cn(
                      "transition-all duration-200 flex-shrink-0",
                      isActive 
                        ? "text-[#1BABE5]" 
                        : "text-gray-500 group-hover:text-[#1BABE5]"
                    )} 
                  />
                  {!collapsed && (
                    <span className={cn(
                      "font-medium transition-all duration-200 truncate",
                      isActive 
                        ? "text-[#1BABE5]" 
                        : "group-hover:text-[#1BABE5]"
                    )}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        {collapsed && (
          <div className="p-4 border-t border-gray-50 flex justify-center">
            <ProfileDropdown />
          </div>
        )}

        {!collapsed && (
          <div className="p-4 border-t border-gray-50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#1BABE5] flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
