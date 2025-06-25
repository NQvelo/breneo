
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
    <div className="min-h-screen bg-breneo-lightgray">
      <AppSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        // Desktop margins - updated for wider sidebar
        "md:ml-80",
        sidebarCollapsed ? "md:ml-24" : "md:ml-80",
        // Mobile padding for header and bottom nav
        "pt-16 pb-20 md:pt-0 md:pb-0"
      )}>
        <div className="px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
