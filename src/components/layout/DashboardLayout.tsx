
import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="h-screen bg-breneo-lightgray overflow-hidden">
      <AppSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <main className={cn(
        "h-full transition-all duration-300 overflow-y-auto",
        // Desktop margins
        "md:ml-72",
        sidebarCollapsed ? "md:ml-28" : "md:ml-72",
        // Mobile padding for header and bottom nav
        "pt-16 pb-20 md:pt-0 md:pb-0"
      )}>
        <div className="px-4 md:px-6 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
