
import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-breneo-lightgray">
      <AppSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <main className={cn(
        "min-h-screen transition-all duration-300",
        isMobile 
          ? "pt-20 pb-20" // Top header height + bottom nav height
          : sidebarCollapsed 
            ? "ml-28" 
            : "ml-72"
      )}>
        <div className={cn(
          "w-full",
          isMobile ? "px-4" : ""
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
