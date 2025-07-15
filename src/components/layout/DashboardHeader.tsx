import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  sidebarCollapsed?: boolean;
}

export function DashboardHeader({ sidebarCollapsed = false }: DashboardHeaderProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/jobs':
        return 'Job Offers';
      case '/courses':
        return 'Courses';
      case '/profile':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`hidden md:block fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300 ${sidebarCollapsed ? 'left-20' : 'left-64'}`}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Page title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
            <span className="text-gray-500 font-normal"> /Accounting</span>
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Cloud CRM dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <span>Cloud CRM</span>
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Cloud CRM</DropdownMenuItem>
              <DropdownMenuItem>Local CRM</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
          </button>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-orange-500 text-white text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}