
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface AppSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export function AppSidebar({ collapsed, toggleSidebar }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  
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
      icon: Settings,
      label: 'Courses',
      href: '/courses'
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={cn(
      "h-screen fixed top-0 left-0 z-40 bg-breneo-navy text-white transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white">
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
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-md transition-all text-black",
                "hover:bg-white/10",
                window.location.pathname === item.href ? "bg-white/20" : ""
              )}
            >
              <item.icon size={20} className="text-black" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 bg-white">
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
