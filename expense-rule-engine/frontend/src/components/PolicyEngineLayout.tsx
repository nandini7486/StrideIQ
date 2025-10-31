import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface PolicyEngineLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  testPanel: React.ReactNode;
}

export function PolicyEngineLayout({ sidebar, mainContent, testPanel }: PolicyEngineLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Left Sidebar */}
      <aside 
        className={`${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:translate-x-0 fixed md:static inset-y-0 left-0 w-[250px] bg-[#F5F5F5] border-r border-[#E5E5E5] 
                  transform transition-transform duration-200 ease-in-out z-40`}
      >
        <div className="p-6 border-b border-[#E5E5E5]">
          <h1 className="text-[20px] font-semibold">Policy Engine</h1>
        </div>
        <nav className="p-2">
          {sidebar}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto bg-white">
        <div className="h-full">
          {mainContent}
        </div>
      </main>
      
      {/* Right Sidebar - Test Panel */}
      <div className={`${isTestPanelOpen ? 'translate-x-0' : 'translate-x-full'}
                    fixed md:static inset-y-0 right-0 w-full md:w-[400px] bg-white border-l border-[#E5E5E5] 
                    transform transition-transform duration-200 ease-in-out z-30 overflow-y-auto`}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center">
            <h2 className="text-base font-semibold">Test Expense</h2>
            <button 
              onClick={() => setIsTestPanelOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {testPanel}
          </div>
        </div>
      </div>

      {/* Test Panel Toggle Button (when closed) */}
      {!isTestPanelOpen && (
        <button
          onClick={() => setIsTestPanelOpen(true)}
          className="fixed bottom-8 right-8 p-3 bg-black text-white rounded-full shadow-lg z-20"
        >
          Test Expense
        </button>
      )}
      
      <Outlet />
    </div>
  );
}
