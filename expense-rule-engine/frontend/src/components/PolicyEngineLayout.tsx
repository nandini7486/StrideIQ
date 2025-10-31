import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface PolicyEngineLayoutProps {
  sidebar: ReactNode;
  mainContent: ReactNode;
  testPanel: ReactNode;
}

export function PolicyEngineLayout({ sidebar, mainContent, testPanel }: PolicyEngineLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        {sidebar}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Rules Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {mainContent}
        </div>
        
        {/* Test Panel */}
        <div className="w-[400px] border-l border-gray-200 bg-white overflow-y-auto">
          {testPanel}
        </div>
      </div>
      
      <Outlet />
    </div>
  );
}
