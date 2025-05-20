
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
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        {children}
      </main>
    </div>
  );
}
