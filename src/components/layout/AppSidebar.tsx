
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
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
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

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:block h-screen fixed top-4 left-4 bottom-4 z-40 bg-breneo-navy text-white transition-all duration-300 flex-col rounded-[20px]",
        collapsed ? "w-20" : "w-64"
      )}>
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white rounded-t-[20px]">
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

        <div className="flex-1 overflow-y-auto py-6 bg-white">
          <nav className="space-y-2 px-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-md transition-all duration-200 text-black group",
                    "hover:bg-breneo-blue/10 hover:text-breneo-blue active:bg-breneo-blue/20",
                    isActive 
                      ? "bg-breneo-blue text-white shadow-md" 
                      : "hover:shadow-sm"
                  )}
                >
                  <item.icon 
                    size={20} 
                    className={cn(
                      "transition-colors duration-200",
                      isActive 
                        ? "text-white" 
                        : "text-black group-hover:text-breneo-blue"
                    )} 
                  />
                  {!collapsed && (
                    <span className={cn(
                      "font-medium transition-colors duration-200",
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

        {collapsed && (
          <div className="p-4 border-t border-white/10 bg-white rounded-b-[20px] flex justify-center">
            <ProfileDropdown />
          </div>
        )}

        {!collapsed && (
          <div className="p-4 border-t border-white/10 bg-white rounded-b-[20px]">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-breneo-blue flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black truncate">
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
